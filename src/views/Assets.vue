<!-- 
	This is the tables page, it uses the dashboard layout in: 
	"./layouts/Dashboard.vue" .
 -->

<template>
	<div>
		<!-- Projects Table -->
		<a-row :gutter="24" type="flex">

			<!-- Projects Table Column -->
			<a-col :span="24" class="mb-24">

				<!-- Projects Table Column -->
				<CardAssetTable
					:data="tableData"
					:columns="tableColumns"
				></CardAssetTable>
				<!-- / Projects Table Column -->
				

			</a-col>
			<!-- / Projects Table Column -->

		</a-row>
		<!-- / Projects Table -->

	</div>
</template>

<script>

	// "Projects" table component.
	import CardAssetTable from '../components/Cards/CardAssetTable' ;
	
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
		{
			key: '7',
			company: {
				name: 'toilet',
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
		{
			key: '8',
			company: {
				name: 'dumpster',
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
		{
			key: '9',
			company: {
				name: 'compost',
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
		{
			key: '10',
			company: {
				name: 'dear120a-mac',
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
			CardAssetTable,
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