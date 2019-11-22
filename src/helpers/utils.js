import dataAPI from '../services/Data/dataAPI';

export function formatAmount(amount, currency = '') {
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

export function compareArray(array1, array2) {
    if (!array1 || !array2) {
        return;
    }

    return array1.length === array2.length && array1.sort().every((value, index) => value === array2.sort()[index]);
};

export function isObject(obj) {
    const type = typeof obj;
    return (type === 'function' || type === 'object') && !!obj;
};

export function isNonEmptyArray(value) {
    return Array.isArray(value) && value.length > 0;
};

export function convertObjectListToArrayList(data) {
    return Object.keys(data).map(key => data[key]);
};

export function getAnonymousName(loginname, nick, showFirstChar, showNickNameFirstChar) {
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

/**
 *
 * @param {string} timeStr - 2019-11-22 03:24:45 (est time)
 * @returns string - local time string 2019-11-22 13:24:45
 */
export function estTimeToLocal(timeStr) {
    let date = new Date(timeStr + '-04:00');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1, 2)}-${pad(date.getDate(), 2)} ` +
        `${pad(date.getHours(), 2)}:${pad(date.getMinutes(), 2)}:${pad(date.getSeconds(), 2)}`;
}

/**
 *
 * @param {string} n number
 * @param {number} width total length
 * @param {string} [z] pad stuff
 *
 * @example pad(10, 4);      // 0010
 * @example pad(10, 4, '-'); // --10
 */
export function pad(n, width, z = '0') {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}