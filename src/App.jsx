
import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import PlaceholderPage from "./pages/PlaceholderPage";
import AdminManagement from "./pages/management/AdminManagement";
import Payments from "./pages/business/Payments";
import Enquiries from "./pages/business/Enquiries";
import ActivityLog from "./pages/business/ActivityLog";
import CareTotal from "./pages/business/CareTotal";

import UKSalesPartners from "./pages/business/UKSalesPartners";
import MedicalTourism from "./pages/business/MedicalTourism";
import PharmaProducts from "./pages/business/PharmaProducts";
import WriterPerformance from "./pages/business/WriterPerformance";
import AdsenseEarnings from "./pages/business/AdsenseEarnings";
import ContentCalendar from "./pages/business/ContentCalendar";
import SecurityManagement from "./pages/business/SecurityManagement";
import Articles from "./pages/business/Articles";
import WriteArticle from "./pages/business/WriteArticle";
import HealthShorts from "./pages/business/HealthShorts";
import Analytics from "./pages/business/Analytics";
import Backups from "./pages/business/Backups";
import MyProfile from "./pages/business/MyProfile";

import { navigation } from "./data/dashboardData";
import FreeDemos from "./pages/business/FreeDemos";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />

          {/* Actual Admin Management Page */}
          <Route
            path="admin-management"
            element={<AdminManagement />}
          />

          <Route
  path="payments"
  element={<Payments />}
/>
<Route path="enquiries" element={<Enquiries />} />

<Route path="activity-log" element={<ActivityLog />} />

<Route path="caretotal" element={<CareTotal />} />

<Route path="demo-tracking" element={<FreeDemos />} />

<Route
  path="uk-sales-partners"
  element={<UKSalesPartners />}
/>

<Route
  path="medical-tourism"
  element={<MedicalTourism />}
/>


<Route
  path="pharma-products"
  element={<PharmaProducts />}
/>

<Route
  path="writer-performance"
  element={<WriterPerformance />}
/>

<Route
  path="adsense-earnings"
  element={<AdsenseEarnings />}
/>

<Route
  path="content-calendar"
  element={<ContentCalendar />}
/>

<Route
  path="security"
  element={<SecurityManagement />}
/>

<Route path="articles" element={<Articles />} />

<Route path="write-article" element={<WriteArticle />} />

<Route path="health-shorts" element={<HealthShorts />} />

<Route path="analytics" element={<Analytics />} />

<Route path="backups" element={<Backups />} />

<Route path="my-profile" element={<MyProfile />} />
          {/* Other module pages */}
          {navigation
            .flatMap((group) => group.items)
            .filter(
              (item) =>
                item.path !== "/" &&
                item.path !== "/admin-management"
            )
            .map((item) => (
              <Route
                key={item.path}
                path={item.path.slice(1)}
                element={<PlaceholderPage />}
              />
            ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
