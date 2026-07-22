import ResponsiveImage from "../components/ResponsiveImage.jsx";
import ReservationForm from "../components/ReservationForm.jsx";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { IMAGES } from "../data/images.js";

const tableSettingImage = IMAGES.restaurantDiningRoom;

function Reservations() {
  useDocumentTitle("Reservations | Café Fausse");

  return (
    <section className="section reservations-page">
      <div className="reservations-intro">
        <div>
          <h1>Reservations</h1>
          <p>
            Reserve your table at Café Fausse. Fill out the form below and we will confirm
            your reservation as soon as it has been processed.
          </p>
        </div>
        <ResponsiveImage
          src={tableSettingImage.src}
          alt={tableSettingImage.alt}
          width={tableSettingImage.width}
          height={tableSettingImage.height}
          className="reservations-image"
        />
      </div>

      <ReservationForm />

      <div className="reservation-policy">
        <h2>Good to Know</h2>
        <ul>
          <li>Tables are subject to availability at the time your request is processed.</li>
          <li>A phone number is optional but helps us reach you if plans change.</li>
          <li>You will receive a confirmation once your reservation has been processed.</li>
        </ul>
      </div>
    </section>
  );
}

export default Reservations;
