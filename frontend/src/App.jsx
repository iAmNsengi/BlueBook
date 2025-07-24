import { Navigate, Route, Routes } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { usePostStore } from "./store/usePostStore";
import Navbar from "./components/Navbar";
import Loader from "./components/Loader/Loader";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import HomePage from "./pages/HomePage";
import Chat from "./pages/chat/Chat";
import FindUsers from "./pages/FindUsers";
import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/LoginPage";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { connectSocket, disconnectSocket } = usePostStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      useAuthStore.setState({ isCheckingAuth: false });
      return;
    }
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authUser) {
      connectSocket();
    }
    return () => disconnectSocket();
  }, [authUser, connectSocket, disconnectSocket]);

  if (isCheckingAuth && !authUser) return <Loader />;

  return (
    <div data-theme={theme}>
      <Navbar />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/chat"
            element={authUser ? <Chat /> : <Navigate to="/login" />}
          />
          <Route
            path="/find-friends"
            element={authUser ? <FindUsers /> : <Navigate to="/login" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/auth/reset-password/:token"
            element={authUser ? <Navigate to="/" /> : <ResetPassword />}
          />
          <Route path="/settings" element={<SettingsPage />} />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
        </Routes>
      </Suspense>

      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          className: "",
          duration: 10000,
          removeDelay: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
    </div>
  );
};

export default App;
