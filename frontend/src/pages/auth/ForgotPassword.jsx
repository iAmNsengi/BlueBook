import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { ArrowBigRight, Loader2, Mail, MessageSquare } from "lucide-react";
import AuthImagePattern from "../../components/AuthImagePattern";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [formData, setFormData] = useState();
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password === "" || formData.email.trim() === "")
      return toast.error("All fields are required!");
    console.log(formData);

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
              <h1 className="text-2xl font-bold mt-2">Reset your password</h1>
              <p className="text-base-content/60">Forgot password 😒</p>
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

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
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
        title="😒"
        subtitle="So sad you can't remember your password 🤦‍♂️"
      />
    </div>
  );
};

export default ForgotPassword;
