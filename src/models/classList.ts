export function classList(...lists: (string | Record<string, boolean>)[]) {
    return lists.map(list => {
        if (typeof list === "string") {
            return list;
        }
        return Object.keys(list).filter(prop => list[prop]).join(" ");
    }).join(" ");
}