// @ts-nocheck
import * as Vue from 'vue'
import * as Vuex from 'vuex'
import * as Router from 'vue-router'

import { FeRoutes, store } from '_build/ssr-temporary-routes'
import { VueRouterOptions } from './interface'

// without tsconfig esModuleInterop options must use the compatible syntax
const RealVue = Vue.default || Vue
const RealRouter = Router.default || Router
const RealVuex = Vuex.default || Vuex

RealVue.use(RealRouter)
RealVue.use(RealVuex)

function deepClone (item) {
  if (!item) { return item } // null, undefined values check

  var types = [Number, String, Boolean]
  var result

  // normalizing primitives if someone did new String('aaa'), or new Number('444');
  types.forEach(function (type) {
    if (item instanceof type) {
      result = type(item)
    }
  })

  if (typeof result === 'undefined') {
    if (Object.prototype.toString.call(item) === '[object Array]') {
      result = []
      item.forEach(function (child, index, array) {
        result[index] = deepClone(child)
      })
    } else if (typeof item === 'object') {
      if (!item.prototype) { // check that this is a literal
        if (item instanceof Date) {
          result = new Date(item)
        } else {
          // it is an object literal
          result = {}
          for (var i in item) {
            // eslint-disable-next-line
            result[i] = deepClone(item[i])
          }
        }
      } else {
        result = item
      }
    } else {
      result = item
    }
  }

  return result
}

function createRouter (options: VueRouterOptions = {}): Router {
  return new RealRouter({
    mode: 'history',
    routes: FeRoutes,
    base: options.base ?? '/'
  })
}

function createStore () {
  return new Vuex.Store(deepClone(store) ?? {})
}

export {
  createRouter,
  createStore,
  RealVue,
  RealRouter,
  RealVuex
}
