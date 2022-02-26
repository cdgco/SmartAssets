<template>
	<div>
		<div class="profile-nav-bg" style="background-image: url('images/bg-profile.jpg')"></div>
		<a-card :bordered="false" class="card-profile-head" :bodyStyle="{padding: 0,}">
			<template #title>
				<a-row type="flex" align="middle">
					<a-col :span="24" :md="12" class="col-info">
						<a-avatar :size="74" shape="square" src="images/Face-new.png" />
						<div class="avatar-info">
							<h4 class="font-semibold m-0">Carter Roeser</h4>
							<p>CEO / Co-Founder</p>
						</div>
					</a-col>
				</a-row>
			</template>
		</a-card>

		<a-row type="flex" :gutter="24">

			<a-col :span="24" :md="8" class="mb-24">

				<CardPlatformSettings></CardPlatformSettings>

			</a-col>
			<a-col :span="24" :md="8" class="mb-24">

				<CardProfileInformation></CardProfileInformation>

			</a-col>
			<a-col :span="24" :md="8" class="mb-24">
				<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{paddingTop: '12px',}">
					<template #title>
						<h6>Recent Events</h6>			
					</template>
					<a-timeline v-if="events.length > 0" :reverse="timelineReverse">
						<a-timeline-item v-for="item in events" :key="item._id" :color="item.color">
							{{ item.title }}
							<p>{{ formatDate(item.createdAt) }}</p>
						</a-timeline-item>
					</a-timeline>
					<a-empty v-else />
				</a-card>
			</a-col>
		</a-row>
	</div>
</template>

<script>

	import CardPlatformSettings from "../components/Cards/CardPlatformSettings"
	import CardProfileInformation from "../components/Cards/CardProfileInformation"
	import { getEvents } from "../components/event.script";

	export default ({
		metaInfo: {
			title: 'Profile',
		},
		components: {
			CardPlatformSettings,
			CardProfileInformation,
		},
		data() {
			var jsonToken = localStorage.getItem("user")
            var rawToken = JSON.parse(jsonToken)
            var accessToken = rawToken.accessToken
			return {
				accessToken: accessToken,
				rawToken: rawToken,
				profileHeaderBtns: 'overview',
				timelineReverse: false,
				events: []
			}
		},
		methods: {
			formatDate(date) {
				var options = { year: 'numeric', month: 'short', day: 'numeric', hour: "numeric", minute: "numeric", second: "numeric" };
				var curDate  = new Date(date);
				return curDate.toLocaleDateString("en-US", options)
			},
			async queryEvent() {
                this.item = {
                    items: 7,
					user: this.rawToken.id,
                    type: "all",
					token: this.accessToken
                    };
                var response = await getEvents(this.item);
                if (response.data.success) {
					this.events = response.data.result;
                } else {
                    console.log(response.data.errors);
                }
			}
		},
		created() {
			this.queryEvent()
		}
	})

</script>