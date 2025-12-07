// components/Pagination.jsx

function Pagination({ page, onPageChange, hasNextPage }) {
  const handlePrev = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (hasNextPage) {
      onPageChange(page + 1);
    }
  };

  return (
    <div className="pagination">
      <button
        className="prev-btn"
        onClick={handlePrev}
        disabled={page === 1}
      >
        Previous
      </button>

      <span className="page-number">Page {page}</span>

      <button
        className="next-btn"
        onClick={handleNext}
        disabled={!hasNextPage}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
