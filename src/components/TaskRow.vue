<template>
  <div>
    <input type='text' v-model="text" @input="onInput" />
    <input type="submit" tabindex="-1" :value="button" />
  </div>
</template>

<script>

export default {
  name: 'TaskRow',
  props: {
    initId: {
      type: Number,
      required: false
    },
    index: {
      type: Number,
      required: false
    }
  },
  data () {
    return {
      id: this.initId
    }
  },
  methods: {
    onInput (e) {
      if (this.id === undefined) {
        this.$emit('newTask', e.data)
      }
      else if (e.target.value === "") {
        this.$emit('removeTask', this.id)
      }
      else {
        this.$emit('input', e.data)
      }
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
    },
    button () {
      return "+";
    }
  },
  mounted() {
    this.$emit('newTaskRow', this.id, this.$el)
  },
  destroyed() {
    this.$emit('destroyedTaskRow', this.index)
  }
}
</script>

<style>
</style>
