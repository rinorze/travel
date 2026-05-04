import { useState, useEffect, createElement } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MapPin,
  CalendarCheck,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Star,
  Globe,
  Users,
  Shield,
  ArrowRight,
  CheckCircle,
  UserCircle,
  Mail,
  Lock,
} from "lucide-react";
import { useAuth } from "../lib/AuthContext.jsx";
import {
  listDestinations,
  listBookings,
  createDestinationAdmin,
  updateDestinationAdmin,
  deleteDestinationAdmin,
  updateProfile,
} from "../lib/api.js";

const categories = ["beach", "mountain", "city", "cultural", "adventure"];

const emptyForm = {
  name: "",
  country: "",
  description: "",
  image: "",
  price: "",
  rating: "",
  category: "beach",
  featured: false,
};

function getActiveTab(search, isAdmin) {
  const tab = new URLSearchParams(search).get("tab");
  if (tab === "profile") return "profile";
  if (tab === "bookings") return "bookings";
  if (tab === "overview") return "overview";
  if (tab === "destinations" && isAdmin) return "destinations";
  return isAdmin ? "destinations" : "overview";
}

export default function DashboardPage() {
  const { user, isAdmin, updateUser } = useAuth();
  const location = useLocation();

  const [destinations, setDestinations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const activeTab = getActiveTab(location.search, isAdmin);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Profile state (kept inside dashboard so profile isn't a separate public page)
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [nameForm, setNameForm] = useState({ name: user?.name || "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        const [destData, bookData] = await Promise.all([
          listDestinations(),
          listBookings(isAdmin ? { scope: "all" } : {}).catch(() => ({
            bookings: [],
          })),
        ]);
        setDestinations(destData.destinations);
        setBookings(bookData.bookings);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, isAdmin]);

  useEffect(() => {
    if (!user) return;
    setNameForm({ name: user?.name || "" });
  }, [user?._id, user?.name]);

  if (!user) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <p className="text-gray-500 mb-4">
            Please log in to access the dashboard.
          </p>
          <Link
            to="/login"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Log in
          </Link>
        </div>
      </div>
    );
  }

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  const openEdit = (dest) => {
    setEditing(dest);
    setForm({
      name: dest.name,
      country: dest.country,
      description: dest.description,
      image: dest.image,
      price: dest.price.toString(),
      rating: dest.rating.toString(),
      category: dest.category,
      featured: dest.featured,
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        rating: parseFloat(form.rating),
      };

      if (editing) {
        const data = await updateDestinationAdmin(editing._id, payload);
        setDestinations((prev) =>
          prev.map((d) => (d._id === editing._id ? data.destination : d)),
        );
        setSuccess("Destination updated successfully.");
      } else {
        const data = await createDestinationAdmin(payload);
        setDestinations((prev) => [data.destination, ...prev]);
        setSuccess("Destination created successfully.");
      }
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this destination?")) return;

    setDeleting(id);
    setSuccess("");

    try {
      await deleteDestinationAdmin(id);
      setDestinations((prev) => prev.filter((d) => d._id !== id));
      setSuccess("Destination deleted successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(null);
    }
  };

  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const confirmedBookings = bookings.filter(
    (b) => b.status === "confirmed",
  ).length;

  const handleNameUpdate = async (e) => {
    e.preventDefault();
    const nextName = nameForm.name.trim();
    if (!nextName || nextName === user?.name) return;

    setProfileSaving(true);
    setProfileError("");
    setProfileSuccess("");

    try {
      const data = await updateProfile({ name: nextName });
      updateUser(data.user);
      setProfileSuccess("Name updated successfully.");
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setProfileError("New passwords do not match.");
      return;
    }

    setProfileSaving(true);

    try {
      await updateProfile({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setProfileSuccess("Password updated successfully.");
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setProfileSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {activeTab === "destinations"
              ? "Destinations"
              : activeTab === "bookings"
                ? "Bookings"
                : activeTab === "profile"
                  ? "Profile"
                  : "Overview"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isAdmin ? "Manage your platform" : "Your travel overview"}
          </p>
        </div>
        {isAdmin && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
            <Shield className="w-3.5 h-3.5" />
            Admin
          </span>
        )}
      </div>

      {/* Success message */}
      {success && (
        <div className="mb-6 px-4 py-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-600 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {success}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
      ) : (
        <>
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {isAdmin && (
                  <StatCard
                    icon={Globe}
                    label="Destinations"
                    value={destinations.length}
                    color="blue"
                  />
                )}
                <StatCard
                  icon={CalendarCheck}
                  label="Total Bookings"
                  value={bookings.length}
                  color="green"
                />
                <StatCard
                  icon={Users}
                  label="Pending"
                  value={pendingBookings}
                  color="amber"
                />
                <StatCard
                  icon={Star}
                  label="Confirmed"
                  value={confirmedBookings}
                  color="purple"
                />
              </div>

              {/* Recent Bookings */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-900">
                    Recent Bookings
                  </h3>
                  <Link
                    to="/my-bookings"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    View all
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {bookings.length === 0 ? (
                  <p className="text-sm text-gray-400 py-6 text-center">
                    No bookings yet. Start exploring destinations!
                  </p>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {bookings.slice(0, 5).map((booking) => (
                      <div
                        key={booking._id}
                        className="flex items-center justify-between py-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {booking.destination}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(booking.startDate).toLocaleDateString()}
                            {isAdmin && (
                              <>
                                {" "}
                                · {booking.user?.name || booking.fullName} (
                                {booking.user?.email || booking.email})
                              </>
                            )}
                          </p>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            booking.status === "confirmed"
                              ? "bg-green-50 text-green-700"
                              : booking.status === "cancelled"
                                ? "bg-red-50 text-red-600"
                                : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Destinations Tab (Admin Only) */}
          {activeTab === "destinations" && isAdmin && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-500">
                  {destinations.length} destination
                  {destinations.length !== 1 ? "s" : ""}
                </p>
                <button
                  onClick={openCreate}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Destination
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                          Destination
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                          Category
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                          Price
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                          Rating
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                          Featured
                        </th>
                        <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {destinations.map((dest) => (
                        <tr
                          key={dest._id}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={dest.image}
                                alt={dest.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {dest.name}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {dest.country}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-medium text-gray-600 capitalize">
                              {dest.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-800">
                              ${(dest.price ?? 0).toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                              <span className="text-sm text-gray-700">
                                {dest.rating}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                dest.featured
                                  ? "bg-green-50 text-green-700"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {dest.featured ? "Yes" : "No"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => openEdit(dest)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                title="Edit"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(dest._id)}
                                disabled={deleting === dest._id}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                                title="Delete"
                              >
                                {deleting === dest._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {destinations.length === 0 && (
                  <div className="text-center py-12">
                    <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">
                      No destinations yet. Create your first one!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === "bookings" && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900">
                  All Bookings
                </h3>
                <Link
                  to="/my-bookings"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Manage bookings
                </Link>
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarCheck className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 mb-4">No bookings yet.</p>
                  <Link
                    to="/destinations"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Explore destinations
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="flex items-center justify-between py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {booking.destination}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(booking.startDate).toLocaleDateString()} -{" "}
                          {booking.guests} guest
                          {booking.guests !== 1 ? "s" : ""} - $
                          {(booking.budget ?? 0).toLocaleString()}
                          {isAdmin && (
                            <>
                              {" "}
                              · {booking.user?.name || booking.fullName} (
                              {booking.user?.email || booking.email})
                            </>
                          )}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          booking.status === "confirmed"
                            ? "bg-green-50 text-green-700"
                            : booking.status === "cancelled"
                              ? "bg-red-50 text-red-600"
                              : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              {(profileSuccess || profileError) && (
                <div
                  className={`px-4 py-3 rounded-xl text-sm ${
                    profileSuccess
                      ? "bg-green-50 border border-green-100 text-green-600"
                      : "bg-red-50 border border-red-100 text-red-600"
                  }`}
                >
                  {profileSuccess || profileError}
                </div>
              )}

              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                  <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
                    <UserCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {user.name}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Mail className="w-3.5 h-3.5" />
                      {user.email}
                    </div>
                  </div>
                  {isAdmin && (
                    <span className="ml-auto px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Admin
                    </span>
                  )}
                </div>

                <form onSubmit={handleNameUpdate}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      required
                      minLength={2}
                      value={nameForm.name}
                      onChange={(e) => setNameForm({ name: e.target.value })}
                      className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={
                        profileSaving ||
                        !nameForm.name.trim() ||
                        nameForm.name.trim() === user.name
                      }
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                      {profileSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Lock className="w-4 h-4 text-gray-500" />
                  <h3 className="text-base font-semibold text-gray-900">
                    Change Password
                  </h3>
                </div>

                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {profileSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {editing ? "Edit Destination" : "New Destination"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {error && (
                <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Santorini"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    value={form.country}
                    onChange={(e) =>
                      setForm({ ...form, country: e.target.value })
                    }
                    placeholder="Greece"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  minLength={10}
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="A beautiful destination..."
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  required
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    placeholder="1200"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="5"
                    step="0.1"
                    value={form.rating}
                    onChange={(e) =>
                      setForm({ ...form, rating: e.target.value })
                    }
                    placeholder="4.8"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm({ ...form, featured: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Featured destination
                </span>
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : editing ? (
                    "Update"
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div
        className={`w-9 h-9 rounded-lg ${colors[color]} flex items-center justify-center mb-3`}
      >
        {createElement(Icon, { className: "w-4.5 h-4.5" })}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}
