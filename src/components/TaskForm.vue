<template>
  <div class='wrapper'>
    <div class='form'>
      <TaskInputField
        ref=text
        :node=node
        :parent=parent
        field=text />
    </div>
  </div>
</template>

<script>
import TaskInputField from './TaskInputField.vue'
import { TaskNode } from '../js/tasktree.js'

export default {
  name: 'TaskForm',
  props: {
    node: {
      type: TaskNode,
      required: true,
    },
    parent: {
      type: TaskNode,
      required: false,
      default () { return this.node.getParent(); }
    }
  },
  components: {
    TaskInputField
  },
  methods: {
    focus () {
      this.$refs['text'].focus()
    },
  },
  mounted() {
    this.focus()
  },
}
</script>

<style scoped>
.wrapper {
  position: absolute;
  top: 10px;
}

.form {
  left: 0;
  top: 0;
  z-index: 1;
  display: block;
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.4);
}
</style>
