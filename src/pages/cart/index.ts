import Page from '../../global/templates/page';
import data from '../../global/data/data';
import { localStorageData } from '../../global/types/index';
import { Data } from '../../global/types/index';
import cartInfo from '../../global/components/cartInfo';
import Main from '../../global/components/main';
import App from '../app';

class CartPage extends Page {
    constructor(id: string) {
        super(id);
    }

    // ? тащим метод класса из другого класса. хохох
    private cartInf: cartInfo = new cartInfo(1, 1);

    static findViaId(itemId: number): Data {
        return <Data>(<unknown>data.filter((el) => el.id === itemId)[0]);
    }

    static getTotalSum(): number {
        if (!localStorage['RS-store-data']) return 0;
        const localData: localStorageData[] = JSON.parse(localStorage['RS-store-data']);
        return localData.reduce((acc, el) => {
            return acc + +CartPage.findViaId(+el.id).price * +el.amount;
        }, 0);
    }

    public refreshHeaderTotal(currentTotal = '0,00'): void {
        const navTotalSumm = document.querySelector('.header__total');
        if (navTotalSumm) {
            navTotalSumm.textContent = `Cart total: €${currentTotal}`;
        }
    }
    private cleanCart(): void {
        const localData: localStorageData[] = JSON.parse(localStorage['RS-store-data']);
        localData.map((el) => {
            if (el.id) {
                console.log(el, 'очищен');
                this.decreaseFromCart(`${el.id}`, `${el.amount}`);
            }
        });
    }
    private createCartBodyHTML(): void {
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

        // popup adding
        const fragment2 = document.createDocumentFragment();
        const popupTemplate: HTMLTemplateElement | null = document.querySelector('#cartPopup');
        const popupClone: HTMLElement | null = <HTMLElement>popupTemplate?.content.cloneNode(true);

        const popupBody: HTMLInputElement | null = popupClone.querySelector('.cart-pup__body');
        const popupRedirect: HTMLInputElement | null = popupClone.querySelector('.cart-pup__redirect');
        const popupCross: HTMLInputElement | null = popupClone.querySelector('.cart-pup__closeBTN');
        const popupPhoneNum: HTMLInputElement | null = popupClone.querySelector('.cart-pup__phone-num');
        const popupEmail: HTMLInputElement | null = popupClone.querySelector('.cart-pup__email');
        const cardNumber: HTMLInputElement | null = popupClone.querySelector('.card__number');
        const cardData: HTMLInputElement | null = popupClone.querySelector('.card__data');
        const cardCvv: HTMLInputElement | null = popupClone.querySelector('.card__cvv');
        const cardLogo: HTMLInputElement | null = popupClone.querySelector('.card__logo');
        const popupButton: HTMLInputElement | null = popupClone.querySelector('.cart-pup__button');

        const digg = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
        if (
            popupBody &&
            cardNumber &&
            cardData &&
            cardCvv &&
            cardLogo &&
            popupCross &&
            popupButton &&
            popupPhoneNum &&
            popupEmail &&
            popupRedirect
        ) {
            popupCross.addEventListener('click', () => {
                CartPage.closePopup();
            });
            cardNumber.addEventListener('input', () => {
                if (!digg.includes(+cardNumber.value[cardNumber.value.length - 1])) {
                    cardNumber.value = cardNumber.value.slice(0, cardNumber.value.length - 1);
                }
                if (cardNumber.value.length > 16) {
                    cardNumber.value = cardNumber.value.slice(0, 16);
                }

                if (cardNumber.value[0] === '3') {
                    cardLogo.className = 'card__logo  amex-card';
                } else if (cardNumber.value[0] === '4') {
                    cardLogo.className = 'card__logo  visa-card';
                } else if (cardNumber.value[0] === '5') {
                    cardLogo.className = 'card__logo  ms-card';
                } else {
                    cardLogo.className = 'card__logo';
                }
            });

            cardData.addEventListener('input', () => {
                if (!digg.includes(+cardData.value[cardData.value.length - 1])) {
                    cardData.value = cardData.value.slice(0, cardData.value.length - 1);
                    // console.log(cardData.value.slice(0, cardData.value.length));
                }
                if (cardData.value.length > 5) {
                    cardData.value = cardData.value.slice(0, 5);
                }
                if (cardData.value.length >= 2) {
                    const data = [...cardData.value].filter((el) => digg.includes(+el));
                    const head = data.slice(0, 2);
                    const tail = data.slice(2, 4);
                    if (+head[0] > 1) {
                        head[0] = '1';
                    }
                    if (head[0] == '1' && +head[1] > 2) {
                        head[1] = '2';
                    }
                    const center = ['/'];
                    const all = head.concat(center, tail);
                    cardData.value = all.join('');
                    if (data.length === 1) {
                        cardData.value = data.join('');
                    }
                }
            });

            cardCvv.addEventListener('input', () => {
                if (!digg.includes(+cardCvv.value[cardCvv.value.length - 1])) {
                    cardCvv.value = cardCvv.value.slice(0, cardCvv.value.length - 1);
                }
                if (cardCvv.value.length > 3) {
                    cardCvv.value = cardCvv.value.slice(0, 3);
                }
            });
            popupButton.addEventListener('click', () => {
                console.log(cardNumber.checkValidity());
                console.log(cardData.checkValidity());
                console.log(cardCvv.checkValidity());
                if (
                    cardNumber.checkValidity() &&
                    cardData.checkValidity() &&
                    cardCvv.checkValidity() &&
                    popupPhoneNum.checkValidity() &&
                    popupEmail.checkValidity()
                ) {
                    popupRedirect.classList.remove('hidden');
                    setTimeout(() => {
                        this.cleanCart();
                        window.location.hash = 'main-page';
                        CartPage.closePopup();
                        popupRedirect.classList.add('hidden');
                    }, 3000);
                }
            });
        }

        fragment2.append(popupClone);
        const boddy = document.body;
        boddy?.append(fragment2);

        return;
    }
    // проще было оставить нолик висеть. Но это некрасиво! Вызывай эту ф-цию при клике по кнопке добавить в корзину!
    static refreshCartIcontotal(): string {
        const cartIconTotal = document.querySelector('.header__total-amount');
        if (cartIconTotal) {
            if (+CartPage.getTotalItems() === 0) {
                cartIconTotal.textContent = ``;
                return '';
            } else {
                cartIconTotal.textContent = `${CartPage.getTotalItems()}`;
            }
        }
        if (+CartPage.getTotalItems() === 0) {
            return '';
        }
        return CartPage.getTotalItems();
    }

    static closePopup(): void {
        const popupBody = document.querySelector('.cart-pup__outer');
        popupBody?.classList.add('closed');
    }
    static openPopup(): void {
        const popupBody = document.querySelector('.cart-pup__outer');
        popupBody?.classList.remove('closed');
    }
    static getTotalItems(): string {
        if (!localStorage['RS-store-data']) return '';

        const localData: localStorageData[] = JSON.parse(localStorage['RS-store-data']);

        const totalProductsAmount = localData.reduce((acc, el) => {
            return acc + +el.amount;
        }, 0);
        return totalProductsAmount.toString();
    }
    private refreshCartSummary(): void {
        const fragment = document.createDocumentFragment();
        const cartSumTemplate: HTMLTemplateElement | null = document.querySelector('#cartSummaryTemplate');
        const cartSumClone: HTMLElement | null = <HTMLElement>cartSumTemplate?.content.cloneNode(true);

        const cartAmount = cartSumClone.querySelector('.cart__products-amount');
        const cartOuter = document.querySelector('.cart-pup__outer');
        const cartTotalSum = cartSumClone.querySelector('.cart__total-sum');
        const cartPromo = cartSumClone.querySelector('.cart__promo-field');
        const cartCheckout = cartSumClone.querySelector('.cart__checkout');
        const carttotal = this.container.querySelector('.header__total');
        if (cartAmount && cartTotalSum && cartPromo && cartCheckout) {
            cartAmount.textContent = `Items: ${CartPage.getTotalItems()}`;
            cartTotalSum.textContent = `Total: €${CartPage.getTotalSum()}`;

            cartCheckout.addEventListener('click', () => {
                CartPage.openPopup();
            });
        }
        if (carttotal) {
            carttotal.textContent = `Cart total: €${CartPage.getTotalSum()}`;
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
        this.refreshHeaderTotal(CartPage.getTotalSum().toString());

        // add total to cart icon (header)
        CartPage.refreshCartIcontotal();
        // close when click out of the popup
        cartOuter?.addEventListener('mouseup', (event) => {
            console.log('clicj');
            const target = event.target as HTMLElement;
            if (event.target as Element) {
                const lal = target.closest('.cart-pup__body');
                if (!lal) {
                    CartPage.closePopup();
                }
            }
        });

        const pages: HTMLElement | null = this.container.querySelector('.cart__pages');
        pages?.classList.remove('closed');
    }
    public openCartPopup(): void {
        console.log('');
        return;
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
                const oldSummary: HTMLElement | null = this.container.querySelector('.cart__total');
                oldSummary?.remove();
                const pages: HTMLElement | null = this.container.querySelector('.cart__pages');
                pages?.classList.add('closed');
                const cartLeftHeader = this.container.querySelector('.cart__left-header');
                cartLeftHeader?.remove();
            }
        } else {
            const emptyCartPageText = this.createElement('p', 'cart__empty-text');
            emptyCartPageText.innerText = 'The cart is empty yet ¯\\_( ◡ ₒ ◡ )_/¯';
            this.container.append(emptyCartPageText);
            const oldSummary: HTMLElement | null = this.container.querySelector('.cart__total');
            oldSummary?.remove();
            const pages: HTMLElement | null = this.container.querySelector('.cart__pages');
            pages?.classList.add('closed');
            const cartLeftHeader = this.container.querySelector('.cart__left-header');
            cartLeftHeader?.remove();

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
