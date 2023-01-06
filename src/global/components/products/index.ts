import Component from '../../templates/component';
import { Data, ProductInfoForMainPage } from '../../types';
import data from '../../data/data';

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
        const fragment = document.createDocumentFragment();
        const productsItemTemp: HTMLTemplateElement | null = document.querySelector('#productsItemTemp');

        if (productsItemTemp) {
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

            this.container.innerHTML = '';
            this.container.appendChild(fragment);
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

    render(): HTMLElement {
        this.createHTML(data);
        return this.container;
    }
}

export default Products;
