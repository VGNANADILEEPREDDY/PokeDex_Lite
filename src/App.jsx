// App.jsx
import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import TypeFilter from "./components/TypeFilter";
import PokemonList from "./components/PokemonList";
import Pagination from "./components/Pagination";
import PokemonDetailModal from "./components/PokemonDetailModal";
import Login from "./components/Login";

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

  const [selectedPokemon, setSelectedPokemon] = useState(null);

  // ⭐ User auth state
  const [user, setUser] = useState(null);

  // Load user + favourites from localStorage
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (savedUser) {
      setUser(savedUser);
    }

    const savedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(savedFavorites);
  }, []);

  // Save user when changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Save favorites when changes
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

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

  // Filters
  const searchFiltered = pokemonList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const filteredPokemon = searchFiltered.filter((pokemon) => {
    if (!selectedType) return true;
    return pokemon.types.includes(selectedType);
  });

  const handleCardClick = (pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const handleCloseModal = () => {
    setSelectedPokemon(null);
  };

  // ⭐ Login handlers
  const handleLogin = (userInfo) => {
    setUser(userInfo);
  };

  const handleLogout = () => {
    setUser(null);
    // (optionally) clear favourites on logout:
    // setFavorites([]);
  };

  // ⭐ If not logged in, show login page only
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      {/* Header with user + logout */}
      <header className="app-header">
        <h1 className="title">Pokedex Lite</h1>
        <div className="user-info">
          <span className="user-email">{user.email}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

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
