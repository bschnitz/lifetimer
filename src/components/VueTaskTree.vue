<template>
  <div>
    <button id="backup" tabindex='-1' @click="backupTasks">
      Backup all Tasks
    </button>
    <TaskForm
      v-if='showForm'
      @toggleForm="toggleForm"
      :parent="focusedTaskRow.parent"
      :node="focusedTaskRow.node" />
    <VueTaskNode class="root" :node="this.tree.getRootNode()" />
  </div>
</template>

<script>
import Vue from 'vue';
import { TaskTree } from '../js/tasktree.js'

import TaskForm from './TaskForm.vue'
import VueTaskNode from './VueTaskNode.vue'

export default {
  name: 'VueTaskTree',
  data () {
    return {
      bus:            new Vue(),
      focusedTaskRow: undefined,
      showForm:       false,
      tree:           TaskTree.loadFromLocalStorage('tasktree')
    }
  },
  provide () {
    return {
      bus: this.bus,
      shortkeys: this.shortkeys
    }
  },
  components: {
    VueTaskNode,
    TaskForm,
  },
  created() {
    this.bus.$on('changeTask',  (data) => {this.changeTask(data);});
    this.bus.$on('focusedTaskRow', (taskRow) => {
      this.focusedTaskRow = taskRow;
    });

    this.registerShortkeys();
  },
  methods: {
    changeTask (payload) {
      let node   = payload.node;
      let parent = payload.parent;
      let data   = payload.data;

      if (!node.hasId()) {
        this.tree.addTask(parent, data);
      }
      else if (data.text === "" && !node.hasChilds()) {
        parent.removeChildNode(node);
      }
      else {
        node.setData(data);
      }

      this.tree.saveToLocalStorage('tasktree');
    },
    toggleCompleteTask() {
      this.focusedTaskRow.node.toggleComplete();
      this.tree.saveToLocalStorage('tasktree');
    },
    focusNextTaskRow () {
      let inputs = this.$el.querySelectorAll("input.task")
      let focusedInput = this.focusedTaskRow.getInputElement();

      for (let i = 0; i < inputs.length; i++) {
        if (inputs[i] === focusedInput) {
          if (inputs[i+1] !== undefined) {
            inputs[i+1].focus();
            return;
          }
        }
      }
    },
    focusPreviousTaskRow () {
      let inputs = this.$el.querySelectorAll("input.task")
      let focusedInput = this.focusedTaskRow.getInputElement();

      for (let i = 0; i < inputs.length; i++) {
        if (inputs[i] === focusedInput) {
          if (inputs[i-1] !== undefined) {
            inputs[i-1].focus();
            return;
          }
        }
      }
    },
    toggleForm () {
      this.showForm = !this.showForm;
      if (!this.showForm) {
        this.focusedTaskRow.focus();
      }
      this.registerShortkeys();
    },
    backupTasks () {
      let FileSaver = require('file-saver');
      let json = JSON.stringify(this.tree.getRawDataCopy())
      let blob = new Blob([json], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, "task-backup.json");
    },
    registerShortkeys () {
      this.bus.$off('SHORTKEY_C_M');
      this.bus.$off('SHORTKEY_C_J');
      this.bus.$off('SHORTKEY_C_K');
      this.bus.$off('SHORTKEY_C_L');
      this.bus.$off('SHORTKEY_C_H');
      this.bus.$off('SHORTKEY_ESC');
      this.bus.$off('SHORTKEY_C_ENTER');

      this.bus.$on('SHORTKEY_C_M', this.toggleForm);
      this.bus.$on('SHORTKEY_ENTER', () => {this.toggleCompleteTask()});
      if (this.showForm) {
        this.bus.$on('SHORTKEY_ESC', this.toggleForm);
      }
      else {
        this.bus.$on('SHORTKEY_C_J',     this.focusNextTaskRow);
        this.bus.$on('SHORTKEY_C_K', this.focusPreviousTaskRow);
        this.bus.$on('SHORTKEY_C_L', () => {this.focusedTaskRow.showSubtree()});
        this.bus.$on('SHORTKEY_C_H', () => {this.focusedTaskRow.hideSubtree()});
      }
    }
  },
  computed: {
    shortkeys () {
      return {
        SHORTKEY_C_J:   ['ctrl', 'j'],
        SHORTKEY_C_K:   ['ctrl', 'k'],
        SHORTKEY_C_L:   ['ctrl', 'l'],
        SHORTKEY_C_H:   ['ctrl', 'h'],
        SHORTKEY_C_M:   ['ctrl', 'm'],
        SHORTKEY_ESC:   ['esc'],
        SHORTKEY_ENTER: ['enter'],
      }
    }
  }
}
</script>

<style scoped>
button#backup {
  margin-top: 2em;
  margin-left: 1em;
  border: 2px solid #62E200;
  border-radius: .5em;
  padding: .4em;
}

.root {
  margin-left: 1em;
  margin-right: 1em;
}
</style>

<style>
button, input {
  margin: 0;
}
</style>
