import Page from '../../global/templates/page';
import Products from '../../global/components/products';
import data from '../../global/data/data';

class MainPage extends Page {
    static fltredCollection: Map<string, Set<string>> = new Map([
        ['category', new Set()],
        ['brand', new Set()],
    ]);

    static filtredData = data;

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
                    this.createFilterList('category', filterListByCategoty);
                    this.createFilterList('brand', filterListByBrand);

                    fragment.append(productClone);
                }
            }

            this.container.innerHTML = '';
            this.container.appendChild(fragment);
            const products = new Products('div', 'products');
            this.container.append(products.render());
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

            this.productFiltering(checkbox);

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

    private productFiltering(checkbox: HTMLInputElement) {
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                MainPage.fltredCollection.get(checkbox.name)?.add(checkbox.id);
            } else {
                MainPage.fltredCollection.get(checkbox.name)?.delete(checkbox.id);
            }

            const categories = MainPage.fltredCollection.get('category');
            const brands = MainPage.fltredCollection.get('brand');
            MainPage.filtredData = data;

            if (categories?.size)
                MainPage.filtredData = MainPage.filtredData.filter((el) => categories?.has(el['category']));
            if (brands?.size) MainPage.filtredData = MainPage.filtredData.filter((el) => brands?.has(el['brand']));

            const products = document.querySelector<HTMLElement>('.products');
            const productsItems = document.querySelector<HTMLElement>('.products__items');
            const stat = document.querySelector<HTMLElement>('.stat');

            if (products && productsItems && stat) {
                stat.innerText = `Found: ${MainPage.filtredData.length}`;
                productsItems.remove();
                const newProductsItems = Products.createProductsHTML(MainPage.filtredData);
                if (newProductsItems) products.append(newProductsItems);
            }
        });
    }

    render() {
        this.createHTML();
        return this.container;
    }
}

export default MainPage;
