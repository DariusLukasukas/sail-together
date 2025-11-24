import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import Home from "@/pages/Home";
import Events from "@/pages/Events";
import Profile from "@/pages/Profile";
import Explore from "@/pages/Explore";
import NotFound from "@/pages/NotFound";
import JobPage from "@/pages/JobPage";
import RootLayout from "@/layouts/RootLayout";
import SignUpPage from "@/pages/auth/SignUp";
import LoginPage from "@/pages/auth/Login";
import GuestRoute from "@/components/GuestRoute";
import AuthLayout from "@/layouts/AuthLayout";
import AddJob from "./components/modals/AddJob";

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />}>
          <Route path="add-listing" element={<AddJob />} />
        </Route>
        <Route path="/jobs/:jobId" element={<JobPage />} />
        <Route path="/events" element={<Events />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <SignUpPage />
            </GuestRoute>
          }
        />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
