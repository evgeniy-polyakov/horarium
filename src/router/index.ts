import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FileView from "@/views/FileView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: HomeView,
            children: [
                {
                    path: '/:file',
                    component: FileView,
                }
            ]
        },
    ]
});

export default router;
