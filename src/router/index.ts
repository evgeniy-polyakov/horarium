import {createRouter, createWebHistory} from 'vue-router'
import FileView from "@/views/FileView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/:file?',
            component: FileView,
        },
    ]
});

export default router;
