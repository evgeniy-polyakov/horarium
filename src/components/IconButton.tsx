import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {IconProp} from "@fortawesome/fontawesome-svg-core";

export function IconButton({icon, hint, onClick}: {
    icon: IconProp,
    hint?: string,
    onClick?: () => void,
}) {
    return (
        <button className="icon" onClick={onClick} title={hint}>
            <FontAwesomeIcon icon={icon}/>
        </button>
    );
}
