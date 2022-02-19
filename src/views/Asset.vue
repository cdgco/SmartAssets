<!-- 
	This is the billing page, it uses the dashboard layout in: 
	"./layouts/Dashboard.vue" .
 -->

<template>
	<div>
		<a-spin :spinning="spinning" size="large">
		<a-row type="flex" :gutter="24">

			<!-- Billing Info Column -->
			<a-col :span="24" :md="16">
				<a-row type="flex" :gutter="24">
					<a-col :span="24" class="mb-24">

						<!-- Payment Methods Card -->
						<AssetForm
							:name="fields.name"
						></AssetForm>
						
						<!-- Payment Methods Card -->

					</a-col>
				</a-row>
			</a-col>
			<!-- / Billing Info Column -->
			
			<!-- Invoices Column -->
			<a-col :span="24" :md="8" class="mb-24">
				<a-row>
					<!-- Invoices Card -->
					<CardConnectionMarketplace
						:data="invoiceData"
					></CardConnectionMarketplace>
					<!-- / Invoices Card -->
				</a-row>
				<br>
				<a-row>
					<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 0,}">
						<template #title>
							<h6 class="font-semibold m-0">Asset Tag</h6>
						</template>
						<a-row class="card-footer" type="flex" justify="center" align="top">
							<img id="barcode"/>
						</a-row>
					</a-card>
				</a-row>
			</a-col>

		</a-row>

		<a-row type="flex" :gutter="24">

			<!-- Billing Information Column -->
			<a-col :span="24" :md="16" class="mb-24">
					<!-- Billing Information Card -->
					<CardAssetHistory></CardAssetHistory>
					<!-- / Billing Information Card -->
			</a-col>
			<a-col :span="24" :md="8" class="mb-24">
					<!-- Billing Information Card -->
					<CardAssetHistory></CardAssetHistory>
					<!-- / Billing Information Card -->
			</a-col>
			<!-- Billing Information Column -->


		</a-row>
		</a-spin>
	</div>
</template>

<script>
	import AssetForm from '../components/Cards/AssetForm' ;
	var JsBarcode = require('jsbarcode');
	
	import CardAssetHistory from "../components/Cards/CardAssetHistory"
	import CardConnectionMarketplace from "../components/Cards/CardConnectionMarketplace"
	import CardActiveConnections from "../components/Cards/CardActiveConnections"
	import CardAssetNotes from "../components/Cards/CardAssetNotes"

	import { getAsset } from "../components/getAsset.script";


	// "Invoices" list data.
	const invoiceData = [
		{
			title: "Active Directory Users & Groups",
			code: "Assign assets to AD users",
			amount: "50",
		},
		{
			title: "Jira Helpdesk",
			code: "Link assets & projects to Jira tickets",
			amount: "200",
		},
		{
			title: "TeamDynamix",
			code: "Link assets & projects to TeamDynamix tickets",
			amount: "200",
		},
		{
			title: "LDAP Authentication",
			code: "Allow login via LDAP",
			amount: "20",
		},
		{
			title: "Azure SSO",
			code: "Allow login via Azure",
			amount: "20",
		},
	] ;
	export default ({
		metaInfo () {
			return {
			title: this.fields.name
			}
		},
		components: {
			CardAssetHistory,
			CardConnectionMarketplace,
			CardActiveConnections,
			CardAssetNotes,
			AssetForm
		},
		data() {
			var jsonToken = localStorage.getItem("user")
            var rawToken = JSON.parse(jsonToken)
            var accessToken = rawToken.accessToken
			return {

				// Associating "Invoices" list data with its corresponding property.
				invoiceData,
				spinning: true,
				accessToken: accessToken,

				fields: {
					name: '',
				},
			
			}
		},
		methods: {
            async queryAsset() {
                this.item = {
                    query: this.$route.params.id,
					token: this.accessToken
                };
                const response = await getAsset(this.item);
                if (response.data.success) {
					this.spinning = !this.spinning;
					this.fields.name = response.data.result.name
					this.$emit('asset-name', this.fields.name)
					var barcodeData = (response.data.result._id.length == 1) ? "0" + response.data.result._id : response.data.result._id;
					JsBarcode("#barcode", barcodeData, {
						format: "CODE128",
						lineColor: "#262626",
						width:5,
						height:50
					});
                } else {
                    this.$router.push({ path: `/assets/?err=a404` });
                }
            },
        },
		created() {
			this.queryAsset()
        },
	})

</script>

<style lang="scss">
</style>