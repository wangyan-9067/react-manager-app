import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';
import { VALUE_LENGTH } from '../../../constants';

export default class WaitingListResp extends Socket.ResponseBase {
	parseResp(bytes) {
		this.count = bytes.readUnsignedInt();
		this.delegatorList = [];

		for (let i = 0 ; i < this.count; i++) {
			this.delegatorList.push({
				name: bytes.readUTFBytes(VALUE_LENGTH.LOGIN_NAME),
				tel: bytes.readUTFBytes(VALUE_LENGTH.TEL),
				waitingStartTime: bytes.readUnsignedInt(),
				token: bytes.readByte()
			});
		}
	}
}