<script setup lang="ts">

const props = defineProps(["title"]);
const model = defineModel();

const submit = () => {
// 
}
const cancel = () => {
// 
}


</script>

<template>
<div class="text-input-component">
	<h2>{{ title }}</h2>
	<input
		type="text"
		v-model="model"
		@keydown.enter.prevent="submit"
		ref="inputField"
	/>
	<div class="buttons">
		<button @click="submit" class="mod-cta">Submit</button>
		<button @click="cancel">Cancel</button>
	</div>
</div>

</template>

