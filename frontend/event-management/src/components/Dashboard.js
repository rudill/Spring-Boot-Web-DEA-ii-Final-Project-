import { useEffect, useState } from "react";
import { getEvents, getVenues } from "../services/eventService";

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    getEvents().then(res => setEvents(res.data));
    getVenues().then(res => setVenues(res.data));
  }, []);

  return (
    <div>
      <h1>Event Dashboard</h1>

      <div className="card">
        <h3>Total Venues</h3>
        <h2>{venues.length}</h2>
      </div>

      <div className="card">
        <h3>Total Events</h3>
        <h2>{events.length}</h2>
      </div>
    </div>
  );
}

export default Dashboard;
