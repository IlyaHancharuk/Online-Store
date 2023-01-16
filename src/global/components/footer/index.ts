import Component from '../../templates/component';
import { footerHTMLTypes } from '../../types';

const footerElements: footerHTMLTypes[] = [
    {
        tag: 'a',
        class: 'footer__ilya',
        innerText: 'IlyaHancharuk',
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
        href: 'https://github.com/Lights0n',
    },
    {
        tag: 'a',
        class: 'footer__rs-school',
        innerText: 'Rs-shools',
        href: 'https://rs.school/js/',
    },
];

class Footer extends Component {
    constructor(tagName: string, className: string) {
        super(tagName, className);
    }

    renderFooterButtons(): void {
        const fragment = document.createDocumentFragment();
        const footerTemplate: HTMLTemplateElement | null = document.querySelector('#footer');
        const footerClone: HTMLElement | null = <HTMLElement>footerTemplate?.content.cloneNode(true);

        const footerIlyaAnchor: HTMLElement | null = footerClone.querySelector('.footer__ilua_anchor');
        const footerLights0nAnchor: HTMLElement | null = footerClone.querySelector('.footer__lights0n_anchor');
        const footerRSAnchor: HTMLElement | null = footerClone.querySelector('.footer__lights0n_anchor');

        if (footerIlyaAnchor && footerLights0nAnchor && footerRSAnchor) {
            footerIlyaAnchor.textContent = `${footerElements[0].innerText}`;
            footerLights0nAnchor.textContent = `${footerElements[2].innerText}`;
        }
        fragment.append(footerClone);
        this.container.append(fragment);
    }

    render() {
        this.renderFooterButtons();
        return this.container;
    }
}

export default Footer;
