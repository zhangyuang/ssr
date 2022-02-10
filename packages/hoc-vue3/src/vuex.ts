import { computed } from 'vue'
import { useStore } from 'vuex'
const mapState = <T = any>() => {
  const store = useStore()
  return Object.fromEntries(
    Object.keys(store.state).map(
      key => [key, computed(() => store.state[key] as T)]
    )
  )
}
const mapGetters = <T = any>() => {
  const store = useStore()
  return Object.fromEntries(
    Object.keys(store.getters).map(
      getter => [getter, computed(() => store.getters[getter] as T)]
    )
  )
}
const mapMutations = () => {
  const store = useStore()
  return Object.fromEntries(
    // @ts-expect-error
    Object.keys(store._mutations).map(
      // @ts-expect-error
      mutation => [mutation, value => store.commit(mutation, value)]
    )
  )
}
const mapActions = <T = any>() => {
  const store = useStore()
  return Object.fromEntries(
    // @ts-expect-error
    Object.keys(store._actions).map(
      // @ts-expect-error
      action => [action, async value => await (store.dispatch(action, value) as Promise<T>)]
    )
  )
}
export { mapState, mapGetters, mapMutations, mapActions }
