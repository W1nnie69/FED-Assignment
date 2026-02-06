// i regret picking this feature!!!!!
// now i have to modify everyone's html !!!! 
// kill me
import { currentUser }  from "../Role-based-access-control/auth_guard.js";

const routes = {
    login: {
        page: "login-page/login",
        requiresAuth: false
    },
    signup: {
        page: "sign-up-page/signup",
        requiresAuth: false
    },
    operator_dash: {
        page: "operator-dashboard/operator_dashboard",
        requiresAuth: true,
        roleRequired: "operator"
    }

}

function loadPageCSS(page) {
    // remove old css
    const existingCSS = document.getElementById("page-style");
    if (existingCSS) existingCSS.remove();

    // add new css
    const link = document.createElement("link");
    link.id = "page-style";
    link.rel = "stylesheet";
    link.href = `./feature/${page}.css`;
    document.head.appendChild(link);
}

export async function router() {
    const app = document.getElementById("app");
    const routeName = location.hash.replace("#/", "") || "login";
    const route = routes[routeName]

    if (!route) {
        app.innerHTML = "<h1>404</h1>";
        return; 
    }

    // auth
    if (route.requiresAuth && !currentUser) {
        location.hash = "/login";
        return;
    }

    // role guard yes
    if (route.roleRequired) {
        const userRole = localStorage.getItem("role");
        if (userRole !== route.roleRequired) {
            app.innerHTML = "<h1>403 Access Denied</h1>"
            return;
        }
    }

    // load page & it's css
    const res = await fetch(`./features/${route.page}.html`)
    app.innerHTML = await res.text();
    loadPageCSS(page);
}

window.addEventListener("hashchange", router);
window.addEventListener("load", router);