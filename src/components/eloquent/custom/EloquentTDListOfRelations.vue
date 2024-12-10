<template>
  <div v-for="(o, ind) in object[field.id] || []" :key="`o-${ind}`">
    [{{ o.id }}] {{ o.title.ru }}
  </div>
</template>

<script setup lang="ts">
defineProps({
  field: { required: true, type: Object },
  object: { required: true, type: Object }
})
</script>
