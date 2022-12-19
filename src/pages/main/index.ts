import Page from '../../global/templates/page';
import Products from '../../global/components/products';

class MainPage extends Page {
    static textObj = {
        mainTitle: 'Online Store',
    };

    constructor(id: string) {
        super(id);
    }

    render() {
        const title = this.createTitle(MainPage.textObj.mainTitle);
        this.container.append(title);
        const products = new Products('div', 'products');
        this.container.append(products.render());
        return this.container;
    }
}

export default MainPage;
