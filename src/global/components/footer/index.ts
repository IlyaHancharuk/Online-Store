import Component from '../../templates/component';
// import "../../../../"
// { [tag?: string, innerText?: string, href?: string] }
interface blabla {
    tag: string;
    innerText?: string;
    class?: string;
    backgroundImage?: string;
    href?: string;
}

const footerElements: blabla[] = [
    {
        tag: 'a',
        class: 'footer__ilya',
        innerText: 'IlyaHancharuk',
        backgroundImage: '/git-red.svg',
        href: 'https://github.com/IlyaHancharuk',
    },
    {
        tag: 'p',
        class: 'footer__year',
        innerText: '2022',
    },
    {
        tag: 'a',
        class: 'footer__lights0n',
        innerText: 'Lights0n',
        backgroundImage: './src/git-blue.svg',
        href: 'https://github.com/Lights0n',
    },
    {
        tag: 'a',
        class: 'footer__rs-school',
        backgroundImage: './src/rs_school_js.svg',
        href: 'https://rs.school/js/',
    },
];

class Footer extends Component {
    constructor(tagName: string, className: string) {
        super(tagName, className);
    }

    renderFooterButtons(): void {
        const footerBody = document.createElement('div');
        footerBody.classList.add('footer__body');

        footerElements.forEach((element) => {
            const footerItemHTML = document.createElement(element.tag);
            footerItemHTML.classList.add(`${element.class}`);
            if (element.href) {
                footerItemHTML.setAttribute('href', element.href);
                footerItemHTML.setAttribute('target', '_blank');
            }
            if (element.innerText) {
                footerItemHTML.innerText = element.innerText;
            }
            if (element.backgroundImage) {
                footerItemHTML.style.backgroundImage = `url(${element.backgroundImage})`;
            }
            footerBody.append(footerItemHTML);
        });
        this.container.append(footerBody);
    }

    render() {
        this.renderFooterButtons();
        return this.container;
    }
}

export default Footer;
