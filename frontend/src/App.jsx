import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/auth/SignUpPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";
import Chat from "./pages/chat/Chat";
import LoginPage from "./pages/auth/LoginPage";
import FindUsers from "./pages/FindUsers";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import Loader from "./components/Loader/Loader";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) return <Loader />;

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to={"/login"} />}
        />
        <Route path="/chat" element={authUser ? <Chat /> : <SignUpPage />} />
        <Route
          path="/find-friends"
          element={authUser ? <FindUsers /> : <SignUpPage />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to={"/"} /> : <SignUpPage />}
        />
        <Route
          path="/login"
          element={authUser ? <Navigate to={"/"} /> : <LoginPage />}
        />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />}
        />
      </Routes>

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
