import { useState, useEffect } from "react";
import { bookEvent, getVenues } from "../services/eventService";

function BookEvent() {
  const [venues, setVenues] = useState([]);
  const [event, setEvent] = useState({
    venueId: "",
    customerName: "",
    eventDate: "",
    attendees: ""
  });

  useEffect(() => {
    getVenues().then(res => setVenues(res.data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    bookEvent(event)
      .then(() => alert("Event Booked!"))
      .catch(err => alert(err.response.data.message));
  };

  return (
    <div className="card">
      <h2>Book Event</h2>
      <form onSubmit={handleSubmit}>

        <select onChange={e => setEvent({...event, venueId: e.target.value})}>
          <option>Select Venue</option>
          {venues.map(v => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>

        <input placeholder="Customer Name"
          onChange={e => setEvent({...event, customerName: e.target.value})} />

        <input type="date"
          onChange={e => setEvent({...event, eventDate: e.target.value})} />

        <input type="number" placeholder="Attendees"
          onChange={e => setEvent({...event, attendees: e.target.value})} />

        <button type="submit">Book</button>
      </form>
    </div>
  );
}

export default BookEvent;
