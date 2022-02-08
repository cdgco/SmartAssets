<template>

	<!-- Layout Header ( Navbar ) -->
	<a-layout-header>
		<router-link to="/dashboard" class="nav-link" @click="e => e.preventDefault()">
			<div class="header-col header-brand">
				<h6>{{appName}}</h6>
			</div>
		</router-link>

	</a-layout-header>
	<!-- / Layout Header ( Navbar ) -->

</template>

<script>

	export default ({
		data() {
			return {
				appName: process.env.VUE_APP_NAME
			}
		},
	})

</script>

<style lang="scss" scoped>

	.nav-link svg {
		margin-right: 5px;
		vertical-align: middle;
	}
	.nav-link span {
		vertical-align: middle;
	}
	.ant-menu-submenu-popup {
		width: 100%;
	}

</style>