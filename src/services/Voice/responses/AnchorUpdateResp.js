import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';

export default class AnchorUpdateResp extends Socket.ResponseBase {
	parseResp(bytes) {
		this.code = bytes.readUnsignedInt();
	}
}