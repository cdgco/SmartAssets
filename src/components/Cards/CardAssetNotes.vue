<template>

	<!-- Your Transactions Card -->
	<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{paddingTop: 0, paddingBottom: '16px' }">
		<template #title>
			<h6 class="font-semibold m-0">Notes</h6>
		</template>
		<a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
			<a-row>
				<a-col :span="24">
			        <a-textarea :rows="8" @change="onChange" />
				</a-col>
			</a-row>
			
			
			<a-form-item :wrapper-col="{ span: 24 }">
			<a-button type="primary" block html-type="submit">
				Save
			</a-button>
			</a-form-item>
  		</a-form>
	</a-card>
	<!-- / Your Transactions Card -->

</template>

<script>

	export default ({
		props: {
			data: {
				type: Array,
				default: () => [],
			},
		},
		data() {
			return {
			}
		},
	})

</script>