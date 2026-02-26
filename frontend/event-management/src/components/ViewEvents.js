import { useEffect, useState } from "react";
import { getEvents, deleteEvent } from "../services/eventService";
import { useNavigate } from "react-router-dom";

function ViewEvents() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const loadEvents = () => {
    getEvents().then(res => setEvents(res.data));
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Delete this event?")) {
      deleteEvent(id).then(() => {
        alert("Event Deleted!");
        loadEvents();
      });
    }
  };

  return (
    <div className="card">
      <h2>All Events</h2>

      <table width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Attendees</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {events.map(e => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.customerName}</td>
              <td>{e.eventDate}</td>
              <td>{e.attendees}</td>
              <td>{e.status}</td>
              <td>
                <button onClick={() => navigate(`/edit-event/${e.id}`)}>Edit</button>
                <button onClick={() => handleDelete(e.id)} style={{marginLeft:"10px", background:"red"}}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewEvents;
