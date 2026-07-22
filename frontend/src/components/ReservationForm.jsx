import { useEffect, useId, useMemo, useRef, useState } from "react";
import FormField from "./FormField.jsx";
import { ApiError, checkAvailability, createReservation } from "../services/api.js";

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
// The backend enforces the same rules independently — this only shapes the
// dropdown, it is not the source of truth.
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
  const [statusTone, setStatusTone] = useState("neutral");
  const [confirmation, setConfirmation] = useState(null);
  const [availability, setAvailability] = useState({ state: "idle", tablesRemaining: null });
  const availabilityRequestRef = useRef(0);

  const timeSlotOptions = useMemo(() => getTimeSlotsForDate(date), [date]);

  function handleDateChange(event) {
    setDate(event.target.value);
    setTimeSlot(""); // available slots depend on the date, so reset the choice
  }

  // Soft-check availability as a convenience once both date and time are
  // picked. If the check fails or is inconclusive, submission stays
  // enabled — POST /api/reservations is the actual source of truth.
  useEffect(() => {
    if (!date || !timeSlot) {
      setAvailability({ state: "idle", tablesRemaining: null });
      return;
    }

    const requestId = availabilityRequestRef.current + 1;
    availabilityRequestRef.current = requestId;
    setAvailability({ state: "loading", tablesRemaining: null });

    checkAvailability(`${date}T${timeSlot}:00`)
      .then((data) => {
        if (availabilityRequestRef.current !== requestId) {
          return;
        }
        setAvailability({
          state: data.available ? "available" : "full",
          tablesRemaining: data.tables_remaining,
        });
      })
      .catch(() => {
        if (availabilityRequestRef.current !== requestId) {
          return;
        }
        setAvailability({ state: "unknown", tablesRemaining: null });
      });
  }, [date, timeSlot]);

  function validate() {
    const nextErrors = {};
    if (!date) {
      nextErrors.date = "Please choose a reservation date.";
    } else if (date < todayDateString) {
      nextErrors.date = "Please choose a date from today onward.";
    }
    if (!timeSlot) {
      nextErrors.time_slot = "Please choose a timeslot.";
    }
    const guestsNumber = Number(guests);
    if (!guestsNumber || guestsNumber < 1 || guestsNumber > 12) {
      nextErrors.number_of_guests = "Party size must be between 1 and 12.";
    }
    if (!name.trim()) {
      nextErrors.customer_name = "Please enter the name for the reservation.";
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email_address = "Please enter a valid email address.";
    }
    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatusMessage("");
      return;
    }

    setIsSubmitting(true);
    setStatusTone("neutral");
    setStatusMessage("");

    try {
      const response = await createReservation({
        customer_name: name.trim(),
        email_address: email.trim(),
        phone_number: phone.trim(),
        number_of_guests: Number(guests),
        time_slot: `${date}T${timeSlot}:00`,
      });

      const timeLabel = timeSlotOptions.find((slot) => slot.value === timeSlot)?.label ?? timeSlot;
      setConfirmation({
        reservationId: response.reservation_id,
        tableNumber: response.table_number,
        date,
        timeLabel,
        guests: response.number_of_guests,
      });
      setStatusTone("success");
      setStatusMessage(response.message);
      setErrors({});

      // Reset only after a confirmed successful reservation.
      setDate("");
      setTimeSlot("");
      setGuests("2");
      setName("");
      setEmail("");
      setPhone("");
      setAvailability({ state: "idle", tablesRemaining: null });
    } catch (error) {
      setConfirmation(null);
      setStatusTone("error");
      if (error instanceof ApiError && error.status === 400 && error.details) {
        setErrors(error.details);
        setStatusMessage("Please correct the highlighted fields.");
      } else if (error instanceof ApiError) {
        setStatusMessage(error.message);
      } else {
        setStatusMessage("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const isConfirmedFull = availability.state === "full";

  return (
    <form className="reservation-form" onSubmit={handleSubmit} noValidate>
      {confirmation ? (
        <div className="reservation-confirmation" role="status">
          <p className="reservation-confirmation-title">Reservation Confirmed</p>
          <dl>
            <div>
              <dt>Confirmation #</dt>
              <dd>{confirmation.reservationId}</dd>
            </div>
            <div>
              <dt>Table</dt>
              <dd>{confirmation.tableNumber}</dd>
            </div>
            <div>
              <dt>Date</dt>
              <dd>{confirmation.date}</dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>{confirmation.timeLabel}</dd>
            </div>
            <div>
              <dt>Guests</dt>
              <dd>{confirmation.guests}</dd>
            </div>
          </dl>
        </div>
      ) : null}

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
          error={errors.time_slot}
          hint={!date ? "Choose a date to see available times." : undefined}
        >
          <select
            id={`${formId}-time-slot`}
            name="timeSlot"
            value={timeSlot}
            onChange={(event) => setTimeSlot(event.target.value)}
            aria-describedby={
              errors.time_slot
                ? `${formId}-time-slot-error`
                : !date
                  ? `${formId}-time-slot-hint`
                  : undefined
            }
            aria-invalid={Boolean(errors.time_slot)}
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

      {timeSlot ? (
        <p className="availability-status" aria-live="polite">
          {availability.state === "loading" && "Checking availability…"}
          {availability.state === "available" &&
            `Tables available (${availability.tablesRemaining} remaining).`}
          {availability.state === "full" && "This time is fully booked. Please choose another time."}
          {availability.state === "unknown" &&
            "Could not check availability right now. You can still submit your request."}
        </p>
      ) : null}

      <div className="form-row">
        <FormField
          id={`${formId}-guests`}
          label="Number of Guests"
          required
          error={errors.number_of_guests}
        >
          <select
            id={`${formId}-guests`}
            name="guests"
            value={guests}
            onChange={(event) => setGuests(event.target.value)}
            aria-describedby={errors.number_of_guests ? `${formId}-guests-error` : undefined}
            aria-invalid={Boolean(errors.number_of_guests)}
            required
          >
            {PARTY_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size} {size === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </FormField>

        <FormField id={`${formId}-name`} label="Customer Name" required error={errors.customer_name}>
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-describedby={errors.customer_name ? `${formId}-name-error` : undefined}
            aria-invalid={Boolean(errors.customer_name)}
            required
          />
        </FormField>
      </div>

      <div className="form-row">
        <FormField id={`${formId}-email`} label="Email Address" required error={errors.email_address}>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-describedby={errors.email_address ? `${formId}-email-error` : undefined}
            aria-invalid={Boolean(errors.email_address)}
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

      <button
        type="submit"
        className="button button-primary"
        disabled={isSubmitting || isConfirmedFull}
      >
        {isSubmitting ? "Submitting…" : "Request Reservation"}
      </button>

      <p
        className={`form-status form-status-${statusTone}`}
        aria-live="polite"
        role={statusTone === "error" ? "alert" : undefined}
      >
        {statusMessage}
      </p>
    </form>
  );
}

export default ReservationForm;
