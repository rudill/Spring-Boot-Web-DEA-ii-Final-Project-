import { useEffect, useState } from "react";
import { getVenueById, updateVenue } from "../services/eventService";
import { useParams, useNavigate } from "react-router-dom";

function EditVenue() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [venue, setVenue] = useState({
    name: "",
    capacity: "",
    pricePerHour: ""
  });

  useEffect(() => {
    getVenueById(id).then(res => setVenue(res.data));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateVenue(id, venue).then(() => {
      alert("Venue Updated!");
      navigate("/venues");
    });
  };

  return (
    <div className="card">
      <h2>Edit Venue</h2>

      <form onSubmit={handleSubmit}>
        <input value={venue.name}
          onChange={e => setVenue({...venue, name: e.target.value})} />

        <input type="number" value={venue.capacity}
          onChange={e => setVenue({...venue, capacity: e.target.value})} />

        <input type="number" value={venue.pricePerHour}
          onChange={e => setVenue({...venue, pricePerHour: e.target.value})} />

        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default EditVenue;
