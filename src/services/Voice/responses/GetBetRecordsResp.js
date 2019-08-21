import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';

const xml2js = require('xml2js');

export default class GetBetRecordsResp extends Socket.ResponseBase {
    parseResp(bytes) {
        const parser = new xml2js.Parser();

        this.xmlStr = bytes.readUTFBytes(bytes.length - 12);

        parser.parseString(this.xmlStr, (err, result) => {
            this.data = result;
        });
    }
}