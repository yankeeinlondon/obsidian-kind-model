<script setup lang="ts">
const _props = defineProps(["title"]);
const model = defineModel();

function submit() {
  //
}
function cancel() {
  //
}
</script>

<template>
  <div class="text-input-component">
    <h2>{{ title }}</h2>
    <input v-model="model" type="text" @keydown.enter.prevent="submit">
    <div class="buttons">
      <button class="mod-cta" @click="submit">
        Submit
      </button>
      <button @click="cancel">
        Cancel
      </button>
    </div>
  </div>
</template>
