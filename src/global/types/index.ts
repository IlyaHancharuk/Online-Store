export type Data = {
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
    dataItem: Data;
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

export interface Isettings {
    viewMode: string;
    sort: string;
    fltredCollection: Map<string, Set<string>>;
    rangeValues: {
        price: {
            from: number;
            to: number;
        };
        stock: {
            from: number;
            to: number;
        };
    };
}
