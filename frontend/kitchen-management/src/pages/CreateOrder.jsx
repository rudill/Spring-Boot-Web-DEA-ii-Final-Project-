import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { orderService, menuService } from '../services/api';
import './CreateOrder.css';

const CreateOrder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    restaurantId: '',
    tableNumber: '',
    staffId: '',
    specialInstructions: '',
    orderItems: [{ menuItemId: '', quantity: 1, notes: '' }],
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await menuService.getAvailable();
      setMenuItems(response.data.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      // fallback to all items
      try {
        const allRes = await menuService.getAllMenuItems();
        setMenuItems(allRes.data.data?.filter(i => i.available) || []);
      } catch (err) {
        console.error('Error fetching all menu items:', err);
      }
    } finally {
      setMenuLoading(false);
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

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.orderItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setFormData(prev => ({ ...prev, orderItems: updatedItems }));
    setError('');
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      orderItems: [...prev.orderItems, { menuItemId: '', quantity: 1, notes: '' }],
    }));
  };

  const removeItem = (index) => {
    if (formData.orderItems.length === 1) return;
    setFormData(prev => ({
      ...prev,
      orderItems: prev.orderItems.filter((_, i) => i !== index),
    }));
  };

  const getSelectedMenuItem = (menuItemId) => {
    return menuItems.find(item => item.id === parseInt(menuItemId));
  };

  const calculateTotal = () => {
    return formData.orderItems.reduce((total, item) => {
      const menuItem = getSelectedMenuItem(item.menuItemId);
      return total + (menuItem?.price || 0) * (item.quantity || 0);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = {
        restaurantId: parseInt(formData.restaurantId),
        tableNumber: formData.tableNumber,
        staffId: formData.staffId ? parseInt(formData.staffId) : null,
        specialInstructions: formData.specialInstructions || null,
        orderItems: formData.orderItems.map(item => {
          const menuItem = getSelectedMenuItem(item.menuItemId);
          return {
            menuItemId: parseInt(item.menuItemId),
            quantity: parseInt(item.quantity),
            price: menuItem?.price || 0,
            notes: item.notes || null,
          };
        }),
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
        <p className="form-subtitle">Fill in the details below to create a new kitchen order</p>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
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
              <label htmlFor="tableNumber" className="form-label">
                Table Number
              </label>
              <input
                type="text"
                id="tableNumber"
                name="tableNumber"
                value={formData.tableNumber}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., T-01"
              />
            </div>

            <div className="form-group">
              <label htmlFor="staffId" className="form-label">
                Staff ID
              </label>
              <input
                type="number"
                id="staffId"
                name="staffId"
                value={formData.staffId}
                onChange={handleChange}
                className="form-input"
                min="1"
                placeholder="Assigned staff ID"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Order Total</label>
              <div className="total-display">
                Rs. {calculateTotal().toLocaleString()}
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="specialInstructions" className="form-label">
                Special Instructions
              </label>
              <textarea
                id="specialInstructions"
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleChange}
                className="form-textarea"
                rows="2"
                maxLength="500"
                placeholder="Any special instructions for the kitchen..."
              />
            </div>
          </div>

          {/* Order Items */}
          <div className="order-items-section">
            <div className="items-header">
              <h2 className="items-title">Order Items</h2>
              <button type="button" onClick={addItem} className="btn btn-outline add-item-btn">
                <Plus size={18} />
                Add Item
              </button>
            </div>

            {menuLoading ? (
              <div className="spinner"></div>
            ) : (
              <div className="items-list">
                {formData.orderItems.map((item, index) => (
                  <div key={index} className="order-item-row">
                    <div className="item-field menu-item-field">
                      <label className="form-label">Menu Item *</label>
                      <select
                        value={item.menuItemId}
                        onChange={(e) => handleItemChange(index, 'menuItemId', e.target.value)}
                        className="form-select"
                        required
                      >
                        <option value="">Select menu item</option>
                        {menuItems.map(mi => (
                          <option key={mi.id} value={mi.id}>
                            {mi.itemName} - Rs. {mi.price?.toLocaleString()} ({mi.mealType})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="item-field qty-field">
                      <label className="form-label">Qty *</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="form-input"
                        required
                        min="1"
                      />
                    </div>

                    <div className="item-field notes-field">
                      <label className="form-label">Notes</label>
                      <input
                        type="text"
                        value={item.notes}
                        onChange={(e) => handleItemChange(index, 'notes', e.target.value)}
                        className="form-input"
                        placeholder="Item notes..."
                      />
                    </div>

                    <div className="item-field subtotal-field">
                      <label className="form-label">Subtotal</label>
                      <span className="subtotal-value">
                        Rs. {((getSelectedMenuItem(item.menuItemId)?.price || 0) * (item.quantity || 0)).toLocaleString()}
                      </span>
                    </div>

                    <div className="item-field remove-field">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="remove-item-btn"
                        disabled={formData.orderItems.length === 1}
                        title="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <Link to="/orders" className="btn btn-secondary">
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
