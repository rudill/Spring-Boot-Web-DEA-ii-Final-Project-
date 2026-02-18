import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Mail, Phone, MapPin, Calendar, DollarSign, Briefcase } from 'lucide-react';
import { employeeService } from '../services/api';
import './EmployeeDetails.css';

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const response = await employeeService.getEmployeeById(id);
      setEmployee(response.data.data);
    } catch (error) {
      console.error('Error fetching employee:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeService.deleteEmployee(id);
        navigate('/employees');
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

  if (!employee) {
    return (
      <div className="error-message">
        <p>Employee not found</p>
        <Link to="/employees" className="btn btn-primary">Back to List</Link>
      </div>
    );
  }

  return (
    <div className="employee-details fade-in">
      <div className="page-header">
        <button onClick={() => navigate('/employees')} className="back-btn">
          <ArrowLeft size={20} />
          Back to List
        </button>
        <div className="header-actions">
          <Link to={`/employees/edit/${employee.id}`} className="btn btn-secondary">
            <Edit size={18} />
            Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      <div className="details-container">
        <div className="employee-header card">
          <div className="employee-avatar">
            {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
          </div>
          <div className="employee-info">
            <h1 className="employee-title">
              {employee.firstName} {employee.lastName}
            </h1>
            <p className="employee-position">{employee.position}</p>
            <span className={getStatusBadge(employee.status)}>
              {employee.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="details-grid">
          <div className="detail-card card">
            <div className="detail-icon">
              <Mail size={24} />
            </div>
            <div className="detail-content">
              <span className="detail-label">Email</span>
              <span className="detail-value">{employee.email}</span>
            </div>
          </div>

          <div className="detail-card card">
            <div className="detail-icon">
              <Phone size={24} />
            </div>
            <div className="detail-content">
              <span className="detail-label">Phone</span>
              <span className="detail-value">{employee.phone}</span>
            </div>
          </div>

          <div className="detail-card card">
            <div className="detail-icon">
              <Briefcase size={24} />
            </div>
            <div className="detail-content">
              <span className="detail-label">Department</span>
              <span className="detail-value">{employee.department.replace('_', ' ')}</span>
            </div>
          </div>

          <div className="detail-card card">
            <div className="detail-icon">
              <DollarSign size={24} />
            </div>
            <div className="detail-content">
              <span className="detail-label">Salary</span>
              <span className="detail-value">Rs. {employee.salary.toLocaleString()}</span>
            </div>
          </div>

          <div className="detail-card card">
            <div className="detail-icon">
              <Calendar size={24} />
            </div>
            <div className="detail-content">
              <span className="detail-label">Hire Date</span>
              <span className="detail-value">
                {new Date(employee.hireDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="detail-card card">
            <div className="detail-icon">
              <MapPin size={24} />
            </div>
            <div className="detail-content">
              <span className="detail-label">Address</span>
              <span className="detail-value">{employee.address}</span>
            </div>
          </div>
        </div>

        <div className="additional-info card">
          <h2 className="section-title">Additional Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Employee ID</span>
              <span className="info-value">#{employee.id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Department</span>
              <span className="info-value">{employee.department.replace('_', ' ')}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Position</span>
              <span className="info-value">{employee.position}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status</span>
              <span className="info-value">{employee.status.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
