import { useId, useMemo, useState } from "react";
import FormField from "./FormField.jsx";

const PARTY_SIZE_OPTIONS = Array.from({ length: 12 }, (_, index) => index + 1);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Monday-Saturday service runs 5:00 PM-11:00 PM with last seating at 9:30 PM;
// Sunday service runs 5:00 PM-9:00 PM with last seating at 7:30 PM. Slots are
// built in half-hour steps (integer arithmetic to avoid floating-point drift).
function getTimeSlotsForDate(dateString) {
  if (!dateString) {
    return [];
  }

  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const isSunday = date.getDay() === 0;

  const startHalfHour = 17 * 2; // 5:00 PM
  const endHalfHour = isSunday ? 19 * 2 + 1 : 21 * 2 + 1; // 7:30 PM or 9:30 PM

  const slots = [];
  for (let half = startHalfHour; half <= endHalfHour; half += 1) {
    const hour24 = Math.floor(half / 2);
    const minutes = half % 2 === 0 ? "00" : "30";
    const period = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    slots.push({
      value: `${String(hour24).padStart(2, "0")}:${minutes}`,
      label: `${hour12}:${minutes} ${period}`,
    });
  }
  return slots;
}

function ReservationForm() {
  const formId = useId();
  const todayDateString = useMemo(() => getTodayDateString(), []);

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [guests, setGuests] = useState("2");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const timeSlotOptions = useMemo(() => getTimeSlotsForDate(date), [date]);

  function handleDateChange(event) {
    setDate(event.target.value);
    setTimeSlot(""); // available slots depend on the date, so reset the choice
  }

  function validate() {
    const nextErrors = {};
    if (!date) {
      nextErrors.date = "Please choose a reservation date.";
    } else if (date < todayDateString) {
      nextErrors.date = "Please choose a date from today onward.";
    }
    if (!timeSlot) {
      nextErrors.timeSlot = "Please choose a timeslot.";
    }
    const guestsNumber = Number(guests);
    if (!guestsNumber || guestsNumber < 1 || guestsNumber > 12) {
      nextErrors.guests = "Party size must be between 1 and 12.";
    }
    if (!name.trim()) {
      nextErrors.name = "Please enter the name for the reservation.";
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }
    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatusMessage("");
      return;
    }

    setIsSubmitting(true);
    try {
      // Temporary handler: swap this block for
      // `await createReservation({ date, timeSlot, guests, name, email, phone })`
      // (see services/api.js) once the reservations endpoint is live. It
      // must not claim a reservation was saved until the backend confirms it.
      setStatusMessage("The reservation form is ready for backend connection.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="reservation-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <FormField id={`${formId}-date`} label="Reservation Date" required error={errors.date}>
          <input
            id={`${formId}-date`}
            name="date"
            type="date"
            min={todayDateString}
            value={date}
            onChange={handleDateChange}
            aria-describedby={errors.date ? `${formId}-date-error` : undefined}
            aria-invalid={Boolean(errors.date)}
            required
          />
        </FormField>

        <FormField
          id={`${formId}-time-slot`}
          label="Timeslot"
          required
          error={errors.timeSlot}
          hint={!date ? "Choose a date to see available times." : undefined}
        >
          <select
            id={`${formId}-time-slot`}
            name="timeSlot"
            value={timeSlot}
            onChange={(event) => setTimeSlot(event.target.value)}
            aria-describedby={
              errors.timeSlot
                ? `${formId}-time-slot-error`
                : !date
                  ? `${formId}-time-slot-hint`
                  : undefined
            }
            aria-invalid={Boolean(errors.timeSlot)}
            disabled={!date}
            required
          >
            <option value="">{date ? "Select a time" : "Select a date first"}</option>
            {timeSlotOptions.map((slot) => (
              <option key={slot.value} value={slot.value}>
                {slot.label}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="form-row">
        <FormField id={`${formId}-guests`} label="Number of Guests" required error={errors.guests}>
          <select
            id={`${formId}-guests`}
            name="guests"
            value={guests}
            onChange={(event) => setGuests(event.target.value)}
            aria-describedby={errors.guests ? `${formId}-guests-error` : undefined}
            aria-invalid={Boolean(errors.guests)}
            required
          >
            {PARTY_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size} {size === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </FormField>

        <FormField id={`${formId}-name`} label="Customer Name" required error={errors.name}>
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-describedby={errors.name ? `${formId}-name-error` : undefined}
            aria-invalid={Boolean(errors.name)}
            required
          />
        </FormField>
      </div>

      <div className="form-row">
        <FormField id={`${formId}-email`} label="Email Address" required error={errors.email}>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-describedby={errors.email ? `${formId}-email-error` : undefined}
            aria-invalid={Boolean(errors.email)}
            required
          />
        </FormField>

        <FormField id={`${formId}-phone`} label="Phone Number (optional)">
          <input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </FormField>
      </div>

      <button type="submit" className="button button-primary" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Request Reservation"}
      </button>

      <p className="form-status" aria-live="polite">
        {statusMessage}
      </p>
    </form>
  );
}

export default ReservationForm;
