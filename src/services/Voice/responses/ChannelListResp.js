import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';
import { VALUE_LENGTH } from '../../../constants';

export default class ChannelListResp extends Socket.ResponseBase {
    parseResp(bytes) {
        this.count = bytes.readUnsignedInt();
        this.channelList = [];

        for (let i = 0; i < this.count; i++) {
            this.channelList.push({
                channelId: bytes.readUnsignedInt(),
                clientName: bytes.readUTFBytes(VALUE_LENGTH.LOGIN_NAME),
                clientNickName: bytes.readUTFBytes(VALUE_LENGTH.NICK_NAME),
                clientBalance: bytes.readDouble(),
                clientMute: bytes.readByte(), // 0 - mute; 1 - unmute;
                clientState: bytes.readUnsignedInt(), // 0 - idol; 1 - connecting; 2 - connected; 3 - waiting manager;
                anchorName: bytes.readUTFBytes(VALUE_LENGTH.LOGIN_NAME),
                anchorNickName: bytes.readUTFBytes(VALUE_LENGTH.NICK_NAME),
                anchorUrl: bytes.readUTFBytes(VALUE_LENGTH.URL),
                anchorMute: bytes.readByte(), // 0 - mute; 1 - unmute;
                anchorState: bytes.readUnsignedInt(), // 0 - idol; 1 - connecting; 2 - connected; 3 - waiting manager;
                managerName: bytes.readUTFBytes(VALUE_LENGTH.LOGIN_NAME),
                managerNickName: bytes.readUTFBytes(VALUE_LENGTH.NICK_NAME),
                managerUrl: bytes.readUTFBytes(VALUE_LENGTH.URL),
                managerState: bytes.readUnsignedInt(), // 0 - idol; 1 - connecting; 2 - connected;
                vid: bytes.readUTFBytes(VALUE_LENGTH.VID)
            });
        }
    }
}