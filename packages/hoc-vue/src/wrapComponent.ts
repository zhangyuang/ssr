const wrapComponent = (WrappedComponent) => {
  return {
    data () {
      return {

      }
    },
    fetch: WrappedComponent.fetch,
    async beforeMount () {
      if (WrappedComponent.fetch) {
        await WrappedComponent.fetch(this.$store)
      }
    },
    render: h => h(WrappedComponent)
  }
}

export {
  wrapComponent
}
