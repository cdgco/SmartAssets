import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

let routes = [{
        // will match everything
        path: '*',
        component: () =>
            import ('../views/404.vue'),
    },
    {
        path: '/',
        name: 'Home',
        beforeEnter: (to, from, next) => {
            if (to.name !== 'Sign-In' && localStorage.getItem("user") === null) next({
                name: 'Sign-In'
            })
            else next()
        },
        redirect: '/dashboard',
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        layout: "dashboard",
        beforeEnter: (to, from, next) => {
            if (to.name !== 'Sign-In' && localStorage.getItem("user") === null) next({
                name: 'Sign-In'
            })
            else next()
        },
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import ( /* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
    },
    {
        path: '/assets',
        name: 'Assets',
        layout: "dashboard",
        component: () =>
            import ('../views/Assets.vue'),
        beforeEnter: (to, from, next) => {
            if (to.name !== 'Sign-In' && localStorage.getItem("user") === null) next({
                name: 'Sign-In'
            })
            else next()
        },
    },
    {
        path: '/assets/new',
        name: 'New Asset',
        layout: "dashboard",
        component: () =>
            import ('../views/CreateAsset.vue'),
        beforeEnter: (to, from, next) => {
            if (to.name !== 'Sign-In' && localStorage.getItem("user") === null) next({
                name: 'Sign-In'
            })
            else next()
        },
    },
    {
        path: '/assets/:id',
        name: 'Asset',
        layout: "asset",
        component: () =>
            import ('../views/Asset.vue'),
        beforeEnter: (to, from, next) => {
            if (to.name !== 'Sign-In' && localStorage.getItem("user") === null) next({
                name: 'Sign-In'
            })
            else next()
        },
    },
    {
        path: '/projects',
        name: 'Projects',
        layout: "dashboard",
        component: () =>
            import ('../views/Projects.vue'),
        beforeEnter: (to, from, next) => {
            if (to.name !== 'Sign-In' && localStorage.getItem("user") === null) next({
                name: 'Sign-In'
            })
            else next()
        },
    },
    {
        path: '/connections',
        name: 'Connections',
        layout: "dashboard",
        component: () =>
            import ('../views/Connections.vue'),
        beforeEnter: (to, from, next) => {
            if (to.name !== 'Sign-In' && localStorage.getItem("user") === null) next({
                name: 'Sign-In'
            })
            else next()
        },
    },
    {
        path: '/metrics',
        name: 'Metrics',
        layout: "dashboard",
        component: () =>
            import ('../views/Metrics.vue'),
        beforeEnter: (to, from, next) => {
            if (to.name !== 'Sign-In' && localStorage.getItem("user") === null) next({
                name: 'Sign-In'
            })
            else next()
        },
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
        beforeEnter: (to, from, next) => {
            if (to.name !== 'Sign-In' && localStorage.getItem("user") === null) next({
                name: 'Sign-In'
            })
            else next()
        },
    },
    {
        path: '/sign-in',
        name: 'Sign-In',
        component: () =>
            import ('../views/Sign-In.vue'),
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
    },
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