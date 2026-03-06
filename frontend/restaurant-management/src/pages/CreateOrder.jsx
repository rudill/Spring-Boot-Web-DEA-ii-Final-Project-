import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { orderService, tableService } from '../services/api';
import './CreateOrder.css';

const CreateOrder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState([]);
  const [tablesLoading, setTablesLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    tableId: '',
    totalAmount: '',
    specialNotes: '',
  });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await tableService.getAllTables();
      setTables(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching tables:', error);
    } finally {
      setTablesLoading(false);
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
    setLoading(true);
    setError('');

    try {
      const submitData = {
        tableId: parseInt(formData.tableId),
        totalAmount: formData.totalAmount ? parseFloat(formData.totalAmount) : 0.0,
        specialNotes: formData.specialNotes || null,
      };

      await orderService.createOrder(submitData);
      navigate('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      setError(error.response?.data?.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-order fade-in">
      <div className="page-header">
        <button onClick={() => navigate('/orders')} className="back-btn">
          <ArrowLeft size={20} />
          Back to Orders
        </button>
      </div>

      <div className="form-container card">
        <h1 className="form-title">Create New Order</h1>
        <p className="form-subtitle">Fill in the details below to create a new restaurant order</p>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="tableId" className="form-label">
                Table <span className="required">*</span>
              </label>
              {tablesLoading ? (
                <div className="form-input" style={{ color: 'var(--text-secondary)' }}>Loading tables...</div>
              ) : (
                <select
                  id="tableId"
                  name="tableId"
                  value={formData.tableId}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select a table</option>
                  {tables.map(table => (
                    <option key={table.id} value={table.id}>
                      Table {table.tableNumber} (Capacity: {table.capacity}) - {table.status}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="totalAmount" className="form-label">
                Total Amount (Rs.)
              </label>
              <input
                type="number"
                id="totalAmount"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleChange}
                className="form-input"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="specialNotes" className="form-label">
                Special Notes
              </label>
              <textarea
                id="specialNotes"
                name="specialNotes"
                value={formData.specialNotes}
                onChange={handleChange}
                className="form-textarea"
                rows={4}
                maxLength={500}
                placeholder="Any special instructions or notes for this order..."
              />
              <span className="char-count">{formData.specialNotes.length}/500</span>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <div className="spinner-small" />
                  Creating...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Create Order
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrder;
