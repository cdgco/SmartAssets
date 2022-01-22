<template>

	<!-- Orders History Timeline Card -->
	<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{paddingTop: '12px',}">
		<template #title>
			<h6>Recent Events</h6>			
		</template>
		<a-timeline :reverse="timelineReverse">
			<a-timeline-item color="green">
				Asset Created: owen233-02
				<p>09 JUN 7:20 PM</p>
			</a-timeline-item>
			<a-timeline-item color="green">
				Asset Created: owen233-01
				<p>08 JUN 12:20 PM</p>
			</a-timeline-item>
			<a-timeline-item color="orange">
				Asset Checked Out: echo
				<p>04 JUN 3:10 PM</p>
			</a-timeline-item>
			<a-timeline-item color="blue">
				Asset Modified: chmod
				<p>02 JUN 2:45 PM</p>
			</a-timeline-item>
			<a-timeline-item color="blue">
				Asset Modified: echo
				<p>18 MAY 1:30 PM</p>
			</a-timeline-item>
			<a-timeline-item color="red">
				Asset Deleted: owen233-02-old
				<p>14 MAY 3:30 PM</p>
			</a-timeline-item>
			<a-timeline-item color="red">
				Asset Deleted: owen233-01-old
				<p>14 MAY 3:30 PM</p>
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