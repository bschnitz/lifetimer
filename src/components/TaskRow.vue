<template>
  <div>
    <div class='row'>
      <input
        ref="text"
        type='text'
        :value="this.text"
        @input="onInput"
        @focus="onFocus"
        v-shortkey="{focusNext: ['ctrl', 'j'], focusPrevious: ['ctrl', 'k']}"
        @shortkey="handleShortkey"
      />
      <button
      v-if="this.id !== undefined"
      type="submit"
      @click="this.$parent.toggleShowSubtree"
      tabindex="-1"
      :class="[countSubtasks > 0 ? 'with-subtasks' : 'without-subtasks']"
      >
      {{countSubtasks}}
      <div class=arrow :class="[showSubtree ? 'down' : 'right']"></div>
      </button>
    </div>
    <TaskTree
    v-if="showSubtree"
    :tasks=tasks
    class='subtree'
    />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'TaskRow',
  components: {
    TaskTree: () => import('./TaskTree.vue')
  },
  props: {
    task: {
      type: Object,
      required: false
    },
    parentId: {
      type: Number,
      required: false // childs of root node have no parentId
    }
  },
  data () {
    return {
      showSubtree: false
    }
  },
  methods: {
    ...mapMutations([
      'changeTask',
      'removeTask',
      'addTask'
    ]),
    onFocus () {
      this.$parent.root.saveFocusedTaskRow(this);
    },
    onInput (e) {
      let task = {
        id: this.task === undefined ? undefined : this.task.id,
        parentId: this.parentId,
        text: e.target.value
      }
      if (this.id === undefined) {
        this.addTask(task)
        this.$refs['text'].value = ''
      }
      else if (task.text === "") {
        this.removeTask(task);
      }
      else {
        this.changeTask(task);
      }
    },
    focus () {
      this.$refs['text'].focus()
    },
    getInputElement () {
      return this.$refs['text'];
    },
    handleShortkey (event) {
      switch (event.srcKey) {
        case 'focusNext':
          this.$parent.root.focusNextTaskRow();
          break;
        case 'focusPrevious':
          this.$parent.root.focusPreviousTaskRow();
          break;
      }
    }
  },
  computed: {
    id () {
      return this.task === undefined ? undefined : this.task.id
    },
    text () {
      return this.task === undefined ? '' : this.task.text;
    },
    tasks () {
      return this.task.tasks !== undefined ? this.task.tasks : []
    },
    countSubtasks () {
      return this.tasks.length > 0 ? this.tasks.length : "";
    },
    arrow () {
      return this.showSubtree ? "⏷" : "⏵";
    },
  },
  mounted() {
    this.focus()
  },
}
</script>

<style scoped>
.arrow.right {
  position: absolute;
  box-shadow: 2px 2px #000;
  top: .75em;
  right: .675em;
  width: .5em;
  height: .5em;
  display: block;
  -moz-transform:rotate(-45deg);
  -webkit-transform:rotate(-45deg);
}

.arrow.down {
  position: absolute;
  box-shadow: 2px 2px #000;
  top: .5em;
  right: .375em;
  width: .5em;
  height: .5em;
  display: block;
  -moz-transform:rotate(45deg);
  -webkit-transform:rotate(45deg);
}

button {
  margin-bottom: .5em;
  border: 2px solid #62E200;
  border-left: 0;
  border-radius: 0 .5em .5em 0;
  position: relative;
  padding-right: 1.25em;
}

button.without-subtasks {
  padding-right: .75em;
}

button:focus {
  outline: none;
}

button:hover {
  border: 2px solid #AA00A2;
  box-shadow: 0 0 10px #AA00A2;
}

input[type='text'] {
  flex-grow: 1;
  font-family: sans-serif;
  display: block;
  height: 1em;
  padding: .5em;
  margin-bottom: .5em;
  border: 2px solid #62E200;
  border-radius: .5em 0 0 .5em;
}

input[type='text']:focus {
  outline: none;
  border: 2px solid #AA00A2;
  box-shadow: 0 0 10px #AA00A2;
  background-color: #E1FA71;
  color: #AA00A2;
}

div.row {
  display: flex;
  justify-content:  space-between;
}
</style>
