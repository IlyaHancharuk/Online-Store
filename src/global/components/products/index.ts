import Component from '../../templates/component';
import { Data, localStorageData, ProductInfoForMainPage } from '../../types';
import data from '../../data/data';
import { SortOptions } from '../../constants';
import MainPage from '../../../pages/main';
import cartInfo from '../cartInfo';
import Header from '../header';

class Products extends Component {
    private cartInfo: cartInfo;

    static ProductDatailsData = {
        category: 'Category:',
        brand: 'Brand:',
        price: 'Price:',
        rating: 'Rating:',
        discountPercentage: 'Discount:',
        stock: 'Stock:',
    };

    constructor(tagName: string, className: string) {
        super(tagName, className);
        this.cartInfo = new cartInfo(1, 1);
    }

    private createHTML(data: Data[]) {
        const sortHTML = this.createSortHTML();
        data.sort((a, b) => a.id - b.id);
        const productsHTML = this.createProductsHTML(data);

        if (sortHTML && productsHTML) {
            this.container.innerHTML = '';
            this.container.appendChild(sortHTML);
            this.container.append(productsHTML);
        }
    }

    private createSortHTML() {
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
                        MainPage.productsFilteringUsingSearch(data);
                    });
                    searchBar.append(searchInput);

                    const gridModeBtn = document.createElement('div');
                    gridModeBtn.className = 'grid-mode-btn active-mode';
                    for (let i = 0; i < 16; i += 1) {
                        const point = document.createElement('div');
                        point.innerText = '.';
                        gridModeBtn.append(point);
                    }
                    gridModeBtn.onclick = () => {
                        if (document.querySelector('.products__items')?.classList.contains('list-mode')) {
                            document.querySelector('.products__items')?.classList.remove('list-mode');
                        }
                    };

                    const listModeBtn = document.createElement('div');
                    listModeBtn.className = 'list-mode-btn';
                    for (let i = 0; i < 4; i += 1) {
                        const point = document.createElement('div');
                        point.innerText = '.';
                        listModeBtn.append(point);
                    }
                    listModeBtn.onclick = () => {
                        if (!document.querySelector('.products__items')?.classList.contains('list-mode')) {
                            document.querySelector('.products__items')?.classList.add('list-mode');
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

    public createProductsHTML(data: Data[]) {
        const fragment = document.createDocumentFragment();
        const productsItemTemp: HTMLTemplateElement | null = document.querySelector('#productsItemTemp');

        if (productsItemTemp) {
            const productsItems = document.createElement('div');
            productsItems.className = 'products__items';

            data.forEach((item) => {
                const productClone: HTMLElement = <HTMLElement>productsItemTemp.content.cloneNode(true);

                if (productClone) {
                    const productItem = productClone.querySelector<HTMLElement>('.products__item');
                    const productText = productClone.querySelector<HTMLElement>('.item__text');
                    const itemTitle = productClone.querySelector<HTMLElement>('.item__title');
                    const itemInfo = productClone.querySelector<HTMLElement>('.item__info');
                    const dropButton = productClone.querySelector<HTMLElement>('.drop-button');
                    const detailsButton = productClone.querySelector<HTMLElement>('.details-button');

                    if (productItem && productText && itemTitle && itemInfo && dropButton && detailsButton) {
                        productItem.style.backgroundImage = `url(${item.thumbnail})`;
                        productText.addEventListener('click', () => {
                            window.location.hash = `product-details-page/${item.id.toString()}`;
                        });
                        itemTitle.innerText = item.title;
                        this.addInfo(item, itemInfo);

                        const itemId = item.id.toString();

                        if (this.checkInLocalStorage(itemId)) {
                            dropButton.innerText = 'Drop from cart';
                        } else {
                            dropButton.innerText = 'Add to cart';
                        }

                        dropButton.addEventListener('click', () => {
                            if (this.checkInLocalStorage(itemId)) {
                                while (this.checkInLocalStorage(itemId)) {
                                    this.cartInfo.reduceItemAmount(itemId);
                                }
                                dropButton.innerText = 'Add to cart';
                            } else {
                                this.cartInfo.addToCart(itemId, '1');
                                dropButton.innerText = 'Drop from cart';
                            }

                            const sum = Header.getTotalSum();
                            const total = document.querySelector<HTMLElement>('.header__total');
                            if (total) {
                                total.innerText = `Cart total: €${sum}`;
                            }
                        });

                        detailsButton.innerText = 'Details';
                        detailsButton.addEventListener('click', () => {
                            window.location.hash = `product-details-page/${item.id.toString()}`;
                        });

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
                    MainPage.productsSorting('id');
                    break;
                case SortOptions.priceASC:
                    MainPage.productsSorting('price', 'ASC');
                    break;
                case SortOptions.priceDESC:
                    MainPage.productsSorting('price', 'DESC');
                    break;
                case SortOptions.ratingASC:
                    MainPage.productsSorting('rating', 'ASC');
                    break;
                case SortOptions.ratingDESC:
                    MainPage.productsSorting('rating', 'DESC');
                    break;
            }
        };

        container.append(select);
    }

    private checkInLocalStorage(id: string) {
        let localData: localStorageData[] = [];

        if (localStorage['RS-store-data']) {
            localData = JSON.parse(localStorage['RS-store-data']);
        }

        const alreadyInLocalData: localStorageData = localData.filter((el) => el.id === id)[0];
        if (alreadyInLocalData) {
            return true;
        } else {
            return false;
        }
    }

    render(): HTMLElement {
        this.createHTML(data);
        return this.container;
    }
}

export default Products;
