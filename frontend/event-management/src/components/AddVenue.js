import { useState } from "react";
import { addVenue } from "../services/eventService";

function AddVenue() {
  const [venue, setVenue] = useState({
    name: "",
    capacity: "",
    pricePerHour: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addVenue(venue).then(() => {
      alert("Venue Added!");
    });
  };

  return (
    <div className="card">
      <h2>Add Venue</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Venue Name"
          onChange={e => setVenue({...venue, name: e.target.value})} />

        <input type="number" placeholder="Capacity"
          onChange={e => setVenue({...venue, capacity: e.target.value})} />

        <input type="number" placeholder="Price Per Hour"
          onChange={e => setVenue({...venue, pricePerHour: e.target.value})} />

        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default AddVenue;
