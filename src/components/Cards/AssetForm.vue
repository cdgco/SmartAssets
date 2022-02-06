<template>

	<!-- Authors Table Card -->
	<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 0,}">
		<template #title>
			<a-row type="flex" align="middle">
				<a-col :span="24" :md="12">
					<h5 class="font-semibold m-0">New Asset</h5>
				</a-col>
			</a-row>
		</template>
		<a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
			<a-row>
				<a-col :span="12">
					<a-form-item label="Note">
			<a-input
				v-decorator="['note', { rules: [{ required: true, message: 'Please input your note!' }] }]"
			/>
			</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="Gender">
			<a-select
				v-decorator="[
				'gender',
				{ rules: [{ required: true, message: 'Please select your gender!' }] },
				]"
				placeholder="Select a option and change input text above"
				@change="handleSelectChange"
			>
				<a-select-option value="male">
				male
				</a-select-option>
				<a-select-option value="female">
				female
				</a-select-option>
			</a-select>
			</a-form-item>
				</a-col>
			</a-row>
			
			
			<a-form-item :wrapper-col="{ span: 12, offset: 5 }">
			<a-button type="primary" html-type="submit">
				Submit
			</a-button>
			</a-form-item>
  		</a-form>
	</a-card>
	<!-- / Authors Table Card -->

</template>

<script>

	export default {
		data() {
			return {
			formLayout: 'horizontal',
			form: this.$form.createForm(this, { name: 'coordinated' }),
			};
		},
		methods: {
			handleSubmit(e) {
			e.preventDefault();
			this.form.validateFields((err, values) => {
				if (!err) {
				// console.log('Received values of form: ', values);
				}
			});
			},
			handleSelectChange(value) {
			this.form.setFieldsValue({
				note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
			});
			},
		},
		};

</script>