<template>
  <span contenteditable="true" @input="handleInput">{{ content }}</span>
</template>

<script>
export default {
  props: {
    value: String
  },
  data: function() {
    return {
      content: this.value
    }
  },
  methods: {
    handleInput () {
      this.$emit('input', this.$el.innerText)
    }
  },
  name: 'Editable',
}
</script>
