const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";

// Thrown for both network failures and server error responses so callers
// can handle them uniformly. `status` is null for network failures (no
// response was ever received); `details` carries field-level validation
// messages when the server provides them.
export class ApiError extends Error {
  constructor(message, { status = null, details = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function apiFetch(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });
  } catch {
    throw new ApiError("Unable to reach the server. Check your connection and try again.");
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data?.error ?? data?.message ?? "Something went wrong. Please try again.";
    throw new ApiError(message, { status: response.status, details: data?.details ?? null });
  }

  return data;
}

// GET /api/health — lightweight backend and database connectivity check.
export function checkHealth() {
  return apiFetch("/health");
}

// GET /api/availability?time_slot=... — table availability for a timeslot.
export function checkAvailability(timeSlot) {
  return apiFetch(`/availability?time_slot=${encodeURIComponent(timeSlot)}`);
}

// POST /api/reservations — create a reservation. Expects
// { customer_name, email_address, phone_number, number_of_guests, time_slot }.
export function createReservation(payload) {
  return apiFetch("/reservations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// POST /api/newsletter — subscribe or update a newsletter signup. Expects
// { customer_name, email_address, phone_number, newsletter_consent }.
export function subscribeToNewsletter(payload) {
  return apiFetch("/newsletter", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
