import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Users,
  DollarSign,
  FileText,
  MapPin,
  Star,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { getDestination, createBooking } from "../lib/api.js";
import { useAuth } from "../lib/AuthContext.jsx";

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    guests: 1,
    budget: "",
    notes: "",
  });

  useEffect(() => {
    if (id) {
      getDestination(id)
        .then((data) => {
          setDestination(data.destination);
          setForm((prev) => ({
            ...prev,
            budget: data.destination.price.toString(),
          }));
        })
        .catch((err) => {
          setError(`Could not load destination: ${err.message}`);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await createBooking({
        destination: destination?.name || "Custom Trip",
        fullName: user.name,
        startDate: new Date(form.startDate).toISOString(),
        endDate: form.endDate
          ? new Date(form.endDate).toISOString()
          : undefined,
        guests: parseInt(form.guests),
        budget: parseFloat(form.budget),
        notes: form.notes,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#4d6554] animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f4ef] px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto bg-[#dfe8d7] rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-[#4d6554]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-gray-500 mb-6">
            Your trip to{" "}
            <span className="font-medium text-gray-700">
              {destination?.name || "your destination"}
            </span>{" "}
            has been booked. We'll send you the details soon.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/my-bookings"
              className="button-primary"
            >
              View My Bookings
            </Link>
            <Link
              to="/destinations"
              className="button-secondary"
            >
              Explore More
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-[#6f6a61] hover:text-[#1f2933] mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Destination Info */}
          {destination && (
            <div className="lg:col-span-2">
              <div className="bg-[#fffdf9] rounded-lg overflow-hidden border border-[#ded7cc] sticky top-24">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="p-5">
                  <h2 className="text-xl font-semibold text-[#1f2933] mb-1">
                    {destination.name}
                  </h2>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1 text-[#6f6a61]">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="text-sm">{destination.country}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-[#b36b38] fill-[#b36b38]" />
                      <span className="text-sm font-medium text-[#1f2933]">
                        {destination.rating}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-[#6f6a61] leading-relaxed">
                    {destination.description}
                  </p>
                  <div className="mt-4 pt-4 border-t border-[#ebe5d9]">
                    <div className="text-2xl font-semibold text-[#1f2933]">
                      ${destination.price.toLocaleString()}
                      <span className="text-sm font-normal text-[#7a756b] ml-1">
                        / person
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Booking Form */}
          <div className={destination ? "lg:col-span-3" : "lg:col-span-5 max-w-2xl"}>
            <div className="bg-[#fffdf9] rounded-lg border border-[#ded7cc] p-6 sm:p-8">
              <h1 className="text-xl font-semibold text-[#1f2933] mb-1">
                Book Your Trip
              </h1>
              <p className="text-sm text-[#6f6a61] mb-6">
                Fill in the details below to reserve your spot
              </p>

              {error && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}

              {!user && (
                <div className="mb-6 px-4 py-3 bg-[#fff4d7] border border-[#ead7a1] rounded-lg text-sm text-[#785d21]">
                  Please{" "}
                  <Link to="/login" className="font-medium underline">
                    log in
                  </Link>{" "}
                  to make a booking.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1f2933] mb-1.5">
                      <Calendar className="w-3.5 h-3.5 inline mr-1" />
                      Start Date
                    </label>
                    <input
                      type="date"
                      required
                      value={form.startDate}
                      onChange={(e) =>
                        setForm({ ...form, startDate: e.target.value })
                      }
                      min={new Date().toISOString().split("T")[0]}
                      className="field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1f2933] mb-1.5">
                      <Calendar className="w-3.5 h-3.5 inline mr-1" />
                      End Date
                    </label>
                    <input
                      type="date"
                      value={form.endDate}
                      onChange={(e) =>
                        setForm({ ...form, endDate: e.target.value })
                      }
                      min={form.startDate || new Date().toISOString().split("T")[0]}
                      className="field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1f2933] mb-1.5">
                      <Users className="w-3.5 h-3.5 inline mr-1" />
                      Guests
                    </label>
                    <select
                      value={form.guests}
                      onChange={(e) =>
                        setForm({ ...form, guests: e.target.value })
                      }
                      className="field"
                    >
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i === 0 ? "Guest" : "Guests"}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1f2933] mb-1.5">
                      <DollarSign className="w-3.5 h-3.5 inline mr-1" />
                      Budget ($)
                    </label>
                    <input
                      type="number"
                      required
                      min="100"
                      value={form.budget}
                      onChange={(e) =>
                        setForm({ ...form, budget: e.target.value })
                      }
                      placeholder="1000"
                      className="field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1f2933] mb-1.5">
                    <FileText className="w-3.5 h-3.5 inline mr-1" />
                    Notes (optional)
                  </label>
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                    maxLength={600}
                    placeholder="Any special requests or preferences..."
                    className="field resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || !user}
                  className="button-primary w-full disabled:cursor-not-allowed disabled:bg-[#8f958b]"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
