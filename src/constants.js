export const VALUE_LENGTH = {
    LOGIN_NAME: 30,
    TOKEN: 16,
    PASSWORD: 16,
    NICK_NAME: 16,
    VID: 4,
    TEL: 20,
    URL: 200
};

export const RESPONSE_CODES = {
    SUCCESS: 0,
    MANAGER_ALREADY_IN_CHANNEL: 301,
    PERMISSION_DENIED: 302,
    LEVEL_NOT_ENOUGH: 303,
    REPEAT_LOGIN: 304,
    INVALID_DATA: 305,
    DELEGATOR_NOT_IN_LINE: 306,
    NO_FREE_CHANNELS: 307,
    DELEGATOR_HAS_TOKEN: 308,
    MANAGER_NOT_IN_CHANNEL: 309,
    CLIENT_IN_ANOTHER_CHANNEL: 310,
    ERR_INVL_PARAM: 401,
    ERR_DB: 402,
    ERR_PWD_ERROR: 403,
    ERR_NO_USER: 404,
    ERR_TIMEOUT: 405,
    ERR_SQL_ERROR: 406,
    ERR_NO_DBRECORD: 407,
    ERR_NO_LOGIN: 408
};

export const USER_STATE = {
    IDOL: 0,
    CONNECTING: 1,
    CONNECTED: 2,
    WAITING_MANAGER: 3,
    CHANGE_ANCHOR: 4,
    CHANGE_DEALER: 5,
    CHANGE_TABLE: 6,
    ANNOYING: 7,
    ADVERTISEMENT: 8
};

export const CALLING_MANAGER_STATES = [
    USER_STATE.WAITING_MANAGER,
    USER_STATE.CHANGE_ANCHOR,
    USER_STATE.CHANGE_DEALER,
    USER_STATE.CHANGE_TABLE,
    USER_STATE.ANNOYING,
    USER_STATE.ADVERTISEMENT
];

export const MANAGER_ACTIONS = {
    JOIN_CHANNEL: 0,
    LEAVE_CHANNEL: 1,
    MUTE_CLIENT: 2,
    UNMUTE_CLIENT: 3,
    MUTE_ANCHOR: 4,
    UNMUTE_ANCHOR: 5,
    KICKOUT_CLIENT: 6,
    BLACKLIST_CLIENT: 7
};

export const MUTE_STATE = {
    MUTE: 0,
    UNMUTE: 1
};

export const DATA_SERVER_VALUE_LENGTH = {
    VL_VIDEO_ID: 4,
    VL_USER_NAME: 30,
    VL_PSW: 16,
    VL_NICK_NAME: 16,
    VL_CURRENCY: 6,
    VL_DEALER_CODE: 8,
    VL_GAME_CODE: 14,
    VL_GM_TYPE: 4,
    VL_TIMESTAMP: 19,
    VL_BILL_NO: 16,
    VL_TBL_CODE: 4,
    VL_BANKER: 3,
    VL_PLAYER: 3,
    VL_URL: 200
};


export const QUERY_SERVER_VALUE_LENGTH = {
    PRODUCT_ID: 10,
    LOGIN_NAME: 30,
    BEGIN_TIME: 19,
    END_TIME: 19,
    GM_CODE: 14,
    GM_TYPE: 4,
    BILL_NO: 16,
    PLATFORM: 10,
    REQEXT: 30
};

export const ROLE = {
    NORMAL: 0,
    ADMIN: 1
};

export const CONTRACT_MODE = {
    OWNER: 0,
    SHARE: 1
};

export const MANAGER_ACTION_TYPE = {
    KICKOUT_CLIENT: 'kickout',
    BLACKLIST_CLIENT: 'blacklist',
    ADD_ANCHOR: 'addAnchor',
    EDIT_ANCHOR: 'editAnchor',
    ADD_MANAGER: 'addManager',
    EDIT_MANAGER: 'editManager'
}

export const DATA_SERVER_VIDEO_STATUS = {
    FREE: 0,	//空闲
    CONTRACTED: 1,	//包桌
    LOCKED: 2,	//已锁
    OTHER_LOCKED: 3,	//已锁
    TURN_CARD: 4,	//竞眯
    UNKNOWN: 5
}

export const DATA_SERVER_GAME_STATUS = {
    CLOSED: 0,	//游戏关闭
    CAN_BET: 1,	//下注状态
    DISPATCH_CARD: 2,	//正在发牌
    LAST_CALL: 3,
    TURN_CARD: 10,	//正在眯牌
    NEW_SHOE: 11,	//洗牌
    PAUSE_BET: 12,	//暂停下注
    UNKNOWN: 13
};

export const GAME_SERVER_RESPONSE_CODES = {
    SUCCESS: 0, // 成功
    ERR_INVL_PARAM: 1, // 无效参数
    ERR_DB: 2, // 数据库I/O失败
    ERR_PWD_ERROR: 3, // 密码错误,
    ERR_NO_USER: 4, // 用户不存在
    ERR_TIMEOUT: 5, // 超時
    ERR_SQL_ERROR: 6, // sql发生异常
    ERR_NO_DBRECORD: 7, // 不存在数据库记录
    ERR_NO_LOGIN: 8, // 用户未登录
    ERR_INVL_PLAYTYPE: 13, // 玩法无效
    ERR_NO_TABLE: 14, // 没有该台桌
    ERR_INVL_USER_TYPE: 15, // 用户类型无效
    ERR_INVL_GAME_STATUS: 16, // 游戏状态无效
    ERR_SEAT_OCCUPIED: 19, // 位置被占
    ERR_INVL_SEATNUM: 21, // 无效座位
    ERR_NOT_ON_SEAT: 24, // 不在座位上
    ERR_LESS_AMOUNT: 26, // 额度不够
    ERR_PERSONAL_LIMIT: 44, // 超个人盘口限额
    ERR_USER_FUNC_LIMIT: 45, // 试玩/真钱用户功能被限制
    ERR_LOW_VER: 46, // 登录时，版本比服务器低
    ERR_UNKNOWN_GAMETYPE: 48, // 未支持游戏类别
    ERR_INVL_ROUND: 50, // 无效期号
    ERR_USER_LIMITED: 51, //用户受限制
    ERR_USER_BET_LIMITED: 52, //用户下注受限制
    ERR_FOLLOW_TOO_MANY_MEMBERS: 53,
    ERR_LED_ENTER_COMMON_TYPE_ONLY: 54,
    ERR_NO_CREDIT_AND_CREDIT_SEQ_TOO_LOW: 78,
    ERR_SAME_BET_MODE: 88, //用户在用同一个下注模式
    ERR_SAME_OPEN_CARD_MODE: 89 //用户在用同一个开牌模式
};

export const PLAYTYPE = {
    BANKER: 1, // 庄
    PLAYER: 2, // 闲
    TIE: 3, // 和
    BANKER_PAIR: 4, // 闲对
    PLAYER_PAIR: 5, // 庄对,
    BIG: 6, //大
    SMALL: 7, //小
    BANKER_NO_COMMISSION: 11,
    BANKER_DRAGON_BONUS: 12, // 庄龙宝
    PLAYER_DRAGON_BONUS: 13, // 闲龙宝
    SUPER_SIX: 14, // 超级六
    ANY_PAIR: 15, // 任意对子
    PERFECT_PAIR: 16 // 完美对子
};

export const SUPPORT_PLAYTYPE = [
    PLAYTYPE.BANKER,
    PLAYTYPE.PLAYER,
    PLAYTYPE.TIE,
    PLAYTYPE.PLAYER_PAIR,
    PLAYTYPE.BANKER_PAIR,
    PLAYTYPE.BIG,
    PLAYTYPE.SMALL]
