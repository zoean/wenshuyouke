<template>
	<div>
		<CompanyList v-if="!showDetail" :changeCom="changeCom" :setCListId="setCListId" :showDetail="showDetail" />
		<CompanyDetails v-if="showDetail" :changeCom="changeCom" :setCListId="setCListId" :showDetail="showDetail" /> 
	</div>
</template>
<script>
	import CompanyList from './list.vue'
	import CompanyDetails from './details.vue'
	export default{
		components:{
			CompanyList,
			CompanyDetails
		},
		data(){
			return{				
				showDetail:false,
				companyId:''
			}
		},
		methods:{
			changeCom(){
				this.showDetail = !this.showDetail
			},
			setCListId(listId){
				this.companyId = listId
			}
		}		
	}
</script>
<style lang="scss">
	.list-search{
		display: flex;
		align-items: center;
		.el-input{
			width:200px;
			margin-right: 20px;
		}
	}
	.list-card{
		ul{
			width: 100%;
			display: flex;
			align-content: flex-start;
			flex-wrap:wrap;
			flex-grow: 1;
			li{
				width:400px;
				height:440px;
				padding:16px;
				background:rgba(255,255,255,1);
				box-shadow:0px 0px 6px 0px #d3e5ff;
				border-radius:12px;
				margin:13px 13px 13px 0;
				flex-direction: column;
				.el-switch{
					display: flex;
					justify-content: flex-end;
				}
				h2{
					color: #4386FE;
					font-size: 30px;
					text-align: center;
					margin-top: 62px;
				}
				.el-select{
					margin:0;
					width: 160px;
				}
				p{
					text-align: center;
				}
				dl{
					margin-top: 95px;
					display: flex;
					justify-content: space-between;
					flex-direction: row;
					dt{
						span{
							color: #CC0000
						}
					}
				}
			}
			li.first-card{
				i.el-icon-plus{
					font-size: 40px;
					color: #ccc;
					margin: 160px 0 110px 165px;
					text-align: center;
				}
				p{
					color: #4084FF;
					text-align: center;
					cursor: pointer;
				}
			}
		}
	}
</style>