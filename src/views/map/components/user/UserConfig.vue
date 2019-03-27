<template>
	<el-dialog class="Blue" :title="$t('map.userConfig')" width="50%" :visible="$store.state.user.visibles.userConfigDialog" :before-close="handleClose" :lock-scroll="false">
	  <el-form ref="form" label-width="150px">

			<el-form-item :label="$t('setting.bubble')" size="mini">
				<el-checkbox v-model="setting.bubbleShow.battery"><i class="fa fa-battery-three-quarters"></i></el-checkbox>
				<el-checkbox v-model="setting.bubbleShow.temperature"><i class="fa fa-thermometer-three-quarters"></i></el-checkbox>
				<el-checkbox v-model="setting.bubbleShow.power"><i class="fa fa-plug"></i></el-checkbox>
				<el-checkbox v-model="setting.bubbleShow.signal"><i class="fa fa-signal"></i></el-checkbox>
			</el-form-item>

			<el-form-item :label="$t('setting.alarm')" size="mini">
				<el-checkbox v-model="setting.alarm.fenceEnter">{{$t('setting.fenceEnter')}}</el-checkbox>
				<el-checkbox v-model="setting.alarm.fenceLeave">{{$t('setting.fenceLeave')}}</el-checkbox>
				<el-checkbox v-model="setting.alarm.online">{{$t('setting.online')}}</el-checkbox>
				<el-checkbox v-model="setting.alarm.offline">{{$t('setting.offline')}}</el-checkbox>
				<el-checkbox v-model="setting.alarm.weakSignal">{{$t('setting.weakSignal')}}</el-checkbox>
			</el-form-item>

			<el-form-item :label="$t('setting.accept')" size="mini">
				<el-checkbox v-model="setting.voice">{{$t('setting.voice')}}</el-checkbox>
			</el-form-item>

			<el-form-item :label="$t('map.userConfigLanguage')" size="small">
				<el-select v-model="lang" @change="changeLang" placeholder="请选择">
					<el-option
						v-for="item in $store.state.common.langs"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
			</el-form-item>

			<el-form-item :label="$t('setting.tempUnit')" size="mini">
				<el-radio-group v-model="setting.tempUnit">
					<el-radio label="°C">°C</el-radio>
					<el-radio label="°F">°F</el-radio>
				</el-radio-group>
			</el-form-item>

			<el-form-item :label="$t('setting.speedUnit')" size="mini">
				<el-radio-group v-model="setting.speedUnit">
					<el-radio label="KM/H">KM/H</el-radio>
					<el-radio label="MPH">MPH</el-radio>
				</el-radio-group>
			</el-form-item>

			<el-form-item :label="$t('setting.emailAlert')" size="small">
				<el-checkbox v-model="setting.emailAlert"></el-checkbox>
			</el-form-item>

		</el-form>

		<div slot="footer" class="dialog-footer">
			<el-button @click="handleClose">{{$t('common.cancel')}}</el-button>
			<el-button type="primary" :disabled="$store.state.common.user.roleKeys == 'demo'" @click.native="editSubmit">{{$t('common.ok')}}</el-button>
		</div>

	</el-dialog>
</template>

<script>
	import { updateSetting } from '@/api/api';
	export default {
		name: 'UserConfig',
		data() {
			return {
					lang: localStorage.lang?localStorage.lang:'en',
					setting: {
						bubbleShow: {
							battery: true,
							temperature: true,
							power: true,
							signal: false,
						},
						alarm: {
							fenceEnter: true,
							fenceLeave: true,
							online: true,
							offline: true,
							power: true,
							weakSignal: true,
						},
						voice: true,
						tempUnit: '°C',
						speedUnit: 'KM/H',
						emailAlert: true,
					}
			}
		},
		methods: {
			handleClose: function() {
				this.$store.dispatch('setVisblesFlag', [{key:'userConfigDialog',value:false}]);
			},
			editSubmit(){
				updateSetting(this.setting).then(data => {
					Vue.set(localStorage, 'setting', JSON.stringify(this.setting));
					// localStorage.setting = JSON.stringify(this.setting);
					this.$store.dispatch("updateUserSetting", this.setting);
				})
				this.handleClose();
			},
			changeLang(val){
				this.$i18n.locale = val;
				localStorage.lang = val;
				this.$store.dispatch('initSystem',[{key:'lang',value:val}]);
			},

		},
		mounted() {
			if(localStorage.setting) {
				this.setting = JSON.parse(localStorage.setting);
				// console.log(this.setting);
				this.$store.dispatch("updateUserSetting", this.setting);				
			}
			else {
				localStorage.setting = JSON.stringify(this.setting);
			}
		}
	}
</script>
<style>
.el-form-item__label {
	font-weight: bold;
}
.el-radio__label {
	width: 200px;
}
.el-dialog__header {
	text-align: center;
}
.el-dialog__title {
	font-size: 20px;
	font-weight: bold;
}
</style>

