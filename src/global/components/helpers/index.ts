import MainPage from '../../../pages/main';
import { LocalStorageKey } from '../../constants';
import data from '../../data/data';
import { localStorageData, localStorageKey } from '../../types';

export const cleanLocalStorage = (key: localStorageKey) => {
    if (localStorage[key]) {
        localStorage.removeItem(key);
    }
};

export const checkInLocalStorage = (id: string) => {
    let localData: localStorageData[] = [];

    if (localStorage[LocalStorageKey.data]) {
        localData = JSON.parse(localStorage[LocalStorageKey.data]);
    }

    const alreadyInLocalData: localStorageData = localData.filter((el) => el.id === id)[0];
    return alreadyInLocalData ? true : false;
};

export const productsFilteringUsingDualSliders = () => {
    const priceData = MainPage.settings.rangeValues.price;
    const stockData = MainPage.settings.rangeValues.stock;

    MainPage.filtredBySlidersData = data
        .filter((el) => +el.price >= priceData.from && +el.price <= priceData.to)
        .filter((el) => +el.stock >= stockData.from && +el.stock <= stockData.to);

    MainPage.changeProductsHTML();
};

export const productFiltering = () => {
    MainPage.resultFiltringData = MainPage.sortedData
        .filter((el) => MainPage.filtredByCheckboxesData.includes(el))
        .filter((el) => MainPage.filtredBySlidersData.includes(el))
        .filter((el) => MainPage.filtredBySearchData.includes(el));

    return MainPage.resultFiltringData;
};

export const productsFilteringUsingSearch = () => {
    const searchInput = document.querySelector<HTMLInputElement>('.search-bar input');
    if (searchInput) {
        const keyword = searchInput.value.toLowerCase();
        MainPage.filtredBySearchData = data.filter((item) => {
            const title = item.title.toLowerCase();
            const desc = item.description.toLowerCase();
            const brand = item.brand.toLowerCase();
            const category = item.category.toLowerCase();
            const price = item.price.toString().toLowerCase();
            const stock = item.stock.toString().toLowerCase();
            const discount = item.discountPercentage.toString().toLowerCase();
            const rating = item.rating.toString().toLowerCase();

            if (title.indexOf(keyword) > -1) return true;
            if (desc.indexOf(keyword) > -1) return true;
            if (brand.indexOf(keyword) > -1) return true;
            if (category.indexOf(keyword) > -1) return true;
            if (price.indexOf(keyword) > -1) return true;
            if (stock.indexOf(keyword) > -1) return true;
            if (discount.indexOf(keyword) > -1) return true;
            if (rating.indexOf(keyword) > -1) return true;
            return false;
        });

        MainPage.changeProductsHTML();
    }
};

export const productsSorting = (option: 'id' | 'price' | 'rating', mod?: 'ASC' | 'DESC') => {
    if (mod === 'DESC') {
        MainPage.sortedData.sort((a, b) => b[option] - a[option]);
    } else {
        MainPage.sortedData.sort((a, b) => a[option] - b[option]);
    }

    MainPage.changeProductsHTML();
};

export const cleanFilters = () => {
    MainPage.settings.fltredCollection.get('category')?.clear();
    MainPage.settings.fltredCollection.get('brand')?.clear();
    MainPage.filtredByCheckboxesData = data;
    MainPage.filtredBySlidersData = data;
    MainPage.filtredBySearchData = data;
    MainPage.sortedData = data;
    MainPage.resultFiltringData = data;
};

export const productsFilteringUsingCheckbox = (checkbox: HTMLInputElement) => {
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            MainPage.settings.fltredCollection.get(checkbox.name)?.add(checkbox.id);
        } else {
            MainPage.settings.fltredCollection.get(checkbox.name)?.delete(checkbox.id);
        }

        const categories = MainPage.settings.fltredCollection.get('category');
        const brands = MainPage.settings.fltredCollection.get('brand');
        MainPage.filtredByCheckboxesData = data;
        MainPage.resultFiltringData = data;

        if (categories?.size)
            MainPage.filtredByCheckboxesData = MainPage.filtredByCheckboxesData.filter((el) =>
                categories?.has(el['category'])
            );
        if (brands?.size)
            MainPage.filtredByCheckboxesData = MainPage.filtredByCheckboxesData.filter((el) =>
                brands?.has(el['brand'])
            );
        MainPage.changeProductsHTML();
    });
};
