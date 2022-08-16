import Oidc from "oidc-client";
var config = {
    authority: process.env.VUE_APP_SIS_AUTHORITY_URL, 
    client_id: "mfeClient",
    redirect_uri: window.location.origin + "/callback", 
    response_type: "id_token token",
    scope: "openid profile mfe_api email",
    post_logout_redirect_uri: window.location.origin + "/index", 
    userStore: new Oidc.WebStorageStateStore({ store: window.sessionStorage })
};
const mgr = new Oidc.UserManager(config);

export default mgr;