<template>
	<div>
		<a-row :gutter="24" type="flex" align="stretch">
			<a-col :span="24" :lg="10" class="mb-24">
				<CardBarChart v-if="loaded"></CardBarChart>
				<a-skeleton active v-else/>
			</a-col>
			<a-col :span="24" :lg="14" class="mb-24">
				<CardLineChart v-if="loaded"></CardLineChart>
				<a-skeleton active v-else/>
			</a-col>
		</a-row>
		<a-row :gutter="24" type="flex" align="stretch">
			<a-col :span="24" :lg="16" class="mb-24">
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
				
			</a-col>
			<a-col :span="24" :lg="8" class="mb-24">

				<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{paddingTop: '12px',}">
					<template #title>
						<h6>Recent Events</h6>			
					</template>
					<a-timeline v-if="events.length > 0" :reverse="timelineReverse">
						<a-timeline-item v-for="item in events" :key="item._id" :color="item.color">
							{{ item.title }}
							<p>{{ formatDate(item.createdAt) }}</p>
							<p>{{item.user}}</p>
						</a-timeline-item>
					</a-timeline>
					<a-empty v-else />
				</a-card>

			</a-col>
		</a-row>

	</div>
</template>

<script>

	import CardBarChart from '../components/Cards/CardBarChart' ;
	import CardLineChart from '../components/Cards/CardLineChart' ;
	import CardAssetTable from '../components/Cards/CardAssetTable' ;
	import { getAssets } from "../components/asset.script";
	import { getEvents } from "../components/event.script";

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
				accessToken: accessToken,
				timelineReverse: false,
				events: []
			}
		},
		methods: {
			formatDate(date) {
				var options = { year: 'numeric', month: 'short', day: 'numeric', hour: "numeric", minute: "numeric", second: "numeric" };
				var curDate  = new Date(date);
				return curDate.toLocaleDateString("en-US", options)
			},
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
			},
			async queryEvent() {
                this.item = {
                    items: 7,
                    type: "asset",
					token: this.accessToken
                    };
                var response = await getEvents(this.item);
                if (response.data.success) {
					this.events = response.data.result;
                } else {
                    console.log(response.data.errors);
                }
			}
		},
		 created() {
			this.queryAsset()
			this.queryEvent()
			setTimeout(this.loading, 100);
		}
	})

</script>