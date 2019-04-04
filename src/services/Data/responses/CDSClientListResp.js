import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';
import { DATA_SERVER_VALUE_LENGTH } from '../../../constants';

export default class CDSClientListResp extends Socket.ResponseBase {
	parseResp(bytes) {
    bytes.readUnsignedShort();
    bytes.readUnsignedShort();
    
    this.vid = bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_VIDEO_ID);
    this.seatedPlayerNum = bytes.readByte();

    for (let i = 0 ; i < this.seatedPlayerNum; i++) {
      this.serviceId = bytes.readUnsignedInt();
      this.username = bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_USER_NAME);
      this.nickname = bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_NICK_NAME);
      this.account = bytes.readDouble();
      this.seatnum = bytes.readByte();
      this.playerType = bytes.readByte();
      this.currency = bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_CURRENCY);
      this.fRate = bytes.readFloat();
    }
	}
}