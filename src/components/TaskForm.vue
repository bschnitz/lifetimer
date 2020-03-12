<template>
  <div class='wrapper'>
    <div class='form'>
      <input
        ref="text"
        type='text'
        :value="this.node.getText()"
        v-shortkey="getShortkeys()"
        @input="onInput"
        @shortkey="handleShortkey" />
    </div>
  </div>
</template>

<script>
import { TaskNode } from '../js/tasktree.js'
import { mapMutations } from 'vuex'

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
  methods: {
    ...mapMutations([
      'changeTask',
    ]),
    getShortkeys () {
      return {
        focusNext:          ['ctrl', 'j'],
        focusPrevious:      ['ctrl', 'k'],
        toggleForm:         ['ctrl', 'n'],
      };
    },
    handleShortkey (event) {
      switch (event.srcKey) {
        case 'toggleForm':
          this.$emit('toggleForm');
          break;
      }
    },
    focus () {
      this.$refs['text'].focus()
    },
    onInput (e) {
      this.changeTask({
        node: this.node,
        parent: this.parent,
        data: {text: e.target.value}
      });
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
