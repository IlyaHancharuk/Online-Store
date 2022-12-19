abstract class Page {
    protected container: HTMLElement;
    static textObj = {};

    constructor(id: string) {
        this.container = document.createElement('div');
        this.container.id = id;
    }

    protected createTitle(text: string) {
        const headerTitle = document.createElement('h1');
        headerTitle.innerText = text;
        return headerTitle;
    }

    render() {
        return this.container;
    }
}

export default Page;
