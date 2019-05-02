import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';
import { DATA_SERVER_VALUE_LENGTH } from '../../../constants';

export default class CDSOperatorControlKickoutClientResp extends Socket.ResponseBase {
	parseResp(bytes) {
    bytes.readUnsignedShort();
    bytes.readUnsignedShort();
    
    this.vid = bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_VIDEO_ID);
    this.username = bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_USER_NAME);
    this.reason = bytes.readUnsignedInt();
	}
}