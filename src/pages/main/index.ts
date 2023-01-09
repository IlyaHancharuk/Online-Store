import Page from '../../global/templates/page';
import Products from '../../global/components/products';
import data from '../../global/data/data';
import { Data } from '../../global/types';

class MainPage extends Page {
    static products = new Products('div', 'products');

    static settings = {
        viewMode: 'grid',
        sort: 'default',
        fltredCollection: new Map([
            ['category', new Set()],
            ['brand', new Set()],
        ]),
        rangeValues: {
            price: { from: 0, to: 100 },
            stock: { from: 0, to: 100 },
        },
    };

    getSettings() {
        if (localStorage['RS-store-settings']) {
            MainPage.settings = JSON.parse(localStorage['RS-store-settings']);
        }
    }

    static filtredByCheckboxesData = data;
    static filtredBySlidersData = data;
    static filtredBySearchData = data;
    static sortedData = data;
    static resultFiltringData = data;

    constructor(id: string) {
        super(id);
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
                        this.cleanFilters();
                        this.createHTML();
                    };

                    this.createFilterList('category', filterListByCategoty);
                    this.createFilterList('brand', filterListByBrand);

                    this.createDualSlider('price', sliderByPrice);
                    this.createDualSlider('stock', sliderByStock);

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
            const finalData = MainPage.productFiltering();
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

            this.productsFilteringUsingCheckbox(checkbox);

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

    private productsFilteringUsingCheckbox(checkbox: HTMLInputElement) {
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                MainPage.settings.fltredCollection.get(checkbox.name)?.add(checkbox.id);
            } else {
                MainPage.settings.fltredCollection.get(checkbox.name)?.delete(checkbox.id);
            }

            const categories = MainPage.settings.fltredCollection.get('category');
            const brands = MainPage.settings.fltredCollection.get('brand');
            MainPage.filtredByCheckboxesData = data;
            MainPage.resultFiltringData = data;

            if (categories?.size)
                MainPage.filtredByCheckboxesData = MainPage.filtredByCheckboxesData.filter((el) =>
                    categories?.has(el['category'])
                );
            if (brands?.size)
                MainPage.filtredByCheckboxesData = MainPage.filtredByCheckboxesData.filter((el) =>
                    brands?.has(el['brand'])
                );

            MainPage.changeProductsHTML();
        });
    }

    private createDualSlider(filter: 'price' | 'stock', parentElem: HTMLElement) {
        const sortByFilterData = MainPage.filtredByCheckboxesData.sort((a, b) => a[filter] - b[filter]);
        const minValue = sortByFilterData[0][filter];
        const maxValue = sortByFilterData[sortByFilterData.length - 1][filter];

        MainPage.settings.rangeValues[filter].from = minValue;
        MainPage.settings.rangeValues[filter].to = maxValue;

        const sliderTitle = document.createElement('h3');
        sliderTitle.className = 'slider__title';
        sliderTitle.innerText = `${filter[0].toUpperCase()}${filter.slice(1)}`;
        parentElem.append(sliderTitle);

        const sliderControl = document.createElement('div');
        sliderControl.className = 'slider__control';

        const sliderValue = document.createElement('div');
        sliderValue.className = 'slider__value';

        const fromValue = document.createElement('span');
        fromValue.id = 'fromValue';
        fromValue.innerText = `${minValue}`;

        const toValue = document.createElement('span');
        toValue.id = 'toValue';
        toValue.innerText = `${maxValue}`;

        sliderValue.append(fromValue);
        sliderValue.append('⇔');
        sliderValue.append(toValue);
        sliderControl.append(sliderValue);

        const fromSlider = document.createElement('input');
        fromSlider.type = 'range';
        fromSlider.id = 'fromSlider';
        fromSlider.name = filter;
        fromSlider.min = `${minValue}`;
        fromSlider.defaultValue = `${minValue}`;
        fromSlider.max = `${maxValue}`;

        const toSlider = document.createElement('input');
        toSlider.type = 'range';
        toSlider.id = 'toSlider';
        toSlider.name = filter;
        toSlider.min = `${minValue}`;
        toSlider.max = `${maxValue}`;
        toSlider.defaultValue = `${maxValue}`;

        this.addStylesAndListners(fromSlider, toSlider, fromValue, toValue);

        sliderControl.append(fromSlider);
        sliderControl.append(toSlider);

        parentElem.append(sliderControl);
    }

    private addStylesAndListners(
        fromSlider: HTMLInputElement,
        toSlider: HTMLInputElement,
        fromValue: HTMLElement,
        toValue: HTMLElement
    ) {
        this.fillSlider(fromSlider, toSlider, '#C6C6C6', '#f9b54c', toSlider);

        if (Number(toSlider.value) <= 0) {
            toSlider.style.zIndex = '2';
        } else {
            toSlider.style.zIndex = '0';
        }

        fromSlider.oninput = () => this.controlSlider(fromSlider, toSlider, fromValue);
        toSlider.oninput = () => this.controlSlider(fromSlider, toSlider, toValue);
        fromSlider.onchange = () => this.productsFilteringUsingDualSliders();
        toSlider.onchange = () => this.productsFilteringUsingDualSliders();
    }

    private fillSlider(
        from: HTMLInputElement,
        to: HTMLInputElement,
        sliderColor: string,
        rangeColor: string,
        controlSlider: HTMLInputElement
    ) {
        const rangeDistance = +to.max - +to.min;
        const fromPosition = +from.value - +to.min;
        const toPosition = +to.value - +to.min;
        controlSlider.style.background = `linear-gradient(
          to right,
          ${sliderColor} 0%,
          ${sliderColor} ${(fromPosition / rangeDistance) * 100}%,
          ${rangeColor} ${(fromPosition / rangeDistance) * 100}%,
          ${rangeColor} ${(toPosition / rangeDistance) * 100}%, 
          ${sliderColor} ${(toPosition / rangeDistance) * 100}%, 
          ${sliderColor} 100%)`;
    }

    private controlSlider(fromSlider: HTMLInputElement, toSlider: HTMLInputElement, valueElem: HTMLElement) {
        const from = parseInt(fromSlider.value, 10);
        const to = parseInt(toSlider.value, 10);
        this.fillSlider(fromSlider, toSlider, '#C6C6C6', '#f9b54c', toSlider);

        const filter = fromSlider.name as 'price' | 'stock';
        MainPage.settings.rangeValues[filter].from = from;
        MainPage.settings.rangeValues[filter].to = to;

        if (valueElem.id === 'fromValue') {
            if (from > to) {
                fromSlider.value = `${to}`;
                valueElem.innerText = `${to}`;
            } else {
                valueElem.innerText = `${from}`;
            }
        } else {
            if (Number(toSlider.value) <= 0) {
                toSlider.style.zIndex = '2';
            } else {
                toSlider.style.zIndex = '0';
            }

            if (from <= to) {
                toSlider.value = `${to}`;
                valueElem.innerText = `${to}`;
            } else {
                valueElem.innerText = `${from}`;
                toSlider.value = `${from}`;
            }
        }
    }

    private productsFilteringUsingDualSliders() {
        const priceData = MainPage.settings.rangeValues.price;
        const stockData = MainPage.settings.rangeValues.stock;

        MainPage.filtredBySlidersData = data
            .filter((el) => +el.price >= priceData.from && +el.price <= priceData.to)
            .filter((el) => +el.stock >= stockData.from && +el.stock <= stockData.to);

        MainPage.changeProductsHTML();
    }

    static productFiltering() {
        MainPage.resultFiltringData = MainPage.sortedData
            .filter((el) => MainPage.filtredByCheckboxesData.includes(el))
            .filter((el) => MainPage.filtredBySlidersData.includes(el))
            .filter((el) => MainPage.filtredBySearchData.includes(el));

        return MainPage.resultFiltringData;
    }

    static productsFilteringUsingSearch(data: Data[]) {
        const searchInput = document.querySelector<HTMLInputElement>('.search-bar input');
        if (searchInput) {
            const keyword = searchInput.value.toLowerCase();
            MainPage.filtredBySearchData = data.filter((item) => {
                const title = item.title.toLowerCase();
                const desc = item.description.toLowerCase();
                const brand = item.brand.toLowerCase();
                const category = item.category.toLowerCase();
                const price = item.price.toString().toLowerCase();
                const stock = item.stock.toString().toLowerCase();
                const discount = item.discountPercentage.toString().toLowerCase();
                const rating = item.rating.toString().toLowerCase();

                if (title.indexOf(keyword) > -1) return true;
                if (desc.indexOf(keyword) > -1) return true;
                if (brand.indexOf(keyword) > -1) return true;
                if (category.indexOf(keyword) > -1) return true;
                if (price.indexOf(keyword) > -1) return true;
                if (stock.indexOf(keyword) > -1) return true;
                if (discount.indexOf(keyword) > -1) return true;
                if (rating.indexOf(keyword) > -1) return true;
                return false;
            });

            MainPage.changeProductsHTML();
        }
    }

    static productsSorting(option: 'id' | 'price' | 'rating', mod?: 'ASC' | 'DESC') {
        if (mod === 'DESC') {
            MainPage.sortedData.sort((a, b) => b[option] - a[option]);
        } else {
            MainPage.sortedData.sort((a, b) => a[option] - b[option]);
        }

        MainPage.changeProductsHTML();
    }

    private cleanFilters() {
        MainPage.settings.fltredCollection.get('category')?.clear();
        MainPage.settings.fltredCollection.get('brand')?.clear();
        MainPage.filtredByCheckboxesData = data;
        MainPage.filtredBySlidersData = data;
        MainPage.filtredBySearchData = data;
        MainPage.sortedData = data;
        MainPage.resultFiltringData = data;
    }

    render() {
        this.createHTML();
        return this.container;
    }
}

export default MainPage;
