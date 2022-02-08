<!-- 
	This is the dashboard layout, used in dashboard, tables, billing and profile pages.
 -->

<template>
	<div>

		<!-- Dashboard Layout -->
		<a-layout class="layout-dashboard" id="layout-dashboard" :class="[navbarFixed ? 'navbar-fixed' : '', ! sidebarCollapsed ? 'has-sidebar' : '', layoutClass]">
			
			<!-- Main Sidebar -->
			<DashboardSidebar
				:sidebarCollapsed="sidebarCollapsed"
				:sidebarColor="sidebarColor"
				:sidebarTheme="sidebarTheme"
				@toggleSidebar="toggleSidebar"
			></DashboardSidebar>
			<!-- / Main Sidebar -->

			<!-- Layout Content -->
			<a-layout>

				<!-- Layout Header's Conditionally Fixed Wrapper -->
				<AssetHeader
					:sidebarCollapsed="sidebarCollapsed"
					:navbarFixed="navbarFixed"
					:assetTitle="assetTitle"
					@toggleSettingsDrawer="toggleSettingsDrawer"
					@toggleSidebar="toggleSidebar"
				></AssetHeader>
				<!-- / Layout Header's Conditionally Fixed Wrapper -->

				<!-- Page Content -->
				<a-layout-content>
					<router-view v-on:asset-name="changeTitle"/>
				</a-layout-content>
				<!-- / Page Content -->

				<!-- Layout Footer -->
				<DashboardFooter></DashboardFooter>
				<!-- / Layout Footer -->

				<!-- Sidebar Overlay -->
				<div class="sidebar-overlay" @click="sidebarCollapsed = true" v-show="! sidebarCollapsed"></div>
				<!-- / Sidebar Overlay -->

			</a-layout>
			<!-- / Layout Content -->
			
			<!-- Settings Drawer -->
			<DashboardSettingsDrawer
				:showSettingsDrawer="showSettingsDrawer"
				:navbarFixed="navbarFixed"
				:sidebarTheme="sidebarTheme"
				@toggleSettingsDrawer="toggleSettingsDrawer"
				@toggleNavbarPosition="toggleNavbarPosition"
				@updateSidebarTheme="updateSidebarTheme"
				@updateSidebarColor="updateSidebarColor"
			></DashboardSettingsDrawer>
			<!-- / Settings Drawer -->

		</a-layout>
		<!-- / Dashboard Layout -->

	</div>
</template>

<script>

	import DashboardSidebar from '../components/Sidebars/DashboardSidebar' ;
	import AssetHeader from '../components/Headers/AssetHeader' ;
	import DashboardFooter from '../components/Footers/DashboardFooter' ;
	import DashboardSettingsDrawer from '../components/Sidebars/DashboardSettingsDrawer' ;

	export default ({
		components: {
			DashboardSidebar,
			AssetHeader,
			DashboardFooter,
			DashboardSettingsDrawer,
		},
		data() {
			return {
				// Sidebar collapsed status.
				sidebarCollapsed: false,
				
				// Main sidebar color.
				sidebarColor: "primary",
				
				// Main sidebar theme : light, white, dark.
				sidebarTheme: "light",

				// Header fixed status.
				navbarFixed: false,

				// Settings drawer visiblility status.
				showSettingsDrawer: false,

				assetTitle: ''
			}
		},
		methods: {
			toggleSidebar( value ) {
				this.sidebarCollapsed = value ;
			},
			toggleSettingsDrawer( value ) {
				this.showSettingsDrawer = value ;
			},
			toggleNavbarPosition( value ) {
				this.navbarFixed = value ;
			},
			updateSidebarTheme( value ) {
				this.sidebarTheme = value ;
			},
			updateSidebarColor( value ) {
				this.sidebarColor = value ;
			},
			changeTitle( value ) {
				this.assetTitle = value ;
			}
		},
		computed: {
			// Sets layout's element's class based on route's meta data.
			layoutClass() {
				return this.$route.meta.layoutClass ;
			}
		},
	})

</script>
