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
						<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 0,}">
							<br>
							<a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" :hideRequiredMark="true" @submit="handleSubmit">
								<a-row>
									<a-form-item label="Name">
										<a-input id="name"
											v-decorator="['name', { rules: [{ required: true, message: 'Asset name is required' }] }]"
										/>
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="Type">
										<a-input id="type" v-decorator="['type']"/>
									</a-form-item>
								</a-row>
								<a-row>
										<a-form-item label="Manufacturer">
											<a-input id="manufacturer" v-decorator="['manufacturer']"/>
										</a-form-item>
										</a-row>
								<a-row>
									
										<a-form-item label="Model">
											<a-input id="model" v-decorator="['model']"/>
										</a-form-item>
									</a-row>
								<a-row>
										<a-form-item label="Quantity">
											<a-input-number id="quantity" :min="0" v-decorator="['quantity']"/>
										</a-form-item>
									</a-row>
								<a-row>
										<a-form-item label="Serial">
											<a-input id="serial" v-decorator="['serial']"/>
										</a-form-item>
									</a-row>
								<a-row>
										<a-form-item label="Location">
											<a-input id="location" v-decorator="['location']"/>
										</a-form-item>
								</a-row>
								<a-row>
										<a-form-item label="Supplier">
											<a-input id="supplier" v-decorator="['supplier']"/>
										</a-form-item>
									</a-row>
								<a-row>
										<a-form-item label="Company">
											<a-input id="company" v-decorator="['company']"/>
										</a-form-item>
								</a-row>
								
								
								<a-form-item :wrapper-col="{ span: 12, offset: 5 }">
									<a-button type="primary" html-type="submit" style="margin-right: 15px;">
										Submit
									</a-button>
									<a-button type="default" style="margin-right: 15px;">
										Clone
									</a-button>
									<a-popconfirm
										title="Are you sure?"
										ok-text="Yes"
										cancel-text="No"
										@confirm="confirmDelete"
									>
										<a-button type="danger" >
											Delete
										</a-button>
									</a-popconfirm>
									
								</a-form-item>
							</a-form>
						</a-card>
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

	import { getAsset, deleteAsset } from "../components/asset.script";


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
				formLayout: 'horizontal',
				form: this.$form.createForm(this, { name: 'coordinated'}),

				// Associating "Invoices" list data with its corresponding property.
				invoiceData,
				spinning: true,
				accessToken: accessToken,
				assetId: '',

				fields: {
					name: '',
					id: ''
				},
			
			}
		},
		methods: {
			error(message) {
				this.$error({
					title: 'Failed to delete asset',
					content: message,
				});
			},
            async queryAsset() {
                this.item = {
                    query: this.$route.params.id,
					token: this.accessToken
                };
                const response = await getAsset(this.item);
                if (response.data.success) {
					this.spinning = !this.spinning;
					this.fields.name = response.data.result.name
					this.fields.id = response.data.result._id
					this.form.setFieldsValue({ name: response.data.result.name })
					this.form.setFieldsValue({ type: (response.data.result.type[0]) ? response.data.result.type[0].name : '' })
					this.form.setFieldsValue({ manufacturer: (response.data.result.manufacturer[0]) ? response.data.result.manufacturer[0].name : '' })
					this.form.setFieldsValue({ model: (response.data.result.assetModel[0]) ? response.data.result.assetModel[0].name : '' })
					this.form.setFieldsValue({ quantity: (response.data.result.quantity) ? response.data.result.quantity : '' })
					this.form.setFieldsValue({ serial: (response.data.result.serial) ? response.data.result.serial : '' })
					this.form.setFieldsValue({ location: (response.data.result.location[0]) ? response.data.result.location[0].name : '' })
					this.form.setFieldsValue({ supplier: (response.data.result.supplier[0]) ? response.data.result.supplier[0].name : '' })
					this.form.setFieldsValue({ company: (response.data.result.company[0]) ? response.data.result.company[0].name : '' })
					this.$emit('asset-name', this.fields.name)
					var barcodeData = (String(response.data.result._id).length == 1) ? "0" + response.data.result._id : response.data.result._id;
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
			async confirmDelete() {
				 this.item = {
                    id: this.$route.params.id,
					token: this.accessToken
                };
                const response = await deleteAsset(this.item);
                if (response.data.success) {
					this.$router.push({ path: `/assets/?msg=deleted` });
                } else {
                    this.error(response.data.errors.errors.name.message)
                }
			},
			handleSubmit(e) {
				e.preventDefault();
				this.form.validateFields((err, values) => {
					if (!err) {
					// console.log('Received values of form: ', values);
					}
				});
			}
        },
		created() {
			this.queryAsset()
        },
	})

</script>

<style lang="scss">
</style>