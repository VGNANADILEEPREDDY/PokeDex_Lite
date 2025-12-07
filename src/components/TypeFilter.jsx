// components/TypeFilter.jsx

function TypeFilter({ types, selectedType, onTypeChange }) {
  const handleChange = (event) => {
    onTypeChange(event.target.value);
  };

  return (
    <div className="type-filter">
      <select
        className="type-select"
        value={selectedType}
        onChange={handleChange}
      >
        <option value="">All Types</option>

        {types.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );
}

export default TypeFilter;
