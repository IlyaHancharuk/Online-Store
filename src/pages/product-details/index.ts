import Page from '../../global/templates/page';
import { Data, ProductInfoForProductPage } from '../../global/types';
import data from '../../global/data/data';

class ProductDetailsPage extends Page {
    productId: number | undefined;

    static ProductDatailsData = {
        description: 'Description:',
        discountPercentage: 'Discount Percentage:',
        rating: 'Rating:',
        stock: 'Stock:',
        brand: 'Brand:',
        category: 'Category:',
    };

    constructor(id: string, productId: number | undefined) {
        super(id);
        this.productId = productId;
    }

    createHTML(data: Data[]) {
        if (this.productId) {
            const fragment = document.createDocumentFragment();
            const productDetailsTemp: HTMLTemplateElement | null = document.querySelector('#productDetailsTemp');

            if (productDetailsTemp) {
                const index = this.productId - 1;
                const product = data[index];
                const productClone: HTMLElement = <HTMLElement>productDetailsTemp.content.cloneNode(true);

                if (productClone) {
                    const productTitle = productClone.querySelector<HTMLElement>('.product__title h1');
                    const slides = productClone.querySelector<HTMLElement>('.slides');
                    const grandPhoto = productClone.querySelector<HTMLImageElement>('.grand-photo img');
                    const productInfo = productClone.querySelector<HTMLElement>('.product__info');
                    const price = productClone.querySelector<HTMLElement>('.price');
                    const dropButton = productClone.querySelector<HTMLElement>('.drop-button');
                    const buyButton = productClone.querySelector<HTMLElement>('.buy-button');

                    if (productTitle && slides && grandPhoto && productInfo && price && dropButton && buyButton) {
                        productTitle.innerText = product.title;
                        this.addPhotos(product, grandPhoto, slides);
                        this.addInfo(product, productInfo);
                        price.innerText = product.price.toString();

                        fragment.append(productClone);
                    }
                }
                this.container.innerHTML = '';
                this.container.appendChild(fragment);
            }
        }
    }

    private addPhotos(dataItem: Data, grandProtoElem: HTMLImageElement, parentElem: HTMLElement) {
        const data = dataItem.images;
        grandProtoElem.src = data[0];
        data.forEach((url) => {
            const img = document.createElement('img');
            img.alt = 'slide';
            img.src = url;
            img.addEventListener('click', () => {
                grandProtoElem.src = url;
            });
            parentElem.append(img);
        });
    }

    private addInfo(dataItem: Data, parentElem: HTMLElement) {
        for (const prop in ProductDetailsPage.ProductDatailsData) {
            const key = prop as ProductInfoForProductPage;
            const infoItem = document.createElement('div');
            infoItem.className = 'info__item';

            const title = document.createElement('h3');
            title.innerText = ProductDetailsPage.ProductDatailsData[key];
            infoItem.append(title);

            const text = document.createElement('p');
            text.innerText = dataItem[key].toString();
            infoItem.append(text);

            parentElem.append(infoItem);
        }
    }

    render() {
        this.createHTML(data);
        return this.container;
    }
}

export default ProductDetailsPage;
