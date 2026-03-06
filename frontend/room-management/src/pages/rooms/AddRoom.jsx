import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { roomService } from '../../services/api';
import './RoomForm.css';

const AddRoom = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomType: '',
    pricePerNight: '',
    capacity: '',
    status: 'AVAILABLE',
  });

  const roomTypes = ['SINGLE', 'DELUXE', 'DOUBLE'];
  const statuses = ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        roomNumber: parseInt(formData.roomNumber, 10),
        pricePerNight: parseFloat(formData.pricePerNight),
        capacity: parseInt(formData.capacity, 10),
      };
      await roomService.createRoom(submitData);
      navigate('/rooms');
    } catch (err) {
      console.error('Error creating room:', err);
      setError(err.response?.data?.message || 'Failed to create room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="room-form fade-in">
      <div className="page-header">
        <button onClick={() => navigate('/rooms')} className="back-btn">
          <ArrowLeft size={20} />
          Back to List
        </button>
      </div>

      <div className="form-container card">
        <h1 className="form-title">Add New Room</h1>
        <p className="form-subtitle">Fill in the details below to add a new room</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="roomNumber" className="form-label">
                Room Number <span className="required">*</span>
              </label>
              <input
                type="number"
                id="roomNumber"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                className="form-input"
                required
                min="1"
                placeholder="e.g. 101"
              />
            </div>

            <div className="form-group">
              <label htmlFor="roomType" className="form-label">
                Room Type <span className="required">*</span>
              </label>
              <select
                id="roomType"
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Room Type</option>
                {roomTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="pricePerNight" className="form-label">
                Price Per Night (Rs.) <span className="required">*</span>
              </label>
              <input
                type="number"
                id="pricePerNight"
                name="pricePerNight"
                value={formData.pricePerNight}
                onChange={handleChange}
                className="form-input"
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="capacity" className="form-label">
                Capacity (guests) <span className="required">*</span>
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className="form-input"
                required
                min="1"
                max="10"
                placeholder="e.g. 2"
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
            <Link to="/rooms" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner-small"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Create Room
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoom;
