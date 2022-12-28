import Page from '../../global/templates/page';
import MainPage from '../main';
import ProductDetailsPage from '../product-details';
import CartPage from '../cart';
import ErrorPage, { ErrorTypes } from '../error';
import Header from '../../global/components/header';
import Main from '../../global/components/main';
import Footer from '../../global/components/footer';
import { PageIds } from '../../global/constants';

class App {
    private static container: HTMLElement = document.body;
    private header: Header;
    private main: Main;
    private footer: Footer;

    static renderNewPage(idPage: string, main: Main) {
        main.render().innerHTML = '';
        let page: Page | null = null;

        switch (idPage) {
            case PageIds.MainPage:
                page = new MainPage(idPage);
                break;
            case '':
                page = new MainPage('main-page');
                break;
            case PageIds.CartPage:
                page = new CartPage(idPage);
                break;
            default:
                page = new ErrorPage(idPage, ErrorTypes.Error_404);
                break;
        }

        if (idPage.includes('product-details-page')) {
            const productId = Number(idPage.slice(21));
            page = new ProductDetailsPage(idPage, productId);
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
        this.main = new Main('main', 'app');
        this.footer = new Footer('footer', 'footer');
    }

    run() {
        App.container.append(this.header.render());
        App.container.append(this.main.render());
        App.container.append(this.footer.render());
        App.renderNewPage('main-page', this.main);
        this.enableRouteChange();
    }
}

export default App;
