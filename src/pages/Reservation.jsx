import "../styles/Reservation.css";

const Reservation = () => {
  return (
    <div className="reservation-page">
      <div className="reservation-container">
        <h1 className="reservation-title">Réserver votre session</h1>
        <p className="reservation-subtitle">
          Choisissez une date, une heure et le nombre de participants.
        </p>

        <form className="reservation-form">
          <div className="reservation-field">
            <label htmlFor="day">Date</label>
            <input
              type="date"
              id="day"
              name="day"
              required
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="reservation-field">
            <label htmlFor="hour">Heure</label>
            <input
              type="time"
              id="hour"
              name="hour"
              required
            />
          </div>

          <div className="reservation-field">
            <label htmlFor="number_of_people">Nombre de personnes</label>
            <input
              type="number"
              id="number_of_people"
              name="number_of_people"
              defaultValue={1}
              min={1}
              max={20}
              required
            />
          </div>

          <button type="submit" className="reservation-submit">
            Confirmer la réservation
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reservation;

