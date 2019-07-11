import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';
import { VALUE_LENGTH } from '../../../constants';

export default class AnchorAllQueryResp extends Socket.ResponseBase {
    parseResp(bytes) {
        this.count = bytes.readUnsignedInt();
        this.allAnchorsList = [];

        for (let i = 0; i < this.count; i++) {
            const result = {};

            result.loginname = bytes.readUTFBytes(VALUE_LENGTH.LOGIN_NAME);
            result.password = bytes.readUTFBytes(VALUE_LENGTH.PASSWORD);
            result.nickname = bytes.readUTFBytes(VALUE_LENGTH.NICK_NAME);
            result.url = bytes.readUTFBytes(VALUE_LENGTH.URL);

            this.allAnchorsList.push(result);
        }
    }
}