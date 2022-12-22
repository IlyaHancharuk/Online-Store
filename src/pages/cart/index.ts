import Page from '../../global/templates/page';
import data from '../../global/data/data';
import { Data } from '../../global/types/index';
class CartPage extends Page {
    // static textObj = {
    //     mainTitle: 'Cart',
    // };

    // constructor(id: string) {
    //     super(id);
    // }

    // ? это алгоритм для заполнения данными карзины
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    // private fullfillCartData(): void {}

    // ? при нажатии на "добавить в корзину" на основной странице,
    // ? вызываем функцию добавления итема в корзину по его id
    // ? если data.id будут не по порядку, уникальные, то ищем алгоритмом
    private createProduct(itemId: number, outerContainer: HTMLElement): void {
        // ищем по id в списке товаров нужный
        // TODO переписать через array.find как-то можно, а пока product[0]
        const productArr = data.filter((dataItem) => dataItem.id == itemId);
        const product = productArr[0];

        // для найденого продукта делаем и заполняем html шаблон
        const cartProductItem = this.createElement('li', 'cart__product-item');
        const itemIndex = this.createElement('p', 'item__number');
        itemIndex.innerText = '2';
        cartProductItem.append(itemIndex);

        const itemPhotoOuter = this.createElement('p', 'item__photo-outer');
        cartProductItem.append(itemPhotoOuter);
        const itemPhotoInner = this.createElement('img', 'item__photo-inner');
        itemPhotoInner.setAttribute('src', `${product.thumbnail}`);
        itemPhotoOuter.append(itemPhotoInner);

        const itemInnerBody = this.createElement('div', 'item__inner-body');
        cartProductItem.append(itemInnerBody);

        const itemTitle = this.createElement('div', 'item__title');
        itemTitle.innerText = product.title;
        itemInnerBody.append(itemTitle);

        const itemDescr = this.createElement('div', 'item__descr');
        itemDescr.innerText = product.description;
        itemInnerBody.append(itemDescr);

        const itemRating = this.createElement('div', 'item__rating');
        itemRating.innerText = `Rating: ${product.rating}`;
        itemInnerBody.append(itemRating);

        const itemDiscount = this.createElement('div', 'item__discount');
        itemDiscount.innerText = `Discount: ${product.discountPercentage}`;
        itemInnerBody.append(itemDiscount);
        //
        const itemAmountBody = this.createElement('div', 'item__amount-body');
        const itemAmoutMinus = this.createElement('input', 'item__amount-minus');
        itemAmoutMinus.setAttribute('type', 'button');
        itemAmoutMinus.setAttribute('value', '-');
        itemAmountBody.append(itemAmoutMinus);

        const itemCurrentAmout = this.createElement('input', 'item__current-amount');
        itemCurrentAmout.setAttribute('type', 'number');
        itemCurrentAmout.setAttribute('value', '1');

        const itemAmoutPlus = this.createElement('input', 'item__amount-plus');
        itemAmoutPlus.setAttribute('type', 'button');
        itemAmoutPlus.setAttribute('value', '+');

        const itemInStock = this.createElement('p', 'item__in-stock');
        itemInStock.innerText = `Stock: ${product.stock}`;
        // itemAmountBody.append(itemDiscount);

        itemAmountBody.append(itemCurrentAmout);
        itemAmountBody.append(itemAmoutPlus);
        itemAmountBody.append(itemInStock);

        cartProductItem.append(itemAmountBody);

        outerContainer.append(cartProductItem);
    }

    private createCartBodyHTML(): void {
        // погоди, ты порикручивал к this.
        // я у Page создал метод. И им создаю.
        const cartMain = this.createElement('div', 'cart');
        this.container.append(cartMain);

        // заглушка на выбор пустой/полной корзины
        const cartStatus: number | string | null = prompt(
            `Состояние корзины: 
                1 - с товаром
                0 | esc c клавиатуры - пустая`,
            '1'
        );
        // ? если корзина пуста, то выводим сообщение, что нет ничего
        // ? иначе, создаем структуру и заполняем
        if (!cartStatus || cartStatus === '0' || cartStatus === null) {
            const emptyCartPageText = this.createElement('p', 'cart__empty-text');
            emptyCartPageText.innerText = 'The cart is empty yet ¯\\_( ◡ ₒ ◡ )_/¯';
            cartMain.append(emptyCartPageText);
        } else {
            const fullCartPageBody = this.createElement('div', 'cart__body');
            cartMain.append(fullCartPageBody);

            const cartList = this.createElement('ul', 'cart__list');
            fullCartPageBody.append(cartList);

            // TODO элементы списка (товары корзины) создать и вставить алгоритмом
            // пока что добавим 2 элемента
            this.createProduct(2, cartList);
            this.createProduct(1, cartList);

            // test button to add product via ID
            {
                const testButton = this.createElement('input', 'test-button');
                testButton.setAttribute('type', 'button');
                testButton.setAttribute('value', 'Add to cart');
                fullCartPageBody.append(testButton);
                testButton.addEventListener('click', () => {
                    const id = prompt('input id to add', '1');
                    data.forEach((item) => {
                        if (item.id === Number(id)) {
                            this.createProduct(Number(id), cartList);
                            return;
                        }
                    });
                });
            }
        }
    }

    render() {
        // const title = this.createTitle(CartPage.textObj.mainTitle);
        // this.container.append(title);
        this.createCartBodyHTML();
        return this.container;
    }
}

export default CartPage;
