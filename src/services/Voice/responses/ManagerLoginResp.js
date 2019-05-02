import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';

export default class ManagerLoginResp extends Socket.ResponseBase {
    parseResp(bytes) {
        this.code = bytes.readUnsignedInt();
        this.level = bytes.readByte();
        this.voiceAppId = bytes.readUTFBytes(bytes.length - 17);
    }
}