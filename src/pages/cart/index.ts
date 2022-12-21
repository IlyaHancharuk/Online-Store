import Page from '../../global/templates/page';
class CartPage extends Page {
    static textObj = {
        mainTitle: 'Cart',
    };

    constructor(id: string) {
        super(id);
    }

    // TODO это алгоритм для заполнения данными карзины
    // TODO fullfill the cart with information method
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private fullfillCartData(): void {}

    private createCartBodyHTML(): void {
        // погоди, ты порикручивал к this.
        // я у Page создал метод. И им создаю.
        const cartMain = this.createElement('div', 'cart');

        // const c1rtMain = document.createElement('div');

        // ? если корзина пуста, то выводим сообщение, что нет ничего
        // ? иначе, создаем структуру и заполняем
        // eslint-disable-next-line no-constant-condition, no-empty
        if (false) {
        } else {
            //
        }
    }

    render() {
        const title = this.createTitle(CartPage.textObj.mainTitle);
        this.container.append(title);
        return this.container;
    }
}

export default CartPage;
