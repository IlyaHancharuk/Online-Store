import Component from '../../templates/component';

const footerButtons = [
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

        footerButtons.forEach((element, index) => {
            const itemHTML: string | HTMLElement = document.createElement(`${element.tag}`);
            console.log(Object.values(element));
            for (let i = 1; i < Object.values(element).length; i++) {
                itemHTML.[Object.keys(element)[i]] = Object.values(element)[i];
            }
        });
    }

    render() {
        this.renderFooterButtons();
        return this.container;
    }
}

export default Footer;
