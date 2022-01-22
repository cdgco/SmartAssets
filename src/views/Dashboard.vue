<!-- 
	This is the dashboard page, it uses the dashboard layout in: 
	"./layouts/Dashboard.vue" .
 -->

<template>
	<div>

		<!-- Charts -->
		<a-row :gutter="24" type="flex" align="stretch">
			<a-col :span="24" :lg="10" class="mb-24">

				<!-- Active Users Card -->
				<CardBarChart></CardBarChart>
				<!-- Active Users Card -->

			</a-col>
			<a-col :span="24" :lg="14" class="mb-24">
				
				<!-- Sales Overview Card -->
				<CardLineChart></CardLineChart>
				<!-- / Sales Overview Card -->

			</a-col>
		</a-row>
		<!-- / Charts -->

		<!-- Table & Timeline -->
		<a-row :gutter="24" type="flex" align="stretch">
			<!-- Table -->
			<a-col :span="24" :lg="16" class="mb-24">
				
				<!-- Projects Table Card -->
				<CardAssetTable
					:data="tableData"
					:columns="tableColumns"
				></CardAssetTable>
				<!-- / Projects Table Card -->
				
			</a-col>
			<!-- / Table -->

			<!-- Timeline -->
			<a-col :span="24" :lg="8" class="mb-24">

				<!-- Orders History Timeline Card -->
				<CardEventHistory></CardEventHistory>
				<!-- / Orders History Timeline Card -->

			</a-col>
			<!-- / Timeline -->
		</a-row>
		<!-- / Table & Timeline -->

	</div>
</template>

<script>

	// Bar chart for "Active Users" card.
	import CardBarChart from '../components/Cards/CardBarChart' ;

	// Line chart for "Sales Overview" card.
	import CardLineChart from '../components/Cards/CardLineChart' ;

	// "Projects" table component.
	import CardAssetTable from '../components/Cards/CardAssetTable' ;

	// Order History card component.
	import CardEventHistory from '../components/Cards/CardEventHistory' ;


	// "Projects" table list of columns and their properties.
	const tableColumns = [
		{
			title: 'NAME',
			dataIndex: 'company',
			scopedSlots: { customRender: 'company' },
			width: 300,
		},
		{
			title: 'USERS',
			dataIndex: 'members',
			scopedSlots: { customRender: 'members' },
		},
		{
			title: 'TYPE',
			dataIndex: 'budget',
			class: 'font-bold text-muted text-sm',
		},
	];

	// "Projects" table list of rows and their properties.
	const tableData = [
		{
			key: '1',
			company: {
				name: 'owen233-02',
				logo: 'images/desktop.png',
			},
			members: [ "images/face-1.jpg", "images/face-4.jpg", "images/face-2.jpg", "images/face-3.jpg", ],
			budget: 'Desktop',
			completion: 60,
		},
		{
			key: '2',
			company: {
				name: 'owen233-01',
				logo: 'images/desktop.png',
			},
			members: [ "images/face-4.jpg", "images/face-3.jpg", ],
			budget: 'Desktop',
			completion: 10,
		},
		{
			key: '3',
			company: {
				name: 'coe-support-xps',
				logo: 'images/laptop.png',
			},
			members: [ "images/face-1.jpg", "images/face-2.jpg", "images/face-3.jpg", ],
			budget: 'Laptop',
			completion: {
				label: '100',
				status: 'success',
				value: 100,
			},
		},
		{
			key: '4',
			company: {
				name: 'grep',
				logo: 'images/desktop.png',
			},
			members: [ "images/face-1.jpg", "images/face-2.jpg", ],
			budget: 'Desktop',
			completion: {
				label: '100',
				status: 'success',
				value: 100,
			},
		},
		{
			key: '5',
			company: {
				name: 'chmod',
				logo: 'images/desktop.png',
			},
			members: [ "images/face-1.jpg", "images/face-4.jpg", "images/face-2.jpg", "images/face-3.jpg", ],
			budget: 'Desktop',
			completion: 80,
		},
		{
			key: '6',
			company: {
				name: 'echo',
				logo: 'images/desktop.png',
			},
			members: [ "images/face-1.jpg", "images/face-4.jpg", "images/face-3.jpg", ],
			budget: 'Desktop',
			completion: {
				label: 'Cancelled',
				status: 'exception',
				value: 100,
			},
		},
	];

	export default ({
		components: {
			CardBarChart,
			CardLineChart,
			CardAssetTable,
			CardEventHistory
		},
		data() {
			return {

				// Associating table data with its corresponding property.
				tableData,

				// Associating table columns with its corresponding property.
				tableColumns
			}
		},
	})

</script>

<style lang="scss">
</style>