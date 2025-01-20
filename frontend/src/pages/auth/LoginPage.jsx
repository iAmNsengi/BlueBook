import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import {
  ArrowBigRight,
  Eye,
  EyeClosed,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../../components/AuthImagePattern";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState();
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary animate-pulse" />
              </div>
              <h1 className="text-2xl font-bold mt-2">
                Welcome Back <span className="animate-pulse">🤗</span>{" "}
              </h1>
              <p className="text-base-content/60">Login to your accout</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="lavel">
                <span className="label-text font-medium">E-mail</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
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
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
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
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  {showPassword ? <EyeClosed /> : <Eye />}{" "}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full animate-pulse"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="size-5 animate-spin font-bold" />{" "}
                  Submitting...
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
        </div>
      </div>

      {/* right side */}
      <AuthImagePattern
        title="Welcome back 🤗"
        subtitle="Stay connected to your friends and community 👌"
      />
    </div>
  );
};

export default LoginPage;
