<template>

	<!-- Active Users Card -->
	<a-card :bordered="false" class="dashboard-bar-chart">
		<chart-bar :height="220" :data="barChartData" v-if="loaded"></chart-bar>
		<a-skeleton active v-else/>
		<div class="card-title">
			<h6>New Assets</h6>
			<p v-if="loaded">than last week <span class="text-success">+23%</span></p>
		</div>
		<a-row class="card-footer" type="flex" justify="center" align="top">
			<a-col v-if="loaded" :span="6">
				<h4>14</h4>
				<span>Desktops</span>
			</a-col>
			<a-col v-if="loaded" :span="6">
				<h4>10</h4>
				<span>Laptops</span>
			</a-col>
			<a-col v-if="loaded" :span="6">
				<h4>3</h4>
				<span>Monitors</span>
			</a-col>
			<a-col v-if="loaded" :span="6">
				<h4>4</h4>
				<span>Other</span>
			</a-col>
			<a-skeleton active v-else/>
		</a-row>
	</a-card>
	<!-- Active Users Card -->

</template>

<script>

	// Bar chart for "Active Users" card.
	import ChartBar from '../Charts/ChartBar' ;

	export default ({
		components: {
			ChartBar,
		},
		data() {
			return {
				// Data for bar chart.
				barChartData: {
					labels: ["01", "02", "03", "04", "05", "06", "07", "08", "09"],
					datasets: [{
						label: "Sales",
						backgroundColor: '#fff',
						borderWidth: 0,
						borderSkipped: false,
						borderRadius: 6,
						data: [850, 600, 500, 620, 900, 500, 900, 630, 900],
						maxBarThickness: 20,
					}, ],
				},
				loaded : false
			}
		},
		methods: {
			async loading() {
				this.loaded = true
			}

		},
		 created() {
			setTimeout(this.loading, 1000);
		}
	})

</script>