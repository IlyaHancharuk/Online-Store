import Component from '../../templates/component';
// { [tag?: string, innerText?: string, href?: string] }
const footerButtons = [
    {
        tag: 'a',
        innerText: 'IlyaHancharuk',
        // backgroundImage: '#',
        href: '#https://github.com/IlyaHancharuk',
    },
    {
        tag: 'p',
        innerText: '2022',
        href: '#',
    },
    {
        tag: 'a',
        innerText: 'Lights0n',
        // backgroundImage: '#',
        href: '#https://github.com/Lights0n',
    },
    {
        tag: 'a',
        // backgroundImage: '#',
        href: '#https://github.com/Lights0n',
    },
];

class Footer extends Component {
    constructor(tagName: string, className: string) {
        super(tagName, className);
    }

    renderFooterButtons(): void {
        const footerBody = document.createElement('div');
        footerBody.classList.add('footer__body');
        const footerItemHTML = document.createElement('a');
        console.log(footerItemHTML);

        // footerButtons.forEach((element) => {
        //     for (let i = 0; i < Object.keys(element).length; i++) {
        //         console.log(Object.keys(element)[i]);
        //         footerItemHTML[Object.keys(element)[i]] = Object.values(element)[i];
        //         // footerItemHTML.
        //     }
        // });
    }

    render() {
        this.renderFooterButtons();
        return this.container;
    }
}

export default Footer;
