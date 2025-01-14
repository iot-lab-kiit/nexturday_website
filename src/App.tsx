import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import Login from "./components/Auth/page";
import EventDetails from "./components/EventDetails/EventPage";
import Dashboard from "./components/Home/page";
import EventRegisterForm from "./components/EventRegisterForm/page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/event-details/:eventID/register" element={<EventRegisterForm />} />
        <Route path="/event-details/:eventID" element={<EventDetails />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
