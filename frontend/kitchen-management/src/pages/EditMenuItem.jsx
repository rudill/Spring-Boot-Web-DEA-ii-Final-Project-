import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { menuService } from '../services/api';
import './MenuItemForm.css';

const EditMenuItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    price: '',
    mealType: '',
    serviceType: '',
    menuDate: '',
    restaurantId: '',
    description: '',
    available: true,
  });

  const mealTypes = ['BREAKFAST', 'LUNCH', 'DINNER', 'BUFFET'];
  const serviceTypes = ['RESTAURANT', 'EVENT'];

  useEffect(() => {
    fetchMenuItem();
  }, [id]);

  const fetchMenuItem = async () => {
    try {
      const response = await menuService.getMenuItemById(id);
      const item = response.data.data;
      setFormData({
        itemName: item.itemName,
        category: item.category,
        price: item.price,
        mealType: item.mealType,
        serviceType: item.serviceType,
        menuDate: item.menuDate,
        restaurantId: item.restaurantId,
        description: item.description || '',
        available: item.available,
      });
    } catch (error) {
      console.error('Error fetching menu item:', error);
      setError('Failed to load menu item data');
    } finally {
      setLoading(false);
    }
  };

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
    setSubmitting(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        restaurantId: parseInt(formData.restaurantId),
      };

      await menuService.updateMenuItem(id, submitData);
      navigate('/menu');
    } catch (error) {
      console.error('Error updating menu item:', error);
      setError(error.response?.data?.message || 'Failed to update menu item. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="menu-item-form fade-in">
      <div className="page-header">
        <button onClick={() => navigate('/menu')} className="back-btn">
          <ArrowLeft size={20} />
          Back to List
        </button>
      </div>

      <div className="form-container card">
        <h1 className="form-title">Edit Menu Item</h1>
        <p className="form-subtitle">Update menu item information below</p>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="itemName" className="form-label">
                Item Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="itemName"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                className="form-input"
                required
                maxLength="255"
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
              <label htmlFor="mealType" className="form-label">
                Meal Type <span className="required">*</span>
              </label>
              <select
                id="mealType"
                name="mealType"
                value={formData.mealType}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Meal Type</option>
                {mealTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="serviceType" className="form-label">
                Service Type <span className="required">*</span>
              </label>
              <select
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Service Type</option>
                {serviceTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="menuDate" className="form-label">
                Menu Date <span className="required">*</span>
              </label>
              <input
                type="date"
                id="menuDate"
                name="menuDate"
                value={formData.menuDate}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="restaurantId" className="form-label">
                Restaurant ID <span className="required">*</span>
              </label>
              <input
                type="number"
                id="restaurantId"
                name="restaurantId"
                value={formData.restaurantId}
                onChange={handleChange}
                className="form-input"
                required
                min="1"
                placeholder="Enter restaurant ID"
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

            <div className="form-group full-width">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                rows="3"
                maxLength="500"
                placeholder="Brief description of the dish..."
              />
            </div>
          </div>

          <div className="form-actions">
            <Link to="/menu" className="btn btn-secondary">
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
                  Update Menu Item
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMenuItem;
