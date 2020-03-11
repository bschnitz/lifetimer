<template>
  <div id="app">
    <button id="backup" tabindex='-1' @click="backupTasks">
      Backup all Tasks
    </button>
    <Node class="root" :node=rootData />
  </div>
</template>

<script>
import Node from './components/Node.vue'


export default {
  name: 'App',
  components: {
    Node
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
      let json = JSON.stringify(this.rootData)
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
