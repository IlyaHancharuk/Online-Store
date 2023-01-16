import Page from '../../global/templates/page';

export const enum ErrorTypes {
    Error_404 = '404',
}

class ErrorPage extends Page {
    private errorType: ErrorTypes | string;

    static textObj: { [prop: string]: string } = {
        '404': 'Oops! This page is missing.\nRedirect to the main page after 5 seconds...',
    };

    constructor(id: string, errorType: ErrorTypes | string) {
        super(id);
        this.errorType = errorType;
    }

    render() {
        const title = document.createElement('div');
        title.className = 'error-page';
        title.innerText = ErrorPage.textObj[this.errorType];
        this.container.append(title);
        return this.container;
    }
}

export default ErrorPage;
