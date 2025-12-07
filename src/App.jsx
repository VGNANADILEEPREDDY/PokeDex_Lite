// App.jsx
import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import TypeFilter from "./components/TypeFilter";
import PokemonList from "./components/PokemonList";
import Pagination from "./components/Pagination";
import PokemonDetailModal from "./components/PokemonDetailModal";

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [hasNextPage, setHasNextPage] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");

  const [favorites, setFavorites] = useState([]);

  // ⭐ Modal selected Pokémon
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(saved);
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Toggle favorite
  const toggleFavorite = (pokemonId) => {
    setFavorites((prev) => {
      if (prev.includes(pokemonId)) {
        return prev.filter((id) => id !== pokemonId);
      }
      return [...prev, pokemonId];
    });
  };

  // Fetch Pokémon list + details (image, types, stats, abilities)
  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      setError(null);

      const offset = (page - 1) * pageSize;

      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${pageSize}&offset=${offset}`
        );
        const data = await response.json();

        setHasNextPage(Boolean(data.next));

        const results = data.results || [];

        const detailed = await Promise.all(
          results.map(async (item) => {
            const res = await fetch(item.url);
            const details = await res.json();

            return {
              id: details.id,
              name: details.name,
              image:
                details.sprites?.other?.["official-artwork"]?.front_default ||
                details.sprites?.front_default ||
                "",
              types: details.types.map((t) => t.type.name),
              // extra info for modal:
              stats: details.stats.map((s) => ({
                name: s.stat.name,
                value: s.base_stat,
              })),
              abilities: details.abilities.map((a) => a.ability.name),
              height: details.height,
              weight: details.weight,
            };
          })
        );

        setPokemonList(detailed);
      } catch (err) {
        setError("Failed to load Pokémon.");
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [page, pageSize]);

  // Fetch all types once
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/type");
        const data = await res.json();
        const typeNames = (data.results || []).map((t) => t.name);
        setTypes(typeNames);
      } catch (err) {
        // ignore type errors
      }
    };

    fetchTypes();
  }, []);

  // Search filter
  const searchFiltered = pokemonList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  // Type filter
  const filteredPokemon = searchFiltered.filter((pokemon) => {
    if (!selectedType) return true;
    return pokemon.types.includes(selectedType);
  });

  // ⭐ Card click → open modal
  const handleCardClick = (pokemon) => {
    setSelectedPokemon(pokemon);
  };

  // ⭐ Close modal
  const handleCloseModal = () => {
    setSelectedPokemon(null);
  };

  return (
    <div className="app-container">
      <h1 className="title">Pokedex Lite</h1>

      <div className="search-section">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      <div className="filter-section">
        <TypeFilter
          types={types}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
        />
      </div>

      {loading && <p>Loading Pokémon...</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="list-section">
        {!loading && !error && (
          <PokemonList
            pokemonList={filteredPokemon}
            favorites={favorites}
            onFavoriteToggle={toggleFavorite}
            onCardClick={handleCardClick}
          />
        )}
      </div>

      <div className="pagination-section">
        <Pagination
          page={page}
          onPageChange={setPage}
          hasNextPage={hasNextPage}
        />
      </div>

      {/* ⭐ Detail Modal, only when a Pokémon is selected */}
      {selectedPokemon && (
        <PokemonDetailModal
          pokemon={selectedPokemon}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default App;
