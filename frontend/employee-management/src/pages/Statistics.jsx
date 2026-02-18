import { useEffect, useState } from 'react';
import { Users, DollarSign, TrendingUp, Briefcase } from 'lucide-react';
import { employeeService } from '../services/api';
import './Statistics.css';

const Statistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [departmentStats, setDepartmentStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const [overallRes, deptRes] = await Promise.all([
        employeeService.getStatistics(),
        employeeService.getDepartmentStatistics()
      ]);
      setStatistics(overallRes.data.data);
      setDepartmentStats(deptRes.data.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="statistics fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Statistics & Analytics</h1>
          <p className="page-subtitle">Employee and department insights</p>
        </div>
      </div>

      {statistics && (
        <div className="overview-section">
          <h2 className="section-title">Overall Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card card">
              <div className="stat-icon total">
                <Users size={28} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Total Employees</span>
                <span className="stat-value">{statistics.totalEmployees}</span>
              </div>
            </div>

            <div className="stat-card card">
              <div className="stat-icon active">
                <Users size={28} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Active Employees</span>
                <span className="stat-value">{statistics.activeEmployees}</span>
              </div>
            </div>

            <div className="stat-card card">
              <div className="stat-icon salary">
                <DollarSign size={28} />
              </div>
            <div className="stat-content">
              <span className="stat-label">Average Salary</span>
              <span className="stat-value">Rs. {statistics.averageSalary.toLocaleString()}</span>
            </div>
            </div>

            <div className="stat-card card">
              <div className="stat-icon expense">
                <TrendingUp size={28} />
              </div>
            <div className="stat-content">
              <span className="stat-label">Total Expense</span>
              <span className="stat-value">Rs. {statistics.totalSalaryExpense.toLocaleString()}</span>
            </div>
            </div>
          </div>
        </div>
      )}

      <div className="department-section">
        <h2 className="section-title">Department Breakdown</h2>
        <div className="department-grid">
          {departmentStats.map((dept, index) => (
            <div key={index} className="department-card card">
              <div className="department-header">
                <div className="department-icon">
                  <Briefcase size={24} />
                </div>
                <h3 className="department-name">{dept.department.replace('_', ' ')}</h3>
              </div>
              
              <div className="department-stats">
                <div className="department-stat">
                  <span className="stat-label">Employees</span>
                  <span className="stat-value">{dept.employeeCount}</span>
                </div>
                <div className="department-stat">
                  <span className="stat-label">Avg. Salary</span>
                  <span className="stat-value">Rs. {dept.averageSalary.toLocaleString()}</span>
                </div>
                <div className="department-stat">
                  <span className="stat-label">Total Expense</span>
                  <span className="stat-value">Rs. {dept.totalSalaryExpense.toLocaleString()}</span>
                </div>
              </div>

              <div className="department-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${(dept.employeeCount / statistics?.totalEmployees * 100)}%` }}
                  ></div>
                </div>
                <span className="progress-label">
                  {((dept.employeeCount / statistics?.totalEmployees) * 100).toFixed(1)}% of workforce
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="insights-section card">
        <h2 className="section-title">Key Insights</h2>
        <div className="insights-grid">
          <div className="insight-item">
            <div className="insight-icon">
              <Users size={20} />
            </div>
            <div className="insight-content">
              <span className="insight-label">Largest Department</span>
              <span className="insight-value">
                {departmentStats.reduce((max, dept) => 
                  dept.employeeCount > (max.employeeCount || 0) ? dept : max, {}
                ).department?.replace('_', ' ') || 'N/A'}
              </span>
            </div>
          </div>

          <div className="insight-item">
            <div className="insight-icon">
              <DollarSign size={20} />
            </div>
            <div className="insight-content">
              <span className="insight-label">Highest Avg. Salary Dept.</span>
              <span className="insight-value">
                {departmentStats.reduce((max, dept) => 
                  dept.averageSalary > (max.averageSalary || 0) ? dept : max, {}
                ).department?.replace('_', ' ') || 'N/A'}
              </span>
            </div>
          </div>

          <div className="insight-item">
            <div className="insight-icon">
              <TrendingUp size={20} />
            </div>
            <div className="insight-content">
              <span className="insight-label">Highest Expense Dept.</span>
              <span className="insight-value">
                {departmentStats.reduce((max, dept) => 
                  dept.totalSalaryExpense > (max.totalSalaryExpense || 0) ? dept : max, {}
                ).department?.replace('_', ' ') || 'N/A'}
              </span>
            </div>
          </div>

          <div className="insight-item">
            <div className="insight-icon">
              <Briefcase size={20} />
            </div>
            <div className="insight-content">
              <span className="insight-label">Total Departments</span>
              <span className="insight-value">{departmentStats.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
