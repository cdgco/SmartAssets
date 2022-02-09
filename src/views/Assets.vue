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
                                <h6>Assets</h6>		
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
				<!-- / Projects Table Column -->

			</a-col>
			<!-- / Projects Table Column -->
            

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
	import CardAssetTable from '../components/Cards/CardAssetTable' ;
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
			title: 'MANUFACTURER',
			dataIndex: 'manufacturer',
            scopedSlots: { customRender: 'manufacturers' },
		},
        {
			title: 'MODEL',
			dataIndex: 'assetModel',
            scopedSlots: { customRender: 'models' },
		},
        {
			title: 'SUPPLIER',
			dataIndex: 'supplier',
            scopedSlots: { customRender: 'suppliers' },
		},
        {
			title: 'QUANTITY',
			dataIndex: 'quantity',
		},
        {
			title: 'SERIAL',
			dataIndex: 'serial',
		},
		{
			title: 'LOCATION',
			dataIndex: 'location',
		},
        {
			title: 'TAGS',
			dataIndex: 'tags',
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
		metaInfo: {
			title: 'Assets',
		},
		components: {
			CardAssetTable,
		},
		data() {
			return {
				tableData: [],
                pagination: {},
                loading: false,
                columns,
                numResults: 0,
                seconds: 0,
                current: 1,
                pageSize: 50,
                countWord : "results"
			}
		},
		methods: {
            async queryAsset() {
                this.item = {
                    page: this.current,
                    items: this.pageSize
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
					this.numResults = response.data.result.count
                    this.item = {
                        page: "",
						items: "",
                    };
                    this.loading = false;
                } else {
                    console.log(response.data.errors);
                }
            },
            changePage(pageNumber) {
                this.current = pageNumber
                this.queryAsset()
            },
        },
        created() {
            this.queryAsset()
        },
	})

</script>

<style lang="scss">
</style>