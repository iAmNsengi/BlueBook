import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import {
  ArrowBigRight,
  Eye,
  EyeClosed,
  Loader2,
  Lock,
  MessageSquare,
} from "lucide-react";
import AuthImagePattern from "../../components/AuthImagePattern";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [formData, setFormData] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const { resetPassword, isLoading } = useAuthStore();
  const params = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = params.token;
    if (formData.password !== formData.password2)
      return toast.error("Passwords do not match!");
    resetPassword({ password: formData.password }, token);
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
              <h1 className="text-2xl font-bold mt-2">Reset your password</h1>
              <p className="text-base-content/60">Create a new password 🤗</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
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
            </div>

            <div className="form-control">
              <label className="lavel">
                <span className="label-text font-medium">Re-type password</span>
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
                    setFormData({ ...formData, password2: e.target.value })
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
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-5 animate-spin font-bold" />{" "}
                  Submitting...
                </>
              ) : (
                <div className="flex items-center gap-2">
                  Reset Password <ArrowBigRight className="mt-1" />
                </div>
              )}
            </button>
            <div className="py-2 text-right px-3 underline">
              <span className="label-text font-medium">
                <Link to={"/login"}>Go back to Login?</Link>
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* right side */}
      <AuthImagePattern
        title="👌"
        subtitle="Finally now you can reset your password 🤗"
      />
    </div>
  );
};

export default ResetPassword;
