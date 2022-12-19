import Component from '../../templates/component';

class Footer extends Component {
    constructor(tagName: string, className: string) {
        super(tagName, className);
    }

    render() {
        return this.container;
    }
}

export default Footer;
