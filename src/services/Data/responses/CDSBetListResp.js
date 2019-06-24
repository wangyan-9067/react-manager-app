import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';
import { DATA_SERVER_VALUE_LENGTH } from '../../../constants';

export default class CDSBetListResp extends Socket.ResponseBase {
	parseResp(bytes) {
    bytes.readUnsignedShort();
    bytes.readUnsignedShort();
    
    this.vid = bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_VIDEO_ID);
    this.gmcode = bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_GAME_CODE);
    this.totalBetNumber = bytes.readUnsignedInt();
    this.totalNotValidBet = bytes.readDouble();
    this.totalPayout = bytes.readDouble();
    this.betList = [];

    for (let i = 0 ; i < this.totalBetNumber; i++) {
      this.betList.push({
        serviceId: bytes.readUnsignedInt(),
        username: bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_USER_NAME),
        seatnum: bytes.readByte(),
        playtype: bytes.readUnsignedShort(),
        jetton: bytes.readUnsignedInt(),
        currency: bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_CURRENCY),
        fRate: bytes.readFloat()
      });
    }
	}
}