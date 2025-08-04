import React from 'react';
import PropTypes from 'prop-types';
import '../styles/Pagination.css'; // Optional styling
import { FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from 'react-icons/fa';

const Pagination = ({
                        currentPage,
                        totalPages,
                        onPageChange,
                        maxVisiblePages = 5,
                        showFirstLast = true,
                        showPrevNext = true,
                        customLabels = {}
                    }) => {
    // Default labels with customization option
    const labels = {
        first: <FaAngleDoubleLeft />,
        prev: <FaAngleLeft />,
        next: <FaAngleRight />,
        last: <FaAngleDoubleRight />,
        ...customLabels
    };

    // Calculate visible page range
    const getVisiblePages = () => {
        const half = Math.floor(maxVisiblePages / 2);
        let start = Math.max(1, currentPage - half);
        let end = Math.min(totalPages, start + maxVisiblePages - 1);

        // Adjust if we're at the end
        if (end - start + 1 < maxVisiblePages) {
            start = Math.max(1, end - maxVisiblePages + 1);
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    const visiblePages = getVisiblePages();

    if (totalPages <= 1) return null;

    return (
        <nav className="pagination" aria-label="Pagination">
            <ul className="pagination-list">
                {showFirstLast && (
                    <li>
                        <button
                            className={`pagination-link ${currentPage === 1 ? 'disabled' : ''}`}
                            onClick={() => currentPage !== 1 && onPageChange(1)}
                            disabled={currentPage === 1}
                            aria-label="First page"
                        >
                            {labels.first}
                        </button>
                    </li>
                )}

                {showPrevNext && (
                    <li>
                        <button
                            className={`pagination-link ${currentPage === 1 ? 'disabled' : ''}`}
                            onClick={() => currentPage !== 1 && onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            aria-label="Previous page"
                        >
                            {labels.prev}
                        </button>
                    </li>
                )}

                {visiblePages.map((page) => (
                    <li key={page}>
                        <button
                            className={`pagination-link ${currentPage === page ? 'active' : ''}`}
                            onClick={() => onPageChange(page)}
                            aria-current={currentPage === page ? 'page' : undefined}
                        >
                            {page}
                        </button>
                    </li>
                ))}

                {showPrevNext && (
                    <li>
                        <button
                            className={`pagination-link ${currentPage === totalPages ? 'disabled' : ''}`}
                            onClick={() => currentPage !== totalPages && onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            aria-label="Next page"
                        >
                            {labels.next}
                        </button>
                    </li>
                )}

                {showFirstLast && (
                    <li>
                        <button
                            className={`pagination-link ${currentPage === totalPages ? 'disabled' : ''}`}
                            onClick={() => currentPage !== totalPages && onPageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            aria-label="Last page"
                        >
                            {labels.last}
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
};

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    maxVisiblePages: PropTypes.number,
    showFirstLast: PropTypes.bool,
    showPrevNext: PropTypes.bool,
    customLabels: PropTypes.shape({
        first: PropTypes.string,
        last: PropTypes.string,
        prev: PropTypes.string,
        next: PropTypes.string
    })
};

export default Pagination;