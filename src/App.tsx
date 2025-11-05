import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import Header from "@/components/Header";
import NotFound from "./pages/NotFound";
import JobPage from "./pages/JobPage";

function App() {
  return (
    <div className="relative container mx-auto flex min-h-dvh flex-col gap-4 px-2 md:px-0">
      <Header />

      <main className="flex flex-col gap-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs/:jobId" element={<JobPage />} />
          <Route path="/events" element={<Events />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
