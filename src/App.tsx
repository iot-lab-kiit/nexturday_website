import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import Login from "./components/Auth/page";
import EventDetails from "./components/EventDetails/EventPage";
import Dashboard from "./components/Dashboard/page";
import Form from "./components/Form/page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/event-details" element={<EventDetails />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/form" element={<Form/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
