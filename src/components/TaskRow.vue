<template>
  <div>
    <div class='row' :class="rowClass">
      <div class='status'>
          ✔
      </div>
      <input
        ref="text"
        type='text'
        class='task'
        :value="this.node.getText()"
        @input="onInput"
        @focus="onFocus"
        v-shortkey="getShortkeys()"
        @shortkey="bus.$emit($event.srcKey)"
        />
      <button type="submit" @click="showSubtree">
        {{countSubtasks}}
        <div class=arrow :class="arrowType"></div>
      </button>
    </div>
  </div>
</template>

<script>
import { TaskNode, TaskStatusEnum } from '../js/tasktree.js'

export default {
  name: 'TaskRow',
  props: {
    node: {
      type: TaskNode,
      required: false, // rows for adding tasks have no TaskNode
      default () {return new TaskNode();}
    },
    parent: {
      type: TaskNode,
      required: false,
      default () { return this.node.getParent(); }
    }
  },
  inject: ['bus'],
  methods: {
    getShortkeys () {
      return {
        setFocusToNextTaskRow:     ['ctrl', 'j'],
        setFocusToPreviousTaskRow: ['ctrl', 'k'],
        showSubtree:               ['ctrl', 'l'],
        hideSubtree:               ['ctrl', 'h'],
        toggleForm:                ['ctrl', 'm'],
        toggleCompleteTask:        ['enter'],
      };
    },
    onFocus () {
      this.bus.$emit('focusedTaskRow', this);
    },
    onInput (e) {
      this.bus.$emit('changeTask', {
        node:   this.node,
        parent: this.parent,
        data:   {text: e.target.value}
      });

      if (!this.node.hasId()) {
        this.$refs['text'].value = ''
      }
    },
    focus () {
      this.$refs['text'].focus()
    },
    getInputElement () {
      return this.$refs['text'];
    },
    showSubtree () {
      if (this.node.hasId()) {
        this.$parent.toggleShowSubtree()
      }
    },
    hideSubtree () {
      if (this.$parent === this.root) {
        return;
      }

      if (this.$parent.showSubtree) {
        this.$parent.toggleShowSubtree()
      }
      else if (this.$parent.$parent !== this.root) {
        this.$parent.$parent.toggleShowSubtree()
      }
    },
  },
  computed: {
    root () {
      return this.$parent.root;
    },
    countSubtasks () {
      return this.node.hasChilds() ? this.node.countChilds() : "";
    },
    arrowType () {
      return this.$parent.showSubtree ? 'down' : 'right';
    },
    rowClass () {
      return {
        'without-task':     this.node.getId()     === null,
        'without-subtasks': this.node.hasChilds() === false,
        'open':             this.node.getStatus() === TaskStatusEnum.open,
        'completed':        this.node.getStatus() === TaskStatusEnum.completed,
        'rejected':         this.node.getStatus() === TaskStatusEnum.rejected,
      }
    }
  },
  mounted() {
    this.focus()
  },
}
</script>

<style scoped>
div.status {
  border-radius: .5em 0 0 .5em;
  padding-left: .5em;
  padding-right: .5em;
  position: relative;
  background-color: #E1FA71;
  display: none;
}

div.completed div.status {
  display: flex;
  align-items: center;
}


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
  border: 0;
  border-radius: 0 .5em .5em 0;
  position: relative;
  padding-right: 1.25em;
}

.row.without-subtasks button {
  padding-right: .75em;
}

.row.without-task button {
  display: none;
}

button:focus {
  outline: none;
}

button:hover {
  background-color: #E1FA71;
}

input {
  flex-grow: 1;
  font-family: sans-serif;
  display: block;
  height: 1em;
  padding: .5em;
  border: 0;
  border-radius: .5em 0 0 .5em;
}

div.completed input {
  border-radius: 0;
}

input:focus {
  outline: none;
  background-color: #E1FA71;
}

.row.without-task input {
  border-radius: .5em;
}

div.row {
  display: flex;
  align-items: stretch;
  justify-content:  space-between;
  border: 2px solid #62E200;
  border-radius: .5em;
  margin-bottom: .5em;
}

div.row:focus-within {
  border: 2px solid #AA00A2;
  box-shadow: 0 0 10px #AA00A2;
  color: #AA00A2;
}
</style>
