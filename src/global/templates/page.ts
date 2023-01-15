abstract class Page {
    protected container: HTMLElement;

    constructor(id: string) {
        this.container = document.createElement('div');
        this.container.id = id;
    }

    protected createElement(tag: string, className?: string) {
        const newElement: HTMLElement = document.createElement(tag);
        newElement.className = `${className}`;
        return newElement;
    }

    render() {
        return this.container;
    }
}

export default Page;
