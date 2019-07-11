import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';
import { VALUE_LENGTH } from '../../../constants';

export default class QueryAllDelegatorResp extends Socket.ResponseBase {
    parseResp(bytes) {
        this.count = bytes.readUnsignedInt();
        this.delegatorList = [];

        for (let i = 0; i < this.count; i++) {
            this.delegatorList.push({
                loginname: bytes.readUTFBytes(VALUE_LENGTH.LOGIN_NAME),
                password: bytes.readUTFBytes(VALUE_LENGTH.PASSWORD),
                tel: bytes.readUTFBytes(VALUE_LENGTH.TEL)
            });
        }
    }
}