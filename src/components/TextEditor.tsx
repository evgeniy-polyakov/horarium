import {FileModel} from "@/models/FileModel";
import {useRef} from "react";

export function TextEditor({file}: {
    file: FileModel
}) {
    const textarea = useRef<HTMLTextAreaElement>(null);

    function onChangeText() {
        if (textarea.current) {
            file.textContent = textarea.current.value;
        }
    }

    return (
        <textarea ref={textarea}
                  onChange={() => {
                      if (textarea.current) {
                          file.textContent = textarea.current.value;
                      }
                  }}/>
    );
}

// <script setup lang="ts">
// import {onMounted, ref, watch} from "vue";
// import {useAppStore} from "@/stores/app";
// import {FileModel} from "@/models/FileModel";
//
// const store = useAppStore();
// let textarea = ref<HTMLTextAreaElement>();
// const scrollTop = 'TextEditor:scrollTop';
// const scrollLeft = 'TextEditor:scrollLeft';
//
// const onScrollTextarea = () => {
//   store.setFileState(scrollTop, textarea.value?.scrollTop ?? 0);
//   store.setFileState(scrollLeft, textarea.value?.scrollLeft ?? 0);
// };
//
// const onChangeText = () => {
//   const file = store.getSelectedFile();
//   if (file && textarea.value) {
//     file.textContent = textarea.value.value;
//   }
// };
//
// const onChangeSelectedFile = (file?: FileModel) => {
//   const ta = textarea.value;
//   if (ta) {
//     ta.value = file?.textContent ?? "";
//     ta.scrollTop = store.getFileState(scrollTop, 0);
//     ta.scrollLeft = store.getFileState(scrollLeft, 0);
//   }
// };
//
// watch(store.getSelectedFile, file => onChangeSelectedFile(file as FileModel));
//
// onMounted(() => {
//   onChangeSelectedFile(store.getSelectedFile() as FileModel);
// });
//
// </script>
//
// <template>
//   <textarea ref="textarea"
//             @change="onChangeText"
//             @scroll="onScrollTextarea"></textarea>
// </template>