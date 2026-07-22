function GalleryFilters({ filters, activeFilter, onChange }) {
  return (
    <div className="gallery-filters" role="group" aria-label="Filter gallery by category">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        return (
          <button
            key={filter.id}
            type="button"
            className={isActive ? "filter-button active" : "filter-button"}
            aria-pressed={isActive}
            onClick={() => onChange(filter.id)}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}

export default GalleryFilters;
