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
				<CardProjectTable2
					:data="table2Data"
					:columns="table2Columns"
				></CardProjectTable2>
				<!-- / Projects Table Column -->

			</a-col>
			<!-- / Projects Table Column -->

		</a-row>
		<!-- / Projects Table -->

	</div>
</template>

<script>

	// "Projects" table component.
	import CardProjectTable2 from '../components/Cards/CardProjectTable2' ;
	
	// "Projects" table list of columns and their properties.
	const table2Columns = [
		{
			title: 'NAME',
			dataIndex: 'company',
			scopedSlots: { customRender: 'company' },
			width: 300,
		},
		{
			title: 'TECHNICIANS',
			dataIndex: 'members',
			scopedSlots: { customRender: 'members' },
		},
		{
			title: 'STATUS',
			dataIndex: 'status',
			class: 'font-semibold text-muted text-sm',
		},
		{
			title: 'COMPLETION',
			scopedSlots: { customRender: 'completion' },
			dataIndex: 'completion',
		},
		{
			title: '',
			scopedSlots: { customRender: 'editBtn' },
			width: 50,
		},
	];

	// "Projects" table list of rows and their properties.
	const table2Data = [
		{
			key: '1',
			company: {
				name: 'Reno Laptops 2022',
			},
			status: "working",
			members: [ "images/face-1.jpg", "images/face-4.jpg", "images/face-2.jpg", "images/face-3.jpg", ],
			completion: 60,
		},
		{
			key: '2',
			company: {
				name: 'Retire & Replace HP Z220s',
			},
			status: "working",
			members: [ "images/face-4.jpg", "images/face-3.jpg", ],
			completion: 10,
		},
		{
			key: '3',
			company: {
				name: 'Retire & Replace HP 8550s',
			},
			status: "done",
			members: [ "images/face-1.jpg", "images/face-2.jpg", "images/face-3.jpg", ],
			completion: {
				status: 'success',
				value: 100,
			},
		},
		{
			key: '4',
			company: {
				name: 'January 2022 Surplus',
			},
			status: "canceled",
			members: [ "images/face-1.jpg", "images/face-2.jpg", ],
			completion: {
				status: 'exception',
				value: 50,
			},
		},
		{
			key: '5',
			company: {
				name: 'Install Wi-Fi 6 Access Points',
			},
			status: "working",
			members: [ "images/face-1.jpg", "images/face-4.jpg", "images/face-2.jpg", "images/face-3.jpg", ],
			completion: 80,
		},
		{
			key: '6',
			company: {
				name: 'Upgrade Graduate Monitors',
			},
			status: "canceled",
			members: [ "images/face-1.jpg", "images/face-4.jpg", "images/face-3.jpg", ],
			completion: {
				status: 'exception',
				value: 0,
			},
		},
	];

	export default ({
		components: {
			CardProjectTable2,
		},
		data() {
			return {
				// Associating "Projects" table data with its corresponding property.
				table2Data: table2Data,

				// Associating "Projects" table columns with its corresponding property.
				table2Columns: table2Columns,
			}
		},
	})

</script>

<style lang="scss">
</style>