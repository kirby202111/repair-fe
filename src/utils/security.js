import Oidc from "oidc-client";
var config = {
    authority: process.env.VUE_APP_SIS_AUTHORITY_URL, //VUE_APP_SIS_AUTHORITY_URL: https://192.168.1.245:44310/
    client_id: "mfeClient",
    redirect_uri: window.location.origin + "/callback", // http://192.168.1.245:8000/callback
    response_type: "id_token token",
    scope: "openid profile mfe_api email",
    post_logout_redirect_uri: window.location.origin + "/index", // http://192.168.1.245:8000/index
    userStore: new Oidc.WebStorageStateStore({ store: window.sessionStorage })
};
const mgr = new Oidc.UserManager(config);

export default mgr;