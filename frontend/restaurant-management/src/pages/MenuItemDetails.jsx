import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Tag, DollarSign, UtensilsCrossed } from 'lucide-react';
import { menuService } from '../services/api';
import './MenuItemDetails.css';

const MenuItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menuItem, setMenuItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenuItem();
  }, [id]);

  const fetchMenuItem = async () => {
    try {
      const response = await menuService.getMenuItemById(id);
      setMenuItem(response.data.data);
    } catch (error) {
      console.error('Error fetching menu item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await menuService.deleteMenuItem(id);
        navigate('/menu');
      } catch (error) {
        console.error('Error deleting menu item:', error);
      }
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (!menuItem) {
    return (
      <div className="error-message">
        <p>Menu item not found</p>
        <Link to="/menu" className="btn btn-primary">Back to List</Link>
      </div>
    );
  }

  return (
    <div className="menu-item-details fade-in">
      <div className="page-header">
        <button onClick={() => navigate('/menu')} className="back-btn">
          <ArrowLeft size={20} />
          Back to List
        </button>
        <div className="header-actions">
          <Link to={`/menu/edit/${menuItem.id}`} className="btn btn-secondary">
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
        <div className="item-header card">
          <div className="item-avatar">
            {menuItem.name?.charAt(0)}
          </div>
          <div className="item-info">
            <h1 className="item-title">{menuItem.name}</h1>
            <p className="item-category">{menuItem.category}</p>
            <span className={`badge ${menuItem.available ? 'badge-success' : 'badge-danger'}`}>
              {menuItem.available ? 'AVAILABLE' : 'UNAVAILABLE'}
            </span>
          </div>
        </div>

        <div className="details-grid">
          <div className="detail-card card">
            <div className="detail-icon">
              <DollarSign size={24} />
            </div>
            <div className="detail-content">
              <span className="detail-label">Price</span>
              <span className="detail-value">Rs. {menuItem.price?.toLocaleString()}</span>
            </div>
          </div>

          <div className="detail-card card">
            <div className="detail-icon">
              <Tag size={24} />
            </div>
            <div className="detail-content">
              <span className="detail-label">Category</span>
              <span className="detail-value">{menuItem.category}</span>
            </div>
          </div>

          <div className="detail-card card">
            <div className="detail-icon">
              <UtensilsCrossed size={24} />
            </div>
            <div className="detail-content">
              <span className="detail-label">Availability</span>
              <span className="detail-value">{menuItem.available ? 'Available' : 'Unavailable'}</span>
            </div>
          </div>
        </div>

        <div className="additional-info card">
          <h2 className="section-title">Additional Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Item ID</span>
              <span className="info-value">#{menuItem.id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Name</span>
              <span className="info-value">{menuItem.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Category</span>
              <span className="info-value">{menuItem.category}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Price</span>
              <span className="info-value">Rs. {menuItem.price?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemDetails;
