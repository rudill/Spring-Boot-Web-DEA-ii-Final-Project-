import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Trash2, Filter } from 'lucide-react';
import { orderService } from '../services/api';
import './OrderList.css';

const STATUSES = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'SERVED', 'CANCELLED'];

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [alert, setAlert] = useState(null);

  useEffect(() => { fetchOrders(); }, []);
  useEffect(() => { applyFilters(); }, [search, statusFilter, orders]);

  const fetchOrders = async () => {
    try {
      const res = await orderService.getAll();
      setOrders(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let list = [...orders];
    if (search) list = list.filter(o =>
      o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(search.toLowerCase())
    );
    if (statusFilter) list = list.filter(o => o.status === statusFilter);
    setFiltered(list);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await orderService.updateStatus(id, status);
      fetchOrders();
    } catch {
      showAlert('Failed to update order status.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    try {
      await orderService.delete(id);
      showAlert('Order deleted.', 'success');
      fetchOrders();
    } catch {
      showAlert('Failed to delete order.', 'error');
    }
  };

  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const getStatusBadge = (status) => {
    const map = {
      PENDING: 'badge-warning', CONFIRMED: 'badge-info', PREPARING: 'badge-purple',
      READY: 'badge-success', SERVED: 'badge-gray', CANCELLED: 'badge-danger',
    };
    return `badge ${map[status] || 'badge-gray'}`;
  };

  const formatDate = (dt) => dt ? new Date(dt).toLocaleString() : '—';

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="order-list fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Orders</h1>
          <p className="page-subtitle">{filtered.length} orders found</p>
        </div>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

      <div className="filters-section card">
        <div className="search-box">
          <Search size={18} />
          <input
            className="search-input"
            placeholder="Search by order number or customer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <Filter size={16} />
          <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Order #</th><th>Table</th><th>Customer</th><th>Guests</th>
              <th>Total (Rs.)</th><th>Status</th><th>Order Time</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No orders found.</td></tr>
            ) : filtered.map(order => (
              <tr key={order.id}>
                <td><strong>{order.orderNumber}</strong></td>
                <td>Table #{order.tableId}</td>
                <td>{order.customerName || '—'}</td>
                <td>{order.numberOfGuests || '—'}</td>
                <td className="price-cell">{order.totalAmount?.toLocaleString()}</td>
                <td>
                  <select
                    className={`status-badge-select status-${order.status?.toLowerCase()}`}
                    value={order.status}
                    onChange={e => handleStatusChange(order.id, e.target.value)}
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="date-cell">{formatDate(order.orderTime)}</td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/orders/${order.id}`} className="btn btn-outline btn-sm"><Eye size={14} /></Link>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(order.id)}><Trash2 size={14} /></button>
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

export default OrderList;
