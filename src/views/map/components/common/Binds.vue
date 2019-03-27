<template>
  <section>
    <el-alert
    :title="$t('map.bindDesc')"
    type="warning">
  </el-alert><br>
 		<el-transfer
       	 :titles="[$t('map.unbind'),$t('map.bind')]"
       	 v-model="bindIds"
       	 :data="data"
       	  :props="{
		      key: 'id',
		      label: 'name'
		    }"
       	 @change="handleChange"
       	 ></el-transfer>
           </section>
</template>

<script>
import { getDeviceIdsByGeoId,unbindDeviceIds,bindDeviceIds,getGeofences,getGeofenceIdsByDid,bindGeofenceIds,unbindGeofenceIds } from '@/api/api';
export default {


	data() {
			return {
				data: [],
       	bindIds: []

			}
		},
		methods: {
			init(){
				if(this.by==0){
					this.data= this.$store.state.user.devices.list;
					this.getDeviceIds();
				}else{
					getGeofences().then((data) => {
						this.data = data;
						this.getGeofenceIds();

					});

				}
			},
			handleChange(value, direction, movedKeys) {
		        console.log(value, direction, movedKeys);
		        if(this.by == 0){

		        	this.geofenceBindDevices(value, direction, movedKeys)

		         }else{
		         	this.deviceBindGeofences(value, direction, movedKeys)

		         }
		     },
		     getDeviceIds(){
	    			getDeviceIdsByGeoId(this.$store.state.user.selectGeofence.id).then((data) => {
							this.bindIds = data
					});
		     },
		     getGeofenceIds(){
             console.log(this.$store.state.user.devices.selectId);
	    			getGeofenceIdsByDid(this.$store.state.user.devices.selectId).then((data) => {
							this.bindIds = data
					});
		     },
		     geofenceBindDevices(value, direction, movedKeys){
		     	 let para = { geofenceId: this.$store.state.user.selectGeofence.id,deviceIds:movedKeys };
			         if(direction=='right'){

	                    bindDeviceIds(para).then((res) => {
	                        this.$message({
	                            message: this.$t('map.bindSuccess'),
	                            type: 'success'
	                        });
	                    });

			         }else if(direction=='left'){
	                    unbindDeviceIds(para).then((res) => {
	                        this.$message({
	                            message: this.$t('map.unbindSuccess'),
	                            type: 'success'
	                        });
	                    });
			         }
		     },
		     deviceBindGeofences(value, direction, movedKeys){
		     	let para = { deviceId: this.$store.state.user.devices.selectId,geofenceIds:movedKeys };
		         if(direction=='right'){

                    bindGeofenceIds(para).then((res) => {
                        this.$message({
                            message: this.$t('map.bindSuccess'),
                        });
                    });

		         }else if(direction=='left'){
                    unbindGeofenceIds(para).then((res) => {
                        this.$message({
                            message: this.$t('map.unbindSuccess'),
                        });
                    });
		         }
		     }

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

		props: ['by','visible']
}
</script>
