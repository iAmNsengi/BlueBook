import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { ArrowBigRight, Eye, EyeClosed, Lock, User } from "lucide-react";
import { Link } from "react-router-dom";
import RegexCraft from "regexcraft";
import toast from "react-hot-toast";
import GoogleAuth from "../../components/GoogleAuth/GoogleAuth";
import SmallLoader from "../../components/Loader/SmallLoader";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState();
  const [formData, setFormData] = useState();
  const { signUp, isSigningUp } = useAuthStore();

  const validateForm = () => {
    const passwordValidator = new RegexCraft()
      .hasMinLength(8)
      .hasUpperCase(1)
      .hasNumber(1)
      .hasSpecialCharacter(1);
    const emailValidator = new RegexCraft().isEmail();
    const fullNameValidator = new RegexCraft().hasLetter(3).hasNoNumber();

    if (!fullNameValidator.testOne(formData.fullName.trim()).isValid)
      return toast.error(
        "Invalid name, you need at least 3 letters and no number."
      );

    if (!emailValidator.testOne(formData.email.trim()).isValid)
      return toast.error("Invalid email address.");

    if (!passwordValidator.testOne(formData.password).isValid)
      return toast.error(
        "Password must have a length of at least 8 characters, 1 uppercase, 1 number and 1 special character."
      );

    if (formData.password !== formData.password2) {
      toast.error("Passwords don't match");
      return false;
    }

    return true;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();

    if (success)
      signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
      });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div
        className="hidden lg:block inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(17, 63, 103, 0.7), rgba(52, 105, 154, 0.4)), url('https://images.unsplash.com/photo-1639830488367-21141d865f6d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fHRlYW0lMjBvciUyMHBlb3BsZSUyMGNoYXR0aW5nJTIwb24lMjBwaG9uZXxlbnwwfHwwfHx8MA%3D%3D')`,
        }}
      ></div>

      {/* right side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  required
                  type="text"
                  className="input input-bordered w-full pl-14"
                  placeholder="John Doe"
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
            </div>
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
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  {showPassword ? <EyeClosed /> : <Eye />}{" "}
                </button>
              </div>
            </div>
            <div className="form-control">
              <label className="lavel">
                <span className="label-text font-medium">Re-Type Password</span>
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
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  {showPassword ? <EyeClosed /> : <Eye />}{" "}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <SmallLoader />
              ) : (
                <div className="flex items-center gap-2">
                  Create Account <ArrowBigRight className="mt-1" />
                </div>
              )}
            </button>
          </form>
          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?
              <Link className="link link-primary" to={"/login"}>
                {" "}
                Sign In
              </Link>
            </p>
          </div>
          <GoogleAuth />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
