import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
// import SignIn from "./pages/AuthPages/SignIn";
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
import ContactDetail from "./pages/Contacts/ContactDetail";
import Vehicles from "./pages/Vehicles/index";
import VehicleDetail from "./pages/Vehicles/VehicleDetail";
import AddVehicle from "./pages/Vehicles/AddVehicle";
import EditVehicle from "./pages/Vehicles/EditVehicle";
import CreateWorkOrder from "./pages/WorkOrders/CreateWorkOrder";
import WorkOrdersList from "./pages/WorkOrders/WorkOrdersList";
import ServiceTasksList from "./pages/ServiceTasks/ServiceTasksList";
import CreateServiceTask from "./pages/ServiceTasks/CreateServiceTask";
import ViewServiceTask from "./pages/ServiceTasks/ViewServiceTask";
import IssuesList from "./pages/Issues/IssuesList";
import CreateIssue from "./pages/Issues/CreateIssue";
import IssueDetails from "./pages/Issues/IssueDetails";
import Vendors from "./pages/vendor/index";
import CreateVendor from "./pages/vendor/CreateVendor";
// import Fuels from "./pages/Fuels/index";
// import CreateFuel from "./pages/Fuels/CreateFuel";
import CreatePart from "./pages/Parts/CreatePart";
import PartsList from "./pages/Parts/PartsList";
import EditPart from "./pages/Parts/EditPart";
import CreateServiceReminder from "./pages/ServiceReminders/CreateServiceReminder";
import ServiceReminderList from "./pages/ServiceReminders/ServiceReminderList";
import Fuels from "./pages/Fuels";
import CreateFuel from "./pages/Fuels/CreateFuel";
import FuelDetail from "./pages/Fuels/FuelDetail";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout - Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
          <Route index path="/" element={<Home />} />
          <Route index path="/home" element={<Home />} />

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
            path="/contacts/:id/ContactDetail"
            element={
              <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
                <ContactDetail />
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
                <AddVehicle />
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
            path="/work-orders"
            element={
              <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
                <WorkOrdersList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/work-orders/create"
            element={
              <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
                <CreateWorkOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/work-orders/:id"
            element={
              <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
                <CreateWorkOrder />
              </ProtectedRoute>
            }
          />

          <Route
            path="/service-tasks"
            element={
              <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
                <ServiceTasksList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/service-tasks/create"
            element={
              <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
                <CreateServiceTask />
              </ProtectedRoute>
            }
          />
          <Route
            path="/service-tasks/:id"
            element={
              <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
                <ViewServiceTask />
              </ProtectedRoute>
            }
          />
          <Route
            path="/service-tasks/:id/edit"
            element={
              <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
                <CreateServiceTask />
              </ProtectedRoute>
            }
          />

          <Route
            path="/issues"
            element={
              <ProtectedRoute requiredRoles={["Admin", "Manager" , "Contact" ]}>
                <IssuesList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/issues/create"
            element={
              <ProtectedRoute requiredRoles={["Admin", "Manager" ,"Contact"]}>
                <CreateIssue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/issues/:id"
            element={
              <ProtectedRoute requiredRoles={["Admin", "Manager" ,"Contact"]}>
                <IssueDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/issues/:id/edit"
            element={
              <ProtectedRoute requiredRoles={["Admin", "Manager" ,"Contact"]}>
                <CreateIssue />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vendors"
            element={
              <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
                <Vendors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendors/create"
            element={
              <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
                <CreateVendor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendors/:id"
            element={
              <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
                <CreateVendor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendors/:id/edit"
            element={
              <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
                <CreateVendor />
              </ProtectedRoute>
            }
          />

            <Route
              path="/fuels"
              element={
                <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
                  <Fuels/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/fuels/create"
              element={
                <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
                  <CreateFuel/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/fuels/:id"
              element={
                <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
                  <CreateFuel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fuels/:id/FuelDetail"
              element={
                <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
                  <FuelDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fuels/:id/edit"
              element={
                <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
                  <CreateFuel />
                </ProtectedRoute>
              }
            />

          <Route
            path="/parts"
            element={
              <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
                <PartsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parts/create"
            element={
              <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
                <CreatePart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/parts/:id/edit"
            element={
              <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
                <EditPart />
              </ProtectedRoute>
            }
          />


          <Route
            path="/service-reminders"
            element={
              <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
                <ServiceReminderList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/service-reminders/create"
            element={
              <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
                <CreateServiceReminder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/service-reminders/:id"
            element={
              <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
                <CreateServiceReminder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/service-reminders/:id/edit"
            element={
              <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
                <CreateServiceReminder />
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
            <Route path="/bar-chart" element={<BarChart />} /> 
          */}

          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
