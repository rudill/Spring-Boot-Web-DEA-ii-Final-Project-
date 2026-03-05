import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, BedDouble, Eye, Edit, Trash2, Filter } from 'lucide-react';
import { roomService } from '../../services/api';
import './RoomList.css';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const roomTypes = ['SINGLE', 'DELUXE', 'DOUBLE'];
  const statuses = ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE'];

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    filterRooms();
  }, [searchTerm, typeFilter, statusFilter, rooms]);

  const fetchRooms = async () => {
    try {
      const response = await roomService.getAllRooms();
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data ?? [];
      setRooms(data);
      setFilteredRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRooms = () => {
    let filtered = rooms;

    if (searchTerm) {
      filtered = filtered.filter(
        (room) =>
          String(room.roomNumber).toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.roomType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter) {
      filtered = filtered.filter((room) => room.roomType === typeFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter((room) => room.status === statusFilter);
    }

    setFilteredRooms(filtered);
  };

  const handleDelete = async (roomNumber) => {
    if (window.confirm(`Are you sure you want to delete Room ${roomNumber}?`)) {
      try {
        await roomService.deleteRoom(roomNumber);
        fetchRooms();
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

  return (
    <div className="room-list fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Room Directory</h1>
          <p className="page-subtitle">{filteredRooms.length} rooms found</p>
        </div>
        <Link to="/rooms/add" className="btn btn-primary">
          <BedDouble size={20} />
          Add Room
        </Link>
      </div>

      <div className="filters-section card">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by room number or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <Filter size={18} />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Types</option>
            {roomTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Room Number</th>
              <th>Type</th>
              <th>Price / Night</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.map((room) => (
              <tr key={room.roomId ?? room.roomNumber}>
                <td className="room-number">#{room.roomNumber}</td>
                <td>{room.roomType}</td>
                <td>Rs. {Number(room.pricePerNight).toLocaleString()}</td>
                <td>{room.capacity} guests</td>
                <td>
                  <span className={getStatusBadge(room.status)}>{room.status}</span>
                </td>
                <td>
                  <div className="action-buttons">
                    <Link
                      to={`/rooms/${room.roomNumber}`}
                      className="action-btn view-btn"
                      title="View"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      to={`/rooms/edit/${room.roomNumber}`}
                      className="action-btn edit-btn"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(room.roomNumber)}
                      className="action-btn delete-btn"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredRooms.length === 0 && (
        <div className="no-results">
          <p>No rooms found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default RoomList;
