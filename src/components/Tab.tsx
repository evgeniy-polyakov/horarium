import {ITabItem} from "@/components/ITabItem";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from '@fortawesome/free-solid-svg-icons';
import {IconButton} from "@/components/IconButton";

export function Tab({item, onSelect, onRemove}: {
    item: ITabItem,
    onSelect?: () => void,
    onRemove?: () => void
}) {
    const className = `tab ${item.selected ? 'selected' : ''} ${item.editable ? 'editable' : ''}`;
    return (
        <li className={className}>
            <button className="label" onClick={() => {
                if (!item.selected) {
                    onSelect?.();
                }
            }}>
                {item.icon && <span className="icon"><FontAwesomeIcon icon={item.icon}/></span>}
                {item.name && <span className="name">{item.name}</span>}
            </button>
            {item.removable && <IconButton icon={faXmark} onClick={onRemove}/>}
        </li>
    );
}