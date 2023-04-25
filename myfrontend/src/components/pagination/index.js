import React from 'react';
import './styles.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination-content">
      {pageNumbers.map((number) => (
        <button 
          key={number} 
          onClick={(event) => onPageChange(event, number)} 
          className={currentPage === number ? "active" : ""}
        >
          {number}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
