import Component from '../../templates/component';
import { PageIds } from '../../../pages/app';

const Buttons = [
    {
        id: PageIds.MainPage,
        text: 'Online Store',
        class: 'header__online-store',
    },
    {
        id: PageIds.CartPage,
        text: 'Cart',
        class: 'header__cart',
    },
    {
        id: PageIds.ProductDetailsPage,
        text: 'Product Datails',
        class: 'product-details',
    },
];

class Header extends Component {
    constructor(tagName: string, className: string) {
        super(tagName, className);
    }

    renderNavButtons() {
        const navButtons = document.createElement('div');
        Buttons.forEach((button) => {
            const buttonHTML = document.createElement('a');
            buttonHTML.href = `#${button.id}`;
            buttonHTML.classList.add(`${button.class}`);
            buttonHTML.innerText = button.text;
            navButtons.append(buttonHTML);
        });

        this.container.append(navButtons);
    }

    render() {
        this.renderNavButtons();
        return this.container;
    }
}

export default Header;
