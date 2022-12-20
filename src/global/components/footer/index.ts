import Component from '../../templates/component';

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
    },
    {
        tag: 'a',
        innerText: 'Lights0n',
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
        // footerItemHTML.href = footerButtons[0].href;
        // footerButtons.forEach((element, index) => {
        //     const itemHTML: string | HTMLElement = document.createElement(`${element.tag}`);
        //     Object.keys(element).forEach((tag) => {
        //         itemHTML[tag] =
        //     });
        // });
    }

    render() {
        this.renderFooterButtons();
        return this.container;
    }
}

export default Footer;
