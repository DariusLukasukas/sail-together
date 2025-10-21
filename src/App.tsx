import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Profile from "./pages/Profile";
import Feed from "./pages/Feed";

function App() {
  return (
    <div className="container mx-auto">
      <nav className="flex flex-row gap-2 items-center justify-center w-full *:hover:text-blue-500 *:px-4 *:py-2 *:font-medium">
        <Link to="/">Home</Link>
        <Link to="/events">Events</Link>
        <Link to="/feed">Feed</Link>
        <Link to="/profile">Profile</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
