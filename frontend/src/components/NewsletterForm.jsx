import { useId, useState } from "react";
import FormField from "./FormField.jsx";
import { ApiError, subscribeToNewsletter } from "../services/api.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function NewsletterForm() {
  const formId = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusTone, setStatusTone] = useState("neutral");

  function validate() {
    const nextErrors = {};
    if (!name.trim()) {
      nextErrors.customer_name = "Please enter your name.";
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email_address = "Please enter a valid email address.";
    }
    if (!consent) {
      nextErrors.newsletter_consent = "Please confirm you would like to receive the newsletter.";
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
      const response = await subscribeToNewsletter({
        customer_name: name.trim(),
        email_address: email.trim(),
        phone_number: "",
        newsletter_consent: consent,
      });

      setStatusTone("success");
      setStatusMessage(response.message);
      setErrors({});

      // Reset only after a confirmed successful subscription.
      setName("");
      setEmail("");
      setConsent(false);
    } catch (error) {
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

  return (
    <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <FormField id={`${formId}-name`} label="Name" required error={errors.customer_name}>
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
      </div>

      <div className="form-field form-field-checkbox">
        <label htmlFor={`${formId}-consent`}>
          <input
            id={`${formId}-consent`}
            name="consent"
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            aria-describedby={errors.newsletter_consent ? `${formId}-consent-error` : undefined}
            aria-invalid={Boolean(errors.newsletter_consent)}
            required
          />
          I would like to receive the Café Fausse newsletter
        </label>
        {errors.newsletter_consent ? (
          <p className="form-field-error" id={`${formId}-consent-error`} role="alert">
            {errors.newsletter_consent}
          </p>
        ) : null}
      </div>

      <button type="submit" className="button button-primary" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Sign Up"}
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

export default NewsletterForm;
