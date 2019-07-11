import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';
import { DATA_SERVER_VALUE_LENGTH } from '../../../constants';

export default class CDSAnchorBetResp extends Socket.ResponseBase {

    parseResp(bytes) {
        bytes.readUnsignedShort();
        bytes.readUnsignedShort();

        this.name = bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_USER_NAME);
        this.vid = bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_VIDEO_ID);
        this.playtype = bytes.readUnsignedShort();
        this.jetton = bytes.readUnsignedInt();
        this.code = bytes.readUnsignedInt();
        this.totalNotValidBet = bytes.readDouble();
    }
}