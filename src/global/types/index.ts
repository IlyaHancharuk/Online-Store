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

export type localStorageData = {
    id: number | string;
    amount: number | string;
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
