<!-- 
	This is the tables page, it uses the dashboard layout in: 
	"./layouts/Dashboard.vue" .
 -->

<template>
	<div>

		<!-- Authors Table -->
		<a-row :gutter="24" type="flex">

			<!-- Authors Table Column -->
			<a-col :span="24" class="mb-24">

				<!-- Authors Table Card -->
				<NewAssetForm></NewAssetForm>
				<!-- / Authors Table Card -->

			</a-col>
			<!-- / Authors Table Column -->

		</a-row>
		<!-- / Authors Table -->

	</div>
</template>

<script>
	import NewAssetForm from '../components/Cards/NewAssetForm' ;

	export default ({
		metaInfo: {
			title: 'New Asset',
		},
		components: {
			NewAssetForm
		},
		data() {
			return {
			}
		},
	})

</script>

<style lang="scss">
</style>