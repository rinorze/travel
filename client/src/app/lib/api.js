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
    throw new Error(data.message || "Request failed.");
  }
  return data;
};

// Auth
export const registerUser = async (payload) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
};

export const loginUser = async (payload) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
};

export const getMe = async () => {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: getHeaders(),
  });
  return parseResponse(response);
};

// Destinations
export const listDestinations = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/destinations?${query}`);
  return parseResponse(response);
};

export const getDestination = async (id) => {
  const response = await fetch(`${API_URL}/destinations/${id}`);
  return parseResponse(response);
};

export const seedDestinations = async () => {
  const response = await fetch(`${API_URL}/destinations/seed`, {
    method: "POST",
  });
  return parseResponse(response);
};

// Bookings
export const listBookings = async () => {
  const response = await fetch(`${API_URL}/bookings`, {
    headers: getHeaders(),
  });
  return parseResponse(response);
};

export const createBooking = async (payload) => {
  const response = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
};

export const cancelBooking = async (id) => {
  const response = await fetch(`${API_URL}/bookings/${id}/cancel`, {
    method: "PATCH",
    headers: getHeaders(),
  });
  return parseResponse(response);
};
