// components/PokemonList.jsx
import PokemonCard from "./PokemonCard";

function PokemonList({ pokemonList, favorites, onFavoriteToggle, onCardClick }) {
  if (!pokemonList || pokemonList.length === 0) {
    return <p>No Pokémon found.</p>;
  }

  return (
    <div className="pokemon-list">
      {pokemonList.map((pokemon) => (
        <PokemonCard
          key={pokemon.id}
          pokemon={pokemon}
          isFavorite={favorites.includes(pokemon.id)}
          onFavoriteToggle={() => onFavoriteToggle(pokemon.id)}
          onClick={() => onCardClick(pokemon)}
        />
      ))}
    </div>
  );
}

export default PokemonList;
