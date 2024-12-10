<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps({
  object: {
    required: true,
    type: Object
  }
})

const router = useRouter()

const showScheme = async () => {
  await router.push({ name: 'scheme', params: { id: props.object.id } })
}

const rowClicked = () => {
  showScheme()
}

defineExpose({ rowClicked })
</script>
