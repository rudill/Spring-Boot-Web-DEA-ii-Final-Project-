import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserCheck, UserX, Clock, TrendingUp, Building2 } from 'lucide-react';
import { employeeService } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await employeeService.getStatistics();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  const statCards = [
    {
      title: 'Total Employees',
      value: stats?.totalEmployees || 0,
      icon: Users,
      color: '#3b82f6',
      bgColor: '#dbeafe',
    },
    {
      title: 'Active Employees',
      value: stats?.activeEmployees || 0,
      icon: UserCheck,
      color: '#10b981',
      bgColor: '#d1fae5',
    },
    {
      title: 'Inactive',
      value: stats?.inactiveEmployees || 0,
      icon: UserX,
      color: '#ef4444',
      bgColor: '#fee2e2',
    },
    {
      title: 'On Leave',
      value: stats?.onLeaveEmployees || 0,
      icon: Clock,
      color: '#f59e0b',
      bgColor: '#fef3c7',
    },
  ];

  return (
    <div className="dashboard fade-in">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome to ආලකමන්දා Hotel Employee Management System</p>
        </div>
        <Link to="/employees/add" className="btn btn-primary">
          <Users size={20} />
          Add New Employee
        </Link>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderLeft: `4px solid ${stat.color}` }}>
            <div className="stat-icon" style={{ backgroundColor: stat.bgColor, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">{stat.title}</p>
              <h3 className="stat-value">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 mt-4">
        <div className="card">
          <h3 className="card-title">
            <TrendingUp size={20} />
            Financial Overview
          </h3>
          <div className="financial-stats">
            <div className="financial-item">
              <span className="financial-label">Average Salary</span>
              <span className="financial-value">
                Rs. {stats?.averageSalary?.toLocaleString() || 0}
              </span>
            </div>
            <div className="financial-item">
              <span className="financial-label">Total Salary Expense</span>
              <span className="financial-value">
                Rs. {stats?.totalSalaryExpense?.toLocaleString() || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">
            <Building2 size={20} />
            Quick Actions
          </h3>
          <div className="quick-actions">
            <Link to="/employees" className="action-link">
              View All Employees
            </Link>
            <Link to="/employees/add" className="action-link">
              Add New Employee
            </Link>
            <Link to="/statistics" className="action-link">
              View Department Statistics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
