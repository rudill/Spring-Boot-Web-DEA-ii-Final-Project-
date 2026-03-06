import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { menuService } from '../services/api';
import './MenuItemForm.css';

const AddMenuItem = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    available: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
      };

      await menuService.createMenuItem(submitData);
      navigate('/menu');
    } catch (error) {
      console.error('Error creating menu item:', error);
      setError(error.response?.data?.message || 'Failed to create menu item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="menu-item-form fade-in">
      <div className="page-header">
        <button onClick={() => navigate('/menu')} className="back-btn">
          <ArrowLeft size={20} />
          Back to List
        </button>
      </div>

      <div className="form-container card">
        <h1 className="form-title">Add New Menu Item</h1>
        <p className="form-subtitle">Fill in the details below to add a new menu item</p>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Item Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
                maxLength="255"
                placeholder="e.g., Chicken Rice"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Category <span className="required">*</span>
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="e.g., Main Course, Appetizer, Dessert"
              />
            </div>

            <div className="form-group">
              <label htmlFor="price" className="form-label">
                Price (Rs.) <span className="required">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="form-input"
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Availability</label>
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id="available"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <label htmlFor="available" className="checkbox-label">
                  Item is available for orders
                </label>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <Link to="/menu" className="btn btn-secondary">
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
                  Create Menu Item
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMenuItem;
