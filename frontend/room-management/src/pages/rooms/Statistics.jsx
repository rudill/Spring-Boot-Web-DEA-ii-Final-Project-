import { useEffect, useState } from 'react';
import { BedDouble, CheckCircle, Wrench, BarChart3, XCircle } from 'lucide-react';
import { roomService } from '../../services/api';
import './Statistics.css';

const Statistics = () => {
  const [counts, setCounts] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [occupiedRooms, setOccupiedRooms] = useState([]);
  const [maintenanceRooms, setMaintenanceRooms] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const [countsRes, allRes, availRes, occRes, maintRes] = await Promise.all([
        roomService.getRoomCounts(),
        roomService.getAllRooms(),
        roomService.getAvailableRooms(),
        roomService.getOccupiedRooms(),
        roomService.getMaintenanceRooms(),
      ]);

      // GET /rooms/count → { singleRooms, doubleRooms, deluxeRooms, totalRooms }
      setCounts(countsRes.data?.data ?? countsRes.data);

      const toArr = (res) => {
        const d = res.data?.data ?? res.data;
        return Array.isArray(d) ? d : [];
      };
      setAllRooms(toArr(allRes));
      setAvailableRooms(toArr(availRes));
      setOccupiedRooms(toArr(occRes));
      setMaintenanceRooms(toArr(maintRes));
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const toNum = (val) => {
    if (val === null || val === undefined) return 0;
    if (typeof val === 'object') return val.count ?? val.total ?? 0;
    return Number(val) || 0;
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  const totalRooms      = toNum(counts?.totalRooms);
  const singleRooms     = toNum(counts?.singleRooms);
  const doubleRooms     = toNum(counts?.doubleRooms);
  const deluxeRooms     = toNum(counts?.deluxeRooms);
  const availableCount  = availableRooms.length;
  const occupiedCount   = occupiedRooms.length;
  const maintenanceCount = maintenanceRooms.length;

  // Derive per-type availability from allRooms list
  const typeBreakdown = [
    { type: 'SINGLE', total: singleRooms },
    { type: 'DELUXE', total: deluxeRooms },
    { type: 'DOUBLE', total: doubleRooms },
  ].map((t) => ({
    ...t,
    available: allRooms.filter((r) => r.roomType === t.type && r.status === 'AVAILABLE').length,
    occupied:  allRooms.filter((r) => r.roomType === t.type && r.status === 'OCCUPIED').length,
    maintenance: allRooms.filter((r) => r.roomType === t.type && r.status === 'MAINTENANCE').length,
    pct: totalRooms > 0 ? ((t.total / totalRooms) * 100).toFixed(1) : 0,
  }));

  return (
    <div className="statistics fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Statistics & Analytics</h1>
          <p className="page-subtitle">Room occupancy and type insights</p>
        </div>
      </div>

      <div className="overview-section">
        <h2 className="section-title">Overall Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card card">
            <div className="stat-icon total"><BedDouble size={28} /></div>
            <div className="stat-content">
              <span className="stat-label">Total Rooms</span>
              <span className="stat-value">{totalRooms}</span>
            </div>
          </div>

          <div className="stat-card card">
            <div className="stat-icon active"><CheckCircle size={28} /></div>
            <div className="stat-content">
              <span className="stat-label">Available Rooms</span>
              <span className="stat-value">{availableCount}</span>
            </div>
          </div>

          <div className="stat-card card">
            <div className="stat-icon salary"><XCircle size={28} /></div>
            <div className="stat-content">
              <span className="stat-label">Occupied Rooms</span>
              <span className="stat-value">{occupiedCount}</span>
            </div>
          </div>

          <div className="stat-card card">
            <div className="stat-icon expense"><Wrench size={28} /></div>
            <div className="stat-content">
              <span className="stat-label">Under Maintenance</span>
              <span className="stat-value">{maintenanceCount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="department-section">
        <h2 className="section-title">Room Type Breakdown</h2>
        <div className="department-grid">
          {typeBreakdown.map((t) => (
            <div key={t.type} className="department-card card">
              <div className="department-header">
                <div className="department-icon"><BedDouble size={24} /></div>
                <h3 className="department-name">{t.type}</h3>
              </div>

              <div className="department-stats">
                <div className="department-stat">
                  <span className="stat-label">Total Rooms</span>
                  <span className="stat-value">{t.total}</span>
                </div>
                <div className="department-stat">
                  <span className="stat-label">Available</span>
                  <span className="stat-value">{t.available}</span>
                </div>
                <div className="department-stat">
                  <span className="stat-label">Occupied</span>
                  <span className="stat-value">{t.occupied}</span>
                </div>
                <div className="department-stat">
                  <span className="stat-label">Maintenance</span>
                  <span className="stat-value">{t.maintenance}</span>
                </div>
              </div>

              <div className="department-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${t.pct}%` }}></div>
                </div>
                <span className="progress-label">{t.pct}% of total rooms</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="insights-section card">
        <h2 className="section-title">Key Insights</h2>
        <div className="insights-grid">
          <div className="insight-item">
            <div className="insight-icon"><BedDouble size={20} /></div>
            <div className="insight-content">
              <span className="insight-label">Largest Room Type</span>
              <span className="insight-value">
                {typeBreakdown.reduce((max, t) => t.total > max.total ? t : max, typeBreakdown[0] ?? { type: 'N/A', total: 0 }).type}
              </span>
            </div>
          </div>

          <div className="insight-item">
            <div className="insight-icon"><CheckCircle size={20} /></div>
            <div className="insight-content">
              <span className="insight-label">Occupancy Rate</span>
              <span className="insight-value">
                {totalRooms > 0 ? `${((occupiedCount / totalRooms) * 100).toFixed(1)}%` : 'N/A'}
              </span>
            </div>
          </div>

          <div className="insight-item">
            <div className="insight-icon"><Wrench size={20} /></div>
            <div className="insight-content">
              <span className="insight-label">Maintenance Rate</span>
              <span className="insight-value">
                {totalRooms > 0 ? `${((maintenanceCount / totalRooms) * 100).toFixed(1)}%` : 'N/A'}
              </span>
            </div>
          </div>

          <div className="insight-item">
            <div className="insight-icon"><BarChart3 size={20} /></div>
            <div className="insight-content">
              <span className="insight-label">Availability Rate</span>
              <span className="insight-value">
                {totalRooms > 0 ? `${((availableCount / totalRooms) * 100).toFixed(1)}%` : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
