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
                                <h6>Search Results{{titleColon}} {{ query }}</h6>
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
                        :scroll="{ x: 1600 }"
                    >
                        <span slot="name" slot-scope="name">
                            <router-link :to="{ path: '/assets/'+name.id, }">{{ name.name }}</router-link>
                        </span>
                        <span slot="types" slot-scope="types">
                            <span v-for="type in types" :key="type">{{ type.name }}</span>
                        </span>
                        <span slot="manufacturers" slot-scope="manufacturers">
                            <span v-for="manufacturer in manufacturers" :key="manufacturer">{{ manufacturer.name }}</span>
                        </span>
                        <span slot="suppliers" slot-scope="suppliers">
                            <span v-for="supplier in suppliers" :key="supplier">{{ supplier.name }}</span>
                        </span>
                        <span slot="companies" slot-scope="companies">
                            <span v-for="company in companies" :key="company">{{ company.name }}</span>
                        </span>
                        <span slot="models" slot-scope="models">
                            <span v-for="model in models" :key="model">{{ model.name }}</span>
                        </span>
                        <span slot="locations" slot-scope="locations">
                            <span v-for="location in locations" :key="location">{{ location.name }}</span>
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
                            <a-popconfirm
                                v-if="tableData.length"
                                title="Are you sure?"
                                ok-text="Yes"
                                cancel-text="No"
                                @confirm="confirmDelete(action)"
                            >
                                <a style="padding-right: 10px;"> 
                                    <a-tooltip>
                                        <template slot="title">
                                        delete
                                        </template>
                                        <a-icon type="delete" />
                                    </a-tooltip>
                                </a>
                            </a-popconfirm>
                            <a v-if="tableData.length">
                                <a-tooltip>
                                    <template slot="title">
                                    clone
                                    </template>
                                    <router-link :to="{ path: '/assets/new/' + action }">
                                        <a-icon type="copy" />
                                    </router-link>
                                </a-tooltip>
                            </a>
                        </span>
                    </a-table>
                </a-card>
			</a-col>
		</a-row>
        <a-row type="flex" align="middle" style="justify-content:center; margin:3%">
				<a-col :span="24">
					<a-pagination 
                    v-model="current"
                    :total="numResults"
                    :show-total="(total, range) => `${range[0]}-${range[1]} of ${total} items`"
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
    import { deleteAsset } from "../components/asset.script";
	
	// "Projects" table list of columns and their properties.
	const columns = [
		{
			title: 'NAME',
			dataIndex: '_source',
            fixed: 'left',
            width: 220,
            scopedSlots: { customRender: 'name' },
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
            scopedSlots: { customRender: 'locations' },
		},
        {
			title: 'TAGS',
			dataIndex: '_source.tags',
            scopedSlots: { customRender: 'tags' },
		},
        {
            title: 'Action',
            fixed: 'right',
            dataIndex: '_source.id',
            scopedSlots: { customRender: 'action' },
        },
        
	];

	export default ({
        metaInfo() {
            var title = (this.$route.params.id && this.$route.params.id != '') ? ': ' + this.$route.params.id : '';
            var searchString = 'Search' + title;
            return {
                title: searchString
            }
		},
		components: {
			CardSearchResults,
		},
		data() {
            var jsonToken = localStorage.getItem("user")
            var rawToken = JSON.parse(jsonToken)
            var accessToken = rawToken.accessToken
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
                pageSize: 20,
                countWord : "results",
                titleColon: "",
                accessToken: accessToken
			}
		},
        methods: {
            error(message) {
				this.$error({
					title: 'Failed to delete asset',
					content: message,
				});
			},
            async confirmDelete(id) {
				 this.item = {
                    id: id,
					token: this.accessToken
                };
                const response = await deleteAsset(this.item);
                if (response.data.success) {
                    this.$message.success('Asset Deleted Successfuly');
                    const dataSource = this.tableData;
                    this.tableData = dataSource.filter(item => item._id != id);
                } else {
                    this.error(response.data.errors[0])
                }
			},
            async querySearch() {
                this.item = {
                    query: this.query,
                    page: this.current,
                    items: this.pageSize,
                    token: this.accessToken
                };
                this.loading = true;
                const response = await search(this.item);
                if (response.data.success) {
                    if (response.data.messages[0] == "exact-match") {
                        this.$router.push("/assets/" +response.data.result.hits.hits[0]._id);
                    }
                    this.tableData = response.data.result.hits.hits
                    this.numResults = response.data.result.count
                    this.countWord = (response.data.result.count == 1) ? "result" : "results"
                    this.titleColon = (response.data.result.count > 0) ? ":" : ""
                    this.seconds = (response.data.result.took / 1000)
                    this.item = {
                        query: ""
                    };
                    this.loading = false;
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