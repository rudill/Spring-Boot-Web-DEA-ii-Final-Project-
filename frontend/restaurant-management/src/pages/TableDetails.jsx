import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Hash, Users, CheckCircle, XCircle } from 'lucide-react';
import { tableService } from '../services/api';
import './TableDetails.css';

const TableDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [table, setTable] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTable();
  }, [id]);

  const fetchTable = async () => {
    try {
      const response = await tableService.getTableById(id);
      setTable(response.data.data);
    } catch (error) {
      console.error('Error fetching table:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this table?')) {
      try {
        await tableService.deleteTable(id);
        navigate('/tables');
      } catch (error) {
        console.error('Error deleting table:', error);
      }
    }
  };

  const handleOccupy = async () => {
    try {
      await tableService.occupyTable(id);
      fetchTable();
    } catch (error) {
      console.error('Error occupying table:', error);
    }
  };

  const handleFree = async () => {
    try {
      await tableService.freeTable(id);
      fetchTable();
    } catch (error) {
      console.error('Error freeing table:', error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      AVAILABLE: 'badge-success',
      OCCUPIED: 'badge-danger',
      RESERVED: 'badge-warning',
    };
    return `badge ${badges[status] || 'badge-info'}`;
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (!table) {
    return (
      <div className="error-message">
        <p>Table not found</p>
        <button onClick={() => navigate('/tables')} className="btn btn-primary">Back to Tables</button>
      </div>
    );
  }

  return (
    <div className="table-details fade-in">
      <div className="page-header">
        <button onClick={() => navigate('/tables')} className="back-btn">
          <ArrowLeft size={20} />
          Back to Tables
        </button>
        <div className="header-actions">
          {table.status === 'AVAILABLE' && (
            <button onClick={handleOccupy} className="btn btn-warning">
              <XCircle size={18} />
              Occupy
            </button>
          )}
          {table.status === 'OCCUPIED' && (
            <button onClick={handleFree} className="btn btn-secondary">
              <CheckCircle size={18} />
              Free
            </button>
          )}
          <Link to={`/tables/edit/${table.id}`} className="btn btn-primary">
            <Edit size={18} />
            Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      <div className="details-container">
        <div className="table-header-card card">
          <div className="table-avatar">
            T{table.tableNumber}
          </div>
          <div className="table-info">
            <h1 className="table-title">Table #{table.tableNumber}</h1>
            <span className={getStatusBadge(table.status)}>
              {table.status}
            </span>
          </div>
        </div>

        <div className="details-grid">
          <div className="detail-card card">
            <div className="detail-icon">
              <Hash size={24} />
            </div>
            <div className="detail-content">
              <span className="detail-label">Table ID</span>
              <span className="detail-value">#{table.id}</span>
            </div>
          </div>

          <div className="detail-card card">
            <div className="detail-icon">
              <Hash size={24} />
            </div>
            <div className="detail-content">
              <span className="detail-label">Table Number</span>
              <span className="detail-value">{table.tableNumber}</span>
            </div>
          </div>

          <div className="detail-card card">
            <div className="detail-icon">
              <Users size={24} />
            </div>
            <div className="detail-content">
              <span className="detail-label">Capacity</span>
              <span className="detail-value">{table.capacity} seats</span>
            </div>
          </div>

          <div className="detail-card card">
            <div className="detail-icon">
              {table.status === 'AVAILABLE' ? <CheckCircle size={24} /> : <XCircle size={24} />}
            </div>
            <div className="detail-content">
              <span className="detail-label">Status</span>
              <span className="detail-value">{table.status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableDetails;
