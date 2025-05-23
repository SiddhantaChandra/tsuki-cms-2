import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './FilterSearch.module.css';

// SVG icons as components
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor" />
  </svg>
);

const ChevronDownIcon = ({ className }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M7.41 8.59L12 13.17L16.59 8.59L18 10L12 16L6 10L7.41 8.59Z" fill="currentColor" />
  </svg>
);

const ClearIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor" />
  </svg>
);

const FilterSearch = ({ 
  title = "Filter & Search",
  onSearch,
  onFilter,
  initialFilters = {},
  filterOptions = { 
    categories: [],
    sets: [],
    subsets: []
  },
  visibleFilters = {
    category: true,
    set: true,
    subset: true,
    price: true,
    sort: true
  },
  showFilterToggle = true,
  storageKey = 'filter_preferences' // Used for localStorage
}) => {
  // Generate a unique storage key based on the component's context
  const uniqueStorageKey = `${storageKey}_${title.toLowerCase().replace(/\s+/g, '_')}`;
  const searchTimerRef = useRef(null);
  
  // Load initial filters from localStorage if available
  const loadInitialFilters = () => {
    if (typeof window !== 'undefined') {
      try {
        const savedFilters = localStorage.getItem(uniqueStorageKey);
        if (savedFilters) {
          const parsedFilters = JSON.parse(savedFilters);
          // Merge saved filters with initialFilters, with initialFilters taking precedence
          return { ...parsedFilters, ...initialFilters };
        }
      } catch (e) {
        console.error('Error loading saved filters:', e);
      }
    }
    return initialFilters;
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true); // Default to showing filters
  const [filters, setFilters] = useState(() => loadInitialFilters());
  
  // Store filtered options based on cascading selections
  const [filteredOptions, setFilteredOptions] = useState({
    sets: filterOptions.sets,
    subsets: filterOptions.subsets
  });

  // Save filters to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(uniqueStorageKey, JSON.stringify(filters));
      } catch (e) {
        console.error('Error saving filters:', e);
      }
    }
  }, [filters, uniqueStorageKey]);

  // Determine if any filters are visible
  const hasVisibleFilters = Object.values(visibleFilters).some(value => value === true);

  // Handle search input change with debouncing
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    
    // Clear any existing timer
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    
    // Set a new timer
    searchTimerRef.current = setTimeout(() => {
      onSearch?.(e.target.value);
    }, 500); // 500ms debounce time
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    // Clear any existing timer to prevent double searches
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
      searchTimerRef.current = null;
    }
    onSearch?.(searchQuery);
  };

  // Handle filter changes with cascading updates
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    // Update filters state with the new value
    setFilters(prev => {
      const updatedFilters = { ...prev, [name]: value };
      
      // Reset dependent filters when parent filters change
      if (name === 'category') {
        updatedFilters.set = '';
        updatedFilters.subset = '';
        
        // Update filtered sets based on selected category
        const filteredSets = value ? 
          filterOptions.sets.filter(set => set.category_id === value) : 
          filterOptions.sets;
          
        setFilteredOptions(prev => ({
          ...prev,
          sets: filteredSets,
          subsets: [] // Reset subsets when category changes
        }));
        
        // Immediately apply category filter
        setTimeout(() => {
          onFilter?.(updatedFilters);
        }, 0);
      }
      
      // Update filtered subsets when set changes
      if (name === 'set') {
        updatedFilters.subset = '';
        
        const filteredSubsets = value ?
          filterOptions.subsets.filter(subset => subset.set_id === value) :
          filterOptions.subsets;
          
        setFilteredOptions(prev => ({
          ...prev,
          subsets: filteredSubsets
        }));
        
        // Immediate apply set filter
        setTimeout(() => {
          onFilter?.(updatedFilters);
        }, 0);
      }
      
      // Auto-apply sort changes
      if (name === 'sortBy') {
        setTimeout(() => {
          onFilter?.(updatedFilters);
        }, 0);
      }
      
      return updatedFilters;
    });
  };

  // Update filtered options when filterOptions change
  useEffect(() => {
    // Apply current category filter to sets
    const filteredSets = filters.category ?
      filterOptions.sets.filter(set => set.category_id === filters.category) :
      filterOptions.sets;
      
    // Apply current set filter to subsets
    const filteredSubsets = filters.set ?
      filterOptions.subsets.filter(subset => subset.set_id === filters.set) :
      filterOptions.subsets;
    
    setFilteredOptions({
      sets: filteredSets,
      subsets: filteredSubsets
    });
  }, [filterOptions, filters.category, filters.set]);

  // Apply filters
  const applyFilters = () => {
    onFilter?.(filters);
  };

  // Reset filters
  const resetFilters = () => {
    // Clear any existing search timer
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
      searchTimerRef.current = null;
    }
    
    setSearchQuery('');
    
    const resetValues = {
      category: '',
      set: '',
      subset: '',
      priceMin: '',
      priceMax: '',
      sortBy: 'newest'
    };
    
    setFilters(resetValues);
    setFilteredOptions({
      sets: filterOptions.sets,
      subsets: filterOptions.subsets
    });
    
    // Call onFilter with reset filters
    onFilter?.(resetValues);
    onSearch?.('');
  };

  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Get appropriate label for All Sets option based on category
  const getAllSetsLabel = () => {
    if (filters.category) {
      const categoryName = filterOptions.categories.find(c => c.id === filters.category)?.name;
      return categoryName ? `All ${categoryName} Sets` : 'All Sets';
    }
    return 'All Sets';
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  // Check if any filter is applied
  const hasActiveFilters = () => {
    return (
      filters.category !== '' ||
      filters.set !== '' ||
      filters.subset !== '' ||
      filters.priceMin !== '' ||
      filters.priceMax !== '' ||
      filters.sortBy !== 'newest' ||
      searchQuery !== ''
    );
  };

  return (
    <div className={styles.filterSearchContainer}>
      <div className={styles.filterHeader}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.headerControls}>
          {hasActiveFilters() && (
            <button 
              className={styles.clearAllButton}
              onClick={resetFilters}
              aria-label="Clear all filters"
            >
              <ClearIcon /> Clear All
            </button>
          )}
          {showFilterToggle && hasVisibleFilters && (
            <button 
              className={styles.toggleButton}
              onClick={toggleFilters}
              aria-expanded={showFilters}
              aria-controls="filter-section"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
              <ChevronDownIcon className={showFilters ? styles.expanded : ''} />
            </button>
          )}
        </div>
      </div>
      
      {/* Search form */}
      <form onSubmit={handleSearch} className={styles.searchContainer}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          className={styles.searchInput}
          placeholder="Search by name or description..."
          aria-label="Search"
        />
        <button type="submit" className={styles.searchButton}>
          <SearchIcon /> Search
        </button>
      </form>
      
      {/* Filter section */}
      {showFilterToggle && hasVisibleFilters && showFilters && (
        <div id="filter-section" className={styles.filterSection}>
          <div className={styles.filtersTitle}>
            <span>Filters</span>
            {hasActiveFilters() && (
              <button 
                className={styles.resetButton}
                onClick={resetFilters}
                type="button"
              >
                Reset All
              </button>
            )}
          </div>
          <div className={styles.filterControls}>
            {/* Category dropdown */}
            {visibleFilters.category && (
              <div className={styles.filterGroup}>
                <label htmlFor="category" className={styles.filterLabel}>Category</label>
                <select
                  id="category"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className={styles.filterSelect}
                >
                  <option value="">All Categories</option>
                  {filterOptions.categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
            )}
            
            {/* Set dropdown */}
            {visibleFilters.set && (
              <div className={styles.filterGroup}>
                <label htmlFor="set" className={styles.filterLabel}>Set</label>
                <select
                  id="set"
                  name="set"
                  value={filters.set}
                  onChange={handleFilterChange}
                  className={styles.filterSelect}
                >
                  <option value="">{getAllSetsLabel()}</option>
                  {filteredOptions.sets.map((set) => (
                    <option key={set.id} value={set.id}>{set.name}</option>
                  ))}
                </select>
              </div>
            )}
            
            {/* Subset dropdown */}
            {visibleFilters.subset && (
              <div className={styles.filterGroup}>
                <label htmlFor="subset" className={styles.filterLabel}>Subset</label>
                <select
                  id="subset"
                  name="subset"
                  value={filters.subset}
                  onChange={handleFilterChange}
                  className={styles.filterSelect}
                >
                  <option value="">All Subsets</option>
                  {filteredOptions.subsets.map((subset) => (
                    <option key={subset.id} value={subset.id}>{subset.name}</option>
                  ))}
                </select>
              </div>
            )}
            
            {/* Price Range */}
            {visibleFilters.price && (
              <div className={styles.filterGroup}>
                <label htmlFor="priceMin" className={styles.filterLabel}>Price Range</label>
                <div className={styles.filterRangeContainer}>
                  <input
                    type="number"
                    id="priceMin"
                    name="priceMin"
                    value={filters.priceMin}
                    onChange={handleFilterChange}
                    className={styles.filterRangeInput}
                    placeholder="Min"
                    min="0"
                  />
                  <span className={styles.filterDash}>-</span>
                  <input
                    type="number"
                    id="priceMax"
                    name="priceMax"
                    value={filters.priceMax}
                    onChange={handleFilterChange}
                    className={styles.filterRangeInput}
                    placeholder="Max"
                    min="0"
                  />
                </div>
              </div>
            )}
            
            {/* Sort By dropdown */}
            {visibleFilters.sort && (
              <div className={styles.filterGroup}>
                <label htmlFor="sortBy" className={styles.filterLabel}>Sort By</label>
                <select
                  id="sortBy"
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className={styles.filterSelect}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="release_newest">Release Date: Newest First</option>
                  <option value="release_oldest">Release Date: Oldest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                  <option value="name_desc">Name: Z to A</option>
                </select>
              </div>
            )}
          </div>
          
          {/* Filter action buttons */}
          <div className={styles.buttonRow}>
            <button 
              type="button" 
              onClick={applyFilters}
              className={styles.applyButton}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSearch; 