// i regret picking this feature!!!!!
// now i have to modify everyone's html !!!! 
// kill me
import { currentUser, onAuthReady }  from "../Role-based-access-control/auth.js";

let authInitialized = false;

const routes = {
    login: {
        page: "login-page/login",
        requiresAuth: false
    },
    signup: {
        page: "sign-up-page/signup",
        requiresAuth: false
    },
    operator_main: {
        page: "operator-dashboard/operator_dashboard",
        requiresAuth: true,
        roleRequired: "operator"
    },
    operator_stalls: {
        page: "operator-dashboard/stalls",
        requiresAuth: true,
        roleRequired: "operator"
    },
    vendor_main: {
        page: "vendor-pages/vendor-dashboard",
        requiresAuth: true,
        roleRequired: "vendor"  
    },
    patron_main: {
        page: "main-menu/mainmenu",
        requiresAuth: true,
        roleRequired: "patron"
    }
}

onAuthReady(() => {
    authInitialized = true;
    router(); // run first time after auth ready
})


// reference the iframe in index.html
const iframe = document.getElementById("page-frame");

function parseHash() {
    // location.hash = "#/signup?role=vendor"
    let full = location.hash.slice(2); // remove "#/"

    // if (!full) {
    //     full = "#/login";
    // }

    const [route, queryString] = full.split("?");

    const params = {};
    if (queryString) {
        queryString.split("&").forEach(pair => {
            const [key, value] = pair.split("=");
            params[key] = decodeURIComponent(value);
        });
    }
    
    return { route, params };
}

export function router() {
    console.log("running router");
    if (!authInitialized) return;
    // const routeName = location.hash.replace("#/", "") || "login";
    const { route: routeName, params } = parseHash();
    const route = routes[routeName]

    if (!route) {
        if (currentUser) {
            const role = localStorage.getItem("role");
            location.hash = `#/${role}_dash`;
        } else {
            location.hash = "#/login";
        }
        return;
    }

    // auth
    if (route.requiresAuth && !currentUser) {
        console.log("User not logged in")
        alert("User is not logged in")
        location.hash = "#/login";
        return;
    }

    // role guard yes
    if (route.roleRequired) {
        const userRole = localStorage.getItem("role");
        if (userRole !== route.roleRequired) {
            console.log("Access Denied lil bro")
            iframe.src = "../Role-based-access-control/access_denied.html";
            return;
        }
    }

    let src = `./features/${route.page}.html`;
    if (Object.keys(params).length) {
        src += "?" + new URLSearchParams(params).toString();
    }

    iframe.src = src;


}

window.router = router;

window.addEventListener("hashchange", router);
window.addEventListener("load", router);