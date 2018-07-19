// polyfill
import 'babel-polyfill';

import Vue from 'vue';
import App from './App';
import store from './store';
import VueResource from 'vue-resource'

Vue.config.devtools = true;
Vue.use(VueResource)

new Vue({
    el: 'body',
    components: { App },
    store: store
});
