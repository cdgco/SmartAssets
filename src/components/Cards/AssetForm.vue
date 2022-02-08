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
					<a-input id="type"/>
				</a-form-item>
			</a-row>
			<a-row>
					<a-form-item label="Manufacturer">
						<a-input id="manufacturer"/>
					</a-form-item>
					</a-row>
			<a-row>
				
					<a-form-item label="Model">
						<a-input id="model"/>
					</a-form-item>
				</a-row>
			<a-row>
					<a-form-item label="Quantity">
						<a-input-number id="quantity" :min="0" />
					</a-form-item>
				</a-row>
			<a-row>
					<a-form-item label="Serial">
						<a-input id="serial" />
					</a-form-item>
				</a-row>
			<a-row>
					<a-form-item label="Location">
						<a-input id="location"/>
					</a-form-item>
			</a-row>
			<a-row>
					<a-form-item label="Supplier">
						<a-input id="supplier"/>
					</a-form-item>
				</a-row>
			<a-row>
					<a-form-item label="Company">
						<a-input id="company"/>
					</a-form-item>
			</a-row>
			
			
			<a-form-item :wrapper-col="{ span: 12, offset: 5 }">
				<a-button type="primary" html-type="submit" style="margin-right: 15px;">
					Submit
				</a-button>
				<a-button type="default" style="margin-right: 15px;">
					Clone
				</a-button>
				<a-button type="danger" >
					Delete
				</a-button>
			</a-form-item>
  		</a-form>
	</a-card>
	<!-- / Authors Table Card -->

</template>

<script>

	export default {
		props: ['name'],
		data() {
			return {
			formLayout: 'horizontal',
			form: this.$form.createForm(this, { name: 'coordinated', 
				mapPropsToFields: () => {
					return {
						name: this.$form.createFormField({
							value: this.name.value,
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
		},
		methods: {
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