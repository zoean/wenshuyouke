<template>
	<div>
		<CardList v-if="!showDetail" :changeCom="changeCom" :setCurListId="setCurListId" />
		<CompanyList v-if="showDetail" :changeCom="changeCom" :setCurListId="setCurListId" /> 
	</div>
</template>
<script>
	import CardList from './cardlist.vue'
	import CompanyList from './companylist.vue'
	export default{
		components:{
			CardList,
			CompanyList
		},
		data(){
			return{				
				showDetail:false,
				curCardId:''
			}
		},
		methods:{
			changeCom(){
				this.showDetail = !this.showDetail
			},
			setCurListId(listId){
				this.curCardId = listId
			}
		}		
	}
</script>
<style lang="scss" scoped>
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