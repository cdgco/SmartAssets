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

	export default ({
		metaInfo: {
			title: 'New Asset',
		},
		data() {
			var jsonToken = localStorage.getItem("user")
            var rawToken = JSON.parse(jsonToken)
            var accessToken = rawToken.accessToken
			return {
				tags: [],
				accessToken: accessToken,
				formLayout: 'horizontal',
				form: this.$form.createForm(this, { name: 'coordinated'}),
			};
		},
		methods: {
			error(message) {
				this.$error({
					title: 'Failed to save asset',
					content: message,
				});
			},
			async submit(values) {
				this.item = {
					name: values.name,
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
				if (this.tags.length > 0) this.item.tags = values.tags;
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
	})

</script>