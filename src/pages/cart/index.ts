import Page from '../../global/templates/page';
import data from '../../global/data/data';
import { Data } from '../../global/types/index';
class CartPage extends Page {
    // !
    // !
    // !    это все херня. Нужно парсить из localStorage инфу и работать с ней.
    // !    Начиная с главной страницы
    // !
    // static textObj = {
    //     mainTitle: 'Cart',
    // };

    // constructor(id: string) {
    //     super(id);
    // }

    // ? при нажатии на "добавить в корзину" на основной странице,
    // !надо добавлять в localStorage инфу. А после с нее парсить
    // или добавлять ID товара и количесво? в localStorage.
    // а при загрузке корзнины парсить с локалстоража инфу

    private createCartBodyHTML(): void {
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
            this.addItemViaTemplate(2, cartList);
            this.addItemViaTemplate(1, cartList);

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
                            // this.createProduct(Number(id), cartList);
                            this.addItemViaTemplate(Number(id), cartList);
                            return;
                        }
                    });
                });
            }
        }
    }

    private addItemViaTemplate(itemId: number, parentNode?: HTMLElement): void {
        // find item via itemId
        const productArr = data.filter((dataItem) => dataItem.id == itemId);
        const product = productArr[0];

        let cartList: HTMLElement | undefined;
        if (!cartList) {
            cartList = this.createElement('ul', 'cart__list');
        }

        const fragment = document.createDocumentFragment();
        const cartTemplate: HTMLTemplateElement | null = document.querySelector('#cartListtItem');
        const productClone: HTMLElement | null = <HTMLElement>cartTemplate?.content.cloneNode(true);
        // !ебучий ts недоверчивый. то object is probably null, то еще чего. Заебался я переписывать элегантные решения, прибегая к некрасивым проверкам. Козел ТС
        // !The left-hand side of an assignment expression may not be an optional property access. --- сука
        productClone!.querySelector('.item__number')!.textContent = '2';
        productClone?.querySelector('.item__photo-inner')?.setAttribute('src', `${product.thumbnail}`);
        productClone!.querySelector('.item__title')!.textContent = product.title;
        // встал вопрос! следующая строка работает без косых квычек. Строка за ней - нет! ПАЧИМУ?
        productClone!.querySelector('.item__descr')!.textContent = product.description;
        productClone!.querySelector('.item__rating')!.textContent = `Rating: ${product.rating}`;
        productClone!.querySelector('.item__discount')!.textContent = `Discount: ${product.discountPercentage}%`;
        productClone!.querySelector('.item__in-stock')!.textContent = `Stock: ${product.stock}`;

        fragment.append(productClone);

        if (parentNode) {
            parentNode.append(fragment);
        } else {
            this.container.innerHTML = '';
            this.container.appendChild(fragment);
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
