export function isContainEncoded(str: string): boolean {
    // ie ?,=,&,/ etc
    return decodeURI(str) !== decodeURIComponent(str);
}
