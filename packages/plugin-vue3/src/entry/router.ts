// @ts-nocheck
import * as Vue from "vue";
// import * as Router from 'vue-router'

// const realVue: Vue = Vue.default || Vue
import {
  createRouter as create,
  createWebHistory,
  Router,
  createMemoryHistory,
} from "vue-router";

// realVue.use(RealRouter)

const feRoutes = require("ssr-temporary-routes/route");
const Home = { template: "<div>Home</div>" };
export function createRouter(): any {
  // console.log(isCsr);
  return create({
    history:
      "undefined" == typeof window ? createMemoryHistory() : createWebHistory(),
    routes: feRoutes,
    // history: createWebHistory(),
    // routes: [{ path: "/", component: Home, name: "home" }],
  });
}
