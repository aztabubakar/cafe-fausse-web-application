import { Link } from "react-router-dom";
import { NAV_LINKS } from "../data/navigation.js";
import { contact } from "../data/contact.js";
import NewsletterForm from "./NewsletterForm.jsx";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-about">
          <p className="footer-title">{contact.name}</p>
          <address>
            <p>{contact.address}</p>
            <p>
              <a href={contact.phoneHref}>{contact.phone}</a>
            </p>
          </address>
          <ul className="footer-hours">
            {contact.hours.map((entry) => (
              <li key={entry.days}>
                <span>{entry.days}</span>
                <span>{entry.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer" className="footer-nav">
          <p className="footer-heading">Explore</p>
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer-newsletter">
          <p className="footer-heading">Newsletter</p>
          <NewsletterForm />
        </div>
      </div>

      <p className="footer-copyright">&copy; {year} Café Fausse. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
