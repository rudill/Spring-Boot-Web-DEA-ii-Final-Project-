import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, LogIn, LogOut, Wrench, CheckCircle } from 'lucide-react';
import { roomService } from '../../services/api';
import './RoomForm.css';

const EditRoom = () => {
  const { roomNumber } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomType: '',
    pricePerNight: '',
    capacity: '',
    status: 'AVAILABLE',
  });

  const statuses = ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE'];

  useEffect(() => {
    fetchRoom();
  }, [roomNumber]);

  const fetchRoom = async () => {
    try {
      const response = await roomService.getRoomByNumber(roomNumber);
      const room = response.data?.data ?? response.data;
      setFormData({
        roomNumber: room.roomNumber,
        roomType: room.roomType,
        pricePerNight: room.pricePerNight,
        capacity: room.capacity,
        status: room.status,
      });
    } catch (err) {
      console.error('Error fetching room:', err);
      setError('Failed to load room data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  // Main form submit — PATCH /rooms/{roomNumber}/status  body: { status, changedBy }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await roomService.updateRoomStatus(formData.roomNumber, formData.status, 'ADMIN');
      navigate('/rooms');
    } catch (err) {
      console.error('Error updating room:', err);
      setError(err.response?.data?.message || 'Failed to update room. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Quick action helpers
  const handleQuickAction = async (action, label) => {
    setActionLoading(action);
    setError('');
    setSuccess('');
    try {
      switch (action) {
        case 'checkin':
          await roomService.checkInRoom(formData.roomNumber);
          setFormData((prev) => ({ ...prev, status: 'OCCUPIED' }));
          setSuccess(`Room ${formData.roomNumber} checked in successfully.`);
          break;
        case 'checkout':
          await roomService.checkOutRoom(formData.roomNumber);
          setFormData((prev) => ({ ...prev, status: 'AVAILABLE' }));
          setSuccess(`Room ${formData.roomNumber} checked out successfully.`);
          break;
        case 'maintenance':
          await roomService.markRoomForMaintenance(formData.roomNumber);
          setFormData((prev) => ({ ...prev, status: 'MAINTENANCE' }));
          setSuccess(`Room ${formData.roomNumber} marked for maintenance.`);
          break;
        case 'available':
          await roomService.markRoomAvailableAfterMaintenance(formData.roomNumber);
          setFormData((prev) => ({ ...prev, status: 'AVAILABLE' }));
          setSuccess(`Room ${formData.roomNumber} is now available.`);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error(`Error performing ${label}:`, err);
      setError(err.response?.data?.message || `Failed to ${label}. Please try again.`);
    } finally {
      setActionLoading('');
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="room-form fade-in">
      <div className="page-header">
        <button onClick={() => navigate('/rooms')} className="back-btn">
          <ArrowLeft size={20} />
          Back to List
        </button>
      </div>

      <div className="form-container card">
        <h1 className="form-title">Edit Room</h1>
        <p className="form-subtitle">Update room status or use quick actions below</p>

        {error   && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Quick Action Buttons */}
        <div className="quick-action-row">
          <button
            type="button"
            className="btn btn-quick checkin-btn"
            onClick={() => handleQuickAction('checkin', 'Check In')}
            disabled={!!actionLoading || formData.status === 'OCCUPIED'}
          >
            {actionLoading === 'checkin' ? <div className="spinner-small"></div> : <LogIn size={16} />}
            Check In
          </button>
          <button
            type="button"
            className="btn btn-quick checkout-btn"
            onClick={() => handleQuickAction('checkout', 'Check Out')}
            disabled={!!actionLoading || formData.status !== 'OCCUPIED'}
          >
            {actionLoading === 'checkout' ? <div className="spinner-small"></div> : <LogOut size={16} />}
            Check Out
          </button>
          <button
            type="button"
            className="btn btn-quick maintenance-btn"
            onClick={() => handleQuickAction('maintenance', 'Mark for Maintenance')}
            disabled={!!actionLoading || formData.status === 'MAINTENANCE'}
          >
            {actionLoading === 'maintenance' ? <div className="spinner-small"></div> : <Wrench size={16} />}
            Maintenance
          </button>
          <button
            type="button"
            className="btn btn-quick available-btn"
            onClick={() => handleQuickAction('available', 'Mark Available')}
            disabled={!!actionLoading || formData.status === 'AVAILABLE'}
          >
            {actionLoading === 'available' ? <div className="spinner-small"></div> : <CheckCircle size={16} />}
            Mark Available
          </button>
        </div>

        <div className="section-divider">
          <span>or set status manually</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="roomNumber" className="form-label">Room Number</label>
              <input
                type="number"
                id="roomNumber"
                name="roomNumber"
                value={formData.roomNumber}
                className="form-input"
                disabled
                readOnly
              />
            </div>

            <div className="form-group">
              <label htmlFor="roomType" className="form-label">Room Type</label>
              <input
                type="text"
                id="roomType"
                name="roomType"
                value={formData.roomType}
                className="form-input"
                disabled
                readOnly
              />
            </div>

            <div className="form-group">
              <label htmlFor="pricePerNight" className="form-label">Price Per Night (Rs.)</label>
              <input
                type="number"
                id="pricePerNight"
                name="pricePerNight"
                value={formData.pricePerNight}
                className="form-input"
                disabled
                readOnly
              />
            </div>

            <div className="form-group">
              <label htmlFor="capacity" className="form-label">Capacity (guests)</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                className="form-input"
                disabled
                readOnly
              />
            </div>

            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Status <span className="required">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
                required
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <Link to="/rooms" className="btn btn-secondary">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? (
                <><div className="spinner-small"></div>Updating...</>
              ) : (
                <><Save size={18} />Update Status</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRoom;
