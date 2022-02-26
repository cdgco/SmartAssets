<template>
	<div>
		<a-spin :spinning="spinning" size="large">
		<a-row type="flex" :gutter="24">

			<a-col :span="24" :md="16">
				<a-row type="flex" :gutter="24">
					<a-col :span="24" class="mb-24">

						<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 4,}">
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
									<router-link :to="{ path: '/assets/new/' + this.query }">
										<a-button type="default" style="margin-right: 15px;">
											Clone
										</a-button>
									</router-link>
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
			<a-col :span="24" :md="8" class="mb-24">
				<a-row>
					<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 4,}">
						<template #title>
							<h6 class="font-semibold m-0">Tags</h6>
						</template>
						<a-row class="card-footer" type="flex" justify="center" align="top">
							<a-form-item style="width: 80%">
								<a-select mode="tags" v-decorator="['tags']" style="width: 100%" @change="handleChange" :default-value="tagSelected" allowClear="true">
									<a-select-option v-for="tag in tagSource" :key="tag">
										{{ tag }}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-row>
						</a-card>
				</a-row>
				<br>
				<a-row>
					<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 4,}">
						<template #title>
							<h6 class="font-semibold m-0">Asset Code</h6>
						</template>
						<a-row class="card-footer" type="flex" justify="center" align="top">
							<img id="barcode" style="max-width: 80%;"/>
						</a-row>
					</a-card>
				</a-row>
				<br>
				<a-row>
					<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 4,}">
						<template #title>
							<h6 class="font-semibold m-0">Notes</h6>
						</template>
						<a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
							<a-row>
								<a-col :span="24">
									<a-textarea :rows="8" />
								</a-col>
							</a-row>
							
							
							<a-form-item :wrapper-col="{ span: 24 }" style="padding-top: 12px;">
							<a-button type="primary" block html-type="submit">
								Save
							</a-button>
							</a-form-item>
						</a-form>
					</a-card>
				</a-row>
			</a-col>

		</a-row>

		<a-row type="flex" :gutter="24">

			<a-col :span="24" :md="16" class="mb-24">
					<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{paddingTop: 0, paddingBottom: '16px' }">
						<template #title>
							<h6 class="font-semibold m-0">Notes</h6>
						</template>
						<a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
							<a-row>
								<a-col :span="24">
									<a-textarea :rows="8" />
								</a-col>
							</a-row>
							
							
							<a-form-item :wrapper-col="{ span: 24 }">
							<a-button type="primary" block html-type="submit">
								Save
							</a-button>
							</a-form-item>
						</a-form>
					</a-card>
			</a-col>
			<a-col :span="24" :md="8" class="mb-24">
				<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{paddingTop: '12px',}">
					<template #title>
						<h6>Event Log</h6>			
					</template>
					<a-timeline v-if="events.length > 0" :reverse="timelineReverse">
						<a-timeline-item v-for="item in events" :key="item._id" :color="item.color">
							<span v-html="formatDescription(item.description)"></span>
							<p>{{ formatDate(item.createdAt) }}</p>
							<p>{{item.user}}</p>
						</a-timeline-item>
					</a-timeline>
					<a-empty v-else />
				</a-card>
			</a-col>


		</a-row>
		</a-spin>
	</div>
</template>

<script>
	import AssetForm from '../components/Cards/AssetForm' ;
	var JsBarcode = require('jsbarcode');

	import CardConnectionMarketplace from "../components/Cards/CardConnectionMarketplace"
	import CardActiveConnections from "../components/Cards/CardActiveConnections"
	import CardAssetNotes from "../components/Cards/CardAssetNotes"

	import { getAsset, deleteAsset, updateAsset } from "../components/asset.script";
	import { getCompanies, getLocations, getManufacturers, getModels, getSuppliers, getTypes, getTags } from "../components/autocomplete.script";
	import { getEvents } from "../components/event.script";

	export default ({
		metaInfo () {
			return {
			title: this.fields.assetName
			}
		},
		components: {
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
				tagSource: [],
				tagSelected: [],
				originalObject: {},
				query,
				tags: [],
				timelineReverse: false,
				events: [],
				fields: {
					assetName: '',
					id: ''
				},
			
			}
		},
		methods: {
			formatDescription(description) {
				return description.replace(/(?:\r\n|\r|\n)/g, '<br>')
			},
			formatDate(date) {
				var options = { year: 'numeric', month: 'short', day: 'numeric', hour: "numeric", minute: "numeric", second: "numeric" };
				var curDate  = new Date(date);
				return curDate.toLocaleDateString("en-US", options)
			},
			handleChange(selectedItems) {
				this.tagSelected = selectedItems;
			},
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
				const tagResponse = await getTags(this.item);
				if (tagResponse.data.success) {
					tagResponse.data.result.forEach(singleResult => {
						this.tagSource.push(singleResult.name)
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
                    query: encodeURIComponent(this.query),
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
					response.data.result.tags.forEach(singleResult => {
						this.tagSelected.push(singleResult.name)
					})
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
			async queryEvent(id) {
                this.item = {
                    items: 0,
                    type: "asset",
					asset: id,
					token: this.accessToken
                    };
                var response = await getEvents(this.item);
                if (response.data.success) {
					this.events = response.data.result;
                } else {
                    console.log(response.data.errors);
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
				if (JSON.stringify(this.originalObject.tags) != JSON.stringify(this.tagSelected)) this.item.tags = this.tagSelected;
				this.loading = true;
				const response = await updateAsset(this.item);
				if (response.data.success) {
					this.loading = false;
					this.$message.success('Asset Updated');
					this.originalObject = response.data.result
					this.queryEvent(this.$route.params.id)
					
				} else {
					this.error(response.data.errors)
				}
			},
			handleSubmit(e) {
				e.preventDefault();
				this.form.validateFields((err, values) => {
					if (!err) {
						var tempValues = values;
						tempValues.tags = this.tagSelected
						this.update(tempValues);
					}
				});
			}
        },
		created() {
			this.queryAutocomplete()
			this.queryAsset()
			this.queryEvent(this.$route.params.id)
        },
		watch: {
            '$route.params.id': function (id) {
				this.spinning = true
                this.query = id
                this.queryAsset()
				this.queryEvent(id)
            }
        },
	})

</script>