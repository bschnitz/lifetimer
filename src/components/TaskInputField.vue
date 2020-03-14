<template>
  <input
    ref="input"
    type='text'
    :value="this.value"
    v-shortkey="shortkeys"
    @shortkey=onShortkey
    @input="onInput" />
</template>

<script>
import { mapMutations } from 'vuex'
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
  methods: {
    ...mapMutations([
      'changeTask',
    ]),
    onInput (e) {
      let data = {};
      data[this.field] = e.target.value;
      this.changeTask({
        node: this.node,
        parent: this.parent,
        data: data
      });

      if (!this.node.hasId()) {
        this.$refs['input'].value = ''
      }
    },
    focus () {
      this.$refs['input'].focus()
    },
    onShortkey (event) {
      this.$emit('shortkey', event);
    }
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
