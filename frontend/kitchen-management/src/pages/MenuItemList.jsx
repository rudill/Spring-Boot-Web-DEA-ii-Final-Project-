import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, Eye, Edit, Trash2, Filter, ToggleLeft, ToggleRight } from 'lucide-react';
import { menuService } from '../services/api';
import './MenuItemList.css';

const MenuItemList = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [mealTypeFilter, setMealTypeFilter] = useState('');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const mealTypes = ['BREAKFAST', 'LUNCH', 'DINNER', 'BUFFET'];
  const serviceTypes = ['RESTAURANT', 'EVENT'];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchTerm, mealTypeFilter, serviceTypeFilter, categoryFilter, menuItems]);

  const fetchMenuItems = async () => {
    try {
      const response = await menuService.getAllMenuItems();
      setMenuItems(response.data.data);
      setFilteredItems(response.data.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = menuItems;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (mealTypeFilter) {
      filtered = filtered.filter(item => item.mealType === mealTypeFilter);
    }

    if (serviceTypeFilter) {
      filtered = filtered.filter(item => item.serviceType === serviceTypeFilter);
    }

    if (categoryFilter) {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    setFilteredItems(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await menuService.deleteMenuItem(id);
        fetchMenuItems();
      } catch (error) {
        console.error('Error deleting menu item:', error);
      }
    }
  };

  const handleToggleAvailability = async (id) => {
    try {
      await menuService.toggleAvailability(id);
      fetchMenuItems();
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  const categories = [...new Set(menuItems.map(item => item.category).filter(Boolean))];

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="menu-item-list fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Menu Items</h1>
          <p className="page-subtitle">{filteredItems.length} items found</p>
        </div>
        <Link to="/menu/add" className="btn btn-primary">
          <PlusCircle size={20} />
          Add Menu Item
        </Link>
      </div>

      <div className="filters-section card">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by name, category or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <Filter size={18} />
          <select
            value={mealTypeFilter}
            onChange={(e) => setMealTypeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Meal Types</option>
            {mealTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={serviceTypeFilter}
            onChange={(e) => setServiceTypeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Service Types</option>
            {serviceTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Meal Type</th>
              <th>Service Type</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id}>
                <td>#{item.id}</td>
                <td className="item-name">{item.itemName}</td>
                <td>{item.category}</td>
                <td>Rs. {item.price?.toLocaleString()}</td>
                <td>
                  <span className="badge badge-info">{item.mealType}</span>
                </td>
                <td>
                  <span className={`badge ${item.serviceType === 'EVENT' ? 'badge-purple' : 'badge-warning'}`}>
                    {item.serviceType}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleToggleAvailability(item.id)}
                    className={`toggle-btn ${item.available ? 'available' : 'unavailable'}`}
                    title={item.available ? 'Click to mark unavailable' : 'Click to mark available'}
                  >
                    {item.available ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                    <span>{item.available ? 'Yes' : 'No'}</span>
                  </button>
                </td>
                <td>
                  <div className="action-buttons">
                    <Link
                      to={`/menu/${item.id}`}
                      className="action-btn view-btn"
                      title="View"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      to={`/menu/edit/${item.id}`}
                      className="action-btn edit-btn"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
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

      {filteredItems.length === 0 && (
        <div className="no-results">
          <p>No menu items found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default MenuItemList;
