import { useEffect, useState } from "react";
import { getEventById, updateEvent, getVenues } from "../services/eventService";
import { useParams, useNavigate } from "react-router-dom";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [venues, setVenues] = useState([]);
  const [event, setEvent] = useState({
    venueId: "",
    customerName: "",
    eventDate: "",
    attendees: "",
    status: "CONFIRMED"
  });

  useEffect(() => {
    getVenues().then(res => setVenues(res.data));
    getEventById(id).then(res => setEvent(res.data));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateEvent(id, event).then(() => {
      alert("Event Updated!");
      navigate("/events");
    });
  };

  return (
    <div className="card">
      <h2>Edit Event</h2>

      <form onSubmit={handleSubmit}>

        <select value={event.venueId}
          onChange={e => setEvent({...event, venueId: e.target.value})}>
          {venues.map(v => (
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </select>

        <input value={event.customerName}
          onChange={e => setEvent({...event, customerName: e.target.value})} />

        <input type="date" value={event.eventDate}
          onChange={e => setEvent({...event, eventDate: e.target.value})} />

        <input type="number" value={event.attendees}
          onChange={e => setEvent({...event, attendees: e.target.value})} />

        <select value={event.status}
          onChange={e => setEvent({...event, status: e.target.value})}>
          <option value="CONFIRMED">CONFIRMED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>

        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default EditEvent;
