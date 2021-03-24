<template>
  <div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      model: {}
    }
  },
  methods: {
    async submit () {
      const res = await this.$http.post('blogs', this.model)
      console.log(res)
    }
  }
}
</script>

<style lang="scss">

</style>
