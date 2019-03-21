import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';

export default class ManagerLoginResp extends Socket.ResponseBase {
    parseResp(bytes) {
        this.channelId = bytes.readUnsignedInt();
        this.voiceAppId = bytes.readUTFBytes(bytes.length - 16);
    }
}