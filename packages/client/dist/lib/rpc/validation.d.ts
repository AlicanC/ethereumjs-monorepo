/**
 * middleware for parameters validation
 * @memberof module:rpc
 * @param method function to add middleware
 * @param requiredParamsCount required parameters count
 * @param validators array of validators
 */
export declare function middleware(method: any, requiredParamsCount: number, validators?: any[]): any;
/**
 * @memberof module:rpc
 */
export declare const validators: {
    /**
     * address validator to ensure has `0x` prefix and 20 bytes length
     * @param params parameters of method
     * @param index index of parameter
     */
    address(params: any[], index: number): {
        code: number;
        message: string;
    } | undefined;
    /**
     * hex validator to ensure has `0x` prefix
     * @param params parameters of method
     * @param index index of parameter
     */
    hex(params: any[], index: number): {
        code: number;
        message: string;
    } | undefined;
    /**
     * hex validator to validate block hash
     * @param params parameters of method
     * @param index index of parameter
     */
    blockHash(params: any[], index: number): {
        code: number;
        message: string;
    } | undefined;
    /**
     * validator to ensure valid block integer or hash, or string option ["latest", "earliest", "pending"]
     * @param params parameters of method
     * @param index index of parameter
     */
    blockOption(params: any[], index: number): {
        code: number;
        message: string;
    } | undefined;
    /**
     * bool validator to check if type is boolean
     * @param params parameters of method
     * @param index index of parameter
     */
    bool(params: any[], index: number): {
        code: number;
        message: string;
    } | undefined;
    /**
     * validator to ensure required transaction fields are present, and checks for valid address and hex values.
     * @param requiredFields array of required fields
     * @returns validator function with params:
     *   - @param params parameters of method
     *   - @param index index of parameter
     */
    transaction(requiredFields?: string[]): (params: any[], index: number) => any;
};
