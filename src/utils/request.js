import axios from "axios";
import { ElMessage } from 'element-plus'
import router from '../router'
import store from '../store'
// import mgr from '../utils/security'
/** 
 * 提示函数 
 */

const tip = msg => {
    ElMessage({
        showClose: true,
        message: msg,
        duration: 1000,
    });
}

/** 
* 跳转登录页
* 携带当前页面路由，以期在登录页面完成登录后返回当前页面
*/
const toLogin = () => {
    router.replace({
        path: '/login',
        query: {
            redirect: router.currentRoute.value.fullPath
        }
    });
}

const service = axios.create({
    timeout: 1000 * 30
});
// 设置post请求头
service.defaults.headers.post['Content-Type'] = 'application/json';

/** 
 * 请求拦截器 
 * 每次请求前，如果存在token则在请求头中携带token 
 */
service.interceptors.request.use(
    config => {
        // 登录流程控制中，根据本地是否存在token判断用户的登录情况        
        // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token        
        // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码        
        // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。 
        //const accessToken = store.state.app.oidcUserStore.access_token;
        if (sessionStorage.oidcUserStore != null) {
            const accessToken = JSON.parse(sessionStorage.oidcUserStore).access_token;
            accessToken && (config.headers.Authorization = "Bearer " + accessToken);
        }
        return config;
        // if (sessionStorage.getItem("user_token")) { // 判断是否存在token，如果存在的话，则每个http header都加上token
        //     config.headers.Authorization = 'Bearer ' + sessionStorage.getItem("user_token")
        // }
        // return config
    },
    error => Promise.error(error))

// 响应拦截器
service.interceptors.response.use(
    // 请求成功
    res => res.status === 200 ? Promise.resolve(res) : Promise.reject(res),
    error => {
        const {
            response
        } = error;
        if (response) {
            // 请求已发出，但是不在2xx的范围 
            //errorHandle(response.status, response.data.message);
            if (response.status == 403) {
                tip('登录过期，请重新登录');
                sessionStorage.removeItem(`oidc.user:${process.env.VUE_APP_SIS_AUTHORITY_URL}:js`);
                store.commit('loginSuccess', null);
                setTimeout(() => {
                    toLogin();
                }, 1000);
            }
            return Promise.reject(response);
        } else {
            // 处理断网的情况
            // eg:请求超时或断网时，更新state的network状态
            // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
            // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
            if (!window.navigator.onLine) {
                tip('网络连接不上');
                // store.commit('changeNetwork', false);
            } else {
                return Promise.reject(error);
            }
        }
    }
)

//封装函数
//请求核心函数
function request(options) {
    options.method = options.method || 'get'
    //get方法则将参数通过请求行传递
    if (options.method.toLowerCase() === 'get') {
        options.params = options.data;
    }
    return service(options);
}

['get', 'post', 'put', 'delete', 'patch'].forEach((item) => {
    request[item] = (url, data, options) => {
        return request({
            url,
            data,
            method: item,
            ...options
        })
    }
})

export default request;
