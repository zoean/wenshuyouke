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