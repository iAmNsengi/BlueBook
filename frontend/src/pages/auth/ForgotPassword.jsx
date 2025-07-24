import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { ArrowBigRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [formData, setFormData] = useState();
  const { forgotPassword, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    forgotPassword({ email: formData.email });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <h1 className="text-2xl font-bold mt-2">Reset your password</h1>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="lavel">
                <span className="label-text font-medium">E-mail</span>
              </label>
              <div className="relative">
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
      <div
        className="hidden lg:block inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(17, 63, 103, 0.7), rgba(52, 105, 154, 0.4)), url('https://images.unsplash.com/photo-1697382608786-bcf4c113b86e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Zm9yZ290JTIwcGFzc3dvcmQlMjB1c2VyfGVufDB8fDB8fHww')`,
        }}
      ></div>
    </div>
  );
};

export default ForgotPassword;
