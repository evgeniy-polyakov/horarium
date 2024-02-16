import {IMenuItem} from "@/components/IMenuItem";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretRight} from '@fortawesome/free-solid-svg-icons'
import {KeyboardEvent, useEffect, useRef} from "react";
import {classList} from "@/models/classList";
import {Key} from "@/models/Key";
import {useKeyDownRepeater} from "@/models/KeyDownRepeater";

export interface IMenu {
    items: IMenuItem[],
    x: number,
    y: number,
    viewportWidth: number,
    viewportHeight: number,
    remove?: () => void
}

export function Menu({items, x, y, remove, viewportWidth, viewportHeight}: IMenu) {

    const nav = useRef<HTMLElement>(null);
    const navKeyRepeater = useKeyDownRepeater();

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

    useEffect(() => {
        const menu = nav.current;
        if (menu) {
            menu.style.left = "0";
            menu.style.top = "0";
            menu.querySelectorAll("ul").forEach(it => {
                it.style.display = "block";
                it.style.left = "100%";
                it.style.right = "auto";
                it.style.top = "0";
                it.style.bottom = "auto";
            });
            const widthWithSubmenu = menu.scrollWidth;
            const heightWithSubmenu = menu.scrollHeight;
            const width = menu.offsetWidth;
            const height = menu.offsetHeight;
            const isRight = x > viewportWidth - width;
            const isBottom = y > viewportHeight - height;
            const isRightSubmenu = x > viewportWidth - widthWithSubmenu;
            const isBottomSubmenu = y > viewportHeight - heightWithSubmenu;
            menu.querySelectorAll("ul").forEach(it => {
                it.style.display = "";
                it.style.left = "";
                it.style.right = "";
                it.style.top = "";
                it.style.bottom = "";
            });
            menu.style.left = `${isRight ? x - width : x}px`;
            menu.style.top = `${isBottom ? y - height : y}px`;
            menu.classList.toggle("menu-right", isRightSubmenu);
            menu.classList.toggle("menu-bottom", isBottomSubmenu);
            menu.focus();
        }
    });

    function onKeyDown(e: KeyboardEvent, item?: IMenuItem) {
        const key = e.key;
        if (key === Key.Escape) {
            e.preventDefault();
            remove?.();
        } else if (key === Key.Home || key === Key.End) {
            e.preventDefault();
            const list = [...(
                nav.current?.querySelector('li:focus')?.parentElement?.children ??
                nav.current?.querySelectorAll('.root-menu > li') ?? [])
            ].filter(li => (li as HTMLElement).tabIndex >= 0);
            if (list.length > 0) {
                (list[key === Key.Home ? 0 : list.length - 1] as HTMLElement).focus();
            }
        } else if (key === Key.ArrowDown || key === Key.ArrowUp) {
            e.preventDefault();
            if (navKeyRepeater.onKeyDown(key)) {
                const li = nav.current?.querySelector('li:focus');
                if (li) {
                    const sibling = key === Key.ArrowDown ? "nextElementSibling" : "previousElementSibling";
                    for (let next = li[sibling]; next; next = next[sibling]) {
                        if ((next as HTMLElement).tabIndex >= 0) {
                            (next as HTMLElement).focus();
                            break;
                        }
                    }
                } else {
                    const list: NodeListOf<HTMLElement> | undefined = nav.current?.querySelectorAll('.root-menu > li[tabindex]');
                    const index = key === Key.ArrowDown ? 0 : (list?.length ?? 1) - 1;
                    list?.item(index)?.focus();
                }
            }
        } else if (key === Key.ArrowRight || (key === Key.Enter && item?.items?.length)) {
            e.preventDefault();
            if (navKeyRepeater.onKeyDown(key)) {
                const list: NodeListOf<HTMLElement> | undefined = nav.current?.querySelectorAll('li:focus > ul > li[tabindex]');
                if (list?.length) {
                    const li = list.item(0);
                    li.parentElement?.closest('li')?.classList.add('expanded');
                    li.focus();
                }
            }
        } else if (key === Key.ArrowLeft) {
            e.preventDefault();
            if (navKeyRepeater.onKeyDown(key)) {
                const li = nav.current?.querySelector('li:focus')?.parentElement?.closest('li');
                li?.classList.remove('expanded');
                li?.focus();
            }
        } else if (key === Key.Enter && item) {
            e.preventDefault();
            onSelect(item);
        }
    }

    function onKeyUp(e: KeyboardEvent) {
        navKeyRepeater.onKeyUp(e.key);
    }

    function onMouseOver() {
        nav.current?.focus();
        nav.current?.querySelectorAll('li.expanded').forEach(li => li.classList.remove('expanded'));
    }

    function onSelect(item: IMenuItem) {
        remove?.();
        item.select?.();
    }

    function renderItems(items: IMenuItem[], root?: boolean) {
        return (<ul className={classList({"root-menu": root})}>
            {items.map((item, i) => item.separator ? (
                <li key={i} className="separator"></li>
            ) : (
                <li key={i} tabIndex={item.disabled ? -1 : i}
                    className={classList(item.className, {disabled: item.disabled})}
                    onClick={e => onSelect(item)}
                    onKeyDown={e => onKeyDown(e, item)} onKeyUp={onKeyUp}
                    onMouseOver={onMouseOver}>
                    <span className="icon">{item.icon && <FontAwesomeIcon icon={item.icon}/>}</span>
                    <span className="name">{item.name}</span>
                    <span className="keys">{item.keys}</span>
                    {item.items && <span className="expand"><FontAwesomeIcon icon={faCaretRight}/></span>}
                    {item.items && renderItems(item.items)}
                </li>
            ))}
        </ul>);
    }

    return (
        <nav className="menu" ref={nav} tabIndex={0}
             style={{display: items.length > 0 ? "block" : "none"}}
             onContextMenu={e => e.preventDefault()}
             onKeyDown={onKeyDown} onKeyUp={onKeyUp}>
            {renderItems(items, true)}
        </nav>
    );
}