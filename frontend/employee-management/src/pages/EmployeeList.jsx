import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, UserPlus, Eye, Edit, Trash2, Filter } from 'lucide-react';
import { employeeService } from '../services/api';
import './EmployeeList.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const departments = ['FRONT_DESK', 'HOUSEKEEPING', 'KITCHEN', 'RESTAURANT', 'MAINTENANCE', 'MANAGEMENT', 'SECURITY'];
  const statuses = ['ACTIVE', 'INACTIVE', 'ON_LEAVE'];

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [searchTerm, departmentFilter, statusFilter, employees]);

  const fetchEmployees = async () => {
    try {
      const response = await employeeService.getAllEmployees();
      setEmployees(response.data.data);
      setFilteredEmployees(response.data.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = employees;

    if (searchTerm) {
      filtered = filtered.filter(emp =>
        emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (departmentFilter) {
      filtered = filtered.filter(emp => emp.department === departmentFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter(emp => emp.status === statusFilter);
    }

    setFilteredEmployees(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeService.deleteEmployee(id);
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      ACTIVE: 'badge-success',
      INACTIVE: 'badge-danger',
      ON_LEAVE: 'badge-warning'
    };
    return `badge ${badges[status] || 'badge-success'}`;
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="employee-list fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Employee Directory</h1>
          <p className="page-subtitle">{filteredEmployees.length} employees found</p>
        </div>
        <Link to="/employees/add" className="btn btn-primary">
          <UserPlus size={20} />
          Add Employee
        </Link>
      </div>

      <div className="filters-section card">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <Filter size={18} />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept.replace('_', ' ')}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status.replace('_', ' ')}</option>
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
              <th>Email</th>
              <th>Department</th>
              <th>Position</th>
              <th>Status</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id}>
                <td>#{employee.id}</td>
                <td className="employee-name">
                  {employee.firstName} {employee.lastName}
                </td>
                <td>{employee.email}</td>
                <td>{employee.department.replace('_', ' ')}</td>
                <td>{employee.position}</td>
                <td>
                  <span className={getStatusBadge(employee.status)}>
                    {employee.status.replace('_', ' ')}
                  </span>
                </td>
                <td>Rs. {employee.salary.toLocaleString()}</td>
                <td>
                  <div className="action-buttons">
                    <Link
                      to={`/employees/${employee.id}`}
                      className="action-btn view-btn"
                      title="View"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      to={`/employees/edit/${employee.id}`}
                      className="action-btn edit-btn"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(employee.id)}
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

      {filteredEmployees.length === 0 && (
        <div className="no-results">
          <p>No employees found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
