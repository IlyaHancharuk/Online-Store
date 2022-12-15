import Page from '../../global/templates/page';
import MainPage from '../main';
import ProductDetailsPage from '../product-details';
import CartPage from '../cart';
import ErrorPage, { ErrorTypes } from '../error';
import Header from '../../global/components/header';

export const enum PageIds {
    MainPage = 'main-page',
    CartPage = 'cart-page',
    ProductDetailsPage = 'product-details-page',
}

class App {
    private static container: HTMLElement = document.body;
    private static defaultPageId = 'current-page';
    private initialPage: MainPage;
    private header: Header;

    static renderNewPage(idPage: string) {
        const currentPageHTML = document.querySelector(`#${App.defaultPageId}`);
        if (currentPageHTML) {
            currentPageHTML.remove();
        }
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
            pageHTML.id = App.defaultPageId;
            App.container.append(pageHTML);
        }
    }

    private enableRouteChange() {
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1);
            App.renderNewPage(hash);
        });
    }

    constructor() {
        this.initialPage = new MainPage('main-page');
        this.header = new Header('header', 'header');
    }

    run() {
        App.container.append(this.header.render());
        App.renderNewPage('main-page');
        this.enableRouteChange();
    }
}

export default App;
