<template>
  <div>
    <input v-model="text" @input="onInput" />
  </div>
</template>

<script>

export default {
  name: 'TaskRow',
  props: {
    initId: {
      type: Number,
      required: false
    }
  },
  data: function() {
    return {
      id: this.initId
    }
  },
  methods: {
    onInput: function(e) {
      if (this.id === undefined) {
        this.$emit('newTask', e.data)
      }
      this.$emit('input', e.data)
    },
  },
  computed: {
    text: {
      get() {
        let task = this.$store.getters.getTaskById(this.id)
        return typeof task === 'undefined' ? '' : task.text;
      },
      set(value) {
        if (typeof this.id !== 'undefined') {
          this.$store.commit('mergeIntoTasks', {id: this.id, text: value});
        }
      }
    }
  },
}
</script>

<style>
</style>
