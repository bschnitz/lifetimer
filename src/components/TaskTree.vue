<template>
  <ul>
    <li v-for="task in tasks" :key="task.id">
      <TaskRow  :ref="task.id" :initId=task.id />
    </li>
    <li><TaskRow @newTask='addTask' /></li>
  </ul>
</template>

<script>
import TaskRow from './TaskRow.vue'

export default {
  name: 'TaskTree',
  props: {
    tasks: Array
  },
  components: {
    TaskRow
  },
  methods: {
    addTask: function(text) {
      this.$store.dispatch('addTask', {text: text}).then(id => {
        let newInput = this.$refs[id][0].$el.children[0];
        newInput.focus()
      });
    }
  },
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
input {
  font-family: sans-serif;
  box-sizing: border-box;
  display: block;
  padding: .5em;
  margin-bottom: .5em;
  border: 2px solid #62E200;
  border-radius: .5em;
  width: 100%;
}

input:focus {
  outline: none;
  border: 2px solid #AA00A2;
  box-shadow: 0 0 10px #AA00A2;
  background-color: #E1FA71;
  color: #AA00A2;
}

</style>
