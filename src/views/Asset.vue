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

				<!-- Invoices Card -->
				<CardConnectionMarketplace
					:data="invoiceData"
				></CardConnectionMarketplace>
				<!-- / Invoices Card -->

			</a-col>
			<a-col :span="24" :md="8" class="mb-24">

				<!-- Invoices Card -->
				<CardConnectionMarketplace
					:data="invoiceData"
				></CardConnectionMarketplace>
				<!-- / Invoices Card -->

			</a-col>
			<!-- / Invoices Column -->

		</a-row>

		<a-row type="flex" :gutter="24">

			<!-- Billing Information Column -->
			<a-col :span="24" :md="16" class="mb-24">
				<a-row type="flex" :gutter="24">
					<!-- Billing Information Card -->
					<CardAssetHistory></CardAssetHistory>
					<!-- / Billing Information Card -->
				</a-row>
					<a-row type="flex" :gutter="24">
					<!-- Billing Information Card -->
					<CardAssetHistory></CardAssetHistory>
					<!-- / Billing Information Card -->
				</a-row>
			</a-col>
			<!-- Billing Information Column -->


		</a-row>
		</a-spin>
	</div>
</template>

<script>
	import AssetForm from '../components/Cards/AssetForm' ;
	
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
			return {

				// Associating "Invoices" list data with its corresponding property.
				invoiceData,
				spinning: true,

				fields: {
					name: '',
				},
			
			}
		},
		methods: {
            async queryAsset() {
                this.item = {
                    query: this.$route.params.id,
                    };
                const response = await getAsset(this.item);
                if (response.data.success) {
					this.spinning = !this.spinning;
					this.fields.name = response.data.result.name
					this.$emit('asset-name', this.fields.name)
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