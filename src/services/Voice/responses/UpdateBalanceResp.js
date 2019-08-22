import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';
import { VALUE_LENGTH } from '../../../constants';

export default class UpdateBalanceResp extends Socket.ResponseBase {
    parseResp(bytes) {
        this.username = bytes.readUTFBytes(VALUE_LENGTH.LOGIN_NAME);
        this.balance = bytes.readDouble();
    }
}