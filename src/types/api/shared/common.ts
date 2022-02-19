type ErrorCode = number;
type Sequence = number;

/**
 * ユーザーのアクセストークンを使ってはいけない
 */
type AccessToken = never;
type WID = number;

/**
 * @package
 */
export type CurrencyInfo = {
    Cash: number;
    FreeCash: number;
    Metal: number;
    FreeMetal: number;
    Nutrient: number;
    FreeNutrient: number;
    Power: number;
    FreePower: number;
};

/**
 * @package
 */
export type ReqBase = {
    AccessToken: AccessToken;
    Sequence: Sequence;
    WID: WID;
};

/**
 * @package
 */
export type ResBase = {
    ErrorCode: ErrorCode;
    Sequence: Sequence;
};
