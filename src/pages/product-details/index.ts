import Page from '../../global/templates/page';
import { Data } from '../../global/types';
import data from '../../global/data/data';

class ProductDetailsPage extends Page {
    productId: number | undefined;

    static textObj = {
        mainTitle: '#productName',
    };

    constructor(id: string, productId: number | undefined) {
        super(id);
        this.productId = productId;
    }

    createHTML(data: Data[]) {
        if (this.productId) {
            console.log('createHTML');
            const div = document.createElement('div');
            const index = this.productId - 1;
            div.innerText = `${data[index].title}`;
            this.container.append(div);
        }
    }

    render() {
        this.createHTML(data);
        console.log('render');

        return this.container;
    }
}

export default ProductDetailsPage;
