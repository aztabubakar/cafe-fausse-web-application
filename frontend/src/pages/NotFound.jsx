import { Link } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";

function NotFound() {
  useDocumentTitle("Page Not Found | Café Fausse");

  return (
    <section className="section">
      <h1>Page Not Found</h1>
      <p>
        The page you are looking for does not exist. <Link to="/">Return home</Link>.
      </p>
    </section>
  );
}

export default NotFound;
