import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, BedDouble, DollarSign, Users, Activity, Hash, Clock } from 'lucide-react';
import { roomService } from '../../services/api';
import './RoomDetails.css';

const RoomDetails = () => {
  const { roomNumber } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoom();
  }, [roomNumber]);

  const fetchRoom = async () => {
    try {
      const response = await roomService.getRoomByNumber(roomNumber);
      setRoom(response.data?.data ?? response.data);
    } catch (error) {
      console.error('Error fetching room:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete Room ${roomNumber}?`)) {
      try {
        await roomService.deleteRoom(roomNumber);
        navigate('/rooms');
      } catch (error) {
        console.error('Error deleting room:', error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      AVAILABLE: 'badge-success',
      OCCUPIED: 'badge-danger',
      MAINTENANCE: 'badge-warning',
    };
    return `badge ${badges[status] || 'badge-success'}`;
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (!room) {
    return (
      <div className="error-message">
        <p>Room not found</p>
        <Link to="/rooms" className="btn btn-primary">Back to List</Link>
      </div>
    );
  }

  return (
    <div className="room-details fade-in">
      <div className="page-header">
        <button onClick={() => navigate('/rooms')} className="back-btn">
          <ArrowLeft size={20} />
          Back to List
        </button>
        <div className="header-actions">
          <Link to={`/rooms/edit/${room.roomNumber}`} className="btn btn-secondary">
            <Edit size={18} />
            Edit
          </Link>
          <Link to={`/rooms/${room.roomNumber}/history`} className="btn btn-outline">
            <Clock size={18} />
            Status History
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      <div className="details-container">
        <div className="room-header card">
          <div className="room-avatar">
            {room.roomType?.charAt(0) ?? 'R'}
          </div>
          <div className="room-info">
            <h1 className="room-title">Room {room.roomNumber}</h1>
            <p className="room-type-label">{room.roomType} Room</p>
            <span className={getStatusBadge(room.status)}>{room.status}</span>
          </div>
        </div>

        <div className="details-grid">
          <div className="detail-card card">
            <div className="detail-icon"><Hash size={24} /></div>
            <div className="detail-content">
              <span className="detail-label">Room Number</span>
              <span className="detail-value">#{room.roomNumber}</span>
            </div>
          </div>

          <div className="detail-card card">
            <div className="detail-icon"><BedDouble size={24} /></div>
            <div className="detail-content">
              <span className="detail-label">Room Type</span>
              <span className="detail-value">{room.roomType}</span>
            </div>
          </div>

          <div className="detail-card card">
            <div className="detail-icon"><DollarSign size={24} /></div>
            <div className="detail-content">
              <span className="detail-label">Price Per Night</span>
              <span className="detail-value">Rs. {Number(room.pricePerNight).toLocaleString()}</span>
            </div>
          </div>

          <div className="detail-card card">
            <div className="detail-icon"><Users size={24} /></div>
            <div className="detail-content">
              <span className="detail-label">Capacity</span>
              <span className="detail-value">{room.capacity} guests</span>
            </div>
          </div>

          <div className="detail-card card">
            <div className="detail-icon"><Activity size={24} /></div>
            <div className="detail-content">
              <span className="detail-label">Current Status</span>
              <span className="detail-value">{room.status}</span>
            </div>
          </div>

          
        </div>

        <div className="additional-info card">
          <h2 className="section-title">Additional Information</h2>
          <div className="info-grid">
            
            <div className="info-item">
              <span className="info-label">Room Number</span>
              <span className="info-value">#{room.roomNumber}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Room Type</span>
              <span className="info-value">{room.roomType}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status</span>
              <span className="info-value">{room.status}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Price Per Night</span>
              <span className="info-value">Rs. {Number(room.pricePerNight).toLocaleString()}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Capacity</span>
              <span className="info-value">{room.capacity} guests</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
