<template>
  <div id="app">
    <Node :node=rootData />
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
      return this.$store.getters.getRootNodeRawData();
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
