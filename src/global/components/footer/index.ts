import Component from '../../templates/component';
import redIcon from '../../../assets/git-red.svg';
import blueIcon from '../../../assets/git-blue.svg';
import rsIcon from '../../../assets/rs_school_js.svg';
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
        backgroundImage: `${redIcon}`,
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
        backgroundImage: `${blueIcon}`,
        href: 'https://github.com/Lights0n',
    },
    {
        tag: 'a',
        class: 'footer__rs-school',
        innerText: 'Rs-shools',
        backgroundImage: `${rsIcon}`,
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
