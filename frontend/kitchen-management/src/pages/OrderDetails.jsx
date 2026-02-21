import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Clock, Flame, CheckCircle, CheckCheck, Hash, User, UtensilsCrossed, DollarSign, MessageSquare } from 'lucide-react';
import { orderService } from '../services/api';
import './OrderDetails.css';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await orderService.getOrderById(id);
      setOrder(response.data.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await orderService.updateOrderStatus(id, newStatus);
      fetchOrder();
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await orderService.deleteOrder(id);
        navigate('/orders');
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: 'badge-warning',
      COOKING: 'badge-danger',
      READY: 'badge-success',
      SERVED: 'badge-info',
    };
    return `badge ${badges[status] || 'badge-info'}`;
  };

  const getNextStatus = (currentStatus) => {
    const flow = { PENDING: 'COOKING', COOKING: 'READY', READY: 'SERVED' };
    return flow[currentStatus] || null;
  };

  const getStatusSteps = () => {
    const steps = ['PENDING', 'COOKING', 'READY', 'SERVED'];
    const currentIndex = steps.indexOf(order?.orderStatus);
    return steps.map((step, index) => ({
      label: step,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }));
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (!order) {
    return (
      <div className="error-message">
        <p>Order not found</p>
        <button onClick={() => navigate('/orders')} className="btn btn-primary">Back to Orders</button>
      </div>
    );
  }

  return (
    <div className="order-details fade-in">
      <div className="page-header">
        <button onClick={() => navigate('/orders')} className="back-btn">
          <ArrowLeft size={20} />
          Back to Orders
        </button>
        <div className="header-actions">
          {getNextStatus(order.orderStatus) && (
            <button
              onClick={() => handleStatusChange(getNextStatus(order.orderStatus))}
              className="btn btn-warning"
            >
              Move to {getNextStatus(order.orderStatus)}
            </button>
          )}
          <button onClick={handleDelete} className="btn btn-danger">
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      <div className="details-container">
        {/* Order Header */}
        <div className="order-header card">
          <div className="order-avatar">
            #{order.id}
          </div>
          <div className="order-info">
            <h1 className="order-title">Order #{order.id}</h1>
            <p className="order-table">Table: {order.tableNumber || 'N/A'}</p>
            <span className={getStatusBadge(order.orderStatus)}>
              {order.orderStatus}
            </span>
          </div>
        </div>

        {/* Status Progress */}
        <div className="status-progress card">
          <h2 className="section-title">Order Progress</h2>
          <div className="progress-steps">
            {getStatusSteps().map((step, index) => (
              <div key={step.label} className={`progress-step ${step.completed ? 'completed' : ''} ${step.current ? 'current' : ''}`}>
                <div className="step-icon">
                  {step.label === 'PENDING' && <Clock size={20} />}
                  {step.label === 'COOKING' && <Flame size={20} />}
                  {step.label === 'READY' && <CheckCircle size={20} />}
                  {step.label === 'SERVED' && <CheckCheck size={20} />}
                </div>
                <span className="step-label">{step.label}</span>
                {index < 3 && <div className={`step-line ${step.completed && !step.current ? 'completed' : ''}`}></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Order Info Cards */}
        <div className="details-grid">
          <div className="detail-card card">
            <div className="detail-icon">
              <Hash size={24} />
            </div>
            <div className="detail-content">
              <span className="detail-label">Order ID</span>
              <span className="detail-value">#{order.id}</span>
            </div>
          </div>

          <div className="detail-card card">
            <div className="detail-icon">
              <UtensilsCrossed size={24} />
            </div>
            <div className="detail-content">
              <span className="detail-label">Restaurant ID</span>
              <span className="detail-value">#{order.restaurantId}</span>
            </div>
          </div>

          <div className="detail-card card">
            <div className="detail-icon">
              <User size={24} />
            </div>
            <div className="detail-content">
              <span className="detail-label">Staff ID</span>
              <span className="detail-value">{order.staffId ? `#${order.staffId}` : 'N/A'}</span>
            </div>
          </div>

          <div className="detail-card card">
            <div className="detail-icon">
              <DollarSign size={24} />
            </div>
            <div className="detail-content">
              <span className="detail-label">Total Amount</span>
              <span className="detail-value">Rs. {order.totalAmount?.toLocaleString()}</span>
            </div>
          </div>

          <div className="detail-card card">
            <div className="detail-icon">
              <Clock size={24} />
            </div>
            <div className="detail-content">
              <span className="detail-label">Created At</span>
              <span className="detail-value">
                {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
              </span>
            </div>
          </div>

          {order.specialInstructions && (
            <div className="detail-card card">
              <div className="detail-icon">
                <MessageSquare size={24} />
              </div>
              <div className="detail-content">
                <span className="detail-label">Special Instructions</span>
                <span className="detail-value">{order.specialInstructions}</span>
              </div>
            </div>
          )}
        </div>

        {/* Order Items Table */}
        <div className="order-items-section card">
          <h2 className="section-title">Order Items ({order.orderItems?.length || 0})</h2>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems?.map((item, index) => (
                  <tr key={item.id || index}>
                    <td>{index + 1}</td>
                    <td className="item-name">{item.itemName}</td>
                    <td>{item.quantity}</td>
                    <td>Rs. {item.price?.toLocaleString()}</td>
                    <td className="item-subtotal">Rs. {(item.price * item.quantity)?.toLocaleString()}</td>
                    <td>{item.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="total-row">
                  <td colSpan="4" className="total-label">Total</td>
                  <td className="total-value">Rs. {order.totalAmount?.toLocaleString()}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
