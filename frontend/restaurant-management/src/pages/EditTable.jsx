import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { tableService } from '../services/api';
import './TableForm.css';

const EditTable = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    tableNumber: '',
    capacity: '',
    status: 'AVAILABLE',
  });

  const statuses = ['AVAILABLE', 'OCCUPIED', 'RESERVED'];

  useEffect(() => {
    fetchTable();
  }, [id]);

  const fetchTable = async () => {
    try {
      const response = await tableService.getTableById(id);
      const table = response.data.data;
      setFormData({
        tableNumber: table.tableNumber,
        capacity: table.capacity,
        status: table.status,
      });
    } catch (error) {
      console.error('Error fetching table:', error);
      setError('Failed to load table data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const submitData = {
        tableNumber: parseInt(formData.tableNumber),
        capacity: parseInt(formData.capacity),
        status: formData.status,
      };

      await tableService.updateTable(id, submitData);
      navigate('/tables');
    } catch (error) {
      console.error('Error updating table:', error);
      setError(error.response?.data?.message || 'Failed to update table. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="table-form fade-in">
      <div className="page-header">
        <button onClick={() => navigate('/tables')} className="back-btn">
          <ArrowLeft size={20} />
          Back to Tables
        </button>
      </div>

      <div className="form-container card">
        <h1 className="form-title">Edit Table</h1>
        <p className="form-subtitle">Update table information below</p>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="tableNumber" className="form-label">
                Table Number <span className="required">*</span>
              </label>
              <input
                type="number"
                id="tableNumber"
                name="tableNumber"
                value={formData.tableNumber}
                onChange={handleChange}
                className="form-input"
                required
                min="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="capacity" className="form-label">
                Capacity (seats) <span className="required">*</span>
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
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <Link to="/tables" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? (
                <>
                  <div className="spinner-small"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Update Table
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTable;
