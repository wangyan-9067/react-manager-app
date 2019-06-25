import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';

import NullGateSocket from './NullGateSocket';
import * as PROTOCOL from '../../protocols';
import * as CONSTANTS from '../../constants';
import { mapBetHistoryResult, reset } from '../../helpers/appUtils';
import { setBetHistoryInfo, setBetHistory, setBetHistoryUserPid } from '../../actions/data';
import { toggleLoading } from '../../actions/app';
import { store } from '../../store';

class NullGateAPI {
    socket;

    constructor() {
        this.socket = new NullGateSocket();

        this.socket.addEventListener(Socket.EVENT_OPEN, this.onSocketOpen);
        this.socket.addEventListener(Socket.EVENT_PACKET, this.onSocketPacket);
        this.socket.addEventListener(Socket.EVENT_DIE, this.onSocketDie);
    }

    connect() {
        this.socket.autoConnect();
    }

    close() {
        this.socket.close();
    }

    isOpen() {
        return this.socket.isOpen();
    }

    onSocketOpen = () => {
        this.login();
    }

    onSocketPacket = (evt) => {
        if (evt.$type !== Socket.EVENT_PACKET) {
            return;
        }

        console.log('[NullGateSocket]', evt.data);

        switch(evt.data.respId) {
            case PROTOCOL.GATE_FORWARD_MSG:
              if (evt.data.cmd === PROTOCOL.GET_BET_RECORDS_R) {
                const searchResult = evt.data.data.result;
                const info = searchResult && searchResult.addition ? searchResult.addition[0] : {};
                const rows = searchResult && searchResult.row ? searchResult.row : [];
                const result = mapBetHistoryResult(evt.data.loginname, rows);

                store.dispatch(setBetHistoryInfo({
                  numPerPage: info['num_per_page'][0],
                  total: info.total[0]
                }));
                store.dispatch(setBetHistory('billno', result));
                store.dispatch(toggleLoading(false));
              }
            break;

            default:
            break;
          }
    }

    onSocketDie() {
        reset();
    }

    login() {
        this.socket.writeBytes(Socket.createCMD(PROTOCOL.GATE_REQUEST_CACHE));
    }

    getBetHistory(fullLoginname = '', gmcode = '', pageIndex = 1, perNum = 20) {
        const { PRODUCT_ID, LOGIN_NAME, BEGIN_TIME, END_TIME, GM_CODE, GM_TYPE, BILL_NO, PLATFORM, REQEXT } = CONSTANTS.QUERY_SERVER_VALUE_LENGTH;
        const productId = fullLoginname.slice(0, 3);
        const loginname = fullLoginname.slice(3);

        store.dispatch(setBetHistoryUserPid(productId));

        this.socket.writeBytes(Socket.createCMD(PROTOCOL.GATE_FORWARD_MSG, bytes => {
            bytes.writeBytes(Socket.stringToBytes(fullLoginname, LOGIN_NAME));

            bytes.writeInt(PROTOCOL.GET_BET_RECORDS);
            bytes.writeInt(0);
            bytes.writeInt(0);

            bytes.writeBytes(Socket.stringToBytes(productId, PRODUCT_ID));
            bytes.writeBytes(Socket.stringToBytes(loginname, LOGIN_NAME));
            bytes.writeBytes(Socket.stringToBytes('', BEGIN_TIME));
            bytes.writeBytes(Socket.stringToBytes('', END_TIME));
            bytes.writeBytes(Socket.stringToBytes(gmcode, GM_CODE));
            bytes.writeBytes(Socket.stringToBytes('EBAC', GM_TYPE));
            bytes.writeBytes(Socket.stringToBytes('', BILL_NO));
            // TODO: set to EBAC
            bytes.writeBytes(Socket.stringToBytes('', PLATFORM));
            bytes.writeBytes(Socket.stringToBytes('', REQEXT));

            bytes.writeShort(perNum);
            bytes.writeShort(pageIndex);
        }));
    }
}

const nullGateAPI = new NullGateAPI();

export default nullGateAPI;