<template>
  <span contenteditable="true" @input="onInput" >{{ content }}</span>
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
    onInput () {
      this.$emit('input', this.$el.innerText)
    }
  },
  name: 'Editable',
}
</script>
