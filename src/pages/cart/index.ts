import Page from '../../global/templates/page';

class CartPage extends Page {
    static textObj = {
        mainTitle: 'Cart',
    };

    constructor(id: string) {
        super(id);
    }

    render() {
        const title = this.createTitle(CartPage.textObj.mainTitle);
        this.container.append(title);
        return this.container;
    }
}

export default CartPage;
