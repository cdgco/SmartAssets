import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'

Vue.use(VueRouter)
const handleAuth = (to, from, next) => {
    var itemStr = localStorage.getItem("user")
    if (to.name !== 'Sign-In' && itemStr === null) {
        next({ name: 'Sign-In', query: { redirect: to.fullPath } })
    } else {
        var item = JSON.parse(itemStr)
        axios.post(process.env.VUE_APP_API_URL + "/users/token", {
                token: item.accessToken,
                refresh: item.refreshToken
            })
            .then(function(response) {
                if (response.data.success) {
                    const jwt = {
                        id: response.data.result.id,
                        accessToken: response.data.result.accessToken,
                        refreshToken: response.data.result.refreshToken
                    }
                    localStorage.setItem("user", JSON.stringify(jwt));
                    next()
                } else {
                    localStorage.removeItem("user")
                    next({ name: 'Sign-In', query: { redirect: to.fullPath } })
                }
            })
            .catch(function(error) {
                localStorage.removeItem("user")
                next({ name: 'Sign-In', query: { redirect: to.fullPath } })
            });
    }
}

let routes = [{
        // will match everything
        path: '*',
        component: () =>
            import ('../views/404.vue'),
    },
    {
        path: '/',
        name: 'Home',
        beforeEnter: handleAuth,
        redirect: '/dashboard',
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        layout: "dashboard",
        beforeEnter: handleAuth,
        component: () =>
            import ( /* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
    },
    {
        path: '/assets',
        name: 'Assets',
        layout: "dashboard",
        component: () =>
            import ('../views/Assets.vue'),
        beforeEnter: handleAuth
    },
    {
        path: '/assets/new',
        name: 'New Asset',
        layout: "new-asset",
        component: () =>
            import ('../views/CreateAsset.vue'),
        beforeEnter: handleAuth
    },
    {
        path: '/assets/new/:id',
        name: 'New Asset',
        layout: "new-asset",
        component: () =>
            import ('../views/CreateAsset.vue'),
        beforeEnter: handleAuth
    },
    {
        path: '/assets/:id',
        name: 'Asset',
        layout: "asset",
        component: () =>
            import ('../views/Asset.vue'),
        beforeEnter: handleAuth
    },
    {
        path: '/search',
        name: 'Search',
        layout: "dashboard",
        component: () =>
            import ('../views/Search.vue'),
        beforeEnter: handleAuth
    },
    {
        path: '/search/:id',
        name: 'Search',
        layout: "dashboard",
        component: () =>
            import ('../views/Search.vue'),
        beforeEnter: handleAuth
    },
    {
        path: '/projects',
        name: 'Projects',
        layout: "dashboard",
        component: () =>
            import ('../views/Projects.vue'),
        beforeEnter: handleAuth
    },
    {
        path: '/connections',
        name: 'Connections',
        layout: "dashboard",
        component: () =>
            import ('../views/Connections.vue'),
        beforeEnter: handleAuth
    },
    {
        path: '/metrics',
        name: 'Metrics',
        layout: "dashboard",
        component: () =>
            import ('../views/Metrics.vue'),
        beforeEnter: handleAuth
    },
    {
        path: '/account',
        name: 'Account',
        layout: "dashboard",
        meta: {
            layoutClass: 'layout-profile',
        },
        component: () =>
            import ('../views/Profile.vue'),
        beforeEnter: handleAuth
    },
    {
        path: '/sign-in',
        name: 'Sign-In',
        layout: "default",
        component: () =>
            import ('../views/Sign-In.vue'),
        beforeEnter: (to, from, next) => {
            var redirect = to.query.redirect
            if (localStorage.getItem("user") !== null && redirect !== undefined) {
                next({ path: redirect })
            } else if (localStorage.getItem("user") !== null) {
                next({
                    name: 'Dashboard'
                })
            } else next()
        }
    },
    {
        path: '/licenses',
        name: 'Licenses',
        component: () =>
            import ('../views/Licenses.vue'),
    },
    {
        path: '/sign-up',
        name: 'Sign-Up',
        meta: {
            layoutClass: 'layout-sign-up',
        },
        component: () =>
            import ('../views/Sign-Up.vue'),
        beforeEnter: (to, from, next) => {
            if (localStorage.getItem("user") !== null) next({
                name: 'Dashboard'
            })
            else next()
        }
    }
]

// Adding layout property from each route to the meta
// object so it can be accessed later.
function addLayoutToRoute(route, parentLayout = "default") {
    route.meta = route.meta || {};
    route.meta.layout = route.layout || parentLayout;

    if (route.children) {
        route.children = route.children.map((childRoute) => addLayoutToRoute(childRoute, route.meta.layout));
    }
    return route;
}


routes = routes.map((route) => addLayoutToRoute(route));

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return {
                selector: to.hash,
                behavior: 'smooth',
            }
        }
        return {
            x: 0,
            y: 0,
            behavior: 'smooth',
        }
    }
})

export default router