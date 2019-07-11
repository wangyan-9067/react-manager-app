import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';

const xml2js = require('xml2js');

export default class GetBetRecordsResp extends Socket.ResponseBase {
    parseResp(bytes) {
        const parser = new xml2js.Parser();

        this.loginname = bytes.readUTFBytes(30);
        this.cmd = bytes.readInt();
        this.length = bytes.readInt();
        this.seq = bytes.readInt();

        this.xmlStr = bytes.readUTFBytes(bytes.length - 12 - 30 - 12);

        parser.parseString(this.xmlStr, (err, result) => {
            this.data = result;
        });
    }
}