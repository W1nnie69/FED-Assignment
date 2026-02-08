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
    vendor_main: {
        page: "vendor-pages/vendor-dashboard",
        requiresAuth: true,
        roleRequired: "vendor"  
    },
    customer_main: {
        page: "main-menu/mainmenu",
        requiresAuth: true,
        roleRequired: "customer"
    },
    nea_main: {
        page: "nea/neaofficer-dashboard",
        requiresAuth: true,
        roleRequired: "nea"
    }
}

onAuthReady(() => {
    authInitialized = true;
    router(); // run first time after auth ready
})


// reference the iframe in index.html
const iframe = document.getElementById("page-frame");

// for when user signup. The hash will be something like: #/signup?role="customer"
// so this function extract the role and the route separately from hash ^
function parseHash() {
    let full = location.hash.slice(2); // remove "#/"

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

// main routing function
export function router() {
    console.log("running router");
    if (!authInitialized) return;
    const { route: routeName, params } = parseHash();
    const route = routes[routeName]

    // When user refreshes the page, it will bring them back to login
    // This condition below checks if the role has been stored in sessionStorage and will redirect accordingly  
    if (!route) {
        if (currentUser) {
            const role = sessionStorage.getItem("role");

            // If the role is null, it will redirect to login
            if (role != null) {
                location.hash = `#/${role}_main`;
            } else {
                location.hash = "#/login";
            }
        
        // If user is not logged in, it will redirect to login
        } else {
            location.hash = "#/login";
        }
        return;
    }

    // This handles the login/auth requirement where if a page requires the user to be logged in, it will check 
    // whether if currentUser is null or not 
    if (route.requiresAuth && !currentUser) {
        console.log("User not logged in")
        alert("User is not logged in")
        location.hash = "#/login";
        return;
    }

    // This handles the role requirement where if a page is exclusive to a role, the IF block will check below
    // And if the current user's role doesnt match, it will send them to the access_denied page
    if (route.roleRequired) {
        const userRole = sessionStorage.getItem("role");
        if (userRole !== route.roleRequired) {
            console.log("Access Denied lil bro")
            iframe.src = "./features/Role-based-access-control/access_denied.html";
            return;
        }
    }

    // adds back the ?role="customer" if needed.
    let src = `./features/${route.page}.html`;
    if (Object.keys(params).length) {
        src += "?" + new URLSearchParams(params).toString();
    }

    // page finally loads here
    iframe.src = src;


}

window.router = router;

window.addEventListener("hashchange", router);
window.addEventListener("load", router);