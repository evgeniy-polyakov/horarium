import './assets/scss/index.scss'

import {createApp} from 'vue'
import {createPinia} from 'pinia'

import App from './App.vue'
import router from './router'

import {library} from "@fortawesome/fontawesome-svg-core";
import {faPlus, faXmark} from "@fortawesome/free-solid-svg-icons";

library.add(faXmark, faPlus);

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
