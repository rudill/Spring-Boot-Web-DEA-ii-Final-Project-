import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { orderService, orderItemService } from '../services/api';
import './OrderDetails.css';

const STATUSES = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'SERVED', 'CANCELLED'];

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => { fetchOrder(); }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await orderService.getById(id);
      setOrder(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      await orderService.updateStatus(id, status);
      fetchOrder();
      showAlert('Status updated.', 'success');
    } catch {
      showAlert('Failed to update status.', 'error');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Remove this item from the order?')) return;
    try {
      await orderItemService.delete(itemId);
      fetchOrder();
      showAlert('Item removed.', 'success');
    } catch {
      showAlert('Failed to remove item.', 'error');
    }
  };

  const handleUpdateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    try {
      await orderItemService.updateQuantity(itemId, quantity);
      fetchOrder();
    } catch {
      showAlert('Failed to update quantity.', 'error');
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
  if (!order) return <div className="alert alert-error">Order not found.</div>;

  return (
    <div className="order-details fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Order {order.orderNumber}</h1>
          <p className="page-subtitle">Order details and items</p>
        </div>
        <Link to="/orders" className="btn btn-outline"><ArrowLeft size={18} /> Back to Orders</Link>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

      <div className="grid-2">
        {/* Order Info */}
        <div className="card">
          <h3 className="detail-section-title">Order Information</h3>
          <div className="detail-rows">
            <div className="detail-row"><span>Order Number</span><strong>{order.orderNumber}</strong></div>
            <div className="detail-row"><span>Table</span><strong>Table #{order.tableId}</strong></div>
            <div className="detail-row"><span>Customer</span><strong>{order.customerName || '—'}</strong></div>
            <div className="detail-row"><span>Guests</span><strong>{order.numberOfGuests || '—'}</strong></div>
            <div className="detail-row"><span>Order Time</span><strong>{formatDate(order.orderTime)}</strong></div>
            <div className="detail-row"><span>Last Updated</span><strong>{formatDate(order.updatedAt)}</strong></div>
            {order.specialInstructions && (
              <div className="detail-row"><span>Instructions</span><strong>{order.specialInstructions}</strong></div>
            )}
          </div>
        </div>

        {/* Status Control */}
        <div className="card">
          <h3 className="detail-section-title">Status</h3>
          <div style={{ marginBottom: '1rem' }}>
            <span className={getStatusBadge(order.status)} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
              {order.status}
            </span>
          </div>
          <label className="form-label">Update Status</label>
          <select className="form-select" value={order.status} onChange={e => handleStatusChange(e.target.value)}>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div style={{ marginTop: '1.5rem' }}>
            <div className="detail-row"><span>Total Amount</span><strong className="total-amount">Rs. {order.totalAmount?.toLocaleString()}</strong></div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 className="detail-section-title">Order Items ({order.orderItems?.length || 0})</h3>
        {(!order.orderItems || order.orderItems.length === 0) ? (
          <p style={{ color: 'var(--text-secondary)' }}>No items in this order.</p>
        ) : (
          <div className="table-container" style={{ marginTop: '1rem' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Item</th><th>Unit Price (Rs.)</th><th>Quantity</th><th>Subtotal (Rs.)</th>
                  <th>Special Requests</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map(item => (
                  <tr key={item.id}>
                    <td><strong>{item.menuItemName}</strong></td>
                    <td>{item.unitPrice?.toLocaleString()}</td>
                    <td>
                      <div className="qty-control">
                        <button className="qty-btn" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                        <span className="qty-value">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                    </td>
                    <td><strong>{item.subtotal?.toLocaleString()}</strong></td>
                    <td>{item.specialRequests || '—'}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteItem(item.id)}><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
