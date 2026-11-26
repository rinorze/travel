export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getHeaders = () => {
  const headers = { "Content-Type": "application/json" };
  const token = localStorage.getItem("token");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const parseResponse = async (response) => {
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("Server error. Please try again later.");
  }
  if (!response.ok) {
    const firstValidationError =
      Array.isArray(data.errors) && data.errors.length > 0
        ? data.errors[0]?.msg
        : null;
    const message = data.message || "Request failed.";
    throw new Error(
      firstValidationError ? `${message} ${firstValidationError}` : message,
    );
  }
  return data;
};

const apiFetch = async (url, options) => {
  try {
    return await fetch(url, options);
  } catch {
    throw new Error(
      "Could not reach the API server. Make sure the server is running on http://localhost:5000.",
    );
  }
};

// Auth
export const registerUser = async (payload) => {
  const response = await apiFetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
};

export const loginUser = async (payload) => {
  const response = await apiFetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
};

export const getMe = async () => {
  const response = await apiFetch(`${API_URL}/auth/me`, {
    headers: getHeaders(),
  });
  return parseResponse(response);
};

export const updateProfile = async (payload) => {
  const response = await apiFetch(`${API_URL}/auth/profile`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
};

// Destinations
export const listDestinations = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await apiFetch(`${API_URL}/destinations?${query}`);
  return parseResponse(response);
};

export const getDestination = async (id) => {
  const response = await apiFetch(`${API_URL}/destinations/${id}`);
  return parseResponse(response);
};

// Admin Destinations
export const createDestinationAdmin = async (payload) => {
  const response = await apiFetch(`${API_URL}/destinations`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
};

export const updateDestinationAdmin = async (id, payload) => {
  const response = await apiFetch(`${API_URL}/destinations/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
};

export const deleteDestinationAdmin = async (id) => {
  const response = await apiFetch(`${API_URL}/destinations/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return parseResponse(response);
};

// Bookings
export const listBookings = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const suffix = query ? `?${query}` : "";
  const response = await apiFetch(`${API_URL}/bookings${suffix}`, {
    headers: getHeaders(),
  });
  return parseResponse(response);
};

export const createBooking = async (payload) => {
  const response = await apiFetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
};

export const cancelBooking = async (id) => {
  const response = await apiFetch(`${API_URL}/bookings/${id}/cancel`, {
    method: "PATCH",
    headers: getHeaders(),
  });
  return parseResponse(response);
};
