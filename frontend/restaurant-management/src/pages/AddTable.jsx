import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { tableService } from '../services/api';
import './TableForm.css';

const AddTable = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    tableNumber: '',
    capacity: '',
    status: 'AVAILABLE',
  });

  const statuses = ['AVAILABLE', 'OCCUPIED', 'RESERVED'];

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
    setLoading(true);
    setError('');

    try {
      const submitData = {
        tableNumber: parseInt(formData.tableNumber),
        capacity: parseInt(formData.capacity),
        status: formData.status,
      };

      await tableService.createTable(submitData);
      navigate('/tables');
    } catch (error) {
      console.error('Error creating table:', error);
      setError(error.response?.data?.message || 'Failed to create table. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="table-form fade-in">
      <div className="page-header">
        <button onClick={() => navigate('/tables')} className="back-btn">
          <ArrowLeft size={20} />
          Back to Tables
        </button>
      </div>

      <div className="form-container card">
        <h1 className="form-title">Add New Table</h1>
        <p className="form-subtitle">Fill in the details below to add a new restaurant table</p>

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
                placeholder="e.g., 1"
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
                placeholder="e.g., 4"
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
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner-small"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Create Table
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTable;
