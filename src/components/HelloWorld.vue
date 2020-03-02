<template>
  <ul>
    <li v-for="task in store.tasks" :key="task"><TaskRow v-bind:task=task /></li>
  </ul>
</template>

<script>
import TaskRow from './TaskRow.vue'

export default {
  name: 'HelloWorld',
  props: {
    store: Object
  },
  components: {
    TaskRow
  }
}
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
  margin: 2em;
}
li {
  margin: 0;
}
a {
  color: #42b983;
}
</style>

<style type="text/css" media="screen">
span {
  display: block;
  padding: .5em;
  margin: .5em;
  border: 2px solid #62E200;
  border-radius: .5em;
}

span:focus {
  outline: none;
  border: 2px solid #AA00A2;
  box-shadow: 0 0 10px #AA00A2;
  background-color: #E1FA71;
  color: #AA00A2;
}

</style>
