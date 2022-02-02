<!-- 
	This is the sign in page, it uses the dashboard layout in: 
	"./layouts/Default.vue" .
 -->

<template>
	<div class="sign-in">
		
		<a-row type="flex" :gutter="[24,24]" justify="space-around" align="middle">

			<!-- Sign In Form Column -->
			<a-col :span="24" :md="12" :lg="{span: 12, offset: 0}" :xl="{span: 6, offset: 2}" class="col-form">
				<h1 class="mb-15">Sign In</h1>
				<h6 class="font-regular text-muted">Enter your username and password to sign in</h6>

				<!-- Sign In Form -->
				<a-form
					id="components-form-demo-normal-login"
					:form="form"
					class="login-form"
					@submit="handleSubmit"
					:hideRequiredMark="true"
				>
					<a-form-item class="mb-10" label="Username" :colon="false" :validate-status="userNameError() ? 'error' : ''" :help="userNameError() || ''">
						<a-input 
						v-decorator="[
          					'userName',
          					{ rules: [{ required: true, message: 'Please input your username!' }] },
        				]"
        				placeholder="Username"
						autocomplete="username">
						<a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" /></a-input>
					</a-form-item>
					<a-form-item class="mb-5" label="Password" :colon="false" :validate-status="passwordError() ? 'error' : ''" :help="passwordError() || ''">
						<a-input
						v-decorator="[
          					'password',
          					{ rules: [{ required: true, message: 'Please input your Password!' }] },
        				]"
        				type="password"
        				placeholder="Password"
						autocomplete="current-password">
						<a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" /></a-input>
					</a-form-item>
					<a-form-item class="mb-10">
    					<a-switch v-model="rememberMe" /> Remember Me
					</a-form-item>
					<a-form-item>
						<a-button type="primary" block html-type="submit" class="login-form-button" :disabled="hasErrors(form.getFieldsError())">
							SIGN IN
						</a-button>
					</a-form-item>
				</a-form>
				<!-- / Sign In Form -->
			</a-col>
			<!-- / Sign In Form Column -->

			<!-- Sign In Image Column -->
			<a-col :span="24" :md="12" :lg="12" :xl="12" class="col-img">
				<img src="images/img-signin.jpeg" alt="">
			</a-col>
			<!-- Sign In Image Column -->

		</a-row>
		
	</div>
</template>

<script>
	function hasErrors(fieldsError) {
	return Object.keys(fieldsError).some(field => fieldsError[field]);
	}

	export default ({
		data() {
			return {
				hasErrors,
      			form: this.$form.createForm(this, { name: 'horizontal_login' }),
				// Binded model property for "Sign In Form" switch button for "Remember Me" .
				rememberMe: true,
			}
		},
		mounted() {
			this.$nextTick(() => {
			// To disabled submit button at the beginning.
			this.form.validateFields();
			});
		},
		beforeCreate() {
			// Creates the form and adds to it component's "form" property.
			this.form = this.$form.createForm(this, { name: 'normal_login' });
		},
		methods: {
			// Only show error after a field is touched.
			userNameError() {
			const { getFieldError, isFieldTouched } = this.form;
			return isFieldTouched('userName') && getFieldError('userName');
			},
			// Only show error after a field is touched.
			passwordError() {
			const { getFieldError, isFieldTouched } = this.form;
			return isFieldTouched('password') && getFieldError('password');
			},
			// Handles input validation after submission.
			handleSubmit(e) {
				e.preventDefault();
				this.form.validateFields((err, values) => {
					if ( !err ) {
						console.log('Received values of form: ', values) ;
					}
				});
			},
		},
	})

</script>

<style lang="scss">
	body {
		background-color: #ffffff;
	}
</style>