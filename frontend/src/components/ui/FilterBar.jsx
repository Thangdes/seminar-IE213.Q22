const FilterBar = ({ items, activeValue, counts = {}, ariaLabel, onChange }) => {
  return (
    <div className="filter-bar" aria-label={ariaLabel}>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          className={`filter-btn ${activeValue === item.value ? 'active' : ''}`}
          onClick={() => onChange(item.value)}
        >
          {item.label}
          {item.value !== 'all' && counts[item.value] !== undefined && (
            <span className="filter-count">{counts[item.value]}</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
