<template>

	<!-- Your Transactions Card -->
	<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{paddingTop: 0, paddingBottom: '16px' }">
		<template #title>
			<h6 class="font-semibold m-0">SmartAssets API</h6>
		</template>
		<a-list
			class="transactions-list"
			item-layout="horizontal"
			:split="false"
			:data-source="data"
		>
			<a-list-item slot="renderItem" slot-scope="item">
				<template v-if="item.period">
					<h6>{{ item.period }}</h6>
				</template>
				<template v-else>
					<a-list-item-meta
						:title="item.title"
						:description="item.datetime"
					>
					</a-list-item-meta>
				</template>
			</a-list-item>
		</a-list>
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