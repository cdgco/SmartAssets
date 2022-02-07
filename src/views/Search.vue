<!-- 
	This is the tables page, it uses the dashboard layout in: 
	"./layouts/Dashboard.vue" .
 -->

<template>
	<div>
		<!-- Projects Table -->
		<a-row :gutter="24" type="flex">

			<!-- Projects Table Column -->
			<a-col :span="24" class="mb-24">

				<!-- Projects Table Column -->
				<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 0,}">
                    <template #title>
                        <a-row type="flex" align="middle">
                            <a-col :span="24">
                                <h6>Search Results: {{ query }}</h6>
                                <p>{{numResults}} results ({{seconds}} seconds)</p>			
                            </a-col>
                        </a-row>
                    </template>
                    <a-table
                        :columns="columns"
                        :row-key="record => record._id"
                        :data-source="tableData"
                        :pagination="false"
                        :loading="loading"
                    >
                </a-card>
				<!-- / Projects Table Column -->

			</a-col>
			<!-- / Projects Table Column -->
            

		</a-row>
        <a-row type="flex" align="middle" style="justify-content:center; margin:3%">
				<a-col :span="24">
					<a-pagination 
                    v-model="current"
                    :total="numResults"
                    show-less-items 
                    :hideOnSinglePage="true"
                    
                    style="display: flex; justify-content: center;"/>		
				</a-col>
			</a-row>
		<!-- / Projects Table -->

	</div>
</template>

<script>

	// "Projects" table component.
	import CardSearchResults from '../components/Cards/CardSearchResults' ;
    import { search } from "../components/search.script";
	
	// "Projects" table list of columns and their properties.
	const columns = [
		{
			title: 'NAME',
			dataIndex: '_source.name',
		},
		{
			title: 'TYPE',
			dataIndex: '_source.type',
		},
        {
			title: 'MANUFACTURER',
			dataIndex: '_source.manufacturer',
		},
        {
			title: 'MODEL',
			dataIndex: '_source.assetModel',
		},
        {
			title: 'SUPPLIER',
			dataIndex: '_source.supplier',
		},
        {
			title: 'QUANTITY',
			dataIndex: '_source.quantity',
		},
        {
			title: 'SERIAL',
			dataIndex: '_source.serial',
		},
		{
			title: 'LOCATION',
			dataIndex: '_source.location',
		},
        {
			title: 'TAGS',
			dataIndex: '_source.tags',
		},
        
	];

	export default ({
		components: {
			CardSearchResults,
		},
		data() {
            var query = this.$route.params.id;
			return {
                tableData: [],
                pagination: {},
                loading: false,
                columns,
                query,
                numResults: 0,
                seconds: 0,
                current: 1,
			}
		},
        methods: {
            async querySearch() {
                this.item = {
                    query: this.query
                    };
                this.loading = true;
                const response = await search(this.item);
                if (response.data.success) {
                    this.tableData = response.data.result.hits.hits
                    this.numResults = response.data.result.count
                    this.seconds = (response.data.result.took / 1000)
                    this.item = {
                        query: ""
                    };
                    this.loading = false;
                    //this.$router.push("/dashboard");
                } else {
                    console.log(response.data.errors);
                }
            }
        },
        created() {
            this.querySearch()
        },
        watch: {
            '$route.params.id': function (id) {
                this.query = id
                this.querySearch()
            }
        },
	})

</script>

<style lang="scss">
</style>