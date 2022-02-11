<!-- 
	This is the dashboard page, it uses the dashboard layout in: 
	"./layouts/Dashboard.vue" .
 -->

<template>
	<div>

		<!-- Charts -->
		<a-row :gutter="24" type="flex" align="stretch">
			<a-col :span="24" :lg="10" class="mb-24">

				<!-- Active Users Card -->
				<CardBarChart v-if="loaded"></CardBarChart>
				<a-skeleton active v-else/>
				<!-- Active Users Card -->

			</a-col>
			<a-col :span="24" :lg="14" class="mb-24">
				
				<!-- Sales Overview Card -->
				<CardLineChart v-if="loaded"></CardLineChart>
				<a-skeleton active v-else/>
				<!-- / Sales Overview Card -->

			</a-col>
		</a-row>
		<!-- / Charts -->

		<!-- Table & Timeline -->
		<a-row :gutter="24" type="flex" align="stretch">
			<!-- Table -->
			<a-col :span="24" :lg="16" class="mb-24">
				
				<!-- Projects Table Card -->
				<a-card v-if="loaded" :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 0,}">
                    <template #title>
                        <a-row type="flex" align="middle">
                            <a-col :span="24">
                                <h6>Recent Assets</h6>		
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
						<span slot="name" slot-scope="name">
                            <router-link :to="{ path: '/assets/' + name.id }">{{ name.name }}</router-link>
                        </span>
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
                        <span slot="action">
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
				<a-skeleton active v-else/>
				<!-- / Projects Table Card -->
				
			</a-col>
			<!-- / Table -->

			<!-- Timeline -->
			<a-col :span="24" :lg="8" class="mb-24">

				<!-- Orders History Timeline Card -->
				<CardEventHistory v-if="loaded"></CardEventHistory>
				<a-skeleton active v-else/>
				<!-- / Orders History Timeline Card -->

			</a-col>
			<!-- / Timeline -->
		</a-row>
		<!-- / Table & Timeline -->

	</div>
</template>

<script>

	// Bar chart for "Active Users" card.
	import CardBarChart from '../components/Cards/CardBarChart' ;

	// Line chart for "Sales Overview" card.
	import CardLineChart from '../components/Cards/CardLineChart' ;

	// "Projects" table component.
	import CardAssetTable from '../components/Cards/CardAssetTable' ;

	// Order History card component.
	import CardEventHistory from '../components/Cards/CardEventHistory' ;

	import { getAssets } from "../components/getAssets.script";


	// "Projects" table list of columns and their properties.
	const columns = [
		{
			title: 'NAME',
			dataIndex: 'tableData',
            fixed: 'left',
            width: 200,
            scopedSlots: { customRender: 'name' },
		},
		{
			title: 'TYPE',
			dataIndex: 'type',
            scopedSlots: { customRender: 'types' },
		},
        {
			title: 'TAGS',
			dataIndex: 'tags',
            scopedSlots: { customRender: 'tags' },
		},
	];

	export default ({
		metaInfo: {
			title: 'Dashboard',
		},
		components: {
			CardBarChart,
			CardLineChart,
			CardAssetTable,
			CardEventHistory
		},
		data() {
			var jsonToken = localStorage.getItem("user")
            var rawToken = JSON.parse(jsonToken)
            var accessToken = rawToken.accessToken
			return {
				tableData: [],
                loading: false,
                columns,
				loaded : true,
				accessToken: accessToken
			}
		},
		methods: {
			async loading() {
				this.loaded = true
			},
			async queryAsset() {
                this.item = {
                    page: 1,
                    items: 7,
					token: this.accessToken
                    };
                this.loading = true;
                var response = await getAssets(this.item);
                if (response.data.success) {
					response.data.result.results.forEach(singleResult => {
						singleResult.tableData = {
							name: singleResult.name,
							id: singleResult._id
						}
					})
                    this.tableData = response.data.result.results
                    this.item = {
                        page: "",
						items: "",
                    };
                    this.loading = false;
                } else {
                    console.log(response.data.errors);
                }
			}

		},
		 created() {
			this.queryAsset()
			setTimeout(this.loading, 1000);
		}
	})

</script>

<style lang="scss">
</style>