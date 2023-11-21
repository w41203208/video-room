import { createApp } from 'vue';
import App from './App.vue';
import Antd from 'ant-design-vue';
import router from './router';
import store from './store';
import 'ant-design-vue/dist/antd.css';
import '@/index.css';

createApp(App).use(router).use(Antd).use(store).mount('#app');
