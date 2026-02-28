import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, Edit, Trash2, ToggleLeft, ToggleRight, Filter } from 'lucide-react';
import { menuItemService } from '../services/api';
import './MenuItemList.css';

const CATEGORIES = ['APPETIZER', 'SOUP', 'SALAD', 'MAIN_COURSE', 'SIDE_DISH', 'DESSERT', 'BEVERAGE', 'SPECIAL'];

const MenuItemList = () => {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [availableFilter, setAvailableFilter] = useState('');
  const [alert, setAlert] = useState(null);

  useEffect(() => { fetchItems(); }, []);
  useEffect(() => { applyFilters(); }, [search, categoryFilter, availableFilter, items]);

  const fetchItems = async () => {
    try {
      const res = await menuItemService.getAll();
      setItems(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let list = [...items];
    if (search) list = list.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
    if (categoryFilter) list = list.filter(i => i.category === categoryFilter);
    if (availableFilter !== '') list = list.filter(i => String(i.isAvailable) === availableFilter);
    setFiltered(list);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this menu item?')) return;
    try {
      await menuItemService.delete(id);
      showAlert('Menu item deleted successfully.', 'success');
      fetchItems();
    } catch {
      showAlert('Failed to delete menu item.', 'error');
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      await menuItemService.updateAvailability(item.id, !item.isAvailable);
      fetchItems();
    } catch {
      showAlert('Failed to update availability.', 'error');
    }
  };

  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const getCategoryBadge = (cat) => {
    const map = {
      APPETIZER: 'badge-info', SOUP: 'badge-warning', SALAD: 'badge-success',
      MAIN_COURSE: 'badge-purple', SIDE_DISH: 'badge-gray', DESSERT: 'badge-danger',
      BEVERAGE: 'badge-info', SPECIAL: 'badge-warning',
    };
    return `badge ${map[cat] || 'badge-gray'}`;
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="menu-item-list fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Menu Items</h1>
          <p className="page-subtitle">{filtered.length} items found</p>
        </div>
        <Link to="/menu-items/add" className="btn btn-primary">
          <PlusCircle size={20} /> Add Menu Item
        </Link>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

      <div className="filters-section card">
        <div className="search-box">
          <Search size={18} />
          <input
            className="search-input"
            placeholder="Search by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <Filter size={16} />
          <select className="filter-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
          </select>
          <select className="filter-select" value={availableFilter} onChange={e => setAvailableFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Category</th><th>Price (Rs.)</th>
              <th>Prep Time</th><th>Available</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No items found.</td></tr>
            ) : filtered.map(item => (
              <tr key={item.id}>
                <td>#{item.id}</td>
                <td>
                  <div className="item-name">{item.name}</div>
                  <div className="item-desc">{item.description?.substring(0, 50)}{item.description?.length > 50 ? '…' : ''}</div>
                </td>
                <td><span className={getCategoryBadge(item.category)}>{item.category.replace('_', ' ')}</span></td>
                <td className="price-cell">{item.price?.toLocaleString()}</td>
                <td>{item.preparationTimeMinutes ? `${item.preparationTimeMinutes} min` : '—'}</td>
                <td>
                  <button
                    className={`availability-toggle ${item.isAvailable ? 'available' : 'unavailable'}`}
                    onClick={() => handleToggleAvailability(item)}
                    title="Toggle availability"
                  >
                    {item.isAvailable ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                    {item.isAvailable ? 'Yes' : 'No'}
                  </button>
                </td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/menu-items/edit/${item.id}`} className="btn btn-warning btn-sm"><Edit size={14} /></Link>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuItemList;
