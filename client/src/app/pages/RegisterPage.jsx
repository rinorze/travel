import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { registerUser } from "../lib/api.js";
import { useAuth } from "../lib/AuthContext.jsx";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await registerUser(form);
      login(data.user, data.token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f4ef] px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#1f2933] mb-4"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full border border-[#1f2933] text-xs font-bold">
              T
            </span>
            <span className="text-xl font-semibold tracking-tight">Travel</span>
          </Link>
          <h1 className="text-2xl font-semibold text-[#1f2933] mt-4 mb-1">
            Create your account
          </h1>
          <p className="text-sm text-[#6f6a61]">
            Save bookings and manage travel dates
          </p>
        </div>

        <div className="bg-[#fffdf9] rounded-lg border border-[#ded7cc] p-6 sm:p-8">
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1f2933] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                minLength={2}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
                className="field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1f2933] mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1f2933] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="At least 6 characters"
                  className="field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8f958b] hover:text-[#1f2933] cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="button-primary w-full disabled:cursor-not-allowed disabled:bg-[#8f958b]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#6f6a61] mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#4d6554] hover:text-[#1f2933]"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
