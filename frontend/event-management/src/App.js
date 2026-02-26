import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import AddVenue from "./components/AddVenue";
import BookEvent from "./components/BookEvent";
import ViewEvents from "./components/ViewEvents";
import ViewVenues from "./components/ViewVenues";
import EditVenue from "./components/EditVenue";
import EditEvent from "./components/EditEvent";

import "./styles.css";

function App() {
  return (
    <Router>
      <div className="layout">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-venue" element={<AddVenue />} />
            <Route path="/book-event" element={<BookEvent />} />
            <Route path="/events" element={<ViewEvents />} />
            <Route path="/venues" element={<ViewVenues />} />
<Route path="/edit-venue/:id" element={<EditVenue />} />
<Route path="/edit-event/:id" element={<EditEvent />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
