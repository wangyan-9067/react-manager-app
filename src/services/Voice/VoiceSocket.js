import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';

import ManagerLoginResp from './responses/ManagerLoginResp';
import ChannelListResp from './responses/ChannelListResp';
import ManagerActionResp from './responses/ManagerActionResp';
import AnchorsOnDutyResp from './responses/AnchorsOnDutyResp';
import ManagerAllQueryResp from './responses/ManagerAllQueryResp';
import AnchorAllQueryResp from './responses/AnchorAllQueryResp';
import WaitingListResp from './responses/WaitingListResp';
import CodeResp from './responses/CodeResp';
import QueryAllDelegatorResp from './responses/QueryAllDelegatorResp';
import GetBetRecordsResp from './responses/GetBetRecordsResp';
import { CONFIG, ENV } from '../../config';

import {
    MANAGER_LOGIN_R,
    CHANNEL_LIST_R,
    CHANNEL_JOIN_R,
    MANAGER_ACTION_R,
    ANCHORS_ON_DUTY_R,
    MANAGER_ADD_R,
    MANAGER_UPDATE_R,
    MANAGER_DELETE_R,
    MANAGER_ALL_QUERY_R,
    ANCHOR_ADD_R,
    // ANCHOR_UPDATE_R,
    ANCHOR_DELETE_R,
    ANCHOR_ALL_QUERY_R,
    MANAGER_KICKOUT_R,
    WAITING_LIST_R,
    ASSIGN_TOKEN_TO_DELEGATOR_R,
    KICK_LINEUP_PLAYER_R,
    ADD_DELEGATOR_R,
    DELETE_DELEGATOR_R,
    QUERY_ALL_DELEGATOR_R,
    ASSIGN_TABLE_TO_CHANNEL_R,
    GET_BET_RECORDS_R
} from '../../protocols';

export default class VoiceSocket extends Socket.WebSocketBase {
    constructor() {
        const config = {
            tag: '[VoiceSocket]',
            ucHeartBeatPeriod: 15000
        };
        super(config);
    }

    getUrlList() {
        return [CONFIG.VOICE_SERVER_URL[ENV]];
    }

    setupRespClazzMap() {
        this.respClazzMap.set(MANAGER_LOGIN_R, ManagerLoginResp);
        this.respClazzMap.set(CHANNEL_LIST_R, ChannelListResp);
        this.respClazzMap.set(CHANNEL_JOIN_R, CodeResp);
        this.respClazzMap.set(MANAGER_ACTION_R, ManagerActionResp);
        this.respClazzMap.set(ANCHORS_ON_DUTY_R, AnchorsOnDutyResp);

        this.respClazzMap.set(MANAGER_ADD_R, CodeResp);
        this.respClazzMap.set(MANAGER_UPDATE_R, CodeResp);
        this.respClazzMap.set(MANAGER_DELETE_R, CodeResp);
        this.respClazzMap.set(MANAGER_ALL_QUERY_R, ManagerAllQueryResp);
        this.respClazzMap.set(ANCHOR_ADD_R, CodeResp);
        this.respClazzMap.set(ANCHOR_DELETE_R, CodeResp);
        this.respClazzMap.set(ANCHOR_ALL_QUERY_R, AnchorAllQueryResp);
        this.respClazzMap.set(MANAGER_KICKOUT_R, CodeResp);

        this.respClazzMap.set(WAITING_LIST_R, WaitingListResp);
        this.respClazzMap.set(ASSIGN_TABLE_TO_CHANNEL_R, CodeResp);
        this.respClazzMap.set(ASSIGN_TOKEN_TO_DELEGATOR_R, CodeResp);
        this.respClazzMap.set(KICK_LINEUP_PLAYER_R, CodeResp);
        this.respClazzMap.set(ADD_DELEGATOR_R, CodeResp);
        this.respClazzMap.set(DELETE_DELEGATOR_R, CodeResp);
        this.respClazzMap.set(QUERY_ALL_DELEGATOR_R, QueryAllDelegatorResp);
        this.respClazzMap.set(GET_BET_RECORDS_R, GetBetRecordsResp);

    }
}
