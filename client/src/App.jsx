import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard/Dashboard";
import Download from "./components/Download";
import GuestHome from "./components/Guest/Download/GuestHome";
import GuestHomePage from "./components/Guest/GuestHomePage";

import RequireAuth from "./components/Auth/RequireAuth";
import NoRequireAuth from "./components/Auth/NotRequireAuth";

import { loadUserFromStorage } from "./redux/slice/auth/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<GuestHomePage />} />

      {/* Share Links - Must Stay Public */}
      <Route path="/f/:shortCode" element={<Download />} />
      <Route path="/g/:shortCode" element={<GuestHome />} />

      {/* Auth Routes */}
      <Route element={<NoRequireAuth />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<RequireAuth />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

    </Routes>
  );
}

export default App;