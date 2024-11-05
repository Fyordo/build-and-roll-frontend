import { createVuestic } from 'vuestic-ui'
import 'vuestic-ui/css'
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from "./router/router.js";

createApp(App)
    .use(createVuestic())
    .use(router)
    .mount('#app')
