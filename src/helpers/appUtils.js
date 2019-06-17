import langConfig from '../languages/zh-cn.json';
import voiceAPI from '../services/Voice/voiceAPI';
import dataAPI from '../services/Data/dataAPI';
import nullGateAPI from '../services/NullGate/nullGateAPI';
import { setManagerCredential, setIsUserAuthenticated, resetAction } from '../actions/app';
import { store } from '../store';


export const mapBetHistoryResult = (loginname, result) => {
    return result.map(item => {
        let temp = item.$;

        return {
            name: loginname,
            gmtype: temp.platformtype,
            gmcode: temp.gmcode,
            billno: temp.billno,
            betTime: temp.billtime,
            table: temp.tablecode,
            playerVal: temp.playerpoint,
            bankerVal: temp.bankerpoint,
            amount: temp.account,
            profit: temp.cus_account,
            playtype: parseInt(temp.playtype),
            cardlist: temp.cardlist,
            flag: temp.flag,
            remark: temp.remark
        }
    })
};

export const getLangConfig = () => {
    return langConfig;
};

export function reset() {
    if (voiceAPI.isOpen()) {
        voiceAPI.logout();
        voiceAPI.close();
    }

    if (dataAPI.isOpen()) {
        dataAPI.logout();
        dataAPI.close();
    }

    if (nullGateAPI.isOpen()) {
        nullGateAPI.close();
    }

    store.dispatch(setManagerCredential(null));
    store.dispatch(setIsUserAuthenticated(false));
    store.dispatch(resetAction());
}