<template>

	<!-- Orders History Timeline Card -->
	<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{paddingTop: '12px',}">
		<template #title>
			<h6>History</h6>			
		</template>
		<a-timeline :reverse="timelineReverse">
			<a-timeline-item color="orange">
				Asset Checked In
				<p>09 JUN 3:10 PM</p>
			</a-timeline-item>
			<a-timeline-item color="orange">
				Asset Checked Out
				<p>04 JUN 3:10 PM</p>
			</a-timeline-item>
			<a-timeline-item color="blue">
				Asset Modified: Serial changed from xxx to xxx
				<p>18 MAY 1:30 PM</p>
			</a-timeline-item>
			<a-timeline-item color="green">
				Asset Created
				<p>09 JUN 7:20 PM</p>
			</a-timeline-item>
		</a-timeline>
	</a-card>
	<!-- / Orders History Timeline Card -->

</template>

<script>

	export default ({
		data() {
			return {

				// Whether or not the timeline in "Orders History" card is reversed.
				timelineReverse: false,
			}
		},
	})

</script>