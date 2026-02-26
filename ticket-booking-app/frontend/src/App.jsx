 import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Booking from "./pages/Booking";
import SeatLayout from "./pages/SeatLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Confirmation from "./pages/Confirmation";
import MyBookings from "./pages/MyBookings";
import Billing from "./pages/Billing";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/seats" element={<SeatLayout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/confirmation" element={<Confirmation />} />
      </Routes>
    </Router>
  );
}