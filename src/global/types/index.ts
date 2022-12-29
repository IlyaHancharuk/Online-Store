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

export type ProductInfo = 'category' | 'brand' | 'price' | 'discountPercentage' | 'rating' | 'stock';

export type localStorageData = {
    id: number | string;
    amount: number | string;
};
