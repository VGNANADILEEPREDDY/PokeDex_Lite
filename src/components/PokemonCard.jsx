// components/PokemonCard.jsx

function PokemonCard({ pokemon, isFavorite, onFavoriteToggle, onClick }) {
  const handleCardClick = () => {
    onClick();
  };

  const handleFavoriteClick = (event) => {
    event.stopPropagation(); // prevent card click
    onFavoriteToggle();
  };

  return (
    <div className="pokemon-card" onClick={handleCardClick}>
      {/* Image */}
      <div className="pokemon-image-wrapper">
        <img
          src={pokemon.image}
          alt={pokemon.name}
          className="pokemon-image"
        />
      </div>

      {/* Name */}
      <h3 className="pokemon-name">
        {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
      </h3>

      {/* Types */}
      <div className="pokemon-types">
        {pokemon.types.map((type) => (
          <span key={type} className="type-tag">
            {type}
          </span>
        ))}
      </div>

      {/* Favorite Button */}
      <button className="favorite-btn" onClick={handleFavoriteClick}>
        {isFavorite ? "❤️" : "🤍"}
      </button>
    </div>
  );
}

export default PokemonCard;
