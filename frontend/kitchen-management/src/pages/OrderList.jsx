import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Eye, Trash2, Filter, Clock, Flame, CheckCircle, CheckCheck } from 'lucide-react';
import { orderService } from '../services/api';
import './OrderList.css';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const statuses = ['PENDING', 'COOKING', 'READY', 'SERVED'];

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchTerm, statusFilter, orders]);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getAllOrders();
      setOrders(response.data.data);
      setFilteredOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id?.toString().includes(searchTerm) ||
        order.tableNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.specialInstructions?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(order => order.orderStatus === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await orderService.updateOrderStatus(id, newStatus);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await orderService.deleteOrder(id);
        fetchOrders();
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

  const getStatusIcon = (status) => {
    const icons = {
      PENDING: Clock,
      COOKING: Flame,
      READY: CheckCircle,
      SERVED: CheckCheck,
    };
    const Icon = icons[status] || Clock;
    return <Icon size={14} />;
  };

  const getNextStatus = (currentStatus) => {
    const flow = { PENDING: 'COOKING', COOKING: 'READY', READY: 'SERVED' };
    return flow[currentStatus] || null;
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="order-list fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Kitchen Orders</h1>
          <p className="page-subtitle">{filteredOrders.length} orders found</p>
        </div>
        <Link to="/orders/create" className="btn btn-primary">
          <ShoppingCart size={20} />
          Create Order
        </Link>
      </div>

      <div className="filters-section card">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by order ID or table number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <Filter size={18} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Table</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="order-id">#{order.id}</td>
                <td>{order.tableNumber || 'N/A'}</td>
                <td>{order.orderItems?.length || 0} items</td>
                <td className="order-total">Rs. {order.totalAmount?.toLocaleString()}</td>
                <td>
                  <span className={getStatusBadge(order.orderStatus)}>
                    {getStatusIcon(order.orderStatus)}
                    {' '}{order.orderStatus}
                  </span>
                </td>
                <td>
                  {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
                </td>
                <td>
                  <div className="action-buttons">
                    <Link
                      to={`/orders/${order.id}`}
                      className="action-btn view-btn"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </Link>
                    {getNextStatus(order.orderStatus) && (
                      <button
                        onClick={() => handleStatusChange(order.id, getNextStatus(order.orderStatus))}
                        className="action-btn status-btn"
                        title={`Move to ${getNextStatus(order.orderStatus)}`}
                      >
                        {getStatusIcon(getNextStatus(order.orderStatus))}
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(order.id)}
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

      {filteredOrders.length === 0 && (
        <div className="no-results">
          <p>No orders found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default OrderList;
