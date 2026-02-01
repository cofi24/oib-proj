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



const auth_api: IAuthAPI = new AuthAPI();
//const user_api: IUserAPI = new UserAPI();
const audit_api: IAuditAPI = new AuditAPI();



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
       
        <Route path="/" element={<AuthPage authAPI={auth_api} />} />
      </Routes>
    </>
  );
}

export default App;
