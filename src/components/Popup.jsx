export const Popup = ({ titre, contenu }) => {
    return (
        <div className='popup-overlay'>
            <div className='popup-content'>
                <h2>{titre}</h2>
                {contenu}
            </div>
        </div>
    );
};