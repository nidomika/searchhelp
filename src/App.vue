<template>
  <div id="app">
    <SearchForm />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import SearchForm from './components/SearchForm.vue'

  export default defineComponent({
    components: {
      SearchForm
    }
  })
</script>

<style>
  /* Dodaj stylizację tutaj */
</style>
