import Component from '../../templates/component';
import { Data, ProductInfoForMainPage } from '../../types';
import data from '../../data/data';
import { SortOptions } from '../../constants';

class Products extends Component {
    static ProductDatailsData = {
        discountPercentage: 'Discount:',
        stock: 'Stock:',
        rating: 'Rating:',
        brand: 'Brand:',
        category: 'Category:',
        price: 'Price:',
    };

    constructor(tagName: string, className: string) {
        super(tagName, className);
    }

    private createHTML(data: Data[]) {
        const sortHTML = this.createSortHTML(data);
        const productsHTML = this.createProductsHTML(data);

        if (sortHTML && productsHTML) {
            this.container.innerHTML = '';
            this.container.appendChild(sortHTML);
            this.container.append(productsHTML);
        }
    }

    private createSortHTML(data: Data[]) {
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
                        this.filterBySearch(data, searchInput);
                    });
                    searchBar.append(searchInput);

                    const bigMode = document.createElement('div');
                    bigMode.className = 'big-mode active-mode';
                    for (let i = 0; i < 16; i += 1) {
                        const point = document.createElement('div');
                        point.innerText = '.';
                        bigMode.append(point);
                    }

                    const smallMode = document.createElement('div');
                    smallMode.className = 'small-mode';
                    for (let i = 0; i < 36; i += 1) {
                        const point = document.createElement('div');
                        point.innerText = '.';
                        smallMode.append(point);
                    }

                    viewMode.append(bigMode);
                    viewMode.append(smallMode);

                    fragment.append(productClone);
                }
            }
            return fragment;
        }
    }

    private createProductsHTML(data: Data[]) {
        const fragment = document.createDocumentFragment();
        const productsItemTemp: HTMLTemplateElement | null = document.querySelector('#productsItemTemp');

        if (productsItemTemp) {
            const productsItems = document.createElement('div');
            productsItems.className = 'products__items';

            data.forEach((item) => {
                const productClone: HTMLElement = <HTMLElement>productsItemTemp.content.cloneNode(true);

                if (productClone) {
                    const productItem = productClone.querySelector<HTMLElement>('.products__item');
                    const itemTitle = productClone.querySelector<HTMLElement>('.item__title');
                    const itemInfo = productClone.querySelector<HTMLElement>('.item__info');
                    const itemButtons = productClone.querySelector<HTMLElement>('.item__buttons');
                    const dropButton = productClone.querySelector<HTMLElement>('.drop-button');
                    const detailsButton = productClone.querySelector<HTMLElement>('.details-button');

                    if (productItem && itemTitle && itemInfo && itemButtons && dropButton && detailsButton) {
                        productItem.style.backgroundImage = `url(${item.thumbnail})`;
                        productItem.addEventListener('click', () => {
                            window.location.hash = `product-details-page/${item.id.toString()}`;
                        });
                        itemTitle.innerText = item.title;
                        this.addInfo(item, itemInfo);

                        fragment.append(productClone);
                    }
                }
            });
            productsItems.appendChild(fragment);
            return productsItems;
        }
    }

    private addInfo(dataItem: Data, parentElem: HTMLElement) {
        for (const prop in Products.ProductDatailsData) {
            const key = prop as ProductInfoForMainPage;
            const infoItem = document.createElement('div');
            infoItem.className = 'info__item';

            const title = document.createElement('h3');
            title.innerText = Products.ProductDatailsData[key];
            infoItem.append(title);

            const text = document.createElement('p');
            text.innerText = dataItem[key].toString();
            infoItem.append(text);

            parentElem.append(infoItem);
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
                    this.sorting(data, 'id');
                    break;
                case SortOptions.priceASC:
                    this.sorting(data, 'price', 'ASC');
                    break;
                case SortOptions.priceDESC:
                    this.sorting(data, 'price', 'DESC');
                    break;
                case SortOptions.ratingASC:
                    this.sorting(data, 'rating', 'ASC');
                    break;
                case SortOptions.ratingDESC:
                    this.sorting(data, 'rating', 'DESC');
                    break;
            }
        };

        container.append(select);
    }

    private sorting(data: Data[], option: 'id' | 'price' | 'rating', mod?: 'ASC' | 'DESC') {
        const productsItems = document.querySelector<HTMLElement>('.products__items');
        let sortData: Data[] = [];

        if (mod === 'ASC') {
            sortData = data.sort((a, b) => a[option] - b[option]);
        } else if (mod === 'DESC') {
            sortData = data.sort((a, b) => b[option] - a[option]);
        } else {
            sortData = data.sort((a, b) => a[option] - b[option]);
        }

        if (productsItems) {
            productsItems.remove();
            const newProductsItems = this.createProductsHTML(sortData);
            if (newProductsItems) this.container.append(newProductsItems);
        }
    }

    private filterBySearch(data: Data[], input: HTMLInputElement) {
        const keyword = input.value.toLowerCase();
        const filterData: Data[] = data.filter((item) => {
            const title = item.title.toLowerCase();
            return title.indexOf(keyword) > -1;
        });

        const productsItems = document.querySelector<HTMLElement>('.products__items');
        const stat = document.querySelector<HTMLElement>('.stat');

        if (productsItems && stat) {
            stat.innerText = `Found: ${filterData.length}`
            productsItems.remove();
            const newProductsItems = this.createProductsHTML(filterData);
            if (newProductsItems) this.container.append(newProductsItems);
        }
    }

    render(): HTMLElement {
        this.createHTML(data);
        return this.container;
    }
}

export default Products;
