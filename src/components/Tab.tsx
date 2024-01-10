'use client';

import {ITabItem} from "@/components/ITabItem";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from '@fortawesome/free-solid-svg-icons';
import IconButton from "@/components/IconButton";

export function Tab({item, onSelect, onRemove}: {
    item: ITabItem,
    onSelect?: () => void,
    onRemove?: () => void
}) {
    const className = `tab ${item.selected ? 'selected' : ''}`;
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

// <script setup lang="ts">
// import {ITabItem} from "@/components/ITabItem";
// import IconButton from "@/components/IconButton.vue";
// import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
// import {computed} from "vue";
//
// const props = defineProps<{
//   item: ITabItem;
// }>();
//
// defineEmits<{
//   (e: 'edit', value: string): void;
//   (e: 'remove'): void;
//   (e: 'select'): void;
// }>();
//
// const icon = computed(() => {
//   return props.item.icon.split(':');
// })
//
// </script>
//
// <template>
//   <li :class="{selected:item.selected}"
//       @dblclick="(event) => {
//             const input = (event.currentTarget as HTMLElement)?.querySelector('input');
//             if (input) {
//               input.style.pointerEvents = '';
//               input.focus();
//               input.select();
//             }
//           }">
//     <button @click="() => {if (!item.selected) $emit('select')}">
//       <input v-if="item.editable" :value="item.name"
//              style="pointer-events: none"
//              @change="(event) => $emit('edit', (event.target as HTMLInputElement).value)"
//              @blur="(event) => (event.target as HTMLInputElement).style.pointerEvents = 'none'">
//       <span class="name" v-if="item.name">{{ item.name }}</span>
//       <span class="icon" v-if="item.icon">
//         <FontAwesomeIcon :icon="`fa-${icon[1] ?? 'solid'} fa-${icon[0]}`"/>
//       </span>
//     </button>
//     <IconButton v-if="item.removable" @click="$emit('remove')" icon="xmark"/>
//   </li>
// </template>
//
// <style scoped lang="scss">
// li.selected {
//   color: red;
// }
// </style>