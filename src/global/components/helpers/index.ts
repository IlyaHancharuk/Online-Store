import { localStorageData, localStorageKey } from '../../types';

export const cleanLocalStorage = (key: localStorageKey) => {
    if (localStorage[key]) {
        localStorage.removeItem(key);
    }
};

export const checkInLocalStorage = (id: string) => {
    let localData: localStorageData[] = [];

    if (localStorage['RS-store-data']) {
        localData = JSON.parse(localStorage['RS-store-data']);
    }

    const alreadyInLocalData: localStorageData = localData.filter((el) => el.id === id)[0];
    return alreadyInLocalData ? true : false;
};
