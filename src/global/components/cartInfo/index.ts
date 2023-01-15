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

    addToCart(newItemId: string, newItemAmount: string): void {
        const newCartItem = {
            id: '',
            amount: '',
        };

        let localData: localStorageData[];

        if (localStorage['RS-store-data']) {
            localData = JSON.parse(localStorage['RS-store-data']);
            localStorage.removeItem('RS-store-data');
        } else {
            localData = [];
            localStorage.removeItem('RS-store-data');
        }

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
    reduceItemAmount(itemId: string, howMuchToReduce = '1'): void {
        let localData: localStorageData[];

        if (localStorage['RS-store-data']) {
            localData = JSON.parse(localStorage['RS-store-data']);
            localStorage.removeItem('RS-store-data');
        } else {
            localData = [];
            localStorage.removeItem('RS-store-data');
        }

        const alreadyInLocalData: localStorageData | undefined = localData.filter((el) => el.id === itemId)[0];
        if (alreadyInLocalData) {
            localData[localData.indexOf(alreadyInLocalData)].amount =
                +localData[localData.indexOf(alreadyInLocalData)].amount - +howMuchToReduce;
        }

        if (alreadyInLocalData.amount <= 0) {
            localData.splice(localData.indexOf(alreadyInLocalData), 1);
        }
        localStorage['RS-store-data'] = JSON.stringify(localData);

        if (localStorage['RS-store-data'] === '[]') {
            localStorage.removeItem('RS-store-data');
        }
        return;
    }
}

export default cartInfo;
