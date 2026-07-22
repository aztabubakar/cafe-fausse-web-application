import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section>
      <h1>Page Not Found</h1>
      <p>
        The page you are looking for does not exist. <Link to="/">Return home</Link>.
      </p>
    </section>
  );
}

export default NotFound;
