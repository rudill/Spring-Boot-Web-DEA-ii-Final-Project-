import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { tableService } from '../services/api';

const STATUSES = ['AVAILABLE', 'OCCUPIED', 'RESERVED', 'OUT_OF_SERVICE'];

const defaultForm = { tableNumber: '', capacity: '', status: 'AVAILABLE', location: '', description: '' };

const TableForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      tableService.getById(id)
        .then(res => setForm(res.data.data))
        .catch(() => setError('Failed to load table.'))
        .finally(() => setFetchLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const payload = {
      ...form,
      tableNumber: parseInt(form.tableNumber),
      capacity: parseInt(form.capacity),
    };
    try {
      if (isEdit) await tableService.update(id, payload);
      else await tableService.create(payload);
      navigate('/tables');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save table.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div className="spinner"></div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Table' : 'Add Table'}</h1>
          <p className="page-subtitle">{isEdit ? `Editing table #${id}` : 'Add a new table to the restaurant'}</p>
        </div>
        <Link to="/tables" className="btn btn-outline"><ArrowLeft size={18} /> Back</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Table Number *</label>
              <input className="form-input" name="tableNumber" type="number" min="1" value={form.tableNumber} onChange={handleChange} required placeholder="e.g. 5" />
            </div>
            <div className="form-group">
              <label className="form-label">Capacity (persons) *</label>
              <input className="form-input" name="capacity" type="number" min="1" value={form.capacity} onChange={handleChange} required placeholder="e.g. 4" />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-input" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Indoor, Outdoor, Terrace" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" name="description" value={form.description} onChange={handleChange} placeholder="Optional notes about this table..." />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={18} /> {loading ? 'Saving...' : 'Save Table'}
            </button>
            <Link to="/tables" className="btn btn-outline">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TableForm;
