import Component from '../../templates/component';
import { Data, IElemInfo } from '../../types';
import data from '../../data/data';

class Products extends Component {
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
                        productItem.setAttribute('data-id', `${item.id}`);
                        productItem.addEventListener('click', () => {
                            window.location.hash = `product-details-page/${item.id.toString()}`;
                        });
                        itemTitle.innerText = item.title;

                        this.createInfoElement({ dataItem: item, descriptionsTitle: 'category', parentElem: itemInfo });
                        this.createInfoElement({ dataItem: item, descriptionsTitle: 'brand', parentElem: itemInfo });
                        this.createInfoElement({ dataItem: item, descriptionsTitle: 'price', parentElem: itemInfo });
                        this.createInfoElement({
                            dataItem: item,
                            descriptionsTitle: 'discountPercentage',
                            parentElem: itemInfo,
                        });
                        this.createInfoElement({ dataItem: item, descriptionsTitle: 'rating', parentElem: itemInfo });
                        this.createInfoElement({ dataItem: item, descriptionsTitle: 'stock', parentElem: itemInfo });

                        fragment.append(productClone);
                    }
                }
            });

            this.container.innerHTML = '';
            this.container.appendChild(fragment);
        }
    }

    private createInfoElement({ dataItem, descriptionsTitle, parentElem }: IElemInfo) {
        const infoItem = document.createElement('p');
        const title = descriptionsTitle === 'discountPercentage' ? 'discount' : descriptionsTitle;
        infoItem.innerText = `${title}: ${dataItem[descriptionsTitle]}`;
        parentElem.append(infoItem);
    }

    render(): HTMLElement {
        this.createHTML(data);
        return this.container;
    }
}

export default Products;
