import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Activity } from 'lucide-react';
import { roomService } from '../../services/api';
import './StatusHistory.css';

const StatusHistory = () => {
  const { roomNumber } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, [roomNumber]);

  useEffect(() => {
    if (dateFilter) {
      fetchHistoryByDate(dateFilter);
    } else {
      setFilteredHistory(history);
    }
  }, [dateFilter, history]);

  const fetchHistory = async () => {
    try {
      const response = await roomService.getStatusHistory(roomNumber);
      const data = response.data?.data ?? response.data;
      const arr = Array.isArray(data) ? data : [];
      setHistory(arr);
      setFilteredHistory(arr);
    } catch (err) {
      console.error('Error fetching status history:', err);
      setError('Failed to load status history.');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoryByDate = async (date) => {
    try {
      const response = await roomService.getStatusHistoryByDate(roomNumber, date);
      const data = response.data?.data ?? response.data;
      setFilteredHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching history by date:', err);
      setFilteredHistory([]);
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

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString();
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="status-history fade-in">
      <div className="page-header">
        <button onClick={() => navigate(`/rooms/${roomNumber}`)} className="back-btn">
          <ArrowLeft size={20} />
          Back to Room Details
        </button>
        <div className="header-actions">
          <Link to={`/rooms/edit/${roomNumber}`} className="btn btn-secondary">
            Edit Room
          </Link>
        </div>
      </div>

      <div className="history-title-row">
        <div>
          <h1 className="page-title">
            Status History — Room {roomNumber}
          </h1>
          <p className="page-subtitle">{filteredHistory.length} status record(s) found</p>
        </div>
      </div>

      <div className="filters-section card">
        <div className="filter-group">
          <Calendar size={18} />
          <label className="filter-label">Filter by Date:</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="filter-select"
          />
          {dateFilter && (
            <button
              className="btn btn-outline"
              onClick={() => setDateFilter('')}
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Status</th>
              <th>Changed At</th>
              <th>Changed By</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((record, index) => (
              <tr key={record.id ?? index}>
                <td>{index + 1}</td>
                <td>
                  <span className={getStatusBadge(record.status ?? record.newStatus)}>
                    {record.status ?? record.newStatus}
                  </span>
                </td>
                <td>{formatDate(record.changedAt ?? record.timestamp ?? record.date)}</td>
                <td>{record.changedBy ?? record.updatedBy ?? '—'}</td>
                <td>{record.notes ?? record.remarks ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredHistory.length === 0 && !error && (
        <div className="no-results">
          <Activity size={48} style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }} />
          <p>No status history found{dateFilter ? ` for ${dateFilter}` : ''}.</p>
        </div>
      )}
    </div>
  );
};

export default StatusHistory;
