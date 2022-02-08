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
                                <p>{{numResults}} {{countWord}} ({{seconds}} seconds)</p>			
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
                        <span slot="types" slot-scope="types">
                            <p v-for="type in types" :key="type">{{ type.name }}</p>
                        </span>
                        <span slot="manufacturers" slot-scope="manufacturers">
                            <p v-for="manufacturer in manufacturers" :key="manufacturer">{{ manufacturer.name }}</p>
                        </span>
                        <span slot="suppliers" slot-scope="suppliers">
                            <p v-for="supplier in suppliers" :key="supplier">{{ supplier.name }}</p>
                        </span>
                        <span slot="companies" slot-scope="companies">
                            <p v-for="company in companies" :key="company">{{ company.name }}</p>
                        </span>
                        <span slot="models" slot-scope="models">
                            <p v-for="model in models" :key="model">{{ model.name }}</p>
                        </span>
                        <span slot="tags" slot-scope="tags">
                            <a-tag
                                v-for="tag in tags"
                                :key="tag"
                            >
                                {{ tag.name }}
                            </a-tag>
                        </span>
                        <span slot="action" slot-scope="action">
                            <a style="padding-right: 10px;"> 
                                <a-tooltip>
                                    <template slot="title">
                                    delete
                                    </template>
                                    <a-icon type="delete" />
                                </a-tooltip>
                            </a>
                            <a>
                                <a-tooltip>
                                    <template slot="title">
                                    duplicate
                                    </template>
                                    <a-icon type="copy" />
                                </a-tooltip>
                            </a>
                        </span>
                    </a-table>
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
                    :defaultPageSize="pageSize"
                    @change="changePage"
                    
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
            fixed: 'left'
		},
		{
			title: 'TYPE',
			dataIndex: '_source.type',
            scopedSlots: { customRender: 'types' },
		},
        {
			title: 'MANUFACTURER',
			dataIndex: '_source.manufacturer',
            scopedSlots: { customRender: 'manufacturers' },
		},
        {
			title: 'MODEL',
			dataIndex: '_source.assetModel',
            scopedSlots: { customRender: 'models' },
		},
        {
			title: 'SUPPLIER',
			dataIndex: '_source.supplier',
            scopedSlots: { customRender: 'suppliers' },
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
            scopedSlots: { customRender: 'tags' },
		},
        {
            title: 'Action',
            key: 'operation',
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
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
                pageSize: 50,
                countWord : "results"
			}
		},
        methods: {
            async querySearch() {
                this.item = {
                    query: this.query,
                    page: this.current,
                    items: this.pageSize
                    };
                this.loading = true;
                const response = await search(this.item);
                if (response.data.success) {
                    this.tableData = response.data.result.hits.hits
                    this.numResults = response.data.result.count
                    this.countWord = (response.data.result.count == 1) ? "result" : "results"
                    this.seconds = (response.data.result.took / 1000)
                    this.item = {
                        query: ""
                    };
                    this.loading = false;
                    //this.$router.push("/dashboard");
                } else {
                    console.log(response.data.errors);
                }
            },
            changePage(pageNumber) {
                this.current = pageNumber
                this.querySearch()
            },
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