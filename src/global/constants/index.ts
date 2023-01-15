export const PRODUCT_DETAILS_PAGE_HASH_LENGTH = 21;

export const enum PageIds {
    MainPage = 'main-page',
    CartPage = 'cart-page',
    ProductDetailsPage = `product-details-page`,
}

export const enum SortOptions {
    priceASC = 'price-ASC',
    priceDESC = 'price-DESC',
    ratingASC = 'rating-ASC',
    ratingDESC = 'rating-DESC',
    default = 'default',
}

export const enum ProductProperty {
    category = 'Category:',
    brand = 'Brand:',
    price = 'Price:',
    rating = 'Rating:',
    discountPercentage = 'Discount:',
    stock = 'Stock:',
}

export const enum SortBy {
    id = 'id',
    price = 'price',
    rating = 'rating',
}

export const enum SortOrder {
    ASC = 'ASC',
    DESC = 'DESC',
}
