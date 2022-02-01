<!-- 
	This is the billing page, it uses the dashboard layout in: 
	"./layouts/Dashboard.vue" .
 -->

<template>
	<div>

		<a-row type="flex" :gutter="24">

			<!-- Billing Info Column -->
			<a-col :span="24" :md="16">
				<a-row type="flex" :gutter="24">
					<a-col :span="24" class="mb-24">

						<!-- Payment Methods Card -->
						<AssetForm
							:data="table1Data"
							:columns="table1Columns"
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
			<!-- / Invoices Column -->

		</a-row>

		<a-row type="flex" :gutter="24">

			<!-- Billing Information Column -->
			<a-col :span="24" :md="16" class="mb-24">

				<!-- Billing Information Card -->
				<CardAssetHistory></CardAssetHistory>
				<!-- / Billing Information Card -->

			</a-col>
			<!-- Billing Information Column -->

			<!-- Your Transactions Column -->
			<a-col :span="24" :md="8" class="mb-24">

				<!-- Your Transactions Card -->
				<CardAssetNotes
					:data="transactionsData"
				></CardAssetNotes>
				<!-- / Your Transactions Card -->

			</a-col>
			<!-- / Your Transactions Column -->
			
		</a-row>

	</div>
</template>

<script>
	import AssetForm from '../components/Cards/AssetForm' ;
	
	import CardAssetHistory from "../components/Cards/CardAssetHistory"
	import CardConnectionMarketplace from "../components/Cards/CardConnectionMarketplace"
	import CardActiveConnections from "../components/Cards/CardActiveConnections"
	import CardAssetNotes from "../components/Cards/CardAssetNotes"



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
			
			}
		},
	})

</script>

<style lang="scss">
</style>