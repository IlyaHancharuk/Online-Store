export interface IData {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
};

export interface IElemInfo {
    dataItem: IData;
    descriptionsTitle: ProductInfoForMainPage | ProductInfoForProductPage;
    parentElem: HTMLElement;
}

export type ProductInfoForMainPage = 'category' | 'brand' | 'price' | 'discountPercentage' | 'rating' | 'stock';

export type ProductInfoForProductPage =
    | 'description'
    | 'discountPercentage'
    | 'rating'
    | 'stock'
    | 'brand'
    | 'category';

export type localStorageData = {
    id: number | string;
    amount: number | string;
};

export interface footerHTMLTypes {
    tag: string;
    innerText?: string;
    class?: string;
    backgroundImage?: string;
    href?: string;
}

interface IRange {
    from: number;
    to: number;
}

export interface Isettings {
    viewMode: string;
    sort: string;
    fltredCollection: Map<string, Set<string>>;
    rangeValues: {
        price: IRange;
        stock: IRange;
    };
}
