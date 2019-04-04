import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';
import { DATA_SERVER_VALUE_LENGTH } from '../../../constants';

export default class CDSClientEnterTableNotifyResp extends Socket.ResponseBase {
	parseResp(bytes) {
    bytes.readUnsignedShort();
    bytes.readUnsignedShort();

    this.vid = bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_VIDEO_ID);
    this.username = bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_USER_NAME);
    this.nickname = bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_NICK_NAME);
    this.currentAmount = bytes.readDouble();
    this.seatnum = bytes.readByte();
    this.playerType = bytes.readByte();
    this.currency = bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_CURRENCY);
    this.fRate = bytes.readFloat();
	}
}