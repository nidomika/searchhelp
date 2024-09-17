<template>
  <div>
    <h1>Sprawdź Wejściówkę</h1>
    <form @submit.prevent="onSubmit">
      <label for="name">Imię:</label>
      <input type="text" v-model="name" required />

      <label for="surname">Nazwisko:</label>
      <input type="text" v-model="surname" required />

      <button type="submit">Szukaj</button>
    </form>

    <div v-if="person">
      <p>Imię: {{ person.name }}, Nazwisko: {{ person.surname }}</p>
      <p>Status: {{ person.status }}</p>
      <button @click="markAsCollected">Oznacz jako odebrane</button>
    </div>

    <div v-if="errorMessage">{{ errorMessage }}</div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue'

  export default defineComponent({
    name: 'SearchForm',
    setup() {
      const name = ref('')
      const surname = ref('')
      const person = ref<{
        name: string
        surname: string
        status: string
      } | null>(null)
      const errorMessage = ref('')

      const onSubmit = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/api/search?name=${name.value}&surname=${surname.value}`
          )
          const data = await response.json()

          if (data && data.length) {
            person.value = data[0]
          } else {
            errorMessage.value = 'Nie znaleziono osoby o podanych danych.'
          }
        } catch (error) {
          errorMessage.value = 'Błąd w połączeniu z serwerem.'
        }
      }

      const markAsCollected = async () => {
        if (person.value) {
          try {
            await fetch('http://localhost:3000/api/collect', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(person.value)
            })
            person.value.status = 'Odebrano'
          } catch (error) {
            errorMessage.value = 'Nie udało się zaktualizować statusu.'
          }
        }
      }

      return { name, surname, person, errorMessage, onSubmit, markAsCollected }
    }
  })
</script>
