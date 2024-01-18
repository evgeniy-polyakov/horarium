export function TableRowHeader({rowIndex}: {
    rowIndex: number
}) {
    return (
        <th>{rowIndex + 1}</th>
    );
}