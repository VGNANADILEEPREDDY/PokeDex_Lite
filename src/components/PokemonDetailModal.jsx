// components/PokemonDetailModal.jsx

function PokemonDetailModal({ pokemon, onClose }) {
  if (!pokemon) return null;

  const capitalizedName =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  return (
    <div className="modal-container">
      {/* Overlay */}
      <div className="modal-overlay" onClick={onClose}></div>

      {/* Modal content */}
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <div className="modal-header">
          <h2>{capitalizedName}</h2>
          <div className="modal-types">
            {pokemon.types.map((type) => (
              <span key={type} className="type-tag">
                {type}
              </span>
            ))}
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-image">
            <img src={pokemon.image} alt={pokemon.name} />
          </div>

          <div className="modal-info">
            <h3>Stats</h3>
            <ul className="stats-list">
              {pokemon.stats.map((stat) => (
                <li key={stat.name}>
                  <strong>{stat.name}:</strong> {stat.value}
                </li>
              ))}
            </ul>

            <h3>Abilities</h3>
            <ul className="abilities-list">
              {pokemon.abilities.map((ability) => (
                <li key={ability}>{ability}</li>
              ))}
            </ul>

            <h3>Details</h3>
            <p>Height: {pokemon.height}</p>
            <p>Weight: {pokemon.weight}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonDetailModal;
