import { Route, Routes } from "react-router-dom";
import { AuthPage } from "./pages/AuthPage";
import { IAuthAPI } from "./api/auth/IAuthAPI";
import { AuthAPI } from "./api/auth/AuthAPI";
//import { UserAPI } from "./api/users/UserAPI";
//import { IUserAPI } from "./api/users/IUserAPI";
import { DashboardPage } from "./pages/DashboardPage";

import { ProtectedRoute } from "./components/protected_route/ProtectedRoute";
//audit
import { AuditAPI } from "./api/audit/AuditAPI";
import { IAuditAPI } from "./api/audit/IAuditAPI";
import { AuditLogsPage } from "./pages/AuditPage";
//performance
import { PerformancePage } from "./pages/PerformancePage";
//analytics
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { IAnalyticsAPI } from "./api/analytics/IAnalyticsAPI";
import { AnalyticsAPI } from "./api/analytics/AnalyticsAPI";
//production  
import { ProductionPage } from "./pages/ProductionPage";
import { IProductionAPI } from "./api/production/IProductionAPI";
import { ProductionAPI } from "./api/production/ProductionAPI";
//processing
import { IProcessingAPI } from "./api/processing/IProcessingAPI";
import { ProcessingAPI } from "./api/processing/ProcessingAPI";
import { ProcessingPage } from "./pages/ProcessingPage";



const auth_api: IAuthAPI = new AuthAPI();
//const user_api: IUserAPI = new UserAPI();
const audit_api: IAuditAPI = new AuditAPI();
const analytics_api: IAnalyticsAPI = new AnalyticsAPI();
const production_api: IProductionAPI = new ProductionAPI();
const processing_api: IProcessingAPI = new ProcessingAPI();

function App() {
  return (
    <>
      <Routes>
        <Route
        path="/audit-logs"
        element={
          <ProtectedRoute requiredRole="admin">
            <AuditLogsPage auditAPI={audit_api} />
          </ProtectedRoute>
        }
      />
         <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="admin,sales_manager,seller">
              <DashboardPage  />
            </ProtectedRoute>
          }
        /> 
        <Route path="/performance"
         element={ 
         
             <PerformancePage />
          } />
       <Route
        path="/analytics"
        element={
          <ProtectedRoute requiredRole="admin">
            <AnalyticsPage analyticsAPI={analytics_api} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/production"
        element={
          <ProtectedRoute requiredRole="admin,seller,sales_manager">
            <ProductionPage productionAPI={production_api} auditAPI={audit_api} />
          </ProtectedRoute>
        }
      />


     <Route
        path="/processing"
        element={
          <ProtectedRoute requiredRole="admin,seller,sales_manager">
            <ProcessingPage
              processingAPI={processing_api}
              auditAPI={audit_api}
            />
          </ProtectedRoute>
        }
      />





        <Route path="/" element={<AuthPage authAPI={auth_api} />} />
      </Routes>
    </>
  );
}

export default App;
