import { Navigate, Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import Events from "@/pages/Events";
import Profile from "@/pages/Profile";
import Explore from "@/pages/Explore";
import NotFound from "@/pages/NotFound";
import JobPage from "@/pages/JobPage";
import RootLayout from "@/layouts/RootLayout";
import WizardLayout from "@/layouts/WizardLayout";
import AddListingWizard from "@/pages/add-listing/AddListingWizard";

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/jobs/:jobId" element={<JobPage />} />
        <Route path="/events" element={<Events />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route element={<WizardLayout />}>
        <Route path="/add-listing">
          <Route index element={<Navigate to="1" replace />} />
          <Route path=":step" element={<AddListingWizard />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
