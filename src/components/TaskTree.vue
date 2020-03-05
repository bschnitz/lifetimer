<template>
  <ul>
    <li ref="tasks" v-for="(task, index) in tasks" :key="task.id">
      <TaskRow
      :ref="task.id"
      :initId=task.id
      :index=index
      @removeTask='removeTask'
      @newTaskRow='focusNewTaskRow'
      @destroyedTaskRow='focusNextAtIndex'
      />
    </li>
    <li><TaskRow ref=addTask @newTask='addTask' /></li>
  </ul>
</template>

<script>
import TaskRow from './TaskRow.vue'
import { mapState } from 'vuex'

export default {
  name: 'TaskTree',
  components: {
    TaskRow
  },
  computed: mapState(['tasks']),
  created() {
    window.store = this.$store
    this.$store.subscribe((mutation, state) => {
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    })
  },
  methods: {
    addTask (text) {
      this.$store.dispatch('addTask', {text: text})
    },
    removeTask (id) {
      this.$store.commit('removeTask', id);
    },
    focusNewTaskRow (id, elem) {
      if (id !== undefined) {
        elem.childNodes[0].focus();
      }
    },
    focusNextAtIndex (index) {
      let next = this.$refs['tasks'][index]
      if (next === undefined) {
        next = this.$refs['addTask'].$el
      }
      else {
        next = next.childNodes[0]
      }
      next.childNodes[0].focus()
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
li > div {
  display: flex;
  justify-content:  space-between;
}

input[type='submit'] {
  margin-bottom: .5em;
  border: 2px solid #62E200;
  border-left: 0;
  border-radius: 0 .5em .5em 0;
}

input[type='submit']:focus {
  outline: none;
}

input[type='submit']:hover {
  border: 2px solid #AA00A2;
  box-shadow: 0 0 10px #AA00A2;
}

input[type='text'] {
  flex-grow: 1;
  font-family: sans-serif;
  box-sizing: border-box;
  display: block;
  padding: .5em;
  margin-bottom: .5em;
  border: 2px solid #62E200;
  border-radius: .5em 0 0 .5em;
  /*width: 100%;*/
}

input[type='text']:focus {
  outline: none;
  border: 2px solid #AA00A2;
  box-shadow: 0 0 10px #AA00A2;
  background-color: #E1FA71;
  color: #AA00A2;
}

</style>
