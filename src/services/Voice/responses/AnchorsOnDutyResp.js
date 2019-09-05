import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';
import { VALUE_LENGTH } from '../../../constants';

export default class AnchorsOnDutyResp extends Socket.ResponseBase {
    parseResp(bytes) {
        this.count = bytes.readUnsignedInt();
        this.anchorsOnDutyList = [];

        for (let i = 0; i < this.count; i++) {
            this.anchorsOnDutyList.push({
                anchorName: bytes.readUTFBytes(VALUE_LENGTH.LOGIN_NAME),
                nickname: bytes.readUTFBytes(VALUE_LENGTH.NICK_NAME),
                vid: bytes.readUTFBytes(VALUE_LENGTH.VID),
                isBusy: bytes.readByte(),
                url: bytes.readUTFBytes(VALUE_LENGTH.URL),
            });
        }
    }
}