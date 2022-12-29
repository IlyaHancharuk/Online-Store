import { localStorageData } from '../../types';
class cartInfo {
    localCartList: localStorageData[];
    id: string | number;
    amount: string | number;

    constructor(idProp: string | number, amountProp: string | number, localCartListProp: localStorageData[]) {
        this.id = idProp;
        this.amount = amountProp;
        this.localCartList = localCartListProp;
    }
    private addToCart(newId: string | number, newAmount: string | number): void {
        const newCartItem: localStorageData = {
            id: '',
            amount: '',
        };
        newCartItem.id = newId;
        newCartItem.amount = newAmount; 
        this.localCartList.push(newCartItem);
    }
}

export default cartInfo;
