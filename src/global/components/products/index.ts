import Component from '../../templates/component';
import * as types from '../../types';
import data from '../../data/data';

class Products extends Component {
    constructor(tagName: string, className: string) {
        super(tagName, className);
    }

    private createHTML(data: types.Data[]) {
        data.forEach((item) => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item';
            productItem.style.backgroundImage = `url(${item.thumbnail})`;

            const itemTitle = document.createElement('h3');
            itemTitle.className = 'item-title';
            itemTitle.innerText = item.title;
            productItem.append(itemTitle);

            const itemInfo = document.createElement('div');
            itemInfo.className = 'item-info';

            const itemCategory = this.createInfo(item, 'category');
            itemInfo.append(itemCategory);

            const itemBrand = this.createInfo(item, 'brand');
            itemInfo.append(itemBrand);

            const itemPrice = this.createInfo(item, 'price');
            itemInfo.append(itemPrice);

            const itemDiscount = this.createInfo(item, 'discountPercentage');
            itemInfo.append(itemDiscount);

            const itemRating = this.createInfo(item, 'rating');
            itemInfo.append(itemRating);

            const itemStockQuantity = this.createInfo(item, 'stock');
            itemInfo.append(itemStockQuantity);
            productItem.append(itemInfo);

            const itemButtons = document.createElement('div');
            itemButtons.className = 'item-buttons';

            const dropButton = document.createElement('div');
            dropButton.className = 'drop-button';
            dropButton.innerText = 'DROP';
            itemButtons.append(dropButton);

            const detailsButton = document.createElement('div');
            detailsButton.className = 'details-button';
            detailsButton.innerText = 'DATAILS';
            itemButtons.append(detailsButton);
            productItem.append(itemButtons);
            this.container.append(productItem);
            console.log(this);
        });
    }

    private createInfo(item: types.Data, descriptionsTitle: types.ProductInfo) {
        const itemCategory = document.createElement('p');
        const title = descriptionsTitle === 'discountPercentage' ? 'discount' : descriptionsTitle;
        itemCategory.innerText = `${title}: ${item[descriptionsTitle]}`;
        return itemCategory;
    }

    render(): HTMLElement {
        this.createHTML(data);
        return this.container;
    }
}

export default Products;
