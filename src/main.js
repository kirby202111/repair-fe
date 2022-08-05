import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// 不用在main.js中引入vuex
// import vuex from "vuex"
import ElementPlus from 'element-plus'

// import request from './utils/request'

import api from '@/api'

import 'element-plus/dist/index.css'

console.log("环境变量:",import.meta.env.MODE)
console.log("环境变量:",import.meta.env)
const app = createApp(App);
// app.config.globalProperties.$request= request;
app.config.globalProperties.$api= api;
// 引入默认配置,见快速上手
app.use(ElementPlus,{size:"small"});   
// app.use(ElementPlus);   

// app.use(ElementPlusIconsVue);
// app.use(vuex);

app.use(router).mount('#app');
