// i regret picking this feature!!!!!

async function loadPage(path) {
    const res = await fetch(`./features/${path}`);
    document.getElementById("app").innerHTML = await res.text()
}

const routes = {
    login_page: {
        render: () => loadPage("login-page/login.html")
    }
    
}