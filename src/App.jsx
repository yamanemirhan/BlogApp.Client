import React, { useEffect, useState } from "react";
import MainLayout from "./components/layouts/MainLayout";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/LoginPage";
import { Toaster } from "@/components/ui/toaster";
import { getAuthToken } from "./lib/auth";
import { useQuery } from "@tanstack/react-query";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // fix here, showing signup or login for a sec
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setIsAuthenticated(true);
    }
  }, [isAuthenticated]);

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" /> : <SignUpPage />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
        />
      </Routes>

      <Toaster />
    </MainLayout>
  );
};

export default App;

// const { data: authUser, isLoading } = useQuery({
//   use thay key to fetch user without fetching this once again
//   etc: const {data: authUser, isLoading, error} = useQuery({querKey: ["authUser"]})
//   queryKey: ["authUser"],
//   queryFn: async () => {
//     try {
//       const res = await axiosInstance.get("/user/me");
//       return res.data;
//     } catch (err) {
//       if (err.response && err.response.status == 401) {
//         return null;
//       }
//       toast err.response.data || smt went wrong
//     }
//   },
// });

// maybe show loading anim
// if (isLoading) return null;
