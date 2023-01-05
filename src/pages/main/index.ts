import Page from '../../global/templates/page';
import Products from '../../global/components/products';
import data from '../../global/data/data';

class MainPage extends Page {
    static fltredCollection: Map<string, Set<string>> = new Map([
        ['category', new Set()],
        ['brand', new Set()],
    ]);

    static rangeValues = {
        price: { from: 0, to: 100 },
        stock: { from: 0, to: 100 },
    };

    static filtredByCheckboxesData = data;
    static filtredBySlidersData = data;

    constructor(id: string) {
        super(id);
    }

    private createHTML() {
        const filtersHTML = this.createFiltersHTML();

        if (filtersHTML) {
            this.container.innerHTML = '';
            this.container.appendChild(filtersHTML);
            const products = new Products('div', 'products');
            this.container.append(products.render());
        }
    }

    private createFiltersHTML() {
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
                const sliderByPrice = productClone.querySelector<HTMLElement>('.filter-by-price');
                const sliderByStock = productClone.querySelector<HTMLElement>('.filter-by-stock');

                if (
                    resetButton &&
                    copyButton &&
                    filterListByCategoty &&
                    filterListByBrand &&
                    sliderByPrice &&
                    sliderByStock
                ) {
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

    private changeProductsHTML() {
        const products = document.querySelector<HTMLElement>('.products');
        const productsItems = document.querySelector<HTMLElement>('.products__items');
        const stat = document.querySelector<HTMLElement>('.stat');
        const emptiesProducts = document.querySelector<HTMLElement>('#emptiesProducts');

        if (emptiesProducts) {
            emptiesProducts.remove();
        }

        if (products && stat) {
            stat.innerText = `Found: ${MainPage.filtredByCheckboxesData.length}`;

            if (productsItems) productsItems.remove();

            const resultFiltredData = MainPage.filtredByCheckboxesData.filter((el) =>
                MainPage.filtredBySlidersData.includes(el)
            );

            if (resultFiltredData.length !== 0) {
                const newProductsItems = Products.createProductsHTML(resultFiltredData);

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
            amountProduct.innerText = `??/${filterListData[key]}`;
            checkboxLine.append(amountProduct);

            parentElem.append(checkboxLine);
        }
    }

    private productsFilteringUsingCheckbox(checkbox: HTMLInputElement) {
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                MainPage.fltredCollection.get(checkbox.name)?.add(checkbox.id);
            } else {
                MainPage.fltredCollection.get(checkbox.name)?.delete(checkbox.id);
            }

            const categories = MainPage.fltredCollection.get('category');
            const brands = MainPage.fltredCollection.get('brand');
            MainPage.filtredByCheckboxesData = data;

            if (categories?.size)
                MainPage.filtredByCheckboxesData = MainPage.filtredByCheckboxesData.filter((el) =>
                    categories?.has(el['category'])
                );
            if (brands?.size)
                MainPage.filtredByCheckboxesData = MainPage.filtredByCheckboxesData.filter((el) =>
                    brands?.has(el['brand'])
                );

            this.changeProductsHTML();
        });
    }

    private createDualSlider(filter: 'price' | 'stock', parentElem: HTMLElement) {
        const sortByFilterData = MainPage.filtredByCheckboxesData.sort((a, b) => a[filter] - b[filter]);
        const minValue = sortByFilterData[0][filter];
        const maxValue = sortByFilterData[sortByFilterData.length - 1][filter];

        MainPage.rangeValues[filter].from = minValue;
        MainPage.rangeValues[filter].to = maxValue;

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
        this.fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);

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
        this.fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);

        const filter = fromSlider.name as 'price' | 'stock';
        MainPage.rangeValues[filter].from = from;
        MainPage.rangeValues[filter].to = to;

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
        const priceData = MainPage.rangeValues.price;
        const stockData = MainPage.rangeValues.stock;

        MainPage.filtredBySlidersData = data
            .filter((el) => +el.price >= priceData.from && +el.price <= priceData.to)
            .filter((el) => +el.stock >= stockData.from && +el.stock <= stockData.to);

        this.changeProductsHTML();
    }

    render() {
        this.createHTML();
        return this.container;
    }
}

export default MainPage;
