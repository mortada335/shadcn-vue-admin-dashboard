import './assets/index.css'
import './assets/transitions.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { Icon } from '@iconify/vue';
import App from './App.vue'
import router from './plugins/router'
import i18n from './plugins/i18n'

const app = createApp(App)

app.use(createPinia())
app.use(VueQueryPlugin)
app.use(router)
app.component('icon', Icon);
app.use(i18n)
app.mount('#app')
