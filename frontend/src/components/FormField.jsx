function FormField({ id, label, required = false, error, hint, children }) {
  return (
    <div className="form-field">
      <label htmlFor={id}>
        {label}
        {required ? (
          <span className="required-indicator" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </label>
      {children}
      {hint ? (
        <p className="form-field-hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="form-field-error" id={`${id}-error`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default FormField;
