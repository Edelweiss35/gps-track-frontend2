<template>
  <div class="report-item">
    <div class="report-setting" @click="handleClickSetting">
    <!-- <div class="report-setting" v-if="isOwner" @click="handleClickSetting"> -->
      <font-awesome-icon icon="cog"/>
    </div>

    <el-dialog :title="$t('report.alarmSetting')" width="1500px" :visible.sync="dialogFormVisible">
      <el-form :model="tsettings">
        <div class="setting-item-temp">
          <div class="setting-item-wrapper">
            <div class="setting-item-header">
              <span>{{$t("report.temp1")}}</span>
            </div>
            <div class="setting-item-body">
              <div class="item-element">
                <div class="attr-name">
                  <span>{{$t("report.temper")}}:&nbsp;</span>
                </div>
                <div class="attr-base">
                  <input type="number" v-model="tsettings.temperature[0].base">
                  <span class="unit">{{$store.state.common.setting.tempUnit}}</span>
                </div>&nbsp;
                <div class="attr-error">
                  <span class="unit">&plusmn;</span>
                  <input type="number" min="0" v-model="tsettings.temperature[0].error">
                  <span class="unit">{{$store.state.common.setting.tempUnit}}</span>
                </div>
              </div>
              <div class="item-element">
                <div class="attr-name">
                  <span>{{$t("report.humidity")}}:&nbsp;</span>
                </div>
                <div class="attr-base">
                  <input type="number" min="0" v-model="tsettings.humidity[0].base">
                  <span class="unit">%</span>
                </div>&nbsp;
                <div class="attr-error">
                  <span class="unit">&plusmn;</span>
                  <input type="number" min="0" v-model="tsettings.humidity[0].error">
                  <span class="unit">%</span>
                </div>
                <input type="checkbox" v-model="tsettings.humidity[0].show">
              </div>
              <el-form-item>
                <el-switch v-model="tsettings.temperature[0].show"></el-switch>
              </el-form-item>
            </div>
          </div>
        </div>

        <div class="setting-item-temp">
          <div class="setting-item-wrapper">
            <div class="setting-item-header">
              <span>{{$t("report.temp2")}}</span>
            </div>
            <div class="setting-item-body">
              <div class="item-element">
                <div class="attr-name">
                  <span>{{$t("report.temper")}}:&nbsp;</span>
                </div>
                <div class="attr-base">
                  <input type="number" v-model="tsettings.temperature[1].base">
                  <span class="unit">{{$store.state.common.setting.tempUnit}}</span>
                </div>&nbsp;
                <div class="attr-error">
                  <span class="unit">&plusmn;</span>
                  <input type="number" min="0" v-model="tsettings.temperature[1].error">
                  <span class="unit">{{$store.state.common.setting.tempUnit}}</span>
                </div>
              </div>
              <div class="item-element">
                <div class="attr-name">
                  <span>{{$t("report.humidity")}}:&nbsp;</span>
                </div>
                <div class="attr-base">
                  <input type="number" min="0" v-model="tsettings.humidity[1].base">
                  <span class="unit">%</span>
                </div>&nbsp;
                <div class="attr-error">
                  <span class="unit">&plusmn;</span>
                  <input type="number" min="0" v-model="tsettings.humidity[1].error">
                  <span class="unit">%</span>
                </div>
                <input type="checkbox" v-model="tsettings.humidity[1].show">
              </div>
              <el-form-item>
                <el-switch v-model="tsettings.temperature[1].show"></el-switch>
              </el-form-item>
            </div>
          </div>
        </div>

        <div class="setting-item-temp">
          <div class="setting-item-wrapper">
            <div class="setting-item-header">
              <span>{{$t("report.temp3")}}</span>
            </div>
            <div class="setting-item-body">
              <div class="item-element">
                <div class="attr-name">
                  <span>{{$t("report.temper")}}:&nbsp;</span>
                </div>
                <div class="attr-base">
                  <input type="number" v-model="tsettings.temperature[2].base">
                  <span class="unit">{{$store.state.common.setting.tempUnit}}</span>
                </div>&nbsp;
                <div class="attr-error">
                  <span class="unit">&plusmn;</span>
                  <input type="number" min="0" v-model="tsettings.temperature[2].error">
                  <span class="unit">{{$store.state.common.setting.tempUnit}}</span>
                </div>
              </div>
              <div class="item-element">
                <div class="attr-name">
                  <span>{{$t("report.humidity")}}:&nbsp;</span>
                </div>
                <div class="attr-base">
                  <input type="number" min="0" v-model="tsettings.humidity[2].base">
                  <span class="unit">%</span>
                </div>&nbsp;
                <div class="attr-error">
                  <span class="unit">&plusmn;</span>
                  <input type="number" min="0" v-model="tsettings.humidity[2].error">
                  <span class="unit">%</span>
                </div>
                <input type="checkbox" v-model="tsettings.humidity[2].show">
              </div>
              <el-form-item>
                <el-switch v-model="tsettings.temperature[2].show"></el-switch>
              </el-form-item>
            </div>
          </div>
        </div>

        <div class="setting-item-temp">
          <div class="setting-item-wrapper">
            <div class="setting-item-header">
              <span>{{$t("report.temp4")}}</span>
            </div>
            <div class="setting-item-body">
              <div class="item-element">
                <div class="attr-name">
                  <span>{{$t("report.temper")}}:&nbsp;</span>
                </div>
                <div class="attr-base">
                  <input type="number" v-model="tsettings.temperature[3].base">
                  <span class="unit">{{$store.state.common.setting.tempUnit}}</span>
                </div>&nbsp;
                <div class="attr-error">
                  <span class="unit">&plusmn;</span>
                  <input type="number" min="0" v-model="tsettings.temperature[3].error">
                  <span class="unit">{{$store.state.common.setting.tempUnit}}</span>
                </div>
              </div>
              <div class="item-element">
                <div class="attr-name">
                  <span>{{$t("report.humidity")}}:&nbsp;</span>
                </div>
                <div class="attr-base">
                  <input type="number" min="0" v-model="tsettings.humidity[3].base">
                  <span class="unit">%</span>
                </div>&nbsp;
                <div class="attr-error">
                  <span class="unit">&plusmn;</span>
                  <input type="number" min="0" v-model="tsettings.humidity[3].error">
                  <span class="unit">%</span>
                </div>
                <input type="checkbox" v-model="tsettings.humidity[3].show">
              </div>
              <el-form-item>
                <el-switch v-model="tsettings.temperature[3].show"></el-switch>
              </el-form-item>
            </div>
          </div>
        </div>

        <div class="setting-item-special">
          <div class="setting-item-wrapper">
            <div class="setting-item-header">
              <span>{{$t("report.coolerAlarm")}}</span>
            </div>
            <div class="setting-item-body">
              <el-form-item>
                <el-switch v-model="tsettings.cooler"></el-switch>
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="setting-item-normal">
          <div class="setting-item-wrapper">
            <div class="setting-item-header">
              <span>{{$t("report.fuelAlarm")}}</span>
            </div>
            <div class="setting-item-body">
              <div class="attr-base">
                <input type="number" min="0" v-model="tsettings.fuel.limit">
                <span class="unit">%</span>
              </div>
              <el-form-item>
                <el-switch v-model="tsettings.fuel.show"></el-switch>
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="setting-item-normal">
          <div class="setting-item-wrapper">
            <div class="setting-item-header">
              <span>{{$t("report.batteryVAlarm")}}</span>
            </div>
            <div class="setting-item-body">
              <div class="attr-base">
                <input type="number" min="0" v-model="tsettings.battery_voltage.limit">
                <span class="unit">V</span>
              </div>
              <el-form-item>
                <el-switch v-model="tsettings.battery_voltage.show"></el-switch>
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="setting-item-special">
          <div class="setting-item-wrapper">
            <div class="setting-item-header">
              <span>{{$t("report.doorAlarm")}}</span>
            </div>
            <div class="setting-item-body">
              <el-form-item>
                <el-switch v-model="tsettings.door"></el-switch>
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="setting-item-normal">
          <div class="setting-item-wrapper">
            <div class="setting-item-header">
              <span>{{$t("report.speedAlarm")}}</span>
            </div>
            <div class="setting-item-body">
              <div class="attr-base">
                <input type="number" min="0" v-model="tsettings.speed.limit">
                <span class="unit">{{$store.state.common.setting.speedUnit}}</span>
              </div>
              <el-form-item>
                <el-switch v-model="tsettings.speed.show"></el-switch>
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="setting-item-special">
          <div class="setting-item-wrapper">
            <div class="setting-item-header">
              <span>{{$t("report.vibrateAlarm")}}</span>
            </div>
            <div class="setting-item-body">
              <el-form-item>
                <el-switch v-model="tsettings.vibrate"></el-switch>
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="setting-item-normal">
          <div class="setting-item-wrapper">
            <div class="setting-item-header">
              <span>{{$t("report.batteryLAlarm")}}</span>
            </div>
            <div class="setting-item-body">
              <div class="attr-base">
                <input type="number" min="0" v-model="tsettings.battery_remain.limit">
                <span class="unit">%</span>
              </div>
              <el-form-item>
                <el-switch v-model="tsettings.battery_remain.show"></el-switch>
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="setting-item-special">
          <div class="setting-item-wrapper">
            <div class="setting-item-header">
              <span>{{$t("report.powerAlarm")}}</span>
            </div>
            <div class="setting-item-body">
              <el-form-item>
                <el-switch v-model="tsettings.power"></el-switch>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t("report.cancel")}}</el-button>
        <el-button type="primary" :disabled="$store.state.common.user.roleKeys == 'demo'" @click="handleConfirm">{{$t("report.confirm")}}</el-button>
      </span>
    </el-dialog>

    <div class="state-overall">
      <div class="device-name">{{device.name}}</div>
      <div class="state-icons">
        <div class="state-icon cooler">
          <img
            v-if="coolerState == -1"
            src="../../../../assets/images/state-icons/cooler-alert.png"
            height="100%"
          >
          <img
            v-else-if="coolerState == 1"
            src="../../../../assets/images/state-icons/cooler-on.png"
            height="100%"
          >
          <img v-else src="../../../../assets/images/state-icons/cooler-off.png" height="100%">
        </div>
        <div class="state-icon fuel">
          <div class="fuel-icon-wrapper" v-if="fuelState == -1">
            <img
              src="../../../../assets/images/state-icons/fuel-meter-alert-plate.png"
              height="100%"
            >
            <img
              src="../../../../assets/images/state-icons/fuel-meter-alert-arrow.png"
              height="100%"
              class="fuel-meter-arrow"
              :style="{transform: 'rotate(' + fuelMeterRotate + 'deg)'}"
            >
          </div>
          <div class="fuel-icon-wrapper" v-else-if="fuelState == 1">
            <img
              src="../../../../assets/images/state-icons/fuel-meter-on-plate.png"
              height="100%"
            >
            <img
              src="../../../../assets/images/state-icons/fuel-meter-on-arrow.png"
              height="100%"
              class="fuel-meter-arrow"
              :style="{transform: 'rotate(' + fuelMeterRotate + 'deg)'}"
            >
          </div>
          <div class="fuel-icon-wrapper" v-else>
            <img src="../../../../assets/images/state-icons/fuel-meter-off.png" height="100%">
          </div>
        </div>
        <div class="state-icon lock">
          <img
            v-if="doorState == 1"
            src="../../../../assets/images/state-icons/lock-on.png"
            height="100%"
          >
          <img
            v-else-if="doorState == -1"
            src="../../../../assets/images/state-icons/lock-alert.png"
            height="100%"
          >
          <img v-else src="../../../../assets/images/state-icons/lock-off.png" height="100%">
        </div>
      </div>
    </div>
    <div class="state-temper">
      <div
        class="temper part-1"
        v-bind:class="{'state-2': tempState[0] == 2, 'state-0': tempState[0] == 0, 'state-1': tempState[0] == 1}"
      >
        <div class="temperature">
          {{'temp0' in attributes ? Math.round(attributes.temp0) : 0}}
          <span class="temper-unit">{{$store.state.common.setting.tempUnit}}</span>
        </div>
        <div class="humidity">{{'humid0' in attributes ? Math.round(attributes.humid0) : 0}}%</div>
      </div>
      <div
        class="temper part-2"
        v-bind:class="{'state-2': tempState[1] == 2, 'state-0': tempState[1] == 0, 'state-1': tempState[1] == 1}"
      >
        <div class="temperature">
          {{'temp1' in attributes ? Math.round(attributes.temp1) : 0}}
          <span class="temper-unit">{{$store.state.common.setting.tempUnit}}</span>
        </div>
        <div class="humidity">{{'humid1' in attributes ? Math.round(attributes.humid1) : 0}}%</div>
      </div>
      <div
        class="temper part-3"
        v-bind:class="{'state-2': tempState[2] == 2, 'state-0': tempState[2] == 0, 'state-1': tempState[2] == 1}"
      >
        <div class="temperature">
          {{'temp2' in attributes ? Math.round(attributes.temp2) : 0}}
          <span class="temper-unit">{{$store.state.common.setting.tempUnit}}</span>
        </div>
        <div class="humidity">{{'humid2' in attributes ? Math.round(attributes.humid2) : 0}}%</div>
      </div>
      <div
        class="temper part-4"
        v-bind:class="{'state-0': tempState[3] == 0, 'state-1': tempState[3] == 1, 'state-2': tempState[3] == 2}"
      >
        <div class="temperature">
          {{'temp3' in attributes ? Math.round(attributes.temp3) : 0}}
          <span class="temper-unit">{{$store.state.common.setting.tempUnit}}</span>
        </div>
        <div class="humidity">{{'humid3' in attributes ? Math.round(attributes.humid3) : 0}}%</div>
      </div>
    </div>
  </div>
</template>

<script>
import { updateAlarmSetting, getAlarmSetting } from "@/api/api";

export default {
  name: "report-item",
  props: ["device"],
  data() {
    return {
      input4: "",
      dialogFormVisible: false,
      settings: {
        temperature: [
          { base: 0, error: 0, show: true },
          { base: 0, error: 0, show: true },
          { base: 0, error: 0, show: true },
          { base: 0, error: 0, show: true }
        ],
        humidity: [
          { base: 0, error: 0, show: true },
          { base: 0, error: 0, show: true },
          { base: 0, error: 0, show: true },
          { base: 0, error: 0, show: true }
        ],
        cooler: true,
        power: true,
        door: true,
        fuel: { limit: 0, show: true },
        battery_remain: { limit: 0, show: true },
        battery_voltage: { limit: 0, show: true },
        speed: { limit: 0, show: true },
        vibrate: true
      },
      tsettings: {
        temperature: [
          { base: 0, error: 0, show: true },
          { base: 0, error: 0, show: true },
          { base: 0, error: 0, show: true },
          { base: 0, error: 0, show: true }
        ],
        humidity: [
          { base: 0, error: 0, show: true },
          { base: 0, error: 0, show: true },
          { base: 0, error: 0, show: true },
          { base: 0, error: 0, show: true }
        ],
        cooler: true,
        power: true,
        door: true,
        fuel: { limit: 0, show: true },
        battery_remain: { limit: 0, show: true },
        battery_voltage: { limit: 0, show: true },
        speed: { limit: 0, show: true },
        vibrate: true
      },
      tempState: [0, 0, 0, 0],
      formLabelWidth: "50px"
    };
  },
  computed: {
    isOwner() {
      var isOwned = false;
      if (this.$store.state.user.devices.idsOwned == null) return false;
      this.$store.state.user.devices.idsOwned.forEach(item => {
        if (item.id == this.device.id) {
          isOwned = true;
          return;
        }
      });
      return isOwned;
    },
    _attributes() {
      if (
        "attributes" in this.device &&
        typeof this.device.attributes !== "undefined"
      ) {
        return this.device.attributes;
      } else {
        return {
          temp0: 0,
          temp1: 0,
          temp2: 0,
          temp3: 0,
          humid0: 0,
          humid1: 0,
          humid2: 0,
          humid3: 0,
          battery: 0,
          cooler: 0,
          door: 0,
          fuel: 0,
          power: 0,
          voltage: 0,
          vibrate: 0
        };
      }
    },
    attributes() {
      var attributes = Object.assign({}, this._attributes);
      if(this.$store.state.common.setting.tempUnit == '°F') {
        for(var i = 0; i < 4; i++) {
          if(('temp' + i) in attributes) {
            attributes['temp' + i] = Math.round(attributes['temp' + i] * 1.8 + 32);
          }
        }
      }
      // this.updateTSettings();
      for(var i = 0; i < 4; i++) {
        if (attributes.hasOwnProperty("temp" + i) && this.isOnline()) {
          var base = parseInt(this.tsettings.temperature[i].base);
          var error = parseInt(this.tsettings.temperature[i].error);
          var real = parseInt(attributes['temp' + i]);

          if (!this.tsettings.temperature[i].show || (base - error <= real && base + error >= real)) 
            this.tempState[i] = 1;
          else 
            this.tempState[i] = 2;
        } else {
            this.tempState[i] = 0;
        }
      }
      
      return attributes;
    },
    fuelState() {
      if ("fuel" in this.attributes && this.isOnline()) {
        var fuel = parseInt(this.attributes.fuel);
        if(fuel < 0) fuel = 0;
        var degree = 230 / 100 * fuel;
        if (!this.tsettings.fuel.show || this.settings.fuel.limit <= fuel) return 1;
        else return -1;
      } else {
        return 0;
      }
    },
    fuelMeterRotate() {
      if ("fuel" in this.attributes && this.isOnline()) { 
        if ("fuel" in this.attributes && this.isOnline()) {
          var fuel = parseInt(this.attributes.fuel);
          if(fuel < 0) fuel = 0;
          return 230 / 100 * fuel;
        }
      }
      return 0;
    },
    coolerState() {
      if ("cooler" in this.attributes && this.isOnline()) {
        if (this.attributes.cooler == 1) return 1;
        else return -1;
      } else {
        return 0;
      }
    },
    doorState() {
      if ("door" in this.attributes && this.isOnline()) {
        if (this.attributes.door == 1) return 1;
        else return -1;
      } else {
        return 0;
      }
    },
  },
  watch: {
    "$store.state.common.setting": function() {
      this.updateTSettings();
    }
  },
  created() {
    getAlarmSetting(this.device.id).then(data => {
      if (data.hasOwnProperty("settings") && data.settings.length > 2) {
        this.settings = JSON.parse(data.settings);
        this.updateTSettings();
      }
    });
  },
  methods: {
    updateTSettings() {
      var settings = Object.assign({}, this.settings);
      if(this.$store.state.common.setting.tempUnit == '°F') {
        for(var i = 0; i < 4; i++) {
          settings.temperature[i].base = Math.round(settings.temperature[i].base * 1.8 + 32);
          settings.temperature[i].error = Math.round(settings.temperature[i].error * 1.8);
        }
      }
      if(this.$store.state.common.setting.speedUnit == 'MPH') {
        settings.speed.limit = Math.round(settings.speed.limit * 0.62);
      }
      this.tsettings = settings;
    },
    handleConfirm() {
      var settings = Object.assign({}, this.tsettings);
      if(this.$store.state.common.setting.tempUnit == '°F') {
        for(var i = 0; i < 4; i++) {
          settings.temperature[i].base = Math.round((settings.temperature[i].base - 32) / 1.8);
          settings.temperature[i].error = Math.round(settings.temperature[i].error / 1.8);
        }
      }
      if(this.$store.state.common.setting.speedUnit == 'MPH') {
        settings.speed.limit = Math.round(settings.speed.limit / 0.62);
      }
      this.settings = this.tsettings;
      updateAlarmSetting({
        device_id: this.device.id,
        settings: JSON.stringify(this.settings)
      }).then(data => {
        if (data > 0) {
          this.$store.dispatch("setAlarmSettingFlag", true);
        }
      });
      this.dialogFormVisible = false;
    },
    handleClickSetting() {
      this.dialogFormVisible = true;
      getAlarmSetting(this.device.id).then(data => {
        if ("settings" in data && data.settings.length > 2) {
          this.settings = JSON.parse(data.settings);
          this.updateTSettings();
        }
      });
    },
    isOnline() {
      var now = Date.now();
      var lastTime = this.device['lastTime'];
      if(typeof lastTime != 'undefined') {
        var interval = now - lastTime;
        if(interval < 1000 * 60) return true;
      }
      return false;
    }
  }
};
</script>

<style>
.report-item {
  position: relative;
  background-color: white;
  border-radius: 45px;
  height: 90px;
  padding: 5px 30px;
  display: block;
  overflow: auto;
  margin-top: 10px;
}

.report-item .state-overall {
  width: 36%;
  float: left;
}

.report-item .state-temper {
  width: 64%;
  height: 100%;
  float: left;
}

.report-item .device-name {
  width: 100%;
  height: 20px;
  font-size: 20px;
  font-weight: bold;
  line-height: 20px;
  color: #676767;
}

.report-item .state-icons {
  padding-top: 3px;
  width: 100%;
}

.report-item .state-icons .state-icon {
  height: 55px;
  float: left;
  margin: 0 4px;
}

.report-item .state-temper .temper {
  width: 75px;
  height: 75px;
  padding: 15px 0;
  float: left;
  border-radius: 40px;
  background-color: #67c23a;
  margin: 3px 4px;
}

.report-item .state-temper .temper .temperature {
  color: white;
  font-weight: bolder;
  width: fit-content;
  margin: 0 auto;
  font-size: 25px;
  line-height: 30px;
  position: relative;
}

.report-item .state-temper .temper .temperature .temper-unit {
  position: absolute;
  top: -7px;
  right: -10px;
  color: white;
  font-weight: bold;
  font-size: 9px;
}

.report-item .state-temper .temper .humidity {
  color: white;
  font-weight: bold;
  font-size: 13px;
}

.report-setting {
  position: absolute;
  right: 9px;
  top: 30px;
  font-size: 30px;
}

.disabled {
  color: gray;
}

.report-setting:hover {
  color: cadetblue;
}

.el-form {
  display: block;
  overflow: auto;
}

.setting-item-temp,
.setting-item-normal,
.setting-item-special {
  width: 25%;
  padding: 5px;
  float: left;
  display: block;
  overflow: auto;
}

.setting-item-temp .setting-item-wrapper {
  width: 100%;
  display: block;
  overflow: auto;
  border: 1px solid rgba(100, 100, 100, 0.2);
}

.setting-item-normal .setting-item-wrapper,
.setting-item-special .setting-item-wrapper {
  width: 100%;
  display: block;
  overflow: auto;
  border: 1px solid rgba(100, 100, 100, 0.2);
}

.setting-item-temp .setting-item-header {
  background-color: #8bc34a;
  color: white;
  /* font-weight: bold; */
  font-size: 16px;
  font-weight: 500;
  line-height: 40px;
  height: 40px;
}

.setting-item-normal .setting-item-header,
.setting-item-special .setting-item-header {
  background-color: #009688;
  color: white;
  /* font-weight: bold; */
  font-size: 16px;
  font-weight: 500;
  line-height: 40px;
  height: 40px;
}

.report-item .el-form-item {
  margin-bottom: 0px;
}

.item-element {
  padding: 10px 10px;
  font-size: 15px;
  font-weight: bold;
  text-align: left;
}

.attr-name,
.attr-base,
.attr-error {
  width: 30%;
  float: left;
}

.attr-name {
  text-align: right;
}

.item-element input[type="number"] {
  width: 50px;
}

.item-element input[type="checkbox"] {
  width: 20px;
  height: 20px;
}

.el-switch.is-checked .el-switch__core {
  border-color: #01e166;
  background-color: #01e166;
}

.setting-item-normal input[type="number"],
.setting-item-special input[type="number"] {
  width: 50px;
}

.setting-item-normal .attr-base {
  width: 50%;
  text-align: right;
  float: left;
  padding-top: 10px;
  padding-right: 10px;
}

.setting-item-normal .el-form-item {
  padding-left: 20px;
  float: left;
  text-align: left;
}

.setting-item-special .el-form-item {
  text-align: center;
}

.setting-item-temp,
.setting-item-normal,
.setting-item-special {
  margin-bottom: 25px;
}

.setting-item-body input[type="number"] {
  border: 1px solid rgba(100, 100, 100, 0.5);
  border-radius: 3px;
  padding: 2px 4px;
}

.report-item .el-dialog__title {
  font-size: 25px;
  font-weight: bold;
}

.state-0 {
  background-color: #c1c1c1 !important;
}

.state-1 {
  background-color: #67c23a !important;
}

.state-2 {
  background-color: #f84a4a !important;
}

.fuel-icon-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.fuel-meter-arrow {
  position: absolute;
  width: 62%;
  height: 62%;
  top: 19%;
  left: 19%;
  transition: transform 0.5s ease-in;
}

</style>
