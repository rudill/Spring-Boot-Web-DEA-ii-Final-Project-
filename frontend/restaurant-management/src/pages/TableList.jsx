import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Eye, Edit, Trash2, Filter, CheckCircle, XCircle, Clock } from 'lucide-react';
import { tableService } from '../services/api';
import './TableList.css';

const TableList = () => {
  const [tables, setTables] = useState([]);
  const [filteredTables, setFilteredTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const statuses = ['AVAILABLE', 'OCCUPIED', 'RESERVED'];

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    filterTables();
  }, [searchTerm, statusFilter, tables]);

  const fetchTables = async () => {
    try {
      const response = await tableService.getAllTables();
      setTables(response.data.data || []);
      setFilteredTables(response.data.data || []);
    } catch (error) {
      console.error('Error fetching tables:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTables = () => {
    let filtered = tables;

    if (searchTerm) {
      filtered = filtered.filter(table =>
        table.tableNumber?.toString().includes(searchTerm) ||
        table.id?.toString().includes(searchTerm)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(table => table.status === statusFilter);
    }

    setFilteredTables(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this table?')) {
      try {
        await tableService.deleteTable(id);
        fetchTables();
      } catch (error) {
        console.error('Error deleting table:', error);
      }
    }
  };

  const handleOccupy = async (id) => {
    try {
      await tableService.occupyTable(id);
      fetchTables();
    } catch (error) {
      console.error('Error occupying table:', error);
    }
  };

  const handleFree = async (id) => {
    try {
      await tableService.freeTable(id);
      fetchTables();
    } catch (error) {
      console.error('Error freeing table:', error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      AVAILABLE: 'badge-success',
      OCCUPIED: 'badge-danger',
      RESERVED: 'badge-warning',
    };
    return `badge ${badges[status] || 'badge-info'}`;
  };

  const getStatusIcon = (status) => {
    const icons = {
      AVAILABLE: CheckCircle,
      OCCUPIED: XCircle,
      RESERVED: Clock,
    };
    const Icon = icons[status] || CheckCircle;
    return <Icon size={14} />;
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="table-list fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Restaurant Tables</h1>
          <p className="page-subtitle">{filteredTables.length} tables found</p>
        </div>
        <Link to="/tables/add" className="btn btn-primary">
          <Plus size={20} />
          Add Table
        </Link>
      </div>

      <div className="filters-section card">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by table number..."
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

      <div className="tables-grid">
        {filteredTables.map((table) => (
          <div key={table.id} className="table-card card">
            <div className="table-card-header">
              <div className="table-number">Table #{table.tableNumber}</div>
              <span className={getStatusBadge(table.status)}>
                {getStatusIcon(table.status)}
                {' '}{table.status}
              </span>
            </div>
            <div className="table-card-body">
              <div className="table-info-row">
                <span className="table-info-label">Capacity</span>
                <span className="table-info-value">{table.capacity} seats</span>
              </div>
              <div className="table-info-row">
                <span className="table-info-label">ID</span>
                <span className="table-info-value">#{table.id}</span>
              </div>
            </div>
            <div className="table-card-actions">
              <Link to={`/tables/${table.id}`} className="action-btn view-btn" title="View">
                <Eye size={16} />
              </Link>
              <Link to={`/tables/edit/${table.id}`} className="action-btn edit-btn" title="Edit">
                <Edit size={16} />
              </Link>
              {table.status === 'AVAILABLE' && (
                <button onClick={() => handleOccupy(table.id)} className="action-btn occupy-btn" title="Occupy">
                  <XCircle size={16} />
                </button>
              )}
              {table.status === 'OCCUPIED' && (
                <button onClick={() => handleFree(table.id)} className="action-btn free-btn" title="Free">
                  <CheckCircle size={16} />
                </button>
              )}
              <button onClick={() => handleDelete(table.id)} className="action-btn delete-btn" title="Delete">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTables.length === 0 && (
        <div className="no-results">
          <p>No tables found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default TableList;
