import Component from '../../templates/component';
import { PageIds } from '../../constants';
import CartPage from '../../../pages/cart';

class Header extends Component {
    constructor(tagName: string, className: string) {
        super(tagName, className);
    }

    private createHTML() {
        const headerItems = document.createElement('div');
        headerItems.classList.add('nav__body');

        const logo = document.createElement('a');
        logo.href = `#${PageIds.MainPage}`;
        logo.className = 'header__online-store';
        logo.innerText = 'Online Store';
        headerItems.append(logo);

        const total = document.createElement('span');
        total.className = 'header__total';
        const sum = CartPage.getTotalSum();
        total.innerText = `Cart total: €${sum}`;
        headerItems.append(total);

        const cart = document.createElement('a');
        cart.href = `#${PageIds.CartPage}`;
        cart.className = 'header__cart';

        const totalAmount = document.createElement('span');
        totalAmount.className = 'header__total-amount';
        totalAmount.textContent = `${CartPage.refreshCartIcontotal()}`;

        cart.append(totalAmount);

        headerItems.append(cart);

        this.container.append(headerItems);
    }

    render() {
        this.createHTML();
        return this.container;
    }
}

export default Header;
