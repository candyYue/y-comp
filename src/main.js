import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/styles/index.scss'

window.IEBrowser = window.ActiveXObject || 'ActiveXObject' in window

const app = createApp(App)
app.use(store).use(router).mount('#app')
