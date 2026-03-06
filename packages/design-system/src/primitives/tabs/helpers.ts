export function normalizeTabsValue(value: string | number | null): string | undefined {
    if (value == null) return undefined;
    return String(value);
}
