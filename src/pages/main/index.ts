import Page from '../../global/templates/page';
import Products from '../../global/components/products';
import data from '../../global/data/data';
import { Isettings } from '../../global/types';
import { cleanFilters, productFiltering, productsFilteringUsingCheckbox } from '../../global/components/helpers';
import DualSlider from '../../global/components/dualSlider';

class MainPage extends Page {
    private dualSlider: DualSlider;
    static products = new Products('div', 'products');

    static settings: Isettings = {
        viewMode: 'grid',
        sort: 'default',
        fltredCollection: new Map([
            ['category', new Set()],
            ['brand', new Set()],
        ]),
        rangeValues: {
            price: { from: 10, to: 1749 },
            stock: { from: 2, to: 150 },
        },
    };

    static filtredByCheckboxesData = data;
    static filtredBySlidersData = data;
    static filtredBySearchData = data;
    static sortedData = data;
    static resultFiltringData = data;

    constructor(id: string) {
        super(id);
        this.dualSlider = new DualSlider();
    }
    private createHTML() {
        const filtersHTML = this.createFiltersHTML();

        if (filtersHTML) {
            this.container.innerHTML = '';
            this.container.appendChild(filtersHTML);
            this.container.append(MainPage.products.render());
        }
    }

    private createFiltersHTML() {
        const fragment = document.createDocumentFragment();
        const productFiltersTemp: HTMLTemplateElement | null = document.querySelector('#productFiltersTemp');

        if (productFiltersTemp) {
            const productClone: HTMLElement = <HTMLElement>productFiltersTemp.content.cloneNode(true);

            if (productClone) {
                const resetButton = productClone.querySelector<HTMLElement>('.reset-button');
                const filterListByCategoty = productClone.querySelector<HTMLElement>(
                    '.filter-by-category .filter-list'
                );
                const filterListByBrand = productClone.querySelector<HTMLElement>('.filter-by-brand .filter-list');
                const sliderByPrice = productClone.querySelector<HTMLElement>('.filter-by-price');
                const sliderByStock = productClone.querySelector<HTMLElement>('.filter-by-stock');

                if (resetButton && filterListByCategoty && filterListByBrand && sliderByPrice && sliderByStock) {
                    resetButton.onclick = () => {
                        cleanFilters();
                        this.createHTML();
                    };

                    this.createFilterList('category', filterListByCategoty);
                    this.createFilterList('brand', filterListByBrand);

                    this.dualSlider.createDualSlider('price', sliderByPrice);
                    this.dualSlider.createDualSlider('stock', sliderByStock);

                    fragment.append(productClone);
                }
            }
            return fragment;
        }
    }

    static changeProductsHTML() {
        const products = document.querySelector<HTMLElement>('.products');
        const productsItems = document.querySelector<HTMLElement>('.products__items');
        const stat = document.querySelector<HTMLElement>('.stat');
        const emptiesProducts = document.querySelector<HTMLElement>('#emptiesProducts');

        if (emptiesProducts) {
            emptiesProducts.remove();
        }

        if (products && stat) {
            const finalData = productFiltering();
            stat.innerText = `Found: ${finalData.length}`;

            if (productsItems) productsItems.remove();

            if (finalData.length !== 0) {
                const newProductsItems = MainPage.products.createProductsHTML(finalData);

                if (newProductsItems) products.append(newProductsItems);
            } else {
                const emptiesProducts = document.createElement('div');
                emptiesProducts.id = 'emptiesProducts';
                emptiesProducts.innerHTML = 'Not found';
                products.append(emptiesProducts);
            }
        }
    }

    private createFilterList(filter: 'category' | 'brand', parentElem: HTMLElement) {
        const filterListData: { [key: string]: number } = {};

        data.forEach((item) => {
            const key = item[filter];

            if (!(key in filterListData)) {
                filterListData[key] = 1;
            } else {
                filterListData[key] = filterListData[key] + 1;
            }
        });

        for (const key in filterListData) {
            const checkboxLine = document.createElement('div');
            checkboxLine.className = 'checkbox-line';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = key;
            checkbox.name = filter;

            productsFilteringUsingCheckbox(checkbox);

            checkboxLine.append(checkbox);

            const label = document.createElement('label');
            label.htmlFor = key;
            label.innerText = key;
            checkboxLine.append(label);

            const amountProduct = document.createElement('span');
            amountProduct.innerText = `${filterListData[key]}`;
            checkboxLine.append(amountProduct);

            parentElem.append(checkboxLine);
        }
    }

    render() {
        this.createHTML();
        return this.container;
    }
}

export default MainPage;
