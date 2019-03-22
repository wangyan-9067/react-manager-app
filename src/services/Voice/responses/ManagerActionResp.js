import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';

export default class ManagerActionResp extends Socket.ResponseBase {
    parseResp(bytes) {
        this.action = bytes.readUnsignedInt();
        this.code = bytes.readUnsignedInt();
    }
}