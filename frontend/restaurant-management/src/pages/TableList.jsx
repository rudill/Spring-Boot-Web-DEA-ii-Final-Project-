import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, Filter } from 'lucide-react';
import { tableService } from '../services/api';
import './TableList.css';

const STATUSES = ['AVAILABLE', 'OCCUPIED', 'RESERVED', 'OUT_OF_SERVICE'];

const TableList = () => {
  const [tables, setTables] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [alert, setAlert] = useState(null);

  useEffect(() => { fetchTables(); }, []);
  useEffect(() => {
    if (statusFilter) setFiltered(tables.filter(t => t.status === statusFilter));
    else setFiltered(tables);
  }, [statusFilter, tables]);

  const fetchTables = async () => {
    try {
      const res = await tableService.getAll();
      setTables(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await tableService.updateStatus(id, status);
      fetchTables();
    } catch {
      showAlert('Failed to update table status.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this table?')) return;
    try {
      await tableService.delete(id);
      showAlert('Table deleted.', 'success');
      fetchTables();
    } catch {
      showAlert('Failed to delete table.', 'error');
    }
  };

  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const getStatusBadge = (status) => {
    const map = { AVAILABLE: 'badge-success', OCCUPIED: 'badge-danger', RESERVED: 'badge-warning', OUT_OF_SERVICE: 'badge-gray' };
    return `badge ${map[status] || 'badge-gray'}`;
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="table-list fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Restaurant Tables</h1>
          <p className="page-subtitle">{filtered.length} tables found</p>
        </div>
        <Link to="/tables/add" className="btn btn-primary"><PlusCircle size={20} /> Add Table</Link>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

      <div className="filters-section card">
        <div className="filter-group">
          <Filter size={16} />
          <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
        </div>
      </div>

      <div className="tables-grid">
        {filtered.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', padding: '2rem' }}>No tables found.</p>
        ) : filtered.map(table => (
          <div key={table.id} className={`table-card ${table.status.toLowerCase()}`}>
            <div className="table-card-header">
              <h3 className="table-number">Table #{table.tableNumber}</h3>
              <span className={getStatusBadge(table.status)}>{table.status.replace('_', ' ')}</span>
            </div>
            <div className="table-card-body">
              <div className="table-info-row"><span>Capacity:</span><strong>{table.capacity} persons</strong></div>
              {table.location && <div className="table-info-row"><span>Location:</span><strong>{table.location}</strong></div>}
              {table.description && <p className="table-desc">{table.description}</p>}
            </div>
            <div className="table-card-actions">
              <select
                className="status-select"
                value={table.status}
                onChange={e => handleStatusChange(table.id, e.target.value)}
              >
                {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
              <div className="action-buttons">
                <Link to={`/tables/edit/${table.id}`} className="btn btn-warning btn-sm"><Edit size={14} /></Link>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(table.id)}><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableList;
