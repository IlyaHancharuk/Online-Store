import Component from '../../templates/component';
import * as types from '../../types';
import data from '../../data/data';

class Products extends Component {
    constructor(tagName: string, className: string) {
        super(tagName, className);
    }

    private createHTML(data: types.Data[]) {
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
                        itemTitle.innerText = item.title;

                        this.createInfoElement(item, 'category', itemInfo);
                        this.createInfoElement(item, 'brand', itemInfo);
                        this.createInfoElement(item, 'price', itemInfo);
                        this.createInfoElement(item, 'discountPercentage', itemInfo);
                        this.createInfoElement(item, 'rating', itemInfo);
                        this.createInfoElement(item, 'stock', itemInfo);

                        fragment.append(productClone);
                    }
                }
            });

            this.container.innerHTML = '';
            this.container.appendChild(fragment);
        }
    }

    private createInfoElement(dataItem: types.Data, descriptionsTitle: types.ProductInfo, parentItem: HTMLElement) {
        const infoItem = document.createElement('p');
        const title = descriptionsTitle === 'discountPercentage' ? 'discount' : descriptionsTitle;
        infoItem.innerText = `${title}: ${dataItem[descriptionsTitle]}`;
        parentItem.append(infoItem);
    }

    render(): HTMLElement {
        this.createHTML(data);
        return this.container;
    }
}

export default Products;
