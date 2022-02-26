<template>
	
	<!-- Main Sidebar -->
	<component :is="navbarFixed ? 'a-affix' : 'div'" :offset-top="top">

		<!-- Layout Header -->
		<a-layout-header>
			<a-row type="flex">

				<!-- Header Breadcrumbs & Title Column -->
				<a-col :span="24" :md="6">

					<!-- Header Breadcrumbs -->
					<a-breadcrumb>
						<a-breadcrumb-item><router-link to="/"><a-icon type="home" /></router-link></a-breadcrumb-item>
						<a-breadcrumb-item><router-link to="/assets/"> Assets</router-link></a-breadcrumb-item>
						<a-breadcrumb-item>{{ this.$route.name }} {{ this.$route.params.id }}</a-breadcrumb-item>
					</a-breadcrumb>
					<!-- / Header Breadcrumbs -->

					<!-- Header Page Title -->
					<div class="ant-page-header-heading">
						<span class="ant-page-header-heading-title">{{ this.pageTitle }}</span>
					</div>
					<!-- / Header Page Title -->

				</a-col>
				<!-- / Header Breadcrumbs & Title Column -->

				<!-- Header Control Column -->
				<a-col :span="24" :md="18" class="header-control">
					<a-button type="link" @click="logout()">
						<a-icon type="logout" style="font-size:20px" />
					</a-button>

					<!-- Header Control Buttons -->
					<a-dropdown :trigger="['click']" overlayClassName="header-notifications-dropdown" :getPopupContainer="() => wrapper">
						<a-badge count="4">
							<a class="ant-dropdown-link" @click="e => e.preventDefault()">
								<a-icon type="bell" theme="filled" style="font-size: 20px"/>
							</a>
						</a-badge>
						
						<a-list item-layout="horizontal" class="header-notifications-list" :data-source="notificationsData" slot="overlay">
							<a-list-item slot="renderItem" slot-scope="item">
								<a-list-item-meta>
									<template #description>
										<a-icon type="clock-circle" theme="filled" style="font-size: 20px"/>
										<span>{{ item.time }}</span>
									</template>
									<a slot="title" href="#">{{ item.title }}</a>
									<a-avatar v-if="item.img"
										slot="avatar"
										shape="square"
										:src="item.img"
									/>
									<a-avatar v-else
										shape="square"
										slot="avatar"  v-html="item.svg"/>
									
								</a-list-item-meta>
							</a-list-item>
						</a-list>
					</a-dropdown>

					<a-button type="link" @click="showModal">
						<a-icon type="camera" theme="filled" style="font-size: 20px"/>
					</a-button>
					

					<a-button type="link" class="sidebar-toggler" @click="$emit('toggleSidebar', ! sidebarCollapsed) , resizeEventHandler()">
						<a-icon type="menu" style="font-size:20px"/>
					</a-button>
					<!-- / Header Control Buttons -->

					<!-- Header Search Input -->
					<a-input-search class="header-search" placeholder="Search..." @search="onSearch" />
					<!-- / Header Search Input -->

				</a-col>
				<!-- / Header Control Column -->

			</a-row>
			<a-modal v-model="visible" :title="null" :destroyOnClose=true :bodyStyle="{padding: 0}" wrapClassName="camera-scanner-modal" :footer="null">
				<a-spin :spinning="loading">
				<StreamBarcodeReader
					@decode="onDecode"
					@loaded="onLoaded"
				></StreamBarcodeReader>
				<div v-if="loading" style="height: 400px;"></div>
				</a-spin>
			</a-modal>
		</a-layout-header>
		<!--  /Layout Header -->

	</component>
	<!-- / Main Sidebar -->

</template>

<script>

import { StreamBarcodeReader } from "vue-barcode-reader";
import { getAsset } from "../asset.script";

	const notificationsData = [
		{
			title: 'New message from Sophie',
			img: 'images/face-1.jpg',
			time: '13 minutes ago',
		},
		{
			title: 'New album by Travis Scott',
			svg: `<svg width="20" height="20" viewBox="0 0 107 107" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
					<title>logo-spotify</title>
					<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
						<g id="logo-spotify" fill="#2EBD59" fill-rule="nonzero">
							<path d="M53.5,0 C23.9517912,0 0,23.9517912 0,53.5 C0,83.0482088 23.9517912,107 53.5,107 C83.0482088,107 107,83.0482088 107,53.5 C107,23.9554418 83.0482088,0.00365063118 53.5,0 Z M78.0358922,77.1597407 C77.0757762,78.7368134 75.0204708,79.2296486 73.4506994,78.2695326 C60.8888775,70.5922552 45.0743432,68.8582054 26.4524736,73.1111907 C24.656363,73.523712 22.8675537,72.3993176 22.458683,70.6032071 C22.0461617,68.8070966 23.1669055,67.0182873 24.9666667,66.6094166 C45.3444899,61.9548618 62.8273627,63.9590583 76.9297509,72.5745479 C78.4995223,73.5419652 78.9996588,75.5899693 78.0358922,77.1597407 L78.0358922,77.1597407 Z M84.5814739,62.5973729 C83.373115,64.5614125 80.8030706,65.1747185 78.8426817,63.9700102 C64.4664961,55.1318321 42.5408052,52.5727397 25.5325145,57.7347322 C23.3275333,58.4027977 20.9984306,57.1579324 20.3267144,54.9566018 C19.6622996,52.7516206 20.9071648,50.4261685 23.1084954,49.7544524 C42.5371546,43.858683 66.6933811,46.7134766 83.2051859,56.8622313 C85.1692255,58.0705902 85.7898328,60.636984 84.5814739,62.5973729 Z M85.1436711,47.4253497 C67.8980894,37.1853292 39.4523712,36.2434664 22.9880246,41.2375299 C20.3449676,42.0406687 17.5485841,40.5475606 16.7490959,37.9045036 C15.9496076,35.2614466 17.4390652,32.4650631 20.0857728,31.6619243 C38.9850904,25.9267827 70.3987718,27.0329239 90.2509041,38.8171614 C92.627465,40.2299556 93.4087001,43.3001365 91.9995565,45.6730467 C90.5940635,48.0532583 87.5165814,48.838144 85.1436711,47.4253497 Z" id="Shape"></path>
						</g>
					</g>
				</svg>`,
			time: '1 day ago',
		},
		{
			title: 'Payment completed',
			svg: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path fill="#1890FF" d="M4 4C2.89543 4 2 4.89543 2 6V7H18V6C18 4.89543 17.1046 4 16 4H4Z"/>
					<path fill="#1890FF" fill-rule="evenodd" clip-rule="evenodd" d="M18 9H2V14C2 15.1046 2.89543 16 4 16H16C17.1046 16 18 15.1046 18 14V9ZM4 13C4 12.4477 4.44772 12 5 12H6C6.55228 12 7 12.4477 7 13C7 13.5523 6.55228 14 6 14H5C4.44772 14 4 13.5523 4 13ZM9 12C8.44772 12 8 12.4477 8 13C8 13.5523 8.44772 14 9 14H10C10.5523 14 11 13.5523 11 13C11 12.4477 10.5523 12 10 12H9Z"/>
				</svg>`,
			time: '2 days ago',
		},
	] ;

	export default ({
		components: {
			StreamBarcodeReader,
		},
		props: {
			// Header fixed status.
			navbarFixed: {
				type: Boolean,
				default: false,
			},

			// Sidebar collapsed status.
			sidebarCollapsed: {
				type: Boolean,
				default: false,
			},

			// Header notifications data.
			notificationsData: {
				type: Array,
				default: () => notificationsData,
			},

			assetTitle: {
				type: String,
			},
		},
		data() {
			var jsonToken = localStorage.getItem("user")
            var rawToken = JSON.parse(jsonToken)
            var accessToken = rawToken.accessToken
			return {
				// Fixed header/sidebar-footer ( Affix component ) top offset.
				top: 0,

				// Search input loading status.
				searchLoading: false,

				// The wrapper element to attach dropdowns to.
				wrapper: document.body,

				pageTitle: this.$route.name + " " + this.$route.params.id,
				visible: false,
				accessToken: accessToken,
				loading: false
			}
		},
		watch: {
			assetTitle(val) {
				this.pageTitle = val;
			},
		},
		methods: {
			onDecode (result) {
				this.visible = false;
				this.queryAsset(encodeURIComponent(result)).then((response) => {
					if (response) this.$router.push("/assets/" +encodeURIComponent(result)).catch(() => { /* ignore */ });
					else this.$router.push("/search/" +encodeURIComponent(result)).catch(() => { /* ignore */ });
				})
			},
			onLoaded() {
				this.loading = false;
			},
			resizeEventHandler(){
				this.top = this.top ? 0 : -0.01 ;
				// To refresh the header if the window size changes.
				// Reason for the negative value is that it doesn't activate the affix unless
				// scroller is anywhere but the top of the page.
			},
			onSearch(value){
				this.$router.push({ path: `/search/${value}` });
			},
			logout() {
				localStorage.removeItem("user")
				this.$router.push("/sign-in");
			},
			showModal() {
				this.loading = true;
				this.visible = true;
			},
			async queryAsset(assetCode) {
                this.item = {
                    query: encodeURIComponent(assetCode),
					token: this.accessToken
                };
                const response = await getAsset(this.item);
                if (response.data.success) return true
                else return false
            },
		},
		mounted: function(){
			// Set the wrapper to the proper element, layout wrapper.
			this.wrapper = document.getElementById('layout-dashboard') ;
		},
		created() {
			// Registering window resize event listener to fix affix elements size
			// error while resizing.
			window.addEventListener("resize", this.resizeEventHandler);
		},
		destroyed() {
			// Removing window resize event listener.
			window.removeEventListener("resize", this.resizeEventHandler);
		},
	})

</script>
