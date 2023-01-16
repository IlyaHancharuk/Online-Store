import {
    ButtonsType,
    POINTS_COUNT_FOR_GRID_MODE,
    POINTS_COUNT_FOR_LIST_MODE,
    SortBy,
    SortOptions,
    SortOrder,
} from '../../constants';
import data from '../../data/data';
import { modeButtonType } from '../../types';
import { productsFilteringUsingSearch, productsSorting } from '../helpers';

class SortBar {
    public createHTML() {
        const fragment = document.createDocumentFragment();
        const productsSortTemp: HTMLTemplateElement | null = document.querySelector('#productsSortTemp');

        if (productsSortTemp) {
            const productClone: HTMLElement = <HTMLElement>productsSortTemp.content.cloneNode(true);
            if (productClone) {
                const sortBar = productClone.querySelector<HTMLElement>('.sort-bar');
                const stat = productClone.querySelector<HTMLElement>('.stat');
                const searchBar = productClone.querySelector<HTMLElement>('.search-bar');
                const viewMode = productClone.querySelector<HTMLElement>('.view-mode');

                if (sortBar && stat && searchBar && viewMode) {
                    this.addSortOptions(sortBar);
                    stat.innerText = `Found: ${data.length}`;

                    const searchInput = document.createElement('input');
                    searchInput.type = 'text';
                    searchInput.placeholder = 'Search product';
                    searchInput.addEventListener('keyup', () => {
                        productsFilteringUsingSearch();
                    });
                    searchBar.append(searchInput);

                    const gridModeBtn = document.createElement('div');
                    const listModeBtn = document.createElement('div');
                    this.createModeButtons(gridModeBtn, ButtonsType.grid);
                    this.createModeButtons(listModeBtn, ButtonsType.list);

                    gridModeBtn.onclick = () => {
                        if (document.querySelector('.products__items')?.classList.contains('list-mode')) {
                            document.querySelector('.products__items')?.classList.remove('list-mode');
                            gridModeBtn.classList.add('active-mode');
                            listModeBtn.classList.remove('active-mode');
                        }
                    };

                    listModeBtn.onclick = () => {
                        if (!document.querySelector('.products__items')?.classList.contains('list-mode')) {
                            document.querySelector('.products__items')?.classList.add('list-mode');
                            listModeBtn.classList.add('active-mode');
                            gridModeBtn.classList.remove('active-mode');
                        }
                    };

                    viewMode.append(gridModeBtn);
                    viewMode.append(listModeBtn);

                    fragment.append(productClone);
                }
            }
            return fragment;
        }
    }

    private createModeButtons(button: HTMLDivElement, type: modeButtonType) {
        const pointCount = type === ButtonsType.grid ? POINTS_COUNT_FOR_GRID_MODE : POINTS_COUNT_FOR_LIST_MODE;
        button.className = type === ButtonsType.grid ? 'grid-mode-btn active-mode' : 'list-mode-btn';
        for (let i = 0; i < pointCount; i += 1) {
            const point = document.createElement('div');
            point.innerText = '.';
            button.append(point);
        }
    }

    private addSortOptions(container: HTMLElement) {
        const select = document.createElement('select');
        select.options[0] = new Option('Sort options:', 'sort-title');
        select.options[0].disabled = true;
        select.options[0].selected = true;
        select.options[1] = new Option('Default', SortOptions.default);
        select.options[2] = new Option('Sort by price ASC', SortOptions.priceASC);
        select.options[3] = new Option('Sort by price DESC', SortOptions.priceDESC);
        select.options[4] = new Option('Sort by rating ASC', SortOptions.ratingASC);
        select.options[5] = new Option('Sort by rating DESC', SortOptions.ratingDESC);

        select.onchange = () => {
            switch (select.value) {
                case SortOptions.default:
                    productsSorting(SortBy.id);
                    break;
                case SortOptions.priceASC:
                    productsSorting(SortBy.price, SortOrder.ASC);
                    break;
                case SortOptions.priceDESC:
                    productsSorting(SortBy.price, SortOrder.DESC);
                    break;
                case SortOptions.ratingASC:
                    productsSorting(SortBy.rating, SortOrder.ASC);
                    break;
                case SortOptions.ratingDESC:
                    productsSorting(SortBy.rating, SortOrder.DESC);
                    break;
            }
        };

        container.append(select);
    }
}

export default SortBar;
