import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';
import { DATA_SERVER_VALUE_LENGTH } from '../../../constants';

export default class CDSControlReqVideoResp extends Socket.ResponseBase {
    parseResp(bytes) {
        bytes.readUnsignedShort();
        bytes.readUnsignedShort();

        this.num = bytes.readUnsignedInt();
        this.videoStatusList = [];

        for (let i = 0; i < this.num; i++) {
            const result = {};

            result.vid = bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_VIDEO_ID);
            result.gmType = bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_GM_TYPE);
            result.dealerName = bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_DEALER_CODE);
            result.gameCode = bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_GAME_CODE);
            result.status = bytes.readByte();
            this.betTime = bytes.readUnsignedShort();
            this.timeout = bytes.readUnsignedShort();
            this.tblType = bytes.readByte();
            this.flag = bytes.readByte();

            this.videoStatusList.push(result);
        }
    }
}