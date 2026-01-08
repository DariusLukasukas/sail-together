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
import SignUpPage from "@/pages/auth/SignUp";
import LoginPage from "@/pages/auth/Login";
import GuestRoute from "@/components/GuestRoute";
import AuthLayout from "@/layouts/AuthLayout";
import ProfileEdit from "@/pages/ProfileEdit";
import MapPageLayout from "@/layouts/MapPageLayout";
import Test from "@/pages/Test";
import AddJobPage from "@/pages/AddJobPage";
import Favourites from "@/pages/Favourites";
import ProtectedRoute from "./layouts/ProtectedRoute";
import Listings from "@/pages/Listings";
import EditJobPage from "./pages/EditJobPage";

function App() {
  return (
    <Routes>
      <Route element={<MapPageLayout searchType="events" />}>
        <Route path="/events" element={<Events />} />
        <Route path="/test" element={<Test />} />
      </Route>

      <Route element={<MapPageLayout searchType="jobs" />}>
        <Route path="/" element={<Home />} />
      </Route>

      <Route element={<RootLayout />}>
        <Route path="/jobs/:jobId" element={<JobPage />} />
        <Route
          path="/jobs/:jobId/edit"
          element={
            <ProtectedRoute>
              <EditJobPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-job"
          element={
            <ProtectedRoute>
              <AddJobPage />
            </ProtectedRoute>
          }
        />
        <Route path="/events" element={<Events />} />
        <Route
          path="/favourites"
          element={
            <ProtectedRoute>
              <Favourites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/listings"
          element={
            <ProtectedRoute>
              <Listings />
            </ProtectedRoute>
          }
        />
        <Route path="/explore" element={<Explore />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <ProfileEdit />
            </ProtectedRoute>
          }
        />
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

      <Route element={<WizardLayout />}>
        <Route path="/add-listing">
          <Route
            index
            element={
              <ProtectedRoute>
                <Navigate to="1" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path=":step"
            element={
              <ProtectedRoute>
                <AddListingWizard />
              </ProtectedRoute>
            }
          />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
