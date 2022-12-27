import Page from '../../global/templates/page';

class CartPage extends Page {
    constructor(id: string) {
        super(id);
    }

    render() {
        return this.container;
    }
}

export default CartPage;
