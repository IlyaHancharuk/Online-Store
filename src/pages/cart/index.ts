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
        // const cartStatus: number | string | null = prompt(
        //     `Состояние корзины:
        //         1 - с товаром
        //         0 | esc c клавиатуры - пустая`,
        //     '1'
        // );
        // ? если корзина пуста, то выводим сообщение, что нет ничего
        // ? иначе, создаем структуру и заполняем
        const cartLeftBody = this.createElement('section', 'cart__left-body');
        cartMain.append(cartLeftBody);

        const cartLeftHeader = this.createElement('h2', 'cart__left-header');
        cartLeftHeader.textContent = 'Shopping cart';
        cartLeftBody.append(cartLeftHeader);

        const cartList = this.createElement('ul', 'cart__list');
        cartLeftBody.append(cartList);

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
                        this.addItemViaTemplate(Number(id), 1);
                        return;
                    }
                });
            });
        }
        // }
    }

    private sayCartIsEmpty(): void {
        const emptyCartPageText = this.createElement('p', 'cart__empty-text');
        emptyCartPageText.innerText = 'The cart is empty yet ¯\\_( ◡ ₒ ◡ )_/¯';
        this.container.append(emptyCartPageText);
        return;
    }

    private addItemViaTemplate(itemId: number, itemAmount: number): void {
        // find item via itemId
        const productArr = data.filter((dataItem) => dataItem.id == itemId);
        const product = productArr[0];

        const fragment = document.createDocumentFragment();
        const cartTemplate: HTMLTemplateElement | null = document.querySelector('#cartBodyTemplate');
        const cartClone: HTMLElement | null = <HTMLElement>cartTemplate?.content.cloneNode(true);

        const itemNum = cartClone.querySelector('.item__number');
        const itemPhoto = cartClone.querySelector('.item__photo-inner');
        const itemTitle = cartClone.querySelector('.item__title');
        const itemDescr = cartClone.querySelector('.item__descr');
        const itemRating = cartClone.querySelector('.item__rating');
        const itemDiscount = cartClone.querySelector('.item__discount');
        const itemStock = cartClone.querySelector('.item__in-stock');
        const itemHowMany: HTMLInputElement | null = cartClone.querySelector('.item__current-amount');

        if (itemNum && itemPhoto && itemTitle && itemDescr && itemRating && itemDiscount && itemStock && itemHowMany) {
            itemNum.textContent = '2';
            itemPhoto.setAttribute('src', `${product.thumbnail}`);
            itemTitle.textContent = product.title;
            itemDescr.textContent = product.description;
            itemRating.textContent = `Rating: ${product.rating}`;
            itemDiscount.textContent = `Discount: ${product.discountPercentage}%`;
            itemStock.textContent = `Stock: ${product.stock}`;
            itemHowMany.value = `${itemAmount}`;
        }
        // todo количество. Добавь парсинг по количеству. А то добавлять будет по 1 штуке, вместе item.amount
        // cartClone.querySelector('.item__current-amount')!.value = itemAmount;

        fragment.append(cartClone);
        const main: HTMLElement | null = document.getElementById('cart-page');
        // ! почем ты не видишь то, что я создал уже??
        console.log(main, 'main???');
        if (main) {
            const cartList: HTMLElement | null = main.querySelector('.cart__list');
            console.log(cartList, 'wat?');
            if (cartList) {
                cartList.append(fragment);
            }
        }

        /*  if (parentNode) {
             parentNode.append(fragment);
         } else {
             // this.container.innerHTML = '';
             this.container.appendChild(fragment);
         } */
        // this.container.appendChild(fragment);
    }

    // ? тащим метод класса из другого класса. хохох
    private cartInf: cartInfo = new cartInfo(1, 1);
    addToCart(newItemId: string, newItemAmount: string): void {
        this.cartInf.addToCart(newItemId, newItemAmount);
    }

    // пока не понял, почему я прописал 2 товара внизу, а идет только второй
    // ! можно положить приложение, если вбить this.addToCart('1111', '6');
    private addItemsfromLocalStorage(): void {
        if (!localStorage['RS-store-data']) {
            this.sayCartIsEmpty();
            return;
        } else {
            const localData = JSON.parse(localStorage['RS-store-data']);
            localData.forEach((el: localStorageData) => {
                console.log(localData, 'dada');
                console.log(+el.id);
                this.addItemViaTemplate(+el.id, +el.amount);
            });
            return;
        }
    }

    render() {
        this.createCartBodyHTML();
        this.addToCart('1', '2');
        // и еще раз это же действие. проверяй localStorage;
        this.addToCart('11', '1');
        // this.addToCart('12', '4');
        this.addItemsfromLocalStorage();
        return this.container;
    }
}
export default CartPage;
