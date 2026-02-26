import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Event Panel</h2>
      <Link to="/">Dashboard</Link>
      <Link to="/add-venue">Add Venue</Link>
      <Link to="/book-event">Book Event</Link>
      <Link to="/events">View Events</Link>
      <Link to="/venues">View Venues</Link>

    </div>
  );
}

export default Sidebar;
