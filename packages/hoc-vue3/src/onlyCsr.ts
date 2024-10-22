import { defineComponent, onMounted, ref } from 'vue'

const onlyCsr = defineComponent({
	setup(_, { slots }) {
		const show = ref(false)
		onMounted(() => {
			show.value = true
		})
		return () => (show.value && slots.default ? slots.default() : null)
	}
})

export { onlyCsr }
