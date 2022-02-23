<template>
	
	<!-- Main Sidebar -->
	<a-layout-sider
		collapsible
		class="sider-primary"
		breakpoint="lg"
		collapsed-width="0"
		width="250px"
		:collapsed="sidebarCollapsed"
		@collapse="$emit('toggleSidebar', ! sidebarCollapsed)"
		:trigger="null"
		:class="['ant-layout-sider-' + sidebarColor, 'ant-layout-sider-' + sidebarTheme]"
		theme="light"
		:style="{ backgroundColor: 'transparent',}">
			<div class="brand"><img src="/images/LogoMakr-24Dmgq.png" alt=""> <span>{{appName}}</span></div>
			<hr>

			<!-- Sidebar Navigation Menu -->
			<a-menu theme="light" mode="inline">
				<a-menu-item>
					<router-link to="/dashboard">
						<span class="icon">
							<a-icon type="layout" theme="filled" style="font-size: 20px; margin:auto"/>
						</span>
						<span class="label">Dashboard</span>
					</router-link>
				</a-menu-item>
				<a-menu-item>
					<router-link to="/assets">
						<span class="icon">
							<a-icon type="barcode" style="font-size: 20px; margin:auto"/>
						</span>
						<span class="label">Assets</span>
					</router-link>
				</a-menu-item>
				<a-menu-item>
					<router-link to="/projects">
						<span class="icon">
							<a-icon type="reconciliation" theme="filled" style="font-size: 20px; margin:auto"/>
						</span>
						<span class="label">Projects</span>
					</router-link>
				</a-menu-item>
				<a-menu-item>
					<router-link to="/connections">
						<span class="icon">
							<a-icon type="api" theme="filled" style="font-size: 20px; margin:auto"/>
						</span>
						<span class="label">Connections</span>
					</router-link>
				</a-menu-item>
				<a-menu-item>
					<router-link to="/metrics">
						<span class="icon">
							<a-icon type="area-chart" style="font-size: 20px; margin:auto"/>
						</span>
						<span class="label">Metrics</span>
					</router-link>
				</a-menu-item>
				<a-menu-item>
					<router-link to="/account">
						<span class="icon">
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path fill-rule="evenodd" clip-rule="evenodd" d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM12 7C12 8.10457 11.1046 9 10 9C8.89543 9 8 8.10457 8 7C8 5.89543 8.89543 5 10 5C11.1046 5 12 5.89543 12 7ZM9.99993 11C7.98239 11 6.24394 12.195 5.45374 13.9157C6.55403 15.192 8.18265 16 9.99998 16C11.8173 16 13.4459 15.1921 14.5462 13.9158C13.756 12.195 12.0175 11 9.99993 11Z" fill="#111827"/>
							</svg>
						</span>
						<span class="label">Account</span>
					</router-link>
				</a-menu-item>
			</a-menu>
			<!-- / Sidebar Navigation Menu -->
			<p style="font-size:5px;">&nbsp;</p>
				<div class="footer-box">
					<router-link to="/assets/new"><a-button type="primary" block>
						NEW ASSET
					</a-button></router-link><p style="font-size:5px;">&nbsp;</p>
					<a-button type="primary" href="https://demos.creative-tim.com/muse-vue-ant-design-dashboard/documentation" block target="_blank">
						NEW PROJECT
					</a-button>
				</div>
				<div class="footer-box">
					<h6>Issue Detected</h6>
					<p>29 assets missing location</p>
					<a-button type="primary" href="https://demos.creative-tim.com/muse-vue-ant-design-dashboard/documentation" block target="_blank">
						VIEW & FIX
					</a-button>
				</div>

			<!-- / Sidebar Footer -->

			

	</a-layout-sider>
	<!-- / Main Sidebar -->

</template>

<script>
import { getAsset } from "../asset.script";

	export default ({
		props: {
			// Sidebar collapsed status.
			sidebarCollapsed: {
				type: Boolean,
				default: false,
			},
			
			// Main sidebar color.
			sidebarColor: {
				type: String,
				default: "primary",
			},
			
			// Main sidebar theme : light, white, dark.
			sidebarTheme: {
				type: String,
				default: "light",
			},
		},
		setup() {
			const toast = useToast();

			return { toast }
		},
		mounted() {		
			let code = "";
			let reading = false;
			document.addEventListener('keypress', e => {
				if (e.key == "Enter") {
					if (code != '' && `${this.$route.name}` != 'Sign-In' && `${this.$route.name}` != 'Licenses') {
						var curCode = code
						this.queryAsset(curCode).then((response) => {
							if (response) this.$router.push("/assets/" +curCode).catch(() => { /* ignore */ });
							else this.$router.push("/search/" +curCode).catch(() => { /* ignore */ });
							curCode = ''
						})
					}
					code = "";
				} else code += e.key; 

				if(!reading) {
					reading = true;
					setTimeout(() => {
						code = "";
						reading = false;
					}, 50);
				}
			})
		},
		methods: {
			async queryAsset(assetCode) {
                this.item = {
                    query: encodeURIComponent(assetCode),
					token: this.accessToken
                };
                const response = await getAsset(this.item);
                if (response.data.success) return true
                else return false
            },
			barcodeError() {
				this.$toast.error("Barcode Not Found", {
				position: "bottom-left",
				timeout: 5000,
				closeOnClick: true,
				pauseOnFocusLoss: true,
				pauseOnHover: false,
				draggable: false,
				draggablePercent: 0.6,
				showCloseButtonOnHover: true,
				hideProgressBar: false,
				closeButton: "button",
				icon: false,
				rtl: false
				});
			},
			barcodeSuccess() {
				this.$toast.success("Barcode Found", {
				position: "bottom-left",
				timeout: 5000,
				closeOnClick: true,
				pauseOnFocusLoss: true,
				pauseOnHover: false,
				draggable: false,
				draggablePercent: 0.6,
				showCloseButtonOnHover: true,
				hideProgressBar: false,
				closeButton: "button",
				icon: false,
				rtl: false
				});
			}
		},
		data() {
			var jsonToken = localStorage.getItem("user")
            var rawToken = JSON.parse(jsonToken)
            var accessToken = rawToken.accessToken
			return {
				// sidebarCollapsedModel: this.sidebarCollapsed,
				appName: process.env.VUE_APP_NAME,
				accessToken: accessToken,
			}
		},
		created() {
			if (this.$route.query.err == "a404") {
				this.$toast.error("Not Found", {
				position: "bottom-left",
				timeout: 5000,
				closeOnClick: true,
				pauseOnFocusLoss: true,
				pauseOnHover: false,
				draggable: false,
				draggablePercent: 0.6,
				showCloseButtonOnHover: true,
				hideProgressBar: false,
				closeButton: "button",
				icon: true,
				rtl: false
				});
			}
			if (this.$route.query.msg == "deleted") {
				this.$message.success('Asset Deleted Successfuly');
			}
		}
	})

</script>
