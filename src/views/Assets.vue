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
                        :scroll="{ x: 1600 }"
                    >
						<span slot="name" slot-scope="name">
                            <router-link :to="{ path: '/assets/' + name.id }">{{ name.name }}</router-link>
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
                                @confirm="confirmDelete(action.id)"
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
                                    <router-link :to="{ path: '/assets/new/' + action.id }">
                                        <a-icon type="copy" />
                                    </router-link>
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
            <a-row>
                <a-button @click="showModal">Import from CSV</a-button>&nbsp;
                <a-button @click="downloadAssets">Export to CSV</a-button>
            </a-row>
            <br><br>
            <a-modal v-model="visible" title="Import Assets From CSV" :destroyOnClose=true :bodyStyle="{padding: 2}" :footer="null">
                    <a-upload-dragger
                    name="file"
                    :multiple="false"
                    :action="uploadURL"
                    @change="uploadChange"
                    accept=".csv"
                    :showUploadList="false"
                    :headers="accessHeader"
                >
                    <p class="ant-upload-drag-icon">
                    <a-icon type="inbox" />
                    </p>
                    <p class="ant-upload-text">
                    Click or drag file to upload
                    </p>
                    <p class="ant-upload-hint">
                    CSV files with headers on first line
                    </p>
                </a-upload-dragger>
			</a-modal>
		<!-- / Projects Table -->

	</div>
</template>

<script>

	// "Projects" table component.
	import CardAssetTable from '../components/Cards/CardAssetTable' ;
	import { getAssets, deleteAsset, exportAssets } from "../components/asset.script";


	// "Projects" table list of columns and their properties.
	const columns = [
		{
			title: 'NAME',
			dataIndex: 'tableData',
            fixed: 'left',
            width: 220,
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
            scopedSlots: { customRender: 'locations' },
		},
        {
			title: 'TAGS',
			dataIndex: 'tags',
            scopedSlots: { customRender: 'tags' },
		},
        {
            title: 'Action',
            fixed: 'right',
            dataIndex: 'tableData',
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
			var jsonToken = localStorage.getItem("user")
            var rawToken = JSON.parse(jsonToken)
            var accessToken = rawToken.accessToken
            this.$message.config({maxCount: 1});
			return {
				tableData: [],
                pagination: {},
                loading: false,
                columns,
                numResults: 0,
                seconds: 0,
                current: 1,
                pageSize: 20,
                countWord : "results",
				accessToken: accessToken,
                visible: false,
                accessHeader: {
                    Authorization: 'Bearer ' + accessToken
                },
                uploadURL: process.env.VUE_APP_API_URL + "/assets/import",

			}
		},
		methods: {
            uploadChange(event) {
				this.visible = false;
                if (event.file.status == "uploading") {
                    this.$message.loading('Importing Assets ...', 0);
                }
                else if (event.file.status == "done") {
                    this.$message.destroy();
                    if (event.file.response.code == 200 && event.file.response.errors.length == 0) {
                        this.$message.success('Import Completed', 1);
                    }
                    else if (event.file.response.code == 200) {
                        this.$message.warning('Import Completed With Errors', 2);
                    }
                    else {
                        this.$message.error('Import Failed', 2);
                    }
                }
                else {
                    this.$message.destroy();
                    this.$message.error('Import Failed', 2);

                }
			},
            showModal() {
				this.visible = true;
			},
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
                    this.queryAsset()
                    this.$message.success('Asset Deleted Successfuly');
                } else {
                    this.error(response.data.errors[0])
                }
			},
            async downloadAssets() {
                this.$message.loading('Retrieving Assets ...', 0);
				this.assetItem = {
					token: this.accessToken,
                    items: 0,
                    page: 1
                };
                const assetResponse = await getAssets(this.assetItem);
                if (assetResponse.data.success) {
                    this.$message.destroy();
                    this.$message.loading('Generating CSV ...', 0);
                    this.csvItem = {
                        token: this.accessToken,
                        assets: assetResponse.data.result.results
                    };
                    const response = await exportAssets(this.csvItem);
                    if (response) {
                        this.$message.destroy();
                        this.$message.success('Downloaded CSV', 1);
                    }
                    const url = window.URL.createObjectURL(new Blob([response.data]))
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'assets.csv');
                    document.body.appendChild(link)
                    link.click();

                } else {
                    this.error(response.data.errors[0])
                }
			},
            async queryAsset() {
                this.item = {
                    page: this.current,
                    items: this.pageSize,
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