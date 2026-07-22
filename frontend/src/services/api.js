const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";

async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message ?? "Request failed. Please try again.";
    throw new Error(message);
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
// { customerName, email, phone, numberOfGuests, timeSlot }.
export function createReservation(reservation) {
  return apiFetch("/reservations", {
    method: "POST",
    body: JSON.stringify(reservation),
  });
}

// POST /api/newsletter — subscribe or update a newsletter signup. Expects
// { customerName, email, consent }.
export function subscribeToNewsletter(subscriber) {
  return apiFetch("/newsletter", {
    method: "POST",
    body: JSON.stringify(subscriber),
  });
}
