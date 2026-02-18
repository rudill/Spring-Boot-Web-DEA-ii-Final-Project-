import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { employeeService } from '../services/api';
import './EmployeeForm.css';

const AddEmployee = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    salary: '',
    hireDate: '',
    status: 'ACTIVE',
    address: ''
  });

  const departments = ['FRONT_DESK', 'HOUSEKEEPING', 'KITCHEN', 'RESTAURANT', 'MAINTENANCE', 'MANAGEMENT', 'SECURITY'];
  const statuses = ['ACTIVE', 'INACTIVE', 'ON_LEAVE'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        salary: parseFloat(formData.salary)
      };
      
      await employeeService.createEmployee(submitData);
      navigate('/employees');
    } catch (error) {
      console.error('Error creating employee:', error);
      setError(error.response?.data?.message || 'Failed to create employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="employee-form fade-in">
      <div className="page-header">
        <button onClick={() => navigate('/employees')} className="back-btn">
          <ArrowLeft size={20} />
          Back to List
        </button>
      </div>

      <div className="form-container card">
        <h1 className="form-title">Add New Employee</h1>
        <p className="form-subtitle">Fill in the details below to add a new employee</p>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                First Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="form-input"
                required
                minLength="2"
                maxLength="50"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                Last Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="form-input"
                required
                minLength="2"
                maxLength="50"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone <span className="required">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                required
                pattern="[0-9]{10}"
                placeholder="10 digits"
              />
            </div>

            <div className="form-group">
              <label htmlFor="position" className="form-label">
                Position <span className="required">*</span>
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="department" className="form-label">
                Department <span className="required">*</span>
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="salary" className="form-label">
                Salary <span className="required">*</span>
              </label>
              <input
                type="number"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className="form-input"
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="hireDate" className="form-label">
                Hire Date <span className="required">*</span>
              </label>
              <input
                type="date"
                id="hireDate"
                name="hireDate"
                value={formData.hireDate}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Status <span className="required">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
                required
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="address" className="form-label">
                Address <span className="required">*</span>
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-textarea"
                required
                rows="3"
              />
            </div>
          </div>

          <div className="form-actions">
            <Link to="/employees" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner-small"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Create Employee
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
