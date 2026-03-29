export const Popup = ({ titre, contenu }) => {
  return (
    <div className="game-popup-overlay">
      <div className="game-popup-content">
        <h2>{titre}</h2>
        {contenu}
      </div>
    </div>
  );
};
