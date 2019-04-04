import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';
import { DATA_SERVER_VALUE_LENGTH } from '../../../constants';

export default class CDSVideoStatusResp extends Socket.ResponseBase {
	parseResp(bytes) {
    bytes.readUnsignedShort();
    bytes.readUnsignedShort();

    this.vid = bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_VIDEO_ID);
    this.gmcode = bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_GAME_CODE);
    this.deal = bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_DEALER_CODE);
    this.gameStatus = bytes.readByte();
    this.timeout = bytes.readUnsignedShort();
    this.videoStatus = bytes.readByte();
    this.videoMode = bytes.readByte();
    this.password = bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_PSW);
    this.username = bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_USER_NAME);
    this.uServiceid = bytes.readUnsignedInt();
    this.tmContract = bytes.readDouble();
	}
}