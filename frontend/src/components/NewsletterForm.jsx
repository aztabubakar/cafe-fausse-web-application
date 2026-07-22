import { useId, useState } from "react";
import FormField from "./FormField.jsx";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function NewsletterForm() {
  const formId = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  function validate() {
    const nextErrors = {};
    if (!name.trim()) {
      nextErrors.name = "Please enter your name.";
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (!consent) {
      nextErrors.consent = "Please confirm you would like to receive the newsletter.";
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
      // `await subscribeToNewsletter({ name, email, consent })` (see
      // services/api.js) once the newsletter endpoint is live.
      setStatusMessage("The newsletter form is ready for backend connection.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <FormField id={`${formId}-name`} label="Name" required error={errors.name}>
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
      </div>

      <div className="form-field form-field-checkbox">
        <label htmlFor={`${formId}-consent`}>
          <input
            id={`${formId}-consent`}
            name="consent"
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            aria-describedby={errors.consent ? `${formId}-consent-error` : undefined}
            aria-invalid={Boolean(errors.consent)}
            required
          />
          I would like to receive the Café Fausse newsletter
        </label>
        {errors.consent ? (
          <p className="form-field-error" id={`${formId}-consent-error`} role="alert">
            {errors.consent}
          </p>
        ) : null}
      </div>

      <button type="submit" className="button button-primary" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Sign Up"}
      </button>

      <p className="form-status" aria-live="polite">
        {statusMessage}
      </p>
    </form>
  );
}

export default NewsletterForm;
