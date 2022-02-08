<template>
	<div id="app">
		<component :is="layout">
			<router-view />
		</component>
	</div>
</template>

<script>
	export default ({
		metaInfo: {
			title: process.env.VUE_APP_NAME,
			titleTemplate: process.env.VUE_APP_NAME + ' | %s'
		},
		computed: {
			// Sets components name based on current route's specified layout, defaults to
			// <layout-default></layout-default> component.
			layout() {
				return "layout-" + ( this.$route.meta.layout || "default" ).toLowerCase() ;
			}
		},
	})
	
</script>

<style lang="scss">
</style>