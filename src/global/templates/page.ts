abstract class Page {
    protected container: HTMLElement;

    constructor(id: string) {
        this.container = document.createElement('div');
        this.container.id = id;
    }

    // не смог впилить это в CartPage из src/pages/cart/index
    // создал здесь и буду вызывать как метод. 2 класса я же не снаследую
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
