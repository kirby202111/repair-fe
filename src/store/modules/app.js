// let currOidcUserStore = sessionStorage[`oidc.user:${process.env.VUE_APP_SIS_AUTHORITY_URL}:js`] ? JSON.parse(sessionStorage[`oidc.user:${process.env.VUE_APP_SIS_AUTHORITY_URL}:js`]) : {};
let currOidcUserStore = sessionStorage[`oidc.user:localhost:8300:js`] ? JSON.parse(sessionStorage[`oidc.user:localhost:8300:js`]) : {};
export default {
    namespaced: true,
    state: {
        oidcUserStore: currOidcUserStore
    },
    mutations: {
        // 设置当前oidc连接信息
        SET_OIDC_USER_STORE(state, data) {
            state.oidcUserStore = data;
            sessionStorage.oidcUserStore = JSON.stringify(data);
        }
    },
    actions: {
        // 设置当前oidc连接信息
        setOidcUserStore({
            commit
        }, data) {
            commit('SET_OIDC_USER_STORE', data)
        }
    }
}