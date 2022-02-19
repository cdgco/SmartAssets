<template>

	<!-- Authors Table Card -->
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
	<!-- / Authors Table Card -->

</template>

<script>

	export default {
		props: ['name', 'type', 'manufacturer', 'model', 'quantity', 'serial', 'location', 'supplier', 'company'],
		data() {
			return {
			formLayout: 'horizontal',
			form: this.$form.createForm(this, { name: 'coordinated', 
				mapPropsToFields: () => {
					return {
						name: this.$form.createFormField({
							value: this.name.value,
						}),
						type: this.$form.createFormField({
							value: this.type.value,
						}),
						manufacturer: this.$form.createFormField({
							value: this.manufacturer.value,
						}),
						model: this.$form.createFormField({
							value: this.model.value,
						}),
						quantity: this.$form.createFormField({
							value: this.quantity.value,
						}),
						serial: this.$form.createFormField({
							value: this.serial.value,
						}),
						location: this.$form.createFormField({
							value: this.location.value,
						}),
						supplier: this.$form.createFormField({
							value: this.supplier.value,
						}),
						company: this.$form.createFormField({
							value: this.company.value,
						}),
					}; 
				}, 
				}),
			};
		},
		watch: {
			name(val) {
				this.form.setFieldsValue({ name: val });
			},
			type(val) {
				this.form.setFieldsValue({ type: val });
			},
			manufacturer(val) {
				this.form.setFieldsValue({ manufacturer: val });
			},
			model(val) {
				this.form.setFieldsValue({ model: val });
			},
			quantity(val) {
				this.form.setFieldsValue({ quantity: val });
			},
			serial(val) {
				this.form.setFieldsValue({ serial: val });
			},
			location(val) {
				this.form.setFieldsValue({ location: val });
			},
			supplier(val) {
				this.form.setFieldsValue({ supplier: val });
			},
			company(val) {
				this.form.setFieldsValue({ company: val });
			},
		},
		methods: {
			confirmDelete(e) {
				console.log(e);
				this.$message.success('Click on Yes');
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
	};

</script>