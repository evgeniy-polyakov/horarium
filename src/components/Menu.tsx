import {IMenuItem} from "@/components/IMenuItem";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useEffect, useRef} from "react";

export function Menu({items, x, y, remove}: {
    items: IMenuItem[],
    x: number,
    y: number,
    remove?: () => void
}) {

    const nav = useRef<HTMLElement>(null);

    function onMouseDown(e: MouseEvent) {
        if (!nav.current?.contains(e.target as Node)) {
            remove?.();
        }
    }

    useEffect(() => {
        window.addEventListener("mousedown", onMouseDown, false);
        return () => {
            window.removeEventListener("mousedown", onMouseDown, false);
        }
    });

    return (
        <nav className="menu" ref={nav}
             style={{
                 left: `${x}px`,
                 top: `${y}px`,
                 display: items.length > 0 ? "block" : "none"
             }}>
            <ul>
                {items.map((item, i) => (
                    <li key={i} onClick={() => {
                        remove?.();
                        item.select?.();
                    }}>
                        <span className="icon">{item.icon && <FontAwesomeIcon icon={item.icon}/>}</span>
                        <span className="name">{item.name}</span>
                    </li>
                ))}
            </ul>
        </nav>
    );
}