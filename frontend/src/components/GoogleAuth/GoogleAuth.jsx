import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";
const GoogleAuth = () => {
  const clientId = import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID;

  const { loginWithGoogle } = useAuthStore();
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          loginWithGoogle(credentialResponse);
        }}
        onError={() => {
          return toast.error("Login Failed");
        }}
      />
    </GoogleOAuthProvider>
  );
};
export default GoogleAuth;
