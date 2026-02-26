import { useEffect, useState } from "react";
import { getVenues, deleteVenue } from "../services/eventService";
import { useNavigate } from "react-router-dom";

function ViewVenues() {
  const [venues, setVenues] = useState([]);
  const navigate = useNavigate();

  const loadVenues = () => {
    getVenues().then(res => setVenues(res.data));
  };

  useEffect(() => {
    loadVenues();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Delete this venue?")) {
      deleteVenue(id).then(() => {
        alert("Deleted!");
        loadVenues();
      });
    }
  };

  return (
    <div className="card">
      <h2>All Venues</h2>

      <table width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Capacity</th>
            <th>Price/hr</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {venues.map(v => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.name}</td>
              <td>{v.capacity}</td>
              <td>{v.pricePerHour}</td>
              <td>
                <button onClick={() => navigate(`/edit-venue/${v.id}`)}>Edit</button>
                <button onClick={() => handleDelete(v.id)} style={{marginLeft:"10px", background:"red"}}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewVenues;
