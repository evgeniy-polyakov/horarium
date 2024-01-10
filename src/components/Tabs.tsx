'use client'

import {ITabItem} from "@/components/ITabItem";

export function Tabs(_: {
    items: ITabItem[],
    onRename?: (tab: ITabItem) => void,
    onSelect?: (tab: ITabItem) => void,
    onRemove?: (tab: ITabItem) => void,
}) {
    return (
        <nav>
            <ul>
                {_.items.map(item => <li key={item.key}>{item.name}</li>)}
            </ul>
        </nav>
    );
}

// <script setup lang="ts">
// import {ITabItem} from "@/components/ITabItem";
// import Tab from "@/components/Tab.vue";
// import IconButton from "@/components/IconButton.vue";
//
// defineProps<{
//   items: ITabItem[];
//   fixed?: boolean;
// }>();
//
// defineEmits<{
//   (e: 'addTab'): void;
//   (e: 'renameTab', index: number, value: string): void;
//   (e: 'removeTab', index: number): void;
//   (e: 'selectTab', index: number): void;
// }>();
//
// </script>
//
// <template>
//   <nav>
//     <ul>
//       <Tab v-for="(item, index) in items" :key="item.name" :item="item"
//            @edit="(value) => $emit('renameTab', index, value)"
//            @remove="() => $emit('removeTab', index)"
//            @select="() => {items.forEach((it, i) => it.selected = i === index); $emit('selectTab', index);}"/>
//       <li v-if="!fixed">
//         <IconButton icon="plus" @click="$emit('addTab')"/>
//       </li>
//     </ul>
//   </nav>
// </template>
