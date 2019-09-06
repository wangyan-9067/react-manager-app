import dataAPI from '../services/Data/dataAPI';

export const formatAmount = (amount, currency = '') => {
    return getStringFixed2WithComma(amount) + ` ${currency}`;
};

export function getStringFixed2(num) {
    var floorNum = Math.floor(Math.round(num *1000) / 10) / 100;
    if (/\d+\.\d{2,}/.test('' + floorNum)) {
        return floorNum.toFixed(2);
    } else {
        return '' + floorNum;
    }
}

export function getStringFixed2WithComma(num) {
    var parts = getStringFixed2(num).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

export const compareArray = (array1, array2) => {
    if (!array1 || !array2) {
        return;
    }

    return array1.length === array2.length && array1.sort().every((value, index) => value === array2.sort()[index]);
};

export const isObject = obj => {
    const type = typeof obj;
    return (type === 'function' || type === 'object') && !!obj;
};

export const isNonEmptyArray = value => {
    return Array.isArray(value) && value.length > 0;
};

export const convertObjectListToArrayList = data => {
    return Object.keys(data).map(key => data[key]);
};

export const getAnonymousName = (loginname, nick, showFirstChar, showNickNameFirstChar) => {
    if (nick && nick !== loginname.substring(3) && nick.slice(0, 16) !== loginname.substring(3).slice(0, 16)) {
        return nick;
    } else {
        if (showNickNameFirstChar) {
            return nick.slice(0, 1) + '***' + nick.slice(nick.length - 3);
        } else {
            if (showFirstChar) {
                return loginname.slice(0, 1) + '***' + loginname.slice(loginname.length - 3);
            } else {
                return '***' + loginname.slice(loginname.length - 3);
            }
        }
    }
};