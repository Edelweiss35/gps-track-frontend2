<template>
<section class="chart-container">

         <el-row>
         	 <el-col :span="24">
               <el-table :data="cmdRecords" style="width: 100%">
		      <el-table-column prop="sn" label="流水号" width="80"></el-table-column>
		       <el-table-column prop="name" label="名称" width="120"></el-table-column>
		      <el-table-column prop="reqTime" label="发送时间" :formatter="dateFormat" width="180"></el-table-column>
		       <el-table-column prop="status" label="状态"  width="100">
						 <template slot-scope="scope">
							 <el-tag
								 :type="scope.row.status === 0 ? 'success' :scope.row.status === 1 ? 'warning' :scope.row.status === 2 ? 'primary' :scope.row.status === 3 ? 'danger' :''"
								 close-transition>{{scope.row.status === 0 ? '成功' : scope.row.status===1 ?'缓存':scope.row.status===2 ?'等待响应':scope.row.status===3 ? '执行失败':scope.row.status===4 ?'未执行':'未知'}}</el-tag>
						 </template>
					 </el-table-column>
		      <el-table-column prop="time" label="延迟"></el-table-column>
		      <el-table-column prop="res" label="内容" width="150"></el-table-column>
		    </el-table>
            </el-col>
         </el-row>
          <el-row>
          <!--工具条-->
			<el-col :span="24" class="toolbar">

			<el-pagination
				 layout="total, sizes, prev, pager, next"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:page-sizes="this.$store.state.user.pageSizes"
				:page-size="this.$store.state.user.pageSize"
				:total="total"
				:current-page="page"
				style="float:right;">
				</el-pagination>
		</el-col>
          </el-row>
 	</section>
    </template>
<script>
import util from '@/utils/util';
import { getCmdRecords } from '@/api/api';
export default {


	data() {
			return {

				cmdRecords: [],
				total: 0,
				page:1

			}
		},
		methods: {
			getCmdRecords(){
					let params = {
						deviceId:this.device.id,
						page: this.page,
						pageSize:10
					}

	            	getCmdRecords(params).then((res) => {
		                this.cmdRecords = res.list;
		                this.total = res.total;
	                });
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getCmdRecords();
			},
			 handleSizeChange(val) {
		     	 this.$store.dispatch('updatePageSize',val);

		     	this.getCmdRecords();

		      },
			 //时间格式化
        dateFormat:function(row, column) {
           var date = row[column.property];
        if (date == undefined) {
           return "";
        }
        return util.dateFormat(date,'YYYY-MM-DD HH:mm:ss');
			},
			formatStatus:function(row, column) {
         var code = row[column.property];
				 var state = '';
	       switch (code) {
	       	case 0:
						state='<el-tag type="success">执行成功</el-tag>'
	       		break;
						case 1:
						state='未执行（缓存）'
						break;
						case 2:
						state='等待响应'
						break;
						case 3:
						state='执行失败'
						break;
						case 4:
						state='未执行'
						break;
	       	default:

	       }
				return state;
		},

		},
		 watch: {
			'visible': function() {
        console.log('this.visible'+this.visible)
		    	if(this.visible){

		    		this.page = 1
		    	  this.getCmdRecords();
		    	}
		    }
		  },
		mounted() {
			this.getCmdRecords()

		},

		props: ['device','visible']
}
</script>
