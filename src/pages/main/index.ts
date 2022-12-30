import Page from '../../global/templates/page';
import Products from '../../global/components/products';
import { Data } from '../../global/types';
import data from '../../global/data/data';

class MainPage extends Page {
    constructor(id: string) {
        super(id);
    }

    private createHTML() {
        const fragment = document.createDocumentFragment();
        const productFiltersTemp: HTMLTemplateElement | null = document.querySelector('#productFiltersTemp');

        if (productFiltersTemp) {
            const productClone: HTMLElement = <HTMLElement>productFiltersTemp.content.cloneNode(true);

            if (productClone) {
                const resetButton = productClone.querySelector<HTMLElement>('.reset-button');
                const copyButton = productClone.querySelector<HTMLElement>('.copy-button');
                const filterListByCategoty = productClone.querySelector<HTMLElement>(
                    '.filter-by-category .filter-list'
                );
                const filterListByBrand = productClone.querySelector<HTMLElement>('.filter-by-brand .filter-list');
                const priceRange = productClone.querySelector<HTMLElement>('.price-range');
                const stockRange = productClone.querySelector<HTMLElement>('.stock-range');

                if (
                    resetButton &&
                    copyButton &&
                    filterListByCategoty &&
                    filterListByBrand &&
                    priceRange &&
                    stockRange
                ) {
                    this.createFilterList(data, 'category', filterListByCategoty);
                    this.createFilterList(data, 'brand', filterListByBrand);

                    fragment.append(productClone);
                }
            }

            this.container.innerHTML = '';
            this.container.appendChild(fragment);
            const products = new Products('div', 'products');
            this.container.append(products.render());
        }
    }

    private createFilterList(data: Data[], filter: 'category' | 'brand', parentElem: HTMLElement) {
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
            checkboxLine.className = 'checkbox-line item-not-active';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = key;
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    console.log(`${key} CHECKED`);
                } else {
                    console.log(`${key} UNCHECK`);
                }
            });

            checkboxLine.append(checkbox);

            const label = document.createElement('label');
            label.htmlFor = key;
            label.innerText = key;
            checkboxLine.append(label);

            const amountProduct = document.createElement('span');
            amountProduct.innerText = `??/${filterListData[key]}`;
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
