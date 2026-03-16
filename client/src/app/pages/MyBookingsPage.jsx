import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck,
  MapPin,
  Users,
  DollarSign,
  Clock,
  XCircle,
  CheckCircle2,
  Loader2,
  Plane,
} from "lucide-react";
import { listBookings, cancelBooking } from "../lib/api.js";
import { useAuth } from "../lib/AuthContext.jsx";

export default function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    if (user) {
      setLoading(true);
      listBookings()
        .then((data) => setBookings(data.bookings))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    setCancelling(id);
    try {
      const data = await cancelBooking(id);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? data.booking : b)),
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setCancelling(null);
    }
  };

  const statusConfig = {
    pending: {
      icon: Clock,
      label: "Pending",
      className: "bg-amber-50 text-amber-700 border-amber-100",
    },
    confirmed: {
      icon: CheckCircle2,
      label: "Confirmed",
      className: "bg-green-50 text-green-700 border-green-100",
    },
    cancelled: {
      icon: XCircle,
      label: "Cancelled",
      className: "bg-red-50 text-red-700 border-red-100",
    },
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Sign in Required
          </h2>
          <p className="text-gray-500 mb-4">
            Please log in to view your bookings
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl"
          >
            Log in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              My Bookings
            </h1>
            <p className="text-gray-500 text-sm">
              Manage and track your travel plans
            </p>
          </div>
          <Link
            to="/destinations"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <Plane className="w-4 h-4" />
            New Trip
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded-2xl border border-gray-100 p-6"
              >
                <div className="h-5 bg-gray-100 rounded w-1/3 mb-3" />
                <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <CalendarCheck className="w-7 h-7 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No bookings yet
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Start planning your next adventure
            </p>
            <Link
              to="/destinations"
              className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
            >
              Browse Destinations
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const status = statusConfig[booking.status];
              const StatusIcon = status.icon;

              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 hover:border-gray-200 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        {booking.destination}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Booked on{" "}
                        {new Date(booking.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${status.className}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      {status.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <CalendarCheck className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-400">Date</div>
                        <div className="text-sm font-medium text-gray-700">
                          {new Date(booking.startDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            },
                          )}
                          {booking.endDate &&
                            ` - ${new Date(booking.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-400">Guests</div>
                        <div className="text-sm font-medium text-gray-700">
                          {booking.guests}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-400">Budget</div>
                        <div className="text-sm font-medium text-gray-700">
                          ${(booking.budget ?? 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {booking.notes && (
                    <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mb-4">
                      {booking.notes}
                    </p>
                  )}

                  {booking.status !== "cancelled" && (
                    <div className="pt-3 border-t border-gray-50 flex justify-end">
                      <button
                        onClick={() => handleCancel(booking._id)}
                        disabled={cancelling === booking._id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {cancelling === booking._id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5" />
                        )}
                        Cancel Booking
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
