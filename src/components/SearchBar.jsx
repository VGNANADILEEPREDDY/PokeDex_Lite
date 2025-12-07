// components/SearchBar.jsx

function SearchBar({ searchQuery, onSearchChange }) {
  const handleChange = (event) => {
    onSearchChange(event.target.value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search Pokémon..."
        className="search-input"
        value={searchQuery}
        onChange={handleChange}
      />
    </div>
  );
}

export default SearchBar;
