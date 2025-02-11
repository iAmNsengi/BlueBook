import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
const GoogleAuth = () => {
  const clientId = "Enter your client Id";
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </GoogleOAuthProvider>
  );
};
export default GoogleAuth;
