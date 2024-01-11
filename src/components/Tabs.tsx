import {ITabItem} from "@/components/ITabItem";
import {Tab} from "@/components/Tab";

export function Tabs<T extends ITabItem>({items, onRename, onSelect, onRemove}: {
    items: T[],
    onRename?: (tab: T) => void,
    onSelect?: (tab: T) => void,
    onRemove?: (tab: T) => void,
}) {
    return (
        <ul className="tabs">
            {items.map(item => (
                <Tab key={item.key} item={item}
                     onSelect={() => onSelect?.(item)}
                     onRemove={() => onRemove?.(item)}
                />
            ))}
        </ul>
    );
}