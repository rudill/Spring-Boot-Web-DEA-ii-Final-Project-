import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { menuItemService } from '../services/api';

const CATEGORIES = ['APPETIZER', 'SOUP', 'SALAD', 'MAIN_COURSE', 'SIDE_DISH', 'DESSERT', 'BEVERAGE', 'SPECIAL'];

const defaultForm = {
  name: '', description: '', price: '', category: 'MAIN_COURSE',
  isAvailable: true, preparationTimeMinutes: '', imageUrl: '', ingredients: '',
};

const MenuItemForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      menuItemService.getById(id)
        .then(res => { setForm({ ...res.data.data, price: res.data.data.price ?? '' }); })
        .catch(() => setError('Failed to load menu item.'))
        .finally(() => setFetchLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const payload = {
      ...form,
      price: parseFloat(form.price),
      preparationTimeMinutes: form.preparationTimeMinutes ? parseInt(form.preparationTimeMinutes) : null,
    };
    try {
      if (isEdit) {
        await menuItemService.update(id, payload);
      } else {
        await menuItemService.create(payload);
      }
      navigate('/menu-items');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save menu item.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div className="spinner"></div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Menu Item' : 'Add Menu Item'}</h1>
          <p className="page-subtitle">{isEdit ? `Editing item #${id}` : 'Add a new item to the restaurant menu'}</p>
        </div>
        <Link to="/menu-items" className="btn btn-outline"><ArrowLeft size={18} /> Back</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input className="form-input" name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Grilled Chicken" />
            </div>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className="form-select" name="category" value={form.category} onChange={handleChange} required>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Price (Rs.) *</label>
              <input className="form-input" name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required placeholder="0.00" />
            </div>
            <div className="form-group">
              <label className="form-label">Preparation Time (minutes)</label>
              <input className="form-input" name="preparationTimeMinutes" type="number" min="0" value={form.preparationTimeMinutes} onChange={handleChange} placeholder="e.g. 20" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" name="description" value={form.description} onChange={handleChange} placeholder="Short description of the dish..." />
          </div>

          <div className="form-group">
            <label className="form-label">Ingredients</label>
            <input className="form-input" name="ingredients" value={form.ingredients} onChange={handleChange} placeholder="e.g. Chicken, Garlic, Herbs" />
          </div>

          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input className="form-input" name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={handleChange} style={{ width: '1.1rem', height: '1.1rem' }} />
              <span className="form-label" style={{ marginBottom: 0 }}>Available on menu</span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={18} /> {loading ? 'Saving...' : 'Save Menu Item'}
            </button>
            <Link to="/menu-items" className="btn btn-outline">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuItemForm;
