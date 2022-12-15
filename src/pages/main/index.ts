import Page from '../../global/templates/page';

class MainPage extends Page {
    static textObj = {
        mainTitle: 'Online Store',
    };

    constructor(id: string) {
        super(id);
    }

    render() {
        const title = this.createTitle(MainPage.textObj.mainTitle);
        this.container.append(title);
        return this.container;
    }
}

export default MainPage;
