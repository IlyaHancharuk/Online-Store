import Page from '../../global/templates/page';

class ProductDetailsPage extends Page {
    static textObj = {
        mainTitle: '#productName',
    };

    constructor(id: string) {
        super(id);
    }

    render() {
        const title = this.createTitle(ProductDetailsPage.textObj.mainTitle);
        this.container.append(title);
        return this.container;
    }
}

export default ProductDetailsPage;
