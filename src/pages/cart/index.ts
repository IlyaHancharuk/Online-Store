import Page from '../../global/templates/page';
import data from '../../global/data/data';
import { localStorageData } from '../../global/types/index';
import cartInfo from '../../global/components/cartInfo';

class CartPage extends Page {
    constructor(id: string) {
        super(id);
    }

    private createCartBodyHTML(): void {
        const cartMain = this.createElement('div', 'cart');
        this.container.append(cartMain);

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
                        // this.addItemViaTemplate(Number(id), 1);
                        this.addToCart(`${Number(id)}`, '1');
                        this.addItemsfromLocalStorage();
                        return;
                    }
                });
            });
        }
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

        fragment.append(cartClone);

        // добавляем фрагмент в список
        const cartList: HTMLElement | null = this.container.querySelector('.cart__list');
        if (cartList) {
            cartList.append(fragment);
            this.container.append(cartList);
        }
    }

    private sayCartIsEmpty(): void {
        const emptyCartPageText = this.createElement('p', 'cart__empty-text');
        emptyCartPageText.innerText = 'The cart is empty yet ¯\\_( ◡ ₒ ◡ )_/¯';
        this.container.append(emptyCartPageText);
        return;
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
        return;
    }

    decreaseFromCart(itemId: string, howMuchToReduce = '1'): void {
        this.cartInf.reduceItemAmount(itemId, howMuchToReduce);
    }

    private addItemsfromLocalStorage(): void {
        // clear list and renew it;
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
        this.addToCart('20', '24');
        this.decreaseFromCart('20');
        this.decreaseFromCart('20', '20');
        this.addItemsfromLocalStorage();
        return this.container;
    }
}
export default CartPage;
