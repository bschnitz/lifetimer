<template>
  <ul>
    <li v-for="(task, index) in tasks" :key="task.id">
      <TaskRow
      :ref=index
      :index=index
      :task=task
      :parentId=parentId
      @changeTask='changeTask'
      @removeTask='removeTask'
      @newTaskRow='focusNewTaskRow'
      @destroyed='focusAfterDestroy'
      />
    </li>
    <li><TaskRow ref=addTask @addTask='addTask' /></li>
  </ul>
</template>

<script>
import TaskRow from './TaskRow.vue'
import { mapMutations } from 'vuex'

export default {
  name: 'TaskTree',
  props: {
    tasks: {
      type: Array,
      required: true
    },
    parentId: {
      type: Number,
      required: false
    }
  },
  components: {
    TaskRow
  },
  methods: {
    ...mapMutations([
      'changeTask',
      'removeTask',
      'addTask'
    ]),
    focusNewTaskRow (id, row) {
      if (id !== undefined) {
        row.focus()
      }
    },
    focusAfterDestroy (index) {
      this.$nextTick(function(){
        let rowAtIndex = this.$refs[index][0]
        if (rowAtIndex !== undefined) {
          rowAtIndex.focus()
        }
        else {
          this.$refs['addTask'].focus()
        }
      })
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

ul.subtree {
  margin: 0;
  margin-left: 10%;
}

li {
  margin: 0;
}

a {
  color: #42b983;
}
</style>
