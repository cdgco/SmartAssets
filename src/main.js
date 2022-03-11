/*
=========================================================
Muse - Vue Ant Design Dashboard - v1.0.0
=========================================================

Product Page: https://www.creative-tim.com/product/vue-ant-design-dashboard
Copyright 2021 Creative Tim (https://www.creative-tim.com)
Coded by Creative Tim

=========================================================
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. 
*/

import Vue from 'vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from './App.vue'
import DefaultLayout from './layouts/Default.vue'
import DashboardLayout from './layouts/Dashboard.vue'
import DashboardRTLLayout from './layouts/DashboardRTL.vue'
import AssetLayout from './layouts/Asset.vue'
import NewAssetLayout from './layouts/NewAsset.vue'
import Toast from "vue-toastification";
import VueHtmlToPaper from 'vue-html-to-paper';
import "./css/toast.css";
import router from './router'
import axios from 'axios';
import VueMeta from 'vue-meta'

// import './plugins/click-away'

import './scss/app.scss';

import './registerServiceWorker'

Vue.use(Antd);
Vue.use(VueMeta);
Vue.use(Toast, {
    transition: "Vue-Toastification__bounce",
    maxToasts: 5,
    newestOnTop: true,
    filterBeforeCreate: (toast, toasts) => {
        if (toasts.filter(
                t => t.type === toast.type
            ).length !== 0) {
            // Returning false discards the toast
            return false;
        }
        // You can modify the toast if you want
        return toast;
    }
});

const options = {
    name: '_blank',
    specs: [
        'fullscreen=no',
        'titlebar=no',
        'scrollbars=no'
    ],
    styles: ['/css/tag1.css'],
    timeout: 1000, // default timeout before the print window appears
    autoClose: false, // if false, the window will not close after printing
}

Vue.use(VueHtmlToPaper, options);

Vue.config.productionTip = false

// Adding template layouts to the vue components.
Vue.component("layout-default", DefaultLayout);
Vue.component("layout-dashboard", DashboardLayout);
Vue.component("layout-dashboard-rtl", DashboardRTLLayout);
Vue.component("layout-asset", AssetLayout);
Vue.component("layout-new-asset", NewAssetLayout);

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')