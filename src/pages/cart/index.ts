import Page from '../../global/templates/page';
import data from '../../global/data/data';
import { localStorageData } from '../../global/types/index';
import cartInfo from '../../global/components/cartInfo';

const localStorageCartData: localStorageData[] = [];
class CartPage extends Page {
    constructor(id: string) {
        super(id);
    }

    // ? при нажатии на "добавить в корзину" на основной странице,
    // !надо добавлять в localStorage инфу. А после с нее парсить
    // или добавлять ID товара и количесво? в localStorage.
    // а при загрузке корзнины парсить с localStorage инфу

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
            const cartLeftBody = this.createElement('section', 'cart__left-body');
            cartMain.append(cartLeftBody);

            const cartLeftHeader = this.createElement('h2', 'cart__left-header');
            cartLeftHeader.textContent = 'Shopping cart';
            cartLeftBody.append(cartLeftHeader);

            const cartList = this.createElement('ul', 'cart__list');
            cartLeftBody.append(cartList);

            // TODO элементы списка (товары корзины) создать и вставить алгоритмом
            // пока что добавим 2 элемента
            this.addItemViaTemplate(2, cartList);
            this.addItemViaTemplate(1, cartList);

            // test button to add product via ID
            {
                const testButton = this.createElement('input', 'test-button');
                testButton.setAttribute('type', 'button');
                testButton.setAttribute('value', 'Add to cart');
                cartMain.append(testButton);
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

    private addItemViaTemplate(itemId: number, parentNode?: HTMLElement, itemAmount?: number): void {
        // find item via itemId
        const productArr = data.filter((dataItem) => dataItem.id == itemId);
        const product = productArr[0];

        const fragment = document.createDocumentFragment();
        const cartTemplate: HTMLTemplateElement | null = document.querySelector('#cartBodyTemplate');
        const cartClone: HTMLElement | null = <HTMLElement>cartTemplate?.content.cloneNode(true);

        cartClone.querySelector('.item__number')!.textContent = '2';
        cartClone.querySelector('.item__photo-inner')?.setAttribute('src', `${product.thumbnail}`);
        cartClone.querySelector('.item__title')!.textContent = product.title;
        cartClone.querySelector('.item__descr')!.textContent = product.description;
        cartClone.querySelector('.item__rating')!.textContent = `Rating: ${product.rating}`;
        cartClone.querySelector('.item__discount')!.textContent = `Discount: ${product.discountPercentage}%`;
        cartClone.querySelector('.item__in-stock')!.textContent = `Stock: ${product.stock}`;
        // todo количество. Добавь парсинг по количеству. А то добавлять будет по 1 штуке, вместе item.amount
        // cartClone.querySelector('.item__current-amount')!.value = itemAmount;

        fragment.append(cartClone);

        if (parentNode) {
            parentNode.append(fragment);
        } else {
            this.container.innerHTML = '';
            this.container.appendChild(fragment);
        }
    }

    // ? тащим метод класса из другого класса. хохох
    private cartInf: cartInfo = new cartInfo(2, 3);
    addToCart(newItemId: string, newItemAmount: string): void {
        this.cartInf.addToCart(newItemId, newItemAmount);
    }

    // пока не понял, почему я прописал 2 товара внизу, а идет только второй
    // ! можно положить приложение, если вбить this.addToCart('1111', '6');
    // мб нид убрать как-то parendnode в параметрах метода addItemViaTemplate
    private addItemsfromLocalStorage(): void {
        const localData = JSON.parse(localStorage['RS-store-data']);
        localData.forEach((el: localStorageData) => {
            console.log(localData, 'dada');
            this.addItemViaTemplate(+el.id);
        });
        return;
    }

    render() {
        // добавляем в корзину товар с id 1 в кол-ве 6 шт
        this.addToCart('1', '6');
        // и еще раз это же действие. проверяй localStorage;
        this.addToCart('11', '6');

        this.createCartBodyHTML();
        this.addItemsfromLocalStorage();
        return this.container;
    }
}
export default CartPage;
