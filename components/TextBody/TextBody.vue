<template>
	<robin-editor class="editor" @cancel="hideEditor" @save="saveEditor" v-model="html" :imageUploader="uploadImg"
		:muiltImage="true">
	</robin-editor>
</template>

<script>
	export default {
		name: "TextBody",
		data() {
			return {
				html = ""
			}
		},
		methods: {
			uploadImg() {
				console.log(666)
			},
			hideEditor(){
				console.log("hideEditor")
			},
			saveEditor(){
				console.log("saveEditor")
			}
		},
	}
</script>

<style>

</style>
