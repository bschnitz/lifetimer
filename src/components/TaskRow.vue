<template>
  <Editable v-model="title" />
</template>

<script>
import Editable from './Editable.vue'

export default {
  name: 'TaskRow',
  props: {
    task: String
  },
  data: function() {
    return {
      title: this.task
    }
  },
  components: {
    Editable
  },
}
</script>

<style>
  
</style>
