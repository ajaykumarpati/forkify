import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (event) {
      const btn = event.target.closest('.btn--inline');
      if (!btn) return;
      const gotoPage = +btn.dataset.goto;
      handler(Number(gotoPage));
    });
  }

  _generateMarkup() {
    const currentPage = this._data.currentPage;
    const numOfPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    //1) 1st page and there are no other pages
    if (currentPage === 1 && this._data.results.length === 1) {
      return ``;
    }
    //2) 1st page and there are other pages
    if (currentPage === 1 && this._data.results.length > 1) {
      return `
        <button data-goto = ${
          currentPage + 1
        } class="btn--inline pagination__btn--next">
        <span>Page ${currentPage + 1}</span>
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
        </svg>
        </button> 
      `;
    }
    //3) Last page
    if (currentPage === numOfPages) {
      return `
        <button data-goto = ${
          currentPage - 1
        } class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${currentPage - 1}</span>
            </button>
      `;
    }
    //4) Middle page
    if (numOfPages > currentPage) {
      return `
        <button data-goto = ${
          currentPage - 1
        } class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${currentPage - 1}</span>
            </button>
            <button data-goto = ${
              currentPage + 1
            } class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
            </button> 
      `;
    }
  }
}

export default new PaginationView();
