import Component from '../../templates/component';
import { PageIds } from '../../../pages/app';

const Buttons = [
    {
        id: PageIds.MainPage,
        text: 'Online Store',
    },
    {
        id: PageIds.CartPage,
        text: 'Cart',
    },
    {
        id: PageIds.ProductDetailsPage,
        text: 'Product Datails',
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
