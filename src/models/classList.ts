export function classList(...lists: (string | undefined | Record<string, boolean | undefined>)[]) {
    return lists.map(list => {
        if (typeof list === "string") {
            return list;
        }
        if (typeof list === "object") {
            return Object.keys(list).filter(prop => list[prop]).join(" ");
        }
        return "";
    }).join(" ");
}