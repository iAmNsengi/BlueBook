import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import {
  ArrowBigRight,
  Eye,
  EyeClosed,
  Lock,
  Mail,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../../components/AuthImagePattern";
import toast from "react-hot-toast";
import GoogleAuth from "../../components/GoogleAuth/GoogleAuth";
import SmallLoader from "../../components/Loader/SmallLoader";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState();
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password === "" || formData.email.trim() === "")
      return toast.error("All fields are required!");
    login(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <h1 className="text-2xl font-bold mt-2">Login to your account</h1>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="lavel">
                <span className="label-text font-medium">E-mail</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"></div>
                <input
                  required
                  type="email"
                  className="input input-bordered w-full pl-14"
                  placeholder="johndoe@mail.com"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-control">
              <label className="lavel">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"></div>
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-14"
                  placeholder="••••••••••••••••"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() =>
                    formData.password !== ""
                      ? setShowPassword(!showPassword)
                      : undefined
                  }
                  type="button"
                >
                  {showPassword && formData?.password !== "" ? (
                    <EyeClosed />
                  ) : (
                    <Eye />
                  )}{" "}
                </button>
              </div>
              <div className="py-2 text-right px-3 underline">
                <span className="label-text font-medium">
                  <Link to={"/forgot-password"}>Forgot Password?</Link>
                </span>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <SmallLoader />
                </>
              ) : (
                <div className="flex items-center gap-2">
                  Login <ArrowBigRight className="mt-1" />
                </div>
              )}
            </button>
          </form>
          <div className="text-center">
            <p className="text-base-content/60">
              Don&apos;t have an account?
              <Link className="link link-primary" to={"/signup"}>
                {" "}
                Sign Up
              </Link>
            </p>
          </div>
          <GoogleAuth />
        </div>
      </div>

      {/* right side */}
      {/* <AuthImagePattern
        title="Welcome back 🤗"
        subtitle="Stay connected to your friends and community 👌"
      /> */}
      <div
        className="inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1718804714714-03e882445fcd?q=80&w=986&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        }}
      >
        <img src={`/vuga.png`} alt="auth" className="w-full h-full" />
      </div>
    </div>
  );
};

export default LoginPage;
