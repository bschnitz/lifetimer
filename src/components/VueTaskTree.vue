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
    <VueTaskNode class="root" :node=rootData />
  </div>
</template>

<script>
import Vue from 'vue';
import { mapMutations } from 'vuex'

import TaskForm from './TaskForm.vue'
import VueTaskNode from './VueTaskNode.vue'

export default {
  name: 'VueTaskTree',
  data () {
    return {
      bus:            new Vue(),
      focusedTaskRow: undefined,
      showForm:       false,
    }
  },
  provide () {
    return {
      bus: this.bus
    }
  },
  components: {
    VueTaskNode,
    TaskForm,
  },
  computed: {
    rootData() {
      return this.$store.getters.getRootNode();
    }
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      state.tree.saveToLocalStorage('tasktree');
    });

    this.bus.$on('focusedTaskRow', (taskRow) => {
      this.focusedTaskRow = taskRow;
    });

    this.bus.$on('toggleCompleteTask', () => {
      this.toggleCompleteTask(this.focusedTaskRow.node);
    });
    this.bus.$on('changeTask',  (data) => {
      this.changeTask(data);
    });

    this.bus.$on('setFocusToNextTaskRow',     this.focusNextTaskRow);
    this.bus.$on('setFocusToPreviousTaskRow', this.focusPreviousTaskRow);
    this.bus.$on('toggleForm',                this.toggleForm);

    this.bus.$on('showSubtree', () => {this.focusedTaskRow.showSubtree()});
    this.bus.$on('hideSubtree', () => {this.focusedTaskRow.hideSubtree()});
  },
  methods: {
    ...mapMutations([
      'changeTask',
      'toggleCompleteTask',
    ]),
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
    },
    backupTasks () {
      let FileSaver = require('file-saver');
      let tree = this.$store.state.tree;
      let json = JSON.stringify(tree.getRawDataCopy())
      let blob = new Blob([json], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, "task-backup.json");
    },
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
