export function uniqueArray(value: string[]): string[] {
    if (value?.length < 2) {
        return value;
    }

    const uniqueReceivers = new Set(value);
    return Array.from(uniqueReceivers);
}
