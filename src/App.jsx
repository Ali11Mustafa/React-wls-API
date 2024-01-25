import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";

function App() {

  const isAuthenticated = sessionStorage.getItem('token')  || localStorage.getItem('token') !== null;
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/auth/sign-in');
  }

  
  return (
    <Routes>
      
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
    </Routes>
  );
}

export default App;
