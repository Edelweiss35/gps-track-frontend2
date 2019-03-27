<template>
  <section>
    <el-row>
    <el-col :span="8" v-for="(media, index) in data.list">
      <el-card :body-style="{ padding: '0px' }">
        <img :src="'http://'+media.file" class="image">
        <div style="padding: 14px;">
          <div class="bottom clearfix">
            <time class="time">{{dateFormat(media.time)}}</time>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="24" class="toolbar">

    <el-pagination
       layout="total, sizes, prev, pager, next"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="this.$store.state.user.pageSizes"
      :page-size="this.$store.state.user.pageSize"
      :total="data.total"
      :current-page="data.page"
      style="float:right;">
      </el-pagination>
  </el-col>
  </el-row>
   </section>
</template>

<script>
import { getMedias } from '@/api/api';
import util from '@/utils/util'
export default {


	data() {
			return {
        page: 1,
        data:{}
			}
		},
		methods: {
			init(){
        let params = {
          page: this.page,
          pageSize:9,
          deviceId:this.device.id
        }
        getMedias(params).then((data) => {
          this.data = data;

        });
			},
      dateFormat(time){
        return util.dateFormat(time,'YYYY-MM-DD HH:mm:ss')
      },
      handleSizeChange(val) {
        this.$store.dispatch('updatePageSize',val);
        this.init();
       },
       handleCurrentChange(val) {
         this.page = val;
         this.init();
       },

		},
		 watch: {
			'visible': function() {
		    	if(this.visible){
		    		this.init()
		    	}
		    }
		  },
		mounted() {
			this.init()
		},

		props: ['device','visible']
}
</script>
<style>
.image {
    width: 100%;
    display: block;
  }
</style>
