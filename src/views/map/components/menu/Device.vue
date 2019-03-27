<template>
	<section>
	<el-dialog class="add-form" :title="$t('map.menuDeviceAdd')" width="50%" :visible="this.$store.state.user.visibles.deviceAddForm" :before-close="handleClose" :lock-scroll="false">
		<el-form label-width="120px" :model="addForm" ref="addForm">
			<el-row :gutter="20">
				<el-col :span="12">

					<el-form-item :label="$t('common.deviceType')" prop="typeId" label-width="170px" size="small">
						<el-select v-model="addForm.typeId" placeholder="设备类型">
							<el-option
								v-for="item in this.types"
								:key="item.id"
								:label="item.name"
								:value="item.id">
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item :label="$t('common.deviceImei')" label-width="170px" size="small" prop="imei" :rules="[{ required: true, message: '请输入设备号', trigger: 'blur'},{ min: 10, max: 16, message: '长度在 10 到 16 个字符', trigger: 'blur'}]">
						<el-input type="text" v-model="addForm.imei" auto-complete="off"></el-input>
					</el-form-item>

					<el-form-item :label="$t('common.deviceName')" label-width="170px" size="small" prop="name">
						<el-input type="text" v-model="addForm.name" auto-complete="off"></el-input>
					</el-form-item>

					<el-form-item :label="$t('common.deviceSim')" label-width="170px" size="small" prop="sim">
						<el-input type="text" v-model="addForm.sim" auto-complete="off"></el-input>
					</el-form-item>



					<el-form-item :label="$t('system.brand')" label-width="170px" size="small">
						<el-input type="text" v-model="details.brand" auto-complete="off"></el-input>
					</el-form-item>

					<el-form-item :label="$t('system.icon')" label-width="170px" size="small" prop="sim">
						<el-radio-group v-model="details.icon" size="small">
							<el-radio label="default"><img width="40px" src="/static/icon/icon_default_1.png"></el-radio>
							<el-radio label="car"><img width="40px" src="/static/icon/icon_car_1.png"></el-radio>
							<el-radio label="truck"><img width="40px" src="/static/icon/icon_truck_1.png"></el-radio>
							<el-radio label="moto"><img width="40px" src="/static/icon/icon_moto_1.png"></el-radio>
							<el-radio label="people"><img width="40px" src="/static/icon/icon_people_1.png"></el-radio>
							<el-radio label="pet"><img width="40px" src="/static/icon/icon_pet_1.png"></el-radio>
							<el-radio label="plane"><img width="40px" src="/static/icon/icon_plane_1.png"></el-radio>
							<el-radio label="ship"><img width="40px" src="/static/icon/icon_ship_1.png"></el-radio>
							<el-radio label="train"><img width="40px" src="/static/icon/icon_train_1.png"></el-radio>
						</el-radio-group>
					</el-form-item>

					<el-form-item :label="$t('system.client')" label-width="170px" size="small">
						<el-input type="text" v-model="addForm.account" auto-complete="off"></el-input>
					</el-form-item>

					<el-form-item :label="$t('system.devPwd')" label-width="170px" size="small">
						<el-input type="text" v-model="details.devPwd" auto-complete="off"></el-input>
					</el-form-item>

					<el-form-item :label="$t('system.devNumber')" label-width="170px" size="small">
						<el-input type="text" v-model="details.devNumber" auto-complete="off"></el-input>
					</el-form-item>

				</el-col>

				<el-col :span="12">

					<el-form-item :label="$t('system.devVIN')" label-width="170px" size="small">
						<el-input type="text" v-model="details.devVIN" auto-complete="off"></el-input>
					</el-form-item>

					<el-form-item :label="$t('system.refrigModel')" label-width="170px" size="small">
						<el-input type="text" v-model="details.refrigModel" auto-complete="off"></el-input>
					</el-form-item>

					<el-form-item :label="$t('system.refrigSN')" label-width="170px" size="small">
						<el-input type="text" v-model="details.refrigSN" auto-complete="off"></el-input>
					</el-form-item>

					<el-form-item :label="$t('system.fuelVol')" label-width="170px" size="small">
						<el-input type="text" v-model="details.fuelVol" auto-complete="off"></el-input>
					</el-form-item>

					<el-form-item :label="$t('system.containerNumber')" label-width="170px" size="small">
						<el-input type="text" v-model="details.containerNumber" auto-complete="off"></el-input>
					</el-form-item>

					<el-form-item :label="$t('system.containerType')" label-width="170px" size="small">
						<el-input type="text" v-model="details.containerType" auto-complete="off"></el-input>
					</el-form-item>

					<el-form-item :label="$t('system.doorType')" label-width="170px" size="small">
						<el-input type="text" v-model="details.doorType" auto-complete="off"></el-input>
					</el-form-item>

					<el-form-item :label="$t('system.temp1SN')" label-width="170px" size="small">
						<el-input type="text" v-model="details.temp1SN" auto-complete="off"></el-input>
					</el-form-item>

					<el-form-item :label="$t('system.temp2SN')" label-width="170px" size="small">
						<el-input type="text" v-model="details.temp2SN" auto-complete="off"></el-input>
					</el-form-item>

					<el-form-item :label="$t('system.temp3SN')" label-width="170px" size="small">
						<el-input type="text" v-model="details.temp3SN" auto-complete="off"></el-input>
					</el-form-item>

					<el-form-item :label="$t('system.temp4SN')" label-width="170px" size="small">
						<el-input type="text" v-model="details.temp4SN" auto-complete="off"></el-input>
					</el-form-item>

				</el-col>
				<!-- <el-col :span="12" v-if="hasPermission('user:group:view')">
					<GroupTree @handleNodeClick="handleNodeClick" :currentKey="currentKey"></GroupTree>
				</el-col> -->
	 		</el-row>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click.native="handleClose">{{$t('common.cancel')}}</el-button>
			<el-button type="primary" @click.native="addSubmit">{{$t('common.ok')}}</el-button>
		</div>
	</el-dialog>

	<el-dialog class="edit-form"  :title="$t('system.deviceInfo')" width="50%"  :visible.sync="$store.state.user.visibles.deviceEditForm" :lock-scroll="false">
		<el-form label-width="120px" :model="editForm"  ref="editForm" >
			<el-row :span="24">
				<el-col :span="12">
					<el-form-item :label="$t('common.deviceImei')" prop="imei" label-width="170px" size="small">
						<el-input type="text" v-model="editForm.imei" auto-complete="off" disabled></el-input>
					</el-form-item>
					<el-form-item :label="$t('common.deviceName')" prop="name" label-width="170px" size="small">
						<el-input type="text" v-model="editForm.name" auto-complete="off" :disabled="$store.state.common.user.roleKeys == 'demo'"></el-input>
					</el-form-item>
					<el-form-item :label="$t('common.deviceSim')" prop="sim" label-width="170px" size="small">
						<el-input type="text" v-model="editForm.sim" auto-complete="off" disabled></el-input>
					</el-form-item>
					<el-form-item :label="$t('common.deviceType')" prop="typeId" label-width="170px" size="small">
						<el-select v-model="editForm.typeId"  :placeholder="$t('system.deviceType')" disabled>
							<el-option
								v-for="item in this.types"
								:key="item.id"
								:label="item.name"
								:value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label="$t('system.brand')" label-width="170px" size="small">
						<el-input type="text" v-model="details.brand" auto-complete="off" disabled></el-input>
					</el-form-item>

					<el-form-item :label="$t('system.icon')" label-width="170px" size="small" prop="sim">
						<el-radio-group v-model="details.icon" size="small" :disabled="$store.state.common.user.roleKeys == 'demo'">
							<el-radio label="default"><img width="40px" src="/static/icon/icon_default_1.png"></el-radio>
							<el-radio label="car"><img width="40px" src="/static/icon/icon_car_1.png"></el-radio>
							<el-radio label="truck"><img width="40px" src="/static/icon/icon_truck_1.png"></el-radio>
							<el-radio label="moto"><img width="40px" src="/static/icon/icon_moto_1.png"></el-radio>
							<el-radio label="people"><img width="40px" src="/static/icon/icon_people_1.png"></el-radio>
							<el-radio label="pet"><img width="40px" src="/static/icon/icon_pet_1.png"></el-radio>
							<el-radio label="plane"><img width="40px" src="/static/icon/icon_plane_1.png"></el-radio>
							<el-radio label="ship"><img width="40px" src="/static/icon/icon_ship_1.png"></el-radio>
							<el-radio label="train"><img width="40px" src="/static/icon/icon_train_1.png"></el-radio>
						</el-radio-group>
					</el-form-item>

					<el-form-item :label="$t('system.client')" label-width="170px" size="small">
						<el-input type="text" v-model="device.account" auto-complete="off" disabled></el-input>
					</el-form-item>

					<el-form-item :label="$t('system.devPwd')" label-width="170px" size="small">
						<el-input type="text" v-model="details.devPwd" auto-complete="off" disabled></el-input>
					</el-form-item>

					<el-form-item :label="$t('system.devNumber')" label-width="170px" size="small">
						<el-input type="text" v-model="details.devNumber" auto-complete="off" disabled></el-input>
					</el-form-item>

				</el-col>

				<el-col :span="12">

					<el-form-item :label="$t('system.devVIN')" label-width="170px" size="small">
						<el-input type="text" v-model="details.devVIN" auto-complete="off" disabled></el-input>
					</el-form-item>

					<el-form-item :label="$t('system.refrigModel')" label-width="170px" size="small">
						<el-input type="text" v-model="details.refrigModel" auto-complete="off" disabled></el-input>
					</el-form-item>

					<el-form-item :label="$t('system.refrigSN')" label-width="170px" size="small">
						<el-input type="text" v-model="details.refrigSN" auto-complete="off" disabled></el-input>
					</el-form-item>

					<el-form-item :label="$t('system.fuelVol')" label-width="170px" size="small">
						<el-input type="text" v-model="details.fuelVol" auto-complete="off" disabled></el-input>
					</el-form-item>

					<el-form-item :label="$t('system.containerNumber')" label-width="170px" size="small">
						<el-input type="text" v-model="details.containerNumber" auto-complete="off" disabled></el-input>
					</el-form-item>

					<el-form-item :label="$t('system.containerType')" label-width="170px" size="small">
						<el-input type="text" v-model="details.containerType" auto-complete="off" disabled></el-input>
					</el-form-item>

					<el-form-item :label="$t('system.doorType')" label-width="170px" size="small">
						<el-input type="text" v-model="details.doorType" auto-complete="off" disabled></el-input>
					</el-form-item>

					<el-form-item :label="$t('system.temp1SN')" label-width="170px" size="small">
						<el-input type="text" v-model="details.temp1SN" auto-complete="off" disabled></el-input>
					</el-form-item>

					<el-form-item :label="$t('system.temp2SN')" label-width="170px" size="small">
						<el-input type="text" v-model="details.temp2SN" auto-complete="off" disabled></el-input>
					</el-form-item>

					<el-form-item :label="$t('system.temp3SN')" label-width="170px" size="small">
						<el-input type="text" v-model="details.temp3SN" auto-complete="off" disabled></el-input>
					</el-form-item>

					<el-form-item :label="$t('system.temp4SN')" label-width="170px" size="small">
						<el-input type="text" v-model="details.temp4SN" auto-complete="off" disabled></el-input>
					</el-form-item>

					<el-form-item :label="$t('system.timeCreated')" label-width="170px" size="small">
						<el-date-picker v-model="device.time" type="date" disabled></el-date-picker>
					</el-form-item>

				</el-col>
	 		</el-row>
		</el-form>

		<div slot="footer" class="dialog-footer">
			<el-button @click.native="handleClose">{{$t('common.cancel')}}</el-button>
			<el-button type="primary" @click.native="editSubmit" :disabled="$store.state.common.user.roleKeys == 'demo'">{{$t('common.ok')}}</el-button>
		</div>
	</el-dialog>
</section>
</template>

<script>
	import GroupTree from './GroupTree'; //设备新增
	import { deviceAdd, updateDevice, addDeviceDetail, getDeviceDetail, updateDeviceDetail } from '@/api/api'

	export default {
		name: 'device',
		components: {
			GroupTree
		},
		props: ["device", "types"],
		data() {
			return {
				addForm: {
					imei: '',
					name: '',
					sim: '',
					typeId: 1,
					groupId: 0,
					userId: 0,
				},
				editForm: {
					id: 0,
					imei: '',
					name: '',
					sim: '',
					typeId: 1,
					groupId: 0,
					userId: 0,
				},
				details: {
					device_id: 0,
					brand: "",
					icon: "",
					devPwd: "",
					devNumber: "",
					devVIN: "",
					refrigModel: "",
					refrigSN: "",
					fuelVol: "",
					containerType: "",
					doorType: "",
					temp1SN: "",
					temp2SN: "",
					temp3SN: "",
					temp4SN: "",
				},
				typeId: 1,
				currentKey: null
			}
		},
		methods: {
			handleClose: function() {
				this.$store.dispatch('setVisblesFlag', [{key:'deviceEditForm',value:false},{key:'deviceAddForm',value:false}]);
			},
			addSubmit: function() {
				this.$refs.addForm.validate((valid) => {
					if(valid) {
						var params = {
							imei: this.addForm.imei,
							name: this.addForm.name,
							sim: this.addForm.sim,
							typeId: this.addForm.typeId,
							groupId: this.addForm.groupId,
							userId: this.addForm.userId
						};
						deviceAdd(params).then((data) => {
							params.id = data;
							this.$store.dispatch('addDevice', params);
							this.$store.dispatch('setVisblesFlag', [{key:'deviceAddForm',value:false}]);
							this.$refs.addForm.resetFields();
							this.$store.dispatch('initData'); //初始化设备数据
							if(data != 0) {
								this.details.device_id = data;
								addDeviceDetail(this.details).then(data => {
									this.initDetails();
									// this.init();
								});
							}
						});
					}
				});
			},
			initDetails() {
				Object.keys(this.details).forEach(key => {
					this.details[key] = "";
				})
			},
			editSubmit(){
				this.$refs.editForm.validate((valid) => {
					if(valid) {
						this.editForm.typeId = this.typeId;
						console.log(this.editForm);
						console.log(this.device);
						if(this.details.icon != this.device.icon || this.editForm.name != this.device.name) {
							updateDevice(this.editForm).then((res) => {
								updateDeviceDetail(this.details).then(data => {
									this.initDetails();
									this.device.marker.icon = this.editForm.icon;
									// this.init();
								});
								this.$store.dispatch('initData');
							});
						}
						this.$store.dispatch('setVisblesFlag', [{key:'deviceEditForm',value:false}]);
					}
				});
			},
			handleNodeClick(node){
				this.addForm.groupId = node.id;
				this.editForm.groupId = node.id
			}
		},
		mounted() {

		},
		computed: {
			// editForm:function(){
			// 	let editDevice ={}
			// 	if(this.device.id != 0){
			// 		let device  =  this.device;
			// 		editDevice = {
			// 			id: device.id,
			// 			name: device.name,
			// 			imei: device.imei,
			// 			sim: device.sim,
			// 			typeId: device.typeId,
			// 			groupId: device.groupId | 0,
			// 			userId: device.userId
			// 		}
			// 		this.typeId = device.typeId
			// 	}
			// 	return editDevice;
			// }
		},
		watch: {
		 	'$store.state.user.visibles.deviceEditForm': function(nv, ov) {
				if(nv){
					let device  =  this.device;
					// this.editForm = this.device;
					this.currentKey = device.groupId;
					Object.keys(this.editForm).forEach(key => {
						this.editForm[key] = device[key];
					})
					if(this.device.id != 0) {
      					getDeviceDetail({ device_id: this.device.id }).then(data => {
							if(typeof data.device_id != "undefined") {
								this.details = data;
							}
							else {
								this.initDetails();
								this.details.device_id = this.device.id;
							}
						})
					}
				}
			}
		},
	}
</script>
<style>
.add-form .el-form {
	overflow: hidden;
}
.add-form .el-radio,
.edit-form .el-radio {
	padding: 5px;
	margin-left: 0px; 	
}
</style>

