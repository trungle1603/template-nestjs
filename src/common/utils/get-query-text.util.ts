export function getQueryText<T extends object, K extends keyof T>(
    filter: T,
    ...args: K[]
) {
    const query = { $text: { $search: '' } };
    let searchText = query.$text.$search;

    for (let i = 0, length = args.length; i < length; i++) {
        const key = args[i];

        if (filter[key]) {
            searchText += ` ${filter[key]}`;
        }
        delete filter[key];
    }

    query.$text.$search = searchText.trim();
    if (query.$text.$search) {
        Object.assign(filter, query);
    }
}
