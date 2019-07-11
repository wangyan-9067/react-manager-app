import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';

export default class CDSActionResp extends Socket.ResponseBase {
    parseResp(bytes) {
        bytes.readUnsignedShort();
        bytes.readUnsignedShort();

        this.reqCmd = bytes.readUnsignedInt();
        this.code = bytes.readUnsignedInt();
    }
}