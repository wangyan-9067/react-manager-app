import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';
import { VALUE_LENGTH } from '../../../constants';

export default class ManagerAllQueryResp extends Socket.ResponseBase {
	parseResp(bytes) {
		this.count = bytes.readUnsignedInt();
		this.allManagersList = [];

		for (let i = 0 ; i < this.count; i++) {
			const result = {};

			result.loginname = bytes.readUTFBytes(VALUE_LENGTH.LOGIN_NAME);
			result.password = bytes.readUTFBytes(VALUE_LENGTH.PASSWORD);
			result.nickName = bytes.readUTFBytes(VALUE_LENGTH.NICK_NAME);
			
			const urlLength = bytes.readUnsignedInt();
			result.url = bytes.readUTFBytes(urlLength);
			result.flag = bytes.readByte();

			this.allManagersList.push(result);
		}
	}
}