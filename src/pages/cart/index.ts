import Page from '../../global/templates/page';
import data from '../../global/data/data';
import { localStorageData } from '../../global/types/index';
import { Data } from '../../global/types/index';
import cartInfo from '../../global/components/cartInfo';

class CartPage extends Page {
    constructor(id: string) {
        super(id);
    }

    private findViaId(itemId: number): Data {
        return <Data>(<unknown>data.filter((el) => el.id === itemId)[0]);
    }

    public getTotalSum(): number {
        const localData: localStorageData[] = JSON.parse(localStorage['RS-store-data']);
        return localData.reduce((acc, el) => {
            return acc + +this.findViaId(+el.id).price * +el.amount;
        }, 0);
    }

    public refreshHeaderTotal(currentTotal = '0,00'): void {
        const navTotalSumm = document.querySelector('.header__total');
        if (navTotalSumm) {
            navTotalSumm.textContent = `Cart total: €${currentTotal}`;
        }
    }
    private createCartBodyHTML(): void {
        // header
        if (document.querySelector('.header__total')) {
            document.querySelector('.header__total')?.remove();
        }
        const navTotalSumm = document.createElement('div');
        navTotalSumm.className = 'header__total';
        navTotalSumm.textContent = `Cart total: €`;
        const header = document.querySelector('.nav__body');
        header?.append(navTotalSumm);

        const cartMain = this.createElement('div', 'cart');
        this.container.append(cartMain);

        const cartLeftBody = this.createElement('section', 'cart__left-body');
        cartMain.append(cartLeftBody);

        const cartLeftHeader = this.createElement('h2', 'cart__left-header');
        cartLeftHeader.textContent = 'Shopping cart';
        cartLeftBody.append(cartLeftHeader);

        const cartList = this.createElement('ol', 'cart__list');
        cartLeftBody.append(cartList);

        // pages block
        if (document.querySelector('.cart__pages')) {
            document.querySelector('.cart__pages')?.remove();
        }
        const pagesCounterBody = this.createElement('div', 'cart__pages');
        const pagesPages = this.createElement('div', 'cart__pages-pages');
        pagesPages.textContent = 'Page';
        const pagesLeftArrow = this.createElement('input', 'cart__pages-left');
        pagesLeftArrow.setAttribute('type', 'button');
        pagesLeftArrow.classList.add('crt-btn');
        const pagesCirrentPage = this.createElement('span', 'cart__current-page');
        pagesCirrentPage.textContent = '1';
        const pagesdevider = this.createElement('span', 'cart__devider');
        pagesdevider.textContent = '/';
        const pagesMaxPage = this.createElement('span', 'cart__max-page');
        pagesMaxPage.textContent = '1';
        const pagesRightArrow = this.createElement('input', 'cart__pages-right');
        pagesRightArrow.setAttribute('type', 'button');
        pagesRightArrow.classList.add('crt-btn');
        pagesCounterBody.append(pagesPages);
        pagesCounterBody.append(pagesLeftArrow);
        pagesCounterBody.append(pagesCirrentPage);
        pagesCounterBody.append(pagesdevider);
        pagesCounterBody.append(pagesMaxPage);
        pagesCounterBody.append(pagesRightArrow);
        cartLeftBody.append(pagesCounterBody);
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
                        this.addToCart(`${Number(id)}`, '1');
                        this.addItemsfromLocalStorage();
                        return;
                    }
                });
            });
        }
        return;
    }

    private refreshCartSummary(): void {
        if (!localStorage['RS-store-data']) {
            return;
        }
        const localData: localStorageData[] = JSON.parse(localStorage['RS-store-data']);

        //
        const totalProductsAmount = localData.reduce((acc, el) => {
            return acc + +el.amount;
        }, 0);

        const fragment = document.createDocumentFragment();
        const cartSumTemplate: HTMLTemplateElement | null = document.querySelector('#cartSummaryTemplate');
        const cartSumClone: HTMLElement | null = <HTMLElement>cartSumTemplate?.content.cloneNode(true);

        //

        const cartAmount = cartSumClone.querySelector('.cart__products-amount');
        const cartTotalSum = cartSumClone.querySelector('.cart__total-sum');
        const cartPromo = cartSumClone.querySelector('.cart__promo-field');
        const cartCheckout = cartSumClone.querySelector('.cart__checkout');
        const carttotal = this.container.querySelector('.header__total');
        if (cartAmount && cartTotalSum && cartPromo && cartCheckout) {
            cartAmount.textContent = `Items: ${totalProductsAmount}`;
            cartTotalSum.textContent = `Total: €${this.getTotalSum()}`;
        }
        if (carttotal) {
            carttotal.textContent = `Cart total: €${this.getTotalSum()}`;
        }

        fragment.append(cartSumClone);

        // remove old
        const oldSummary: HTMLElement | null = this.container.querySelector('.cart__total');
        oldSummary?.remove();

        // add new
        const cartSumBody: HTMLElement | null = this.container.querySelector('.cart');
        if (cartSumBody) {
            cartSumBody.append(fragment);
            this.container.append(cartSumBody);
        }
        //change header total
        this.refreshHeaderTotal(this.getTotalSum().toString());
    }

    private addItemViaTemplate(itemId: number, itemAmount: number): void {
        // find item via itemId
        let currentAmount = itemAmount;
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
        const itemPrice = cartClone.querySelector('.item__price');
        const itemStock = cartClone.querySelector('.item__in-stock');
        const itemPlus = cartClone.querySelector('.item__amount-plus');
        const itemMinus = cartClone.querySelector('.item__amount-minus');
        const itemHowMany: HTMLInputElement | null = cartClone.querySelector('.item__current-amount');

        if (
            itemNum &&
            itemPhoto &&
            itemTitle &&
            itemDescr &&
            itemRating &&
            itemDiscount &&
            itemPrice &&
            itemStock &&
            itemMinus &&
            itemHowMany &&
            itemPlus
        ) {
            // по стандарту один, а если есть localStorage, то ищем из localStorage.indexOf и тык
            itemNum.textContent = `1`;
            if (localStorage['RS-store-data']) {
                const LStrg = JSON.parse(localStorage['RS-store-data']);
                const blabla = LStrg.filter((el: localStorageData) => +el.id === itemId)[0];
                const itemListIndex = LStrg.indexOf(blabla);
                itemNum.textContent = `${itemListIndex + 1}`;
            }
            itemPhoto.setAttribute('src', `${product.thumbnail}`);
            itemTitle.textContent = product.title;
            itemDescr.textContent = product.description;
            itemRating.textContent = `Rating: ${product.rating}`;
            itemDiscount.textContent = `Discount: ${product.discountPercentage}%`;
            itemPrice.textContent = `€${product.price}`;
            itemStock.textContent = `Stock: ${product.stock}`;
            itemHowMany.value = `${itemAmount}`;

            itemHowMany.max = `${product.stock}`;
            // акуенно интересная но сложно написанная мною ф-ция. Надо научиться делать проще
            itemHowMany.addEventListener('change', (): void => {
                console.log(itemHowMany.value);
                console.log(currentAmount, 'cur before');
                if (+itemHowMany.value === 0) {
                    itemHowMany.value = '1';
                }
                if (+itemHowMany.value > product.stock) {
                    this.decreaseFromCart(`${product.id}`, `${+currentAmount + -product.stock}`);
                    itemHowMany.value = `${product.stock}`;
                    currentAmount = product.stock;
                    return;
                }
                this.decreaseFromCart(`${product.id}`, `${+currentAmount + -itemHowMany.value}`);
                currentAmount = +itemHowMany.value;

                this.sayCartIsEmpty();
                this.refreshCartSummary();
            });
            // делаем кнопки + и - рабочими
            itemMinus.addEventListener('click', (): void => {
                if (+itemHowMany.value - 1 <= 0) {
                    itemNum.parentElement?.remove();
                }
                itemHowMany.value = `${+itemHowMany.value - 1}`;

                this.decreaseFromCart(`${product.id}`, '1');
                currentAmount = +itemHowMany.value;
                console.log(currentAmount, 'was -');
                // чекаем, последний ли элемент был.

                this.sayCartIsEmpty();
            });
            itemPlus.addEventListener('click', () => {
                if (+itemHowMany.value >= product.stock) {
                    itemHowMany.value = `${+itemHowMany.value}`;

                    this.decreaseFromCart(`${product.id}`, '0');

                    return;
                }
                // просто вызываем с минусом. Функция уменьшения почитает красиво
                itemHowMany.value = `${+itemHowMany.value + 1}`;
                this.decreaseFromCart(`${product.id}`, '-1');
                currentAmount = +itemHowMany.value;
                console.log(currentAmount, 'was +');
                return;
            });
        }

        fragment.append(cartClone);

        // добавляем фрагмент в список
        const cartList: HTMLElement | null = this.container.querySelector('.cart__list');
        cartList?.append(fragment);
    }

    // ! можно переписать под чуть красивее. Но кукуха пока не варит. Работает превосходно
    private sayCartIsEmpty(): void {
        if (localStorage['RS-store-data']) {
            const localData = JSON.parse(localStorage['RS-store-data']);
            if (localData.length === 0) {
                localStorage.clear();
                const emptyCartPageText = this.createElement('p', 'cart__empty-text');
                emptyCartPageText.innerText = 'The cart is empty yet ¯\\_( ◡ ₒ ◡ )_/¯';
                this.container.append(emptyCartPageText);
            }
        } else {
            const emptyCartPageText = this.createElement('p', 'cart__empty-text');
            emptyCartPageText.innerText = 'The cart is empty yet ¯\\_( ◡ ₒ ◡ )_/¯';
            this.container.append(emptyCartPageText);
            return;
        }
    }
    private removeSayCartIsEmpty(): void {
        const message = this.container.querySelector('.cart__empty-text');
        if (message) {
            message.remove();
        }
        return;
    }

    // ? тащим метод класса из другого класса. хохох
    private cartInf: cartInfo = new cartInfo(1, 1);
    // метод добавляет элемент по айди, и колво = 1
    addToCart(newItemId: string, newItemAmount: string): void {
        // if no such ItemId in database:
        const productArr = data.filter((dataItem) => dataItem.id == +newItemId)[0];
        if (!productArr) {
            console.log(`no item with id ${newItemId}`);
            alert(`no item with id ${newItemId}`);
            return;
        }
        this.removeSayCartIsEmpty();
        this.cartInf.addToCart(newItemId, newItemAmount);
        this.refreshCartSummary();
        return;
    }

    decreaseFromCart(itemId: string, howMuchToReduce = '1'): string {
        this.cartInf.reduceItemAmount(itemId, howMuchToReduce);
        this.refreshCartSummary();
        return '1';
    }

    private addItemsfromLocalStorage(): void {
        // clear list and renew it;
        this.refreshCartSummary();
        const cartList: HTMLElement | null = this.container.querySelector('.cart__list');
        if (cartList) {
            cartList.innerHTML = '';
        }

        if (!localStorage['RS-store-data']) {
            this.sayCartIsEmpty();
            return;
        } else {
            const localData = JSON.parse(localStorage['RS-store-data']);
            localData.forEach((el: localStorageData) => {
                this.addItemViaTemplate(+el.id, +el.amount);
            });
            return;
        }
    }

    render() {
        this.createCartBodyHTML();
        // !Чисти localStorage чтобы при обновах старого не висело

        // добавить по стандарту 24 предмета
        // удалить 1 (без 2 аргумента по стандарту)
        // удалить 20 из них

        /*  this.addToCart('3', '24');
         this.decreaseFromCart('3');
         this.decreaseFromCart('3', '20'); */

        this.addItemsfromLocalStorage();
        return this.container;
    }
}
export default CartPage;
