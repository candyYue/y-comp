import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/styles/index.scss'

// https://element-plus.org/zh-CN/guide/design.html#%E7%89%88%E6%9C%AC
import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css';
import locale from 'element-plus/lib/locale/lang/zh-cn'


import "./assets/styles/widget/button.scss";
import "./assets/styles/widget/auditions.scss";
import "./assets/styles/widget/voiceupload.scss";
import "./assets/styles/widget/message.scss";
import "./assets/styles/widget/modal.scss";


window.IEBrowser = window.ActiveXObject || 'ActiveXObject' in window

const app = createApp(App)
app.use(store).use(router).use(ElementPlus, { locale }).mount('#app')
