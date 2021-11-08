// @ts-nocheck
import { createRouter as create, createWebHistory, createMemoryHistory } from 'vue-router'
import { createStore as createVuexStore } from 'vuex'
// @ts-expect-error
import * as Routes from '_build/ssr-temporary-routes'

import { RoutesType, VueRouterOptions } from './interface'

const { store, FeRoutes } = Routes as RoutesType

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

function createRouter (options: VueRouterOptions = {}) {
  const base = options.base ?? '/'
  return create({
    history: __isBrowser__ ? createWebHistory(base) : createMemoryHistory(),
    // @ts-expect-error
    routes: FeRoutes
  })
}

function createStore () {
  return createVuexStore(deepClone(store) ?? {})
}

export {
  createRouter,
  createStore
}
