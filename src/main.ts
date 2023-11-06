import './assets/scss/index.scss'

import {createApp} from 'vue'
import {createPinia} from 'pinia'

import App from './App.vue'
import router from './router'

import {library} from "@fortawesome/fontawesome-svg-core";
import {faFileDownload, faPlus, faXmark} from "@fortawesome/free-solid-svg-icons";
import {faFolderOpen} from "@fortawesome/free-regular-svg-icons";

library.add(faXmark, faPlus, faFolderOpen, faFileDownload);

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
