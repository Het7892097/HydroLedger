import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { toast } from "react-toastify";
import LoginPage from "./pages/LoginPage";
import RegistrationForm from "./pages/RegisterPage";
import RoleWalletForm from "./pages/RolePage";
import AdminDashboard from "./pages/AdminDashboard/Sidebar";
import { useUserContext } from "./context/userContext";
import "./index.css";
function App() {
  const { userData } = useUserContext();
  return (
    <div className="App">
      
      <Router>
        <Routes>
          <Route path="/" element={userData ? <AdminDashboard/> : <LoginPage/>} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/role-addition" element={<RoleWalletForm />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </div>

  );
}

export default App;
