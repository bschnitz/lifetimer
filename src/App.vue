<template>
  <div id="app">
    <button id="backup" tabindex='-1' @click="backupTasks">
      Backup all Tasks
    </button>
    <TaskNodeTag class="root" :node=rootData />
  </div>
</template>

<script>
import TaskNodeTag from './components/TaskNodeTag.vue'


export default {
  name: 'App',
  components: {
    TaskNodeTag
  },
  computed: {
    rootData() {
      return this.$store.getters.getRootNode();
    }
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      state.tree.saveToLocalStorage('tasktree');
    })
  },
  methods: {
    backupTasks () {
      let FileSaver = require('file-saver');
      let tree = this.$store.state.tree;
      let json = JSON.stringify(tree.getRawDataCopy())
      let blob = new Blob([json], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, "task-backup.json");
    }
  }
}

</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

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
