import Page from '../../global/templates/page';
import Products from '../../global/components/products';

class MainPage extends Page {
    constructor(id: string) {
        super(id);
    }

    render() {
        const products = new Products('div', 'products');
        this.container.append(products.render());
        return this.container;
    }
}

export default MainPage;
