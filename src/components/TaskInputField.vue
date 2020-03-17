<template>
  <input
    ref="input"
    type='text'
    :value="this.value"
    v-shortkey="shortkeys"
    @shortkey=bus.$emit($event.srcKey)
    @input="onInput" />
</template>

<script>
import { TaskNode } from '../js/tasktree.js'

export default {
  name: 'TaskInputField',
  props: {
    node: {
      type: TaskNode,
      required: false, // forms/rows for adding tasks have no TaskNode
      default () {return new TaskNode();}
    },
    parent: {
      type: TaskNode,
      required: false,
      default () { return this.node.getParent(); }
    },
    field: {
      type: String,
      required: true
    },
    shortkeys: {}
  },
  inject: ['bus', 'shortkeys'],
  methods: {
    onInput (e) {
      this.bus.$emit('changeTask', {
        node:   this.node,
        parent: this.parent,
        data:   {text: e.target.value}
      });

      if (!this.node.hasId()) {
        this.$refs['text'].value = ''
      }
    },
    focus () {
      this.$refs['input'].focus()
    },
  },
  computed: {
    value () {
      return this.node.getFieldValue(this.field);
    }
  },
}
</script>

<style scoped>
</style>
