import Page from '../../global/templates/page';
import data from '../../global/data/data';
import { localStorageData } from '../../global/types/index';
import { IData } from '../../global/types/index';
import cartInfo from '../../global/components/cartInfo';

class CartPage extends Page {
    static container: HTMLElement;
    constructor(id: string) {
        super(id);
    }

    private cartInf: cartInfo = new cartInfo(1, 1);

    static findViaId(itemId: number): IData {
        return <IData>(<unknown>data.filter((el) => el.id === itemId)[0]);
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
                this.decreaseFromCart(`${el.id}`, `${el.amount}`);
            }
        });

        if (localStorage['RS-store-data']) {
            localStorage.removeItem('RS-store-data');
        }

        if (localStorage['RS-store-promo']) {
            localStorage.removeItem('RS-store-promo');
        }
    }
    private createCartBodyHTML(): void {
        const cartMain = this.createElement('div', 'cart');
        this.container.append(cartMain);

        const cartLeftBody = this.createElement('section', 'cart__left-body');
        cartMain.append(cartLeftBody);

        const cartLeftHeader = this.createElement('h2', 'cart__left-header');
        cartLeftBody.append(cartLeftHeader);

        const cartList = this.createElement('ol', 'cart__list');
        cartLeftBody.append(cartList);

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
        this.refreshCartSummary();
        this.refreshPromocodeInf();
        return;
    }
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
    private alertPromocodeState(messageType: string): void {
        const cartPromoField: HTMLInputElement | null = document.querySelector('.cart__promo-field');
        if (cartPromoField) {
            if (messageType === 'exist') {
                cartPromoField.value = 'Already activated :]';
                cartPromoField.style.color = 'green';
                setTimeout(() => {
                    cartPromoField.style.color = '';
                    cartPromoField.value = '';
                }, 1000);
                return;
            }
            if (messageType === 'wrong') {
                cartPromoField.value = 'Invalid code :C';
                cartPromoField.style.color = 'red';
                setTimeout(() => {
                    cartPromoField.style.color = '';
                    cartPromoField.value = '';
                }, 1000);
                return;
            }
            if (messageType === 'new') {
                cartPromoField.value = 'Yeah! Its good!';
                cartPromoField.style.color = 'pink';
                setTimeout(() => {
                    cartPromoField.style.color = '';
                    cartPromoField.value = '';
                }, 1000);
                return;
            }
        }
    }

    public refreshPromocodeInf(): void {
        if (!localStorage['RS-store-promo']) {
            return;
        }
        const promoDOMList: HTMLElement | null = this.container.querySelector('.cart__promo-list');
        const currentPromoList = JSON.parse(localStorage['RS-store-promo']);

        if (promoDOMList) {
            while (promoDOMList.childElementCount > 1) {
                promoDOMList?.lastElementChild?.remove();
            }
        }

        if (promoDOMList) {
            currentPromoList.map((el: string) => {
                const promoListItem = document.createElement('li');
                const promoListItemText = document.createElement('p');
                promoListItemText.classList.add('cart__promo-name');
                const promoListItemDiscount = document.createElement('span');
                promoListItemDiscount.classList.add('cart__promo-discount');
                promoListItemDiscount.textContent = '-10%';
                const promoListItemCross = document.createElement('span');
                promoListItemCross.classList.add('cart__promo-cross');
                promoListItemCross.textContent = 'x';
                promoListItem.append(promoListItemText);
                promoListItem.append(promoListItemDiscount);
                promoListItem.append(promoListItemCross);

                promoListItem.classList.add('cart__promo-code');
                promoListItemText.textContent = `${el}`;
                promoDOMList.append(promoListItem);

                promoListItemCross.addEventListener('click', () => {
                    this.removePromocode(el);
                });
                return;
            });
            if (currentPromoList.length !== 0) {
                const summaryPrice = this.container.querySelector('.cart__total-sum');
                summaryPrice?.classList.add('crossed');
                const summaryPricewithDiscount = this.container.querySelector('.cart__total-discount-sum');
                if (summaryPricewithDiscount) {
                    summaryPricewithDiscount.textContent = `Total: €${Math.ceil(
                        Math.ceil(CartPage.getTotalSum() * (1 - currentPromoList.length * 0.1))
                    )}`;
                }
            } else {
                const summaryPrice = this.container.querySelector('.cart__total-sum');
                summaryPrice?.classList.remove('crossed');
                const summaryPricewithDiscount = this.container.querySelector('.cart__total-discount-sum');
                if (summaryPricewithDiscount) {
                    summaryPricewithDiscount.textContent = ``;
                }
            }
        } else {
            console.log('не грузит, и почему?');
            return;
        }
    }

    private removePromocode(promocode: string): void {
        if (!localStorage['RS-store-promo'] || localStorage['RS-store-promo'] === '[]') {
            return;
        }
        const currentPromoList = JSON.parse(localStorage['RS-store-promo']);
        const newPromocodeList = currentPromoList.filter((el: string) => el !== promocode);
        localStorage['RS-store-promo'] = JSON.stringify(newPromocodeList);
        this.refreshPromocodeInf();
        return;
    }

    private checkPromocodeValidity(promocode: string): boolean {
        const promoList = ['RS2022', 'Hello Kovale.V!', 'admin'];
        const cartPromoField: HTMLInputElement | null = document.querySelector('.cart__promo-field');
        if (cartPromoField) {
            if (!localStorage['RS-store-promo'] && promoList.includes(promocode)) {
                const currentPromoList: string[] = [];
                currentPromoList.push(promocode);
                localStorage.setItem('RS-store-promo', JSON.stringify(currentPromoList));
                this.alertPromocodeState('new');
                this.refreshPromocodeInf();
                return true;
            } else if (localStorage['RS-store-promo']) {
                const currentPromoList = JSON.parse(localStorage['RS-store-promo']);

                if (currentPromoList.includes(promocode)) {
                    this.alertPromocodeState('exist');
                    return true;
                }

                if (promoList.includes(promocode) && !currentPromoList.includes(promocode)) {
                    currentPromoList.push(promocode);
                    localStorage.setItem('RS-store-promo', JSON.stringify(currentPromoList));
                    this.alertPromocodeState('new');
                    this.refreshPromocodeInf();
                    return true;
                }
            }
            if (!promoList.includes(promocode)) {
                this.alertPromocodeState('wrong');
                return false;
            }
            return true;
        }
        return false;
    }
    private refreshCartSummary(): void {
        const fragment = document.createDocumentFragment();
        const cartSumTemplate: HTMLTemplateElement | null = document.querySelector('#cartSummaryTemplate');
        const cartSumClone: HTMLElement | null = <HTMLElement>cartSumTemplate?.content.cloneNode(true);

        const cartAmount = cartSumClone.querySelector('.cart__products-amount');
        const cartOuter = document.querySelector('.cart-pup__outer');
        const cartTotalSum = cartSumClone.querySelector('.cart__total-sum');
        const cartPromoForm = cartSumClone.querySelector('.cart__promo-form');
        const cartPromoSubmit = cartSumClone.querySelector('.cart__promo-submit');
        const cartPromoField: HTMLInputElement | null = cartSumClone.querySelector('.cart__promo-field');
        const cartCheckout = cartSumClone.querySelector('.cart__checkout');
        const carttotal = this.container.querySelector('.header__total');
        if (cartAmount && cartTotalSum && cartPromoField && cartCheckout && cartPromoForm && cartPromoSubmit) {
            cartAmount.textContent = `Items: ${CartPage.getTotalItems()}`;
            cartTotalSum.textContent = `Total: €${CartPage.getTotalSum()}`;

            cartCheckout.addEventListener('click', () => {
                CartPage.openPopup();
            });

            cartPromoForm.addEventListener('submit', () => {
                this.refreshPromocodeInf();
                this.checkPromocodeValidity(cartPromoField.value);
                return false;
            });
        }
        if (carttotal) {
            carttotal.textContent = `Cart total: €${CartPage.getTotalSum()}`;
        }

        fragment.append(cartSumClone);

        const oldSummary: HTMLElement | null = this.container.querySelector('.cart__total');
        oldSummary?.remove();

        const cartSumBody: HTMLElement | null = this.container.querySelector('.cart');
        if (cartSumBody) {
            cartSumBody.append(fragment);
            this.container.append(cartSumBody);
        }
        this.refreshHeaderTotal(CartPage.getTotalSum().toString());

        CartPage.refreshCartIcontotal();
        cartOuter?.addEventListener('mousedown', (event) => {
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
        this.refreshPromocodeInf();
    }

    private addItemViaTemplate(itemId: number, itemAmount: number): void {
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
            itemHowMany.addEventListener('change', (): void => {
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
            itemMinus.addEventListener('click', (): void => {
                itemHowMany.value = `${+itemHowMany.value - 1}`;
                this.decreaseFromCart(`${product.id}`, '1');
                currentAmount = +itemHowMany.value;
                this.sayCartIsEmpty();
                if (+itemHowMany.value - 1 <= 0) {
                    this.addItemsfromLocalStorage();
                    itemNum.parentElement?.remove();
                }
            });
            itemPlus.addEventListener('click', () => {
                if (+itemHowMany.value >= product.stock) {
                    itemHowMany.value = `${+itemHowMany.value}`;

                    this.decreaseFromCart(`${product.id}`, '0');

                    return;
                }
                itemHowMany.value = `${+itemHowMany.value + 1}`;
                this.decreaseFromCart(`${product.id}`, '-1');
                currentAmount = +itemHowMany.value;
                return;
            });
        }

        fragment.append(cartClone);

        const cartList: HTMLElement | null = this.container.querySelector('.cart__list');
        cartList?.append(fragment);
    }

    private sayCartIsEmpty(): void {
        if (!localStorage['RS-store-data']) {
            const alredyHaveMessage: HTMLElement | null = this.container.querySelector('.cart__empty-text');
            const emptyCartPageText = this.createElement('p', 'cart__empty-text');
            emptyCartPageText.innerText = 'The cart is empty yet ¯\\_( ◡ ₒ ◡ )_/¯';
            if (!alredyHaveMessage) {
                this.container.append(emptyCartPageText);
            }
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
        this.refreshPromocodeInf();
        return '1';
    }

    private addItemsfromLocalStorage(): void {
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
        this.addItemsfromLocalStorage();
        return this.container;
    }
}
export default CartPage;
