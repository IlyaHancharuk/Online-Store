import Component from '../../templates/component';
import { IData, ProductInfoForMainPage } from '../../types';
import data from '../../data/data';
import { ProductProperty } from '../../constants';
import cartInfo from '../cartInfo';
import CartPage from '../../../pages/cart';
import { checkInLocalStorage } from '../helpers';
import SortBar from '../sortbar';

class Products extends Component {
    private cartInfo: cartInfo;
    private sortBar: SortBar;

    static ProductDatailsData = {
        category: ProductProperty.category,
        brand: ProductProperty.brand,
        price: ProductProperty.price,
        rating: ProductProperty.rating,
        discountPercentage: ProductProperty.discountPercentage,
        stock: ProductProperty.stock,
    };

    constructor(tagName: string, className: string) {
        super(tagName, className);
        this.cartInfo = new cartInfo(1, 1);
        this.sortBar = new SortBar();
    }

    private createHTML(data: IData[]) {
        const sortHTML = this.sortBar.createHTML();
        data.sort((a, b) => a.id - b.id);
        const productsHTML = this.createProductsHTML(data);

        if (sortHTML && productsHTML) {
            this.container.innerHTML = '';
            this.container.appendChild(sortHTML);
            this.container.append(productsHTML);
        }
    }

    public createProductsHTML(data: IData[]) {
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
                        const itemImage = document.createElement('div');
                        itemImage.className = 'item__image';
                        const img = new Image();
                        img.loading = 'lazy';
                        img.src = item.thumbnail;
                        img.alt = `${item.title} image`;
                        itemImage.append(img);
                        productItem.append(itemImage);

                        productText.addEventListener('click', () => {
                            window.location.hash = `product-details-page/${item.id.toString()}`;
                        });
                        itemTitle.innerText = item.title;
                        this.addInfo(item, itemInfo);

                        const itemId = item.id.toString();
                        dropButton.innerText = checkInLocalStorage(itemId) ? 'Drop from cart' : 'Add to cart';

                        dropButton.addEventListener('click', () => {
                            if (checkInLocalStorage(itemId)) {
                                while (checkInLocalStorage(itemId)) {
                                    this.cartInfo.reduceItemAmount(itemId);
                                }
                                dropButton.innerText = 'Add to cart';
                            } else {
                                this.cartInfo.addToCart(itemId, '1');
                                dropButton.innerText = 'Drop from cart';
                            }

                            const sum = CartPage.getTotalSum();
                            const total = document.querySelector<HTMLElement>('.header__total');
                            if (total) total.innerText = `Cart total: €${sum}`;

                            const totalAmount = document.querySelector<HTMLElement>('.header__total-amount');
                            if (totalAmount) totalAmount.textContent = `${CartPage.refreshCartIcontotal()}`;
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

    private addInfo(dataItem: IData, parentElem: HTMLElement) {
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

    render(): HTMLElement {
        this.createHTML(data);
        return this.container;
    }
}

export default Products;
