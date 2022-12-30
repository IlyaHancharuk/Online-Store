import { localStorageData } from '../../types';
class cartInfo {
    localCartList: localStorageData[];
    id: string | number;
    amount: string | number;

    constructor(idProp: string | number, amountProp: string | number) {
        this.id = idProp;
        this.amount = amountProp;
        this.localCartList = [];
    }

    // !ГЛАВНЫЙ МЕТОД ДОБАВЛЕНИЯ В КОРЗИНУ ТОВАРА
    // ПРИ КЛИКЕ НА ADD to CART на главной
    // вызываем addToCart(Id-товара, 1)

    // Добавляет товар по его Id и количеству. Если товар с этим ID уже есть,
    // ... то просто прибавляет к кол-ву новое значение кол-ва
    addToCart(newItemId: string, newItemAmount: string): void {
        const newCartItem = {
            id: '',
            amount: '',
        };

        // массив наших товаров
        let localData: localStorageData[];

        // чекаем пустой ли localStorage
        if (localStorage['RS-store-data']) {
            localData = JSON.parse(localStorage['RS-store-data']);
            localStorage.clear();
        } else {
            localData = [];
            localStorage.clear();
        }

        // ищем, есть ли такой итем уже в localStorage;
        const alreadyInLocalData: localStorageData | undefined = localData.filter((el) => el.id === newItemId)[0];
        if (alreadyInLocalData) {
            localData[localData.indexOf(alreadyInLocalData)].amount =
                +localData[localData.indexOf(alreadyInLocalData)].amount + +newItemAmount;
            localStorage['RS-store-data'] = JSON.stringify(localData);
            return;
        }

        newCartItem.id = newItemId;
        newCartItem.amount = newItemAmount;
        localData.push(newCartItem);
        localStorage['RS-store-data'] = JSON.stringify(localData);
        return;
    }
}

export default cartInfo;
