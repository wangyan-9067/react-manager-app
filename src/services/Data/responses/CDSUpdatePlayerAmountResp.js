import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';
import { DATA_SERVER_VALUE_LENGTH } from '../../../constants';

export default class CDSUpdatePlayerAmountResp extends Socket.ResponseBase {
    parseResp(bytes) {
        bytes.readUnsignedShort();
        bytes.readUnsignedShort();
        this.username = bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_USER_NAME);
        this.account = bytes.readDouble();
    }
}