<template>
  <div id="app">
    <TaskTree/>
  </div>
</template>

<script>
import TaskTree from './components/TaskTree.vue'


export default {
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
