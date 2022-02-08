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
						<CardActiveConnections></CardActiveConnections>
						
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
				<CardWebhooks></CardWebhooks>
				<!-- / Billing Information Card -->

			</a-col>
			<!-- Billing Information Column -->

			<!-- Your Transactions Column -->
			<a-col :span="24" :md="8" class="mb-24">

				<!-- Your Transactions Card -->
				<CardAPIDetails
					:data="transactionsData"
				></CardAPIDetails>
				<!-- / Your Transactions Card -->

			</a-col>
			<!-- / Your Transactions Column -->
			
		</a-row>

	</div>
</template>

<script>

	import CardWebhooks from "../components/Cards/CardWebhooks"
	import CardConnectionMarketplace from "../components/Cards/CardConnectionMarketplace"
	import CardActiveConnections from "../components/Cards/CardActiveConnections"
	import CardAPIDetails from "../components/Cards/CardAPIDetails"



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

	// "Your Transactions" list data.
	const transactionsData = [
		{
			period: "ENDPOINT",
		},
		{
			title: "REST API",
			datetime: window.location.origin + "/api",
			amount: "2,500",
			type: -1,// 0 is for pending, 1 is for deposit, -1 is for withdrawal.
			status: 'danger',
		},
		{
			period: "CREDENTIALS",
		},
		{
			title: "Global API Key",
			datetime: "b57a83f9-9e39-4bc3-94cd-a3ca1388dea0",
			amount: "750",
			type: 1,
			status: 'success',
		},
		{
			title: "Assets API Key",
			datetime: "8c626f83-b5ca-4891-9e77-af95244a76ef",
			amount: "1,050",
			type: 1,
			status: 'success',
		},
		{
			title: "Projects API Key",
			datetime: "4d4657e9-6f4c-4262-b18a-16b4ef89f565",
			amount: "2,400",
			type: 1,
			status: 'success',
		},
		{
			title: "Users API Key",
			datetime: "790168d5-bc87-404a-aded-6664887c1d8d",
			amount: "Pending",
			type: 0,
			status: 'warning',
		},
	] ;

	export default ({
		metaInfo: {
			title: 'Connections',
		},
		components: {
			CardWebhooks,
			CardConnectionMarketplace,
			CardActiveConnections,
			CardAPIDetails,
		},
		data() {
			return {

				// Associating "Invoices" list data with its corresponding property.
				invoiceData,
				
				// Associating "Your Transactions" list data with its corresponding property.
				transactionsData,
			}
		},
	})

</script>

<style lang="scss">
</style>