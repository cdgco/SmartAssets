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
							<a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" :hideRequiredMark="true" @submit="handleSubmit" autocomplete="off">
								<a-row>
									<a-form-item label="Name">
										<a-input
											autocomplete="chrome-off" 
											v-decorator="['assetName', { rules: [{ required: true, message: 'Asset name is required' }] }]"
										/>
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="Type">
										<a-auto-complete
											autocomplete="chrome-off" 
											v-decorator="['type']"
											v-model="type"
											:data-source="emptyType"
											:filter-option="filterOption"
											@search="function(value) { emptyType = value ? typeSource : []; }"
										/>
									</a-form-item>
								</a-row>
								<a-row>
										<a-form-item label="Manufacturer">
											<a-auto-complete
												autocomplete="chrome-off" 
												v-decorator="['manufacturer']"
												v-model="manufacturer"
												:data-source="emptyManufacturer"
												:filter-option="filterOption"
												@search="function(value) { emptyManufacturer = value ? manufacturerSource : []; }"
											/>
										</a-form-item>
										</a-row>
								<a-row>
									
										<a-form-item label="Model">
											<a-auto-complete
												autocomplete="chrome-off" 
												v-decorator="['model']"
												v-model="model"
												:data-source="emptyModel"
												:filter-option="filterOption"
												@search="function(value) { emptyModel = value ? modelSource : []; }"
											/>
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
											<a-auto-complete
												autocomplete="chrome-off" 
												v-decorator="['location']"
												v-model="location"
												:data-source="emptyLocation"
												:filter-option="filterOption"
												@search="function(value) { emptyLocation = value ? locationSource : []; }"
											/>
										</a-form-item>
								</a-row>
								<a-row>
										<a-form-item label="Supplier">
											<a-auto-complete
												autocomplete="chrome-off" 
												v-decorator="['supplier']"
												v-model="supplier"
												:data-source="emptySupplier"
												:filter-option="filterOption"
												@search="function(value) { emptySupplier = value ? supplierSource : []; }"
											/>
										</a-form-item>
									</a-row>
								<a-row>
										<a-form-item label="Company">
											<a-auto-complete
												autocomplete="chrome-off" 
												v-decorator="['company']"
												v-model="company"
												:data-source="emptyCompany"
												:filter-option="filterOption"
												@search="function(value) { emptyCompany = value ? companySource : []; }"
											/>
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
							<img id="barcode" style="max-width: 80%;"/>
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

	import { getAsset, deleteAsset, updateAsset } from "../components/asset.script";
	import { getCompanies, getLocations, getManufacturers, getModels, getSuppliers, getTypes } from "../components/autocomplete.script";

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
			title: this.fields.assetName
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
			var query = this.$route.params.id;
			return {
				formLayout: 'horizontal',
				form: this.$form.createForm(this, { name: 'coordinated'}),

				// Associating "Invoices" list data with its corresponding property.
				invoiceData,
				spinning: true,
				accessToken: accessToken,
				assetId: '',
				companySource: [],
				emptyCompany: [],
				locationSource: [],
				emptyLocation: [],
				manufacturerSource: [],
				emptyManufacturer: [],
				modelSource: [],
				emptyModel: [],
				supplierSource: [],
				emptySupplier: [],
				typeSource: [],
				emptyType: [],
				originalObject: {},
				query,
				tags: [],

				fields: {
					assetName: '',
					id: ''
				},
			
			}
		},
		methods: {
			filterOption(input, option) {
				return (
					option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
				);
			},
			async queryAutocomplete() {
				this.item = { token: this.accessToken };
				const companyResponse = await getCompanies(this.item);
				if (companyResponse.data.success) {
					companyResponse.data.result.forEach(singleResult => {
						this.companySource.push(singleResult.name)
					})
				} 
				const locationResponse = await getLocations(this.item);
				if (locationResponse.data.success) {
					locationResponse.data.result.forEach(singleResult => {
						this.locationSource.push(singleResult.name)
					})
				} 
				const manufacturerResponse = await getManufacturers(this.item);
				if (manufacturerResponse.data.success) {
					manufacturerResponse.data.result.forEach(singleResult => {
						this.manufacturerSource.push(singleResult.name)
					})
				} 
				const modelResponse = await getModels(this.item);
				if (modelResponse.data.success) {
					modelResponse.data.result.forEach(singleResult => {
						this.modelSource.push(singleResult.name)
					})
				} 
				const supplierResponse = await getSuppliers(this.item);
				if (supplierResponse.data.success) {
					supplierResponse.data.result.forEach(singleResult => {
						this.supplierSource.push(singleResult.name)
					})
				} 
				const typeResponse = await getTypes(this.item);
				if (typeResponse.data.success) {
					typeResponse.data.result.forEach(singleResult => {
						this.typeSource.push(singleResult.name)
					})
				} 
				
			},
			error(message) {
				this.$error({
					title: 'Failed to delete asset',
					content: message,
				});
			},
            async queryAsset() {
                this.item = {
                    query: this.query,
					token: this.accessToken
                };
                const response = await getAsset(this.item);
                if (response.data.success) {
					this.spinning = !this.spinning;
					this.fields.assetName = response.data.result.name
					this.fields.id = response.data.result._id
					this.form.setFieldsValue({ assetName: response.data.result.name })
					this.form.setFieldsValue({ type: (response.data.result.type[0]) ? response.data.result.type[0].name : '' })
					this.form.setFieldsValue({ manufacturer: (response.data.result.manufacturer[0]) ? response.data.result.manufacturer[0].name : '' })
					this.form.setFieldsValue({ model: (response.data.result.assetModel[0]) ? response.data.result.assetModel[0].name : '' })
					this.form.setFieldsValue({ quantity: (response.data.result.quantity) ? response.data.result.quantity : '' })
					this.form.setFieldsValue({ serial: (response.data.result.serial) ? response.data.result.serial : '' })
					this.form.setFieldsValue({ location: (response.data.result.location[0]) ? response.data.result.location[0].name : '' })
					this.form.setFieldsValue({ supplier: (response.data.result.supplier[0]) ? response.data.result.supplier[0].name : '' })
					this.form.setFieldsValue({ company: (response.data.result.company[0]) ? response.data.result.company[0].name : '' })
					this.$emit('asset-name', this.fields.assetName)
					var barcodeData = (String(response.data.result._id).length == 1) ? "0" + response.data.result._id : response.data.result._id;
					JsBarcode("#barcode", barcodeData, {
						format: "CODE128",
						lineColor: "#262626",
						width:5,
						height:50
					});
					this.originalObject = response.data.result
                } else {
                    this.$router.push({ path: `/assets/?err=a404` });
                }
            },
			async confirmDelete() {
				 this.item = {
                    id: this.query,
					token: this.accessToken
                };
                const response = await deleteAsset(this.item);
                if (response.data.success) {
					this.$router.push({ path: `/assets/?msg=deleted` });
                } else {
                    this.error(response.data.errors.errors.name.message)
                }
			},
			async update(values) {
				this.item = {
					id: this.query,
					token: this.accessToken
					};
				if (values.assetName != this.originalObject.name) this.item.name = values.assetName;
				if (values.serial != this.originalObject.serial) this.item.serial = values.serial;
				if (values.quantity != this.originalObject.quantity) this.item.quantity = values.quantity;

				if ((this.originalObject.type[0] && values.type != this.originalObject.type[0].name) || (!this.originalObject.type[0] && values.type)) this.item.type = values.type;
				if ((this.originalObject.manufacturer[0] && values.manufacturer != this.originalObject.manufacturer[0].name) || (!this.originalObject.manufacturer[0] && values.manufacturer)) this.item.manufacturer = values.manufacturer;
				if ((this.originalObject.assetModel[0] && values.model != this.originalObject.assetModel[0].name) || (!this.originalObject.assetModel[0] && values.model)) this.item.model = values.model;
				if ((this.originalObject.location[0] && values.location != this.originalObject.location[0].name) || (!this.originalObject.location[0] && values.location)) this.item.location = values.location;
				if ((this.originalObject.supplier[0] && values.supplier != this.originalObject.supplier[0].name) || (!this.originalObject.supplier[0] && values.supplier)) this.item.supplier = values.supplier;
				if ((this.originalObject.company[0] && values.company != this.originalObject.company[0].name) || (!this.originalObject.company[0] && values.company)) this.item.company = values.company;
				this.loading = true;
				console.log(this.originalObject)
				const response = await updateAsset(this.item);
				if (response.data.success) {
					this.loading = false;
					this.$message.success('Asset Updated');
					this.originalObject = response.data.result
					
				} else {
					this.error(response.data.errors)
				}
			},
			handleSubmit(e) {
				e.preventDefault();
				this.form.validateFields((err, values) => {
					if (!err) {
						this.update(values);
					}
				});
			}
        },
		created() {
			this.queryAutocomplete()
			this.queryAsset()
        },
		watch: {
            '$route.params.id': function (id) {
				this.spinning = true
                this.query = id
                this.queryAsset()
            }
        },
	})

</script>

<style lang="scss">
</style>