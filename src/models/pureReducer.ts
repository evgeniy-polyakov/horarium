/**
 * React calls reducer twice with the same parameters to make sure the function is pure.
 * This hack ensures the reducer is called only once.
 */
export function pureReducer<F extends (...args: any) => any>(f: F): F {
    let first: any = undefined;
    let result: any = undefined;
    return ((...args: any) => {
        if (first !== args[0]) {
            first = args[0];
            result = f(...args);
        }
        return result;
    }) as F;
}