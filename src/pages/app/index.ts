import Page from '../../global/templates/page';
import MainPage from '../main';
import ProductDetailsPage from '../product-details';
import CartPage from '../cart';
import ErrorPage, { ErrorTypes } from '../error';
import Header from '../../global/components/header';
import Main from '../../global/components/main';
import Footer from '../../global/components/footer';

export const enum PageIds {
    MainPage = 'main-page',
    CartPage = 'cart-page',
    ProductDetailsPage = `product-details-page`,
}

class App {
    private static container: HTMLElement = document.body;
    private header: Header;
    private main: Main;
    private footer: Footer;

    static renderNewPage(idPage: string, main: Main) {
        main.render().innerHTML = '';
        let page: Page | null = null;

        if (idPage === PageIds.MainPage) {
            page = new MainPage(idPage);
        } else if (idPage === PageIds.CartPage) {
            page = new CartPage(idPage);
        } else if (idPage === PageIds.ProductDetailsPage) {
            page = new ProductDetailsPage(idPage);
        } else {
            page = new ErrorPage(idPage, ErrorTypes.Error_404);
        }

        if (page) {
            const pageHTML = page.render();
            main.render().append(pageHTML);
        }
    }

    private enableRouteChange() {
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1);
            App.renderNewPage(hash, this.main);
        });
    }

    constructor() {
        this.header = new Header('header', 'header');
        this.main = new Main('main', 'main');
        this.footer = new Footer('footer', 'footer');
    }

    run() {
        App.container.append(this.header.render());
        App.container.append(this.main.render());
        App.container.append(this.footer.render());
        // сразу корзину мне открыть
        // App.renderNewPage('main-page', this.main);
        App.renderNewPage('cart-page', this.main);
        this.enableRouteChange();
    }
}

export default App;
