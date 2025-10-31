import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import Header from "@/components/Header";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="relative container mx-auto flex min-h-svh flex-col px-2 md:px-0">
      <Header />

      <main className="flex flex-1 flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
// Updated App.tsx to include the dynamic :userId parameter in the <Route> path
export default App;
