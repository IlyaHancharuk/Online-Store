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

type ProductInfo<T> = T |'category' | 'brand' | 'discountPercentage' | 'rating' | 'stock';

export type ProductInfoForMainPage = ProductInfo<'price'>;

export type ProductInfoForProductPage = ProductInfo<'description'>;

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

export type localStorageKey = 'RS-store-data' | 'RS-store-promo';

export type modeButtonType = 'grid' | 'list';
