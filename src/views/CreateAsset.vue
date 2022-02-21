<!-- 
	This is the tables page, it uses the dashboard layout in: 
	"./layouts/Dashboard.vue" .
 -->

<template>
	<div>

		<!-- Authors Table -->
		<a-row :gutter="24" type="flex">

			<!-- Authors Table Column -->
			<a-col :span="24" class="mb-24">

				<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 4,}">
					<br>
					<a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" :hideRequiredMark="true" @submit="handleSubmit" autocomplete="off" >
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
						<a-row>
							<a-form-item label="Tags">
								<a-select mode="tags" v-decorator="['tags']" style="width: 100%" allowClear="true">
									<a-select-option v-for="tag in tagSource" :key="tag">
										{{ tag }}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-row>
						<a-form-item :wrapper-col="{ span: 12, offset: 5 }">
							<a-button type="primary" html-type="submit" style="margin-right: 15px;">
								Submit
							</a-button>
						</a-form-item>
					</a-form>
				</a-card>

			</a-col>
			<!-- / Authors Table Column -->

		</a-row>
		<!-- / Authors Table -->

	</div>
</template>

<script>
	import { createAsset } from "../components/asset.script";
	import { getCompanies, getLocations, getManufacturers, getModels, getSuppliers, getTypes, getTags } from "../components/autocomplete.script";

	export default ({
		metaInfo: {
			title: 'New Asset',
		},
		data() {
			var jsonToken = localStorage.getItem("user")
            var rawToken = JSON.parse(jsonToken)
            var accessToken = rawToken.accessToken
			return {
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
				tagSource: [],
				fieldTypes: {
					text: 'text',
				},
				accessToken: accessToken,
				formLayout: 'horizontal',
				form: this.$form.createForm(this, { name: 'coordinated'}),
			};
		},
		methods: {
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
				const tagResponse = await getTags(this.item);
				if (tagResponse.data.success) {
					tagResponse.data.result.forEach(singleResult => {
						this.tagSource.push(singleResult.name)
					})
				} 
				
			},
			filterOption(input, option) {
				return (
					option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
				);
			},
			error(message) {
				this.$error({
					title: 'Failed to save asset',
					content: message,
				});
			},
			async submit(values) {
				this.item = {
					name: values.assetName,
					token: this.accessToken
					};
				if (values.type) this.item.type = values.type;
				if (values.manufacturer) this.item.manufacturer = values.manufacturer;
				if (values.model) this.item.model = values.model;
				if (values.quantity) this.item.quantity = values.quantity;
				if (values.serial) this.item.serial = values.serial;
				if (values.location) this.item.location = values.location;
				if (values.supplier) this.item.supplier = values.supplier;
				if (values.company) this.item.company = values.company;
				if (this.tagSource.length > 0) this.item.tags = values.tags;
				this.loading = true;
				const response = await createAsset(this.item);
				if (response.data.success) {
					this.loading = false;
					this.$router.push("/assets/" + response.data.result._id);
				} else {
					this.error(response.data.errors.errors.name.message)
				}
			},
			handleSubmit(e) {
				e.preventDefault();
				this.form.validateFields((err, values) => {
					if (!err) {
						this.submit(values);
					}
				});
			}
		},
		created() {
			this.queryAutocomplete()
        },
	})

</script>