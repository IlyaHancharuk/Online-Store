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
            const index = this.productId - 1;
            const product = data[index];

            const fragment = document.createDocumentFragment();
            const productDetailsTemp: HTMLTemplateElement | null = document.querySelector('#productDetailsTemp');

            if (productDetailsTemp) {
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
                        buyButton.addEventListener('click', () => {
                            window.location.hash = '#cart-page';
                        });

                        fragment.append(productClone);
                    }
                }
                this.container.innerHTML = '';
                this.createBreadcrumb(product);
                this.container.appendChild(fragment);
            }
        }
    }

    private addPhotos(dataItem: Data, grandProtoElem: HTMLImageElement, parentElem: HTMLElement) {
        const data = dataItem.images;
        grandProtoElem.src = data[0];

        const sizes: string[] = [];

        data.forEach((url) => {
            const img = document.createElement('img');

            const req = new XMLHttpRequest();
            req.open('GET', url, false);
            req.send();
            const imgSize = req.getResponseHeader('content-length');

            if (typeof imgSize === 'string' && !sizes.includes(imgSize)) {
                sizes.push(imgSize);

                img.alt = 'slide';
                img.src = url;
                img.addEventListener('click', () => (grandProtoElem.src = url));
                parentElem.append(img);
            }
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

    private createBreadcrumb(dataItem: Data) {
        const breadcrumb = document.createElement('div');
        breadcrumb.className = 'breadcrumb';

        const storeLink = document.createElement('a');
        storeLink.innerText = 'STORE';
        storeLink.href = '#main-page';
        breadcrumb.append(storeLink);

        breadcrumb.append('>>');
        const spanCategory = document.createElement('span');
        spanCategory.innerText = dataItem.category.toUpperCase();
        breadcrumb.append(spanCategory);

        breadcrumb.append('>>');
        const spanBrand = document.createElement('span');
        spanBrand.innerText = dataItem.brand.toUpperCase();
        breadcrumb.append(spanBrand);

        breadcrumb.append('>>');
        const spanTitle = document.createElement('span');
        spanTitle.innerText = dataItem.title;
        breadcrumb.append(spanTitle);

        this.container.append(breadcrumb);
    }

    render() {
        this.createHTML(data);
        this.container.className = 'product__container';
        return this.container;
    }
}

export default ProductDetailsPage;
