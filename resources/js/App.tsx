import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
// import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
// import Videos from "./pages/UiElements/Videos";
// import Images from "./pages/UiElements/Images";
// import Alerts from "./pages/UiElements/Alerts";
// import Badges from "./pages/UiElements/Badges";
// import Avatars from "./pages/UiElements/Avatars";
// import Buttons from "./pages/UiElements/Buttons";
// import LineChart from "./pages/Charts/LineChart";
// import BarChart from "./pages/Charts/BarChart";
// import Calendar from "./pages/Calendar";
// import BasicTables from "./pages/Tables/BasicTables";
// import FormElements from "./pages/Forms/FormElements";
// import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Contacts from "./pages/Contacts/index";
import CreateContacts from "./pages/Contacts/CreateContact";
import Vehicles from "./pages/Vehicles/index";
import CreateVehicle from "./pages/Vehicles/CreateVehicle";
import VehicleDetail from "./pages/Vehicles/VehicleDetail";
import AddVehicle from "./pages/Vehicles/AddVehicle";
import EditVehicle from "./pages/Vehicles/EditVehicle";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/login" element={<SignIn />} />
          {/* <Route path="/signup" element={<SignUp />} /> */}

          {/* Dashboard Layout - Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index path="/" element={<Home />} />

            <Route
              path="/contacts"
              element={
                <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
                  <Contacts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contacts/create"
              element={
                <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
                  <CreateContacts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contacts/:id"
              element={
                <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
                  <CreateContacts />
                </ProtectedRoute>
              }
            />

            <Route
              path="/vehicles"
              element={
                <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
                  <Vehicles />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vehicles/create"
              element={
                <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
                  <CreateVehicle />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vehicles/add"
              element={
                <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
                  <AddVehicle />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vehicles/:id/edit"
              element={
                <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
                  <EditVehicle />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vehicles/:id/VehicleDetail"
              element={
                <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
                  <VehicleDetail />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfiles />
                </ProtectedRoute>
              }
            />

            {/* <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />
            <Route path="/form-elements" element={<FormElements />} />
            <Route path="/basic-tables" element={<BasicTables />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} /> */}
            
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
