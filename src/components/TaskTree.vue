<template>
  <ul>
    <li ref="tasks" v-for="(task, index) in tasks" :key="task.id">
      <TaskRow
      :ref="task.id"
      :index=index
      :task=task
      @changeTask='changeTask'
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
    this.$store.subscribe((mutation, state) => {
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    })
  },
  methods: {
    addTask (text) {
      this.$store.dispatch('addTask', {text: text})
    },
    changeTask (task) {
      this.$store.commit('mergeIntoTasks', task);
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
