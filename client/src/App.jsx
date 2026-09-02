import { BrowserRouter, Routes, Route } from "react-router-dom";
import JobDetails from "./Pages/JobDetails";
import Navbar from "./Components/Navbar";

import Home from "./Pages/Home";
import Jobs from "./Pages/Jobs";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ApplyJob from "./Pages/ApplyJob";
import MyApplications from "./Pages/MyApplications";
import EmployerApplications from "./Pages/EmployerApplications";
import EmployerJobs from "./Pages/EmployerJobs";
import EditJob from "./Pages/EditJob";
import ProtectedRoute from "./Components/ProtectedRoute";
import CreateJob from "./Pages/CreateJob";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/apply/:jobId" element={<ApplyJob />} />

        <Route
          path="/employer/create-job"
          element={
            <ProtectedRoute role="employer">
              <CreateJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-applications"
          element={
            <ProtectedRoute role="jobseeker">
              <MyApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/jobs"
          element={
            <ProtectedRoute role="employer">
              <EmployerJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/applications/:jobId"
          element={
            <ProtectedRoute role="employer">
              <EmployerApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/edit-job/:id"
          element={
            <ProtectedRoute role="employer">
              <EditJob />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
