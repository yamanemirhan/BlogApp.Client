import React from "react";
import MainLayout from "./components/layouts/MainLayout";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/LoginPage";
import { Toaster } from "@/components/ui/toaster";
import { useQuery } from "@tanstack/react-query";
import CreatePostPage from "./pages/posts/CreatePostPage";
import { axiosInstance } from "./lib/axios";
import PostDetailPage from "./pages/posts/PostDetailPage";
import MyProfilePage from "./pages/profile/MyProfilePage";
import UserProfilePage from "./pages/profile/UserProfilePage";

const App = () => {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["getProfile"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/user/me");
        return res.data;
      } catch (error) {
        // todo: toast
        console.error("error: ", error.message);
        return null;
      }
    },
  });

  if (isLoading) return null;

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" /> : <SignUpPage />}
        />
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route
          path="/post/create"
          element={authUser ? <CreatePostPage /> : <Navigate to="/login" />}
        />
        <Route path="/post/:id" element={<PostDetailPage />} />
        <Route
          path="/profile/me"
          element={authUser ? <MyProfilePage /> : <Navigate to="/login" />}
        />
        <Route path="/profile/:username" element={<UserProfilePage />} />
      </Routes>
      <Toaster />
    </MainLayout>
  );
};

export default App;
