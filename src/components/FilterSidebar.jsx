import React from 'react';
import '../styles/FilterSidebar.css';
import Input from "./Input";
import Select from "./Select";

const FilterSidebar = ({
                           filters,
                           categories,
                           brands,
                           searchTerm,
                           onSearchChange,
                           onFilterChange,
                           onClearFilters
                       }) => {
    return (
        <div className="shop-filter-sidebar">
            <div className="filter-header">
                <h3 className="filter-title">Filters</h3>
                <button className="clear-button" onClick={onClearFilters}>
                    Clear All
                </button>
            </div>

            {/* Search */}
            <div className="filter-section">
                <label className="filter-label">Search Products</label>
                <div className="filter-search-container">
                    <svg className="filter-search-icon" viewBox="0 0 24 24" width="18" height="18">
                        <path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                    <Input
                        type="text"
                        className="search-input"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>

            {/* Category */}
            <div className="filter-section">
                <label className="filter-label">Category</label>
                <div className="select-container">
                    <select
                        className="select"
                        value={filters.category}
                        onChange={(e) => onFilterChange('category', e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    <svg className="dropdown-icon" viewBox="0 0 24 24" width="16" height="16">
                        <path fill="currentColor" d="M7 10l5 5 5-5z"/>
                    </svg>
                </div>
            </div>

            {/* Brand */}
            <div className="filter-section">
                <label className="filter-label">Brand</label>
                <Select
                    options={brands}
                    value={filters.brand}
                    onChange={(e) => onFilterChange('brand', e.target.value)}
                    placeholder="All Brands"
                />
            </div>


            {/* Stock */}
            <div className="filter-section">
                <label className="checkbox-container">
                    <input
                        type="checkbox"
                        checked={filters.inStock}
                        onChange={(e) => onFilterChange('inStock', e.target.checked)}
                        className="hidden-checkbox"
                    />
                    <div className="styled-checkbox">
                        {filters.inStock && (
                            <svg className="check-icon" viewBox="0 0 24 24" width="14" height="14">
                                <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                            </svg>
                        )}
                    </div>
                    <span className="checkbox-label">In Stock Only</span>
                </label>
            </div>
        </div>
    );
};

export default FilterSidebar;
