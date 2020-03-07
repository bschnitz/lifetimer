<template>
  <div id="app">
    <TaskTree :tasks=tasks />
  </div>
</template>

<script>
import TaskTree from './components/TaskTree.vue'


export default {
  name: 'App',
  components: {
    TaskTree
  },
  computed: {
    tasks() {
      return this.$store.getters.getTasks();
    }
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      let tree = state.tree;
      localStorage.setItem('tasktree', JSON.stringify(tree.getRawData()));
    })
  },
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>
