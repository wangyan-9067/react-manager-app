import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';
import { VALUE_LENGTH } from '../../../constants';

export default class ChannelListResp extends Socket.ResponseBase {
    parseResp(bytes) {
        this.code = bytes.readUnsignedInt();
        this.clientName = bytes.readUTFBytes(VALUE_LENGTH.LOGIN_NAME);
        this.clientNickName = bytes.readUTFBytes(VALUE_LENGTH.NICK_NAME);
        this.clientBalance = bytes.readUnsignedInt();
        this.clientMute = bytes.readByte(); // 0 - mute; 1 - unmute;
        this.clientState = bytes.readUnsignedInt(); // 0 - idol; 1 - connecting; 2 - connected; 3 - waiting manager;
        this.anchorName = bytes.readUTFBytes(VALUE_LENGTH.LOGIN_NAME);
        this.anchorNickName = bytes.readUTFBytes(VALUE_LENGTH.NICK_NAME);
        this.anchorMute = bytes.readByte(); // 0 - mute; 1 - unmute;
        this.anchorState = bytes.readUnsignedInt(); // 0 - idol; 1 - connecting; 2 - connected; 3 - waiting manager;
        this.managerName = bytes.readUTFBytes(VALUE_LENGTH.LOGIN_NAME);
        this.managerNickName = bytes.readUTFBytes(VALUE_LENGTH.NICK_NAME);
        this.managerState = bytes.readUnsignedInt(); // 0 - idol; 1 - connecting; 2 - connected;
        this.vid = bytes.readUTFBytes(VALUE_LENGTH.VID);
    }
}