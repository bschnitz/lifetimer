<template>
  <div id="app">
    <TaskTree :tasks="tasks" />
  </div>
</template>

<script>
import TaskTree from './components/TaskTree.vue'


export default {
  data: function() {
    return {
      tasks: this.$store.state.tasks
    }
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    })
  },
  name: 'App',
  components: {
    TaskTree
  }
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>
