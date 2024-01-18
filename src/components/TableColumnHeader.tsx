export function TableColumnHeader({cellIndex}: {
    cellIndex: number
}) {
    return (
        <th>{cellIndex >= 0 ? cellIndex + 1 : ""}</th>
    );
}