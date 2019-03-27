<template>
  <div id="app" class="gps-map">
    <lbs-map
      ref="lbsmap"
      :maptype="$store.state.user.map.type"
      :lang="lang"
      :center="$store.state.user.map.center"
      :zoom="$store.state.user.map.zoom"
      @onClick="onClickMarker"
      :flyto="false"
    >
      <lbs-marker
        class="lbs-marker"
        v-for="(device,index) in devices"
        :key="index"
        :id="device.id"
        :coord="device.marker.coord"
        :label="device.marker.label"
        :color="device.marker.color"
        :icon-image-url="'/static/icon/icon_' + device.marker.icon + '_' + device.status + '.png'"
        :angle="device.marker.angle"
        :visible="device.marker.visible"
      ></lbs-marker>
      <!-- <lbs-bubble :coord="$store.state.user.bubble.coord" :content="$store.state.user.bubble.content" :hide="$store.state.user.bubble.hide"></lbs-bubble> -->
      <lbs-popup
        :header="$store.state.user.popup.header"
        :topRight="$store.state.user.popup.topRight"
        :coord="$store.state.user.popup.coord"
        :content="$store.state.user.popup.content"
        :footer="$store.state.user.popup.footer"
        :visible="$store.state.user.popup.visible"
      ></lbs-popup>
      <lbs-circle
        :id="1"
        :visible="$store.state.user.popup.circle.visible"
        :coords="$store.state.user.popup.coord"
        :radius="$store.state.user.popup.circle.radius"
        :strokeColor="$store.state.user.popup.circle.strokeColor"
        :fillColor="$store.state.user.popup.circle.fillColor"
      ></lbs-circle>
      <lbs-move
        :name="selectDevice.name"
        :pause="this.$store.state.user.control.pause"
        :begin="this.$store.state.user.control.begin"
        :speed="this.$store.state.user.control.speed"
        :posdata="this.$store.state.user.historyPos"
        :startIcon="this.$store.state.user.map.startIcon"
        :endIcon="this.$store.state.user.map.endIcon"
        :stopIcon="this.$store.state.user.map.stopIcon"
        @progress="playstate"
        :runStep="$store.state.user.control.runStep"
      ></lbs-move>

      <lbs-geofence
        v-for="(geofence,index) in this.$store.state.user.geofences"
        :key="index"
        :type="geofence.type"
        @editCall="editCall"
        :editable="geofence.editable"
        :id="geofence.id"
        :area="geofence.area"
        :label="geofence.label"
        :visible="geofence.visible"
        :color="geofence.color"
      ></lbs-geofence>

      <lbs-draw
        :type="$store.state.user.draw.type"
        :enable="$store.state.user.draw.enable"
        @drawCall="drawCall"
      ></lbs-draw>
      <lbs-measure
        :type="$store.state.user.measure.type"
        :editable="$store.state.user.measure.editable"
        :clean="$store.state.user.measure.clean"
        @measureCall="measureCall"
      ></lbs-measure>
      <lbs-alarm :data="$store.state.user.events"></lbs-alarm>
      <lbs-image-layer
        :data="this.$store.state.user.customLayers.list"
        @drag="dragImageLayer"
        :move="this.$store.state.user.map.move"
      ></lbs-image-layer>
      <lbs-poi
        v-for="(poi,index) in $store.state.user.pois.list"
        @editArea="editArea"
        :type="poi.type"
        v-bind:key="index"
        :editable="poi.editable"
        :visible="poi.visible"
        :id="poi.id"
        :area="poi.area"
        :label="poi.name"
        :styles="poi.styles"
      ></lbs-poi>
    </lbs-map>
    <tools-box ref="tools"></tools-box>
    <menu-box :selectDeviceId="selectDeviceId"></menu-box>
    <user-box></user-box>
    <control-box v-show="this.$store.state.user.map.mode==2"></control-box>
    <report-dlg v-show="this.$store.state.user.visibles.reportDialog"></report-dlg>
    <measure-dlg v-show="this.$store.state.user.visibles.measureDialog"></measure-dlg>

    <el-button :disabled="this.$store.state.user.map.zoom == 18" class="zoom-in-btn" @click="zoomIn"><i class="fa fa-plus"></i></el-button>
    <el-button :disabled="this.$store.state.user.map.zoom == 4" class="zoom-out-btn" @click="zoomOut"><i class="fa fa-minus"></i></el-button>

    <img class="site-logo" src="../../assets/images/logo.png" width="375" alt>
    <div class="footer-copyright">
      <el-button
        type="text"
        size="small"
      >{{$store.state.common.system.name}}® Version:{{$store.state.common.system.version}} ©{{$store.state.common.system.date}} {{$store.state.common.system.company}}</el-button>
    </div>

    <el-dialog
      :title="$t('common.customMsg')"
      id="custom-msg-dlg"
      :visible.sync="$store.state.user.visibles.customMsgDialog"
      width="30%"
      center>

      <el-form label-position="center" label-width="30%">
        <el-form-item :label="$t('map.eventOnline')">
          <el-input v-model="$store.state.user.customMsgs.eventOnline"></el-input>
        </el-form-item>
        <el-form-item :label="$t('map.eventOffline')">
          <el-input v-model="$store.state.user.customMsgs.eventOffline"></el-input>
        </el-form-item>
        <el-form-item :label="$t('map.eventFenceEnter')">
          <el-input v-model="$store.state.user.customMsgs.eventFenceEnter"></el-input>
        </el-form-item>
        <el-form-item :label="$t('map.eventFenceExit')">
          <el-input v-model="$store.state.user.customMsgs.eventFenceExit"></el-input>
        </el-form-item>
        <el-form-item :label="$t('map.eventOverSpeed')">
          <el-input v-model="$store.state.user.customMsgs.eventOverSpeed"></el-input>
        </el-form-item>
        <el-form-item :label="$t('map.eventCoolerOff')">
          <el-input v-model="$store.state.user.customMsgs.eventCoolerOff"></el-input>
        </el-form-item>
        <el-form-item :label="$t('map.eventDoorOpen')">
          <el-input v-model="$store.state.user.customMsgs.eventDoorOpen"></el-input>
        </el-form-item>
        <el-form-item :label="$t('map.eventVibration')">
          <el-input v-model="$store.state.user.customMsgs.eventVibration"></el-input>
        </el-form-item>
        <el-form-item :label="$t('map.eventPowerOff')">
          <el-input v-model="$store.state.user.customMsgs.eventPowerOff"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="toggleCustomDlg">{{$t('report.cancel')}}</el-button>
        <el-button type="primary" @click="handleConfirm">{{$t('report.confirm')}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import "@/styles/common.scss";
import "@/styles/gps-index.scss";
import ToolsBox from "./components/tools/Index"; //工具栏

import MenuBox from "./components/menu/Menu"; //菜单
import UserCenterBox from "./components/user/Index"; //用户中心
import ControlBox from "./components/playback/Control"; //控制轨迹播放
import ReportDlg from "./components/report/ReportDlg";
import MeasureDlg from "./components/measure/MeasureDlg";

import websocket from "../../utils/websocket";
import { updateLayer } from "@/api/api";
export default {
  name: "app",
  data() {
    return {
      selectDeviceId: null,
      lang: localStorage.lang,
    };
  },
  methods: {
    initConnect() {
      websocket.init(this);
      this.$store.dispatch("getCustomMsgs");
    },
    toggleCustomDlg() {
      if(this.$store.state.user.visibles.customMsgDialog) {
        this.$store.dispatch("setVisblesFlag", [
          { key: "customMsgDialog", value: false }
        ]);
      }
      else {
        this.$store.dispatch("setVisblesFlag", [
          { key: "customMsgDialog", value: true }
        ]);
      }
    },
    handleConfirm() {
      this.$store.dispatch("setCustomMsgs");
      this.toggleCustomDlg();
    },
    playstate(val) {
      this.$store.dispatch("setControlValue", {
        key: "index",
        value: val.index
      });
      this.$store.dispatch("setControlValue", {
        key: "total",
        value: val.total
      });
    },
    onClickMarker(feature) {
      if (feature.getId()) {
        switch (feature.get("type")) {
          case "marker": //点击车辆marker
            this.selectDeviceId = feature.getId();
            this.$store.dispatch("setSelectDeviceId", feature.getId());
            break;
          case "stopicon": //点击轨迹回放停留标注
            if (feature.getId().indexOf("stop") != -1) {
              var ele = document.getElementById(
                "stop" + feature.getId().split(":")[1]
              );
              ele.setAttribute(
                "style",
                ele.getAttribute("style") == "display:block"
                  ? "display:none"
                  : "display:block"
              );
            }
            break;
          case "poi": //点击兴趣点
            this.$store.dispatch("setPoiValue", {
              key: "selectId",
              value: feature.getId()
            });
            break;
          default:
        }
      }
    },
    editCall(geofence) {
      //编辑完围栏回调的方法

      this.$prompt("请输入新的围栏名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: geofence.label,
        inputPattern: /^\S{2,6}$/,
        inputErrorMessage: "请输入2-6位的名称",
        lockScroll: false
      })
        .then(({ value }) => {
          geofence.label = value;
          this.$store.dispatch("updateGeofence", geofence);
          this.$message({
            type: "success",
            message: "保存成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "继续编辑"
          });
        });
    },
    drawCall(geofence) {
      //绘制完回调的方法
      if (this.$refs.tools.geoVisible) {
        var formatArea = "";
        if (geofence.type.toLowerCase() === "circle") {
          var arr = geofence.area.split(", ");
          var point = arr[0].split(" ");
          var radius = arr[1];
          formatArea = point[1] + " " + point[0] + ", " + radius;
        } else if (geofence.type.toLowerCase() === "polygon") {
          var points = geofence.area.split(", ");
          var coords = [];
          points.forEach(point => {
            coords.push(point.split(" ")[1] + " " + point.split(" ")[0]);
          });
          formatArea = coords.join(", ");
        } else if (geofence.type.toLowerCase() === "linestring") {
          var points = geofence.area.split(", ");
          var coords = [];
          points.forEach(point => {
            coords.push(point.split(" ")[1] + " " + point.split(" ")[0]);
          });
          formatArea = coords.join(", ");
        }
        //console.log(formatArea);
        var geo = {
          area: formatArea,
          editable: true,
          label: "新建围栏",
          type: geofence.type.toLowerCase(),
          visible: true,
          color: "red"
        };

        this.$store.dispatch("setDrawGeofence", geo);

        this.$prompt("请输入围栏名称", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /^\S{2,6}$/,
          inputErrorMessage: "请输入2-6位的名称",
          lockScroll: false
        })
          .then(({ value }) => {
            geofence.name = value;
            geofence.area = formatArea;
            //console.log(geofence);
            this.$store.dispatch("saveDrawGeofence", geofence);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "继续编辑"
            });
          });
      } else if (this.$refs.tools.poisVisible) {
        //console.log('创建poi');
        var styles = {};
        switch (this.$store.state.user.draw.build.toLowerCase()) {
          case "point":
            styles = {
              fillColor: "#409EFF",
              radius: 10
            };
            break;
          case "linestring":
            styles = {
              strokeColor: "#409EFF",
              strokeWidth: 5
            };
            break;
          case "polygon":
            styles = {
              strokeColor: "#409EFF",
              strokeWidth: 5,
              fillColor: "rgba(64,158,255, 0.4)"
            };
            break;
          case "circle":
            styles = {
              strokeColor: "#409EFF",
              strokeWidth: 5,
              fillColor: "rgba(64,158,255, 0.4)"
            };
            break;
          case "marker":
            styles = {
              fillColor: "#aaff56"
            };
            break;
          default:
        }

        var poi = {
          id: 0,
          name: "POI",
          type: this.$store.state.user.draw.build.toLowerCase(),
          area: geofence.area,
          visible: true,
          styles: JSON.stringify(styles)
        };

        this.$store.dispatch("addPoi", poi);
        var draw = {
          type: "",
          build: "",
          enable: false
        };
        this.$store.dispatch("setDrawEnable", draw);
      }
    },
    measureCall(val) {
      //console.log(val);
    },
    downLoad() {
      this.$refs.lbsmap.downLoad();
    },
    dragImageLayer(v, idx) {
      //拖动修改自定义图层的位置
      // console.log(this.$store.state.user.customLayers.list[idx].name);
      //console.log(idx);
      //console.log(v);
      let params = {
        id: this.$store.state.user.customLayers.list[idx].id,
        coord: v[0] + "," + v[1],
        visible: this.$store.state.user.customLayers.list[idx].visible
      };
      this.$store.dispatch("updateLayer", params);
    },
    editArea(val) {
      let params = {
        id: val.id,
        area: val.area
      };
      this.$store.dispatch("updatePoi", params);
    },
    zoomOut() {
      this.$store.dispatch("zoomOut");
    },
    zoomIn() {
      this.$store.dispatch("zoomIn");
    },
  },
  components: {
    "tools-box": ToolsBox,
    "menu-box": MenuBox,
    "user-box": UserCenterBox,
    "control-box": ControlBox,
    "report-dlg": ReportDlg,
    "measure-dlg": MeasureDlg
  },
  mounted() {
    
  },
  created() {
    // set map center as current location
    if(navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(position => {
        this.$store.dispatch("setMapCenter", [position.coords.latitude, position.coords.longitude]);
      })
    }
    //判断本地是否登录
    if (!localStorage.user) {
      this.$store.dispatch("setVisblesFlag", [{ key: "login", value: true }]);
      return;
    } else {
      this.$store.dispatch("initData"); //初始化设备数据
      this.$store.dispatch("setVisblesFlag", [
        { key: "deviceMenu", value: true }
      ]);
      this.$store.dispatch("initStaticData"); //初始化静态数据
      this.initConnect();
    }

    this.interval = setInterval(() => {
      //console.log('定时巡检');
      this.$store.dispatch("lookDevicesMotionState");
    }, 60000);
  },
  watch: {
    //模式切换
    "$store.state.user.map.mode": function(nv, ov) {
      //console.log('切换模式为：'+ov+'--> '+nv);
      if (nv == 2) {
        // -->轨迹回放
        //关闭跟踪的气泡
        if (this.$store.state.user.popup.visible) {
          //console.log('取消跟踪');
          this.$store.dispatch("isShowBoubble");
        }
        //关闭画面跟随
        if (this.$store.state.user.map.isTrackCenter) {
          this.$store.dispatch("isTrackCenter");
        }
        this.$store.dispatch("setDeviceMarkersVisible", {
          select: [],
          visible: true
        });
      } else if (nv == 1 && ov == 2) {
        //轨迹回放-->跟踪设备

        this.$store.dispatch("removeHistoryPositions");
        this.$store.dispatch("setDeviceMarkersVisible", {
          select: [],
          visible: false
        });
        //开启画面跟随
        if (!this.$store.state.user.map.isTrackCenter) {
          this.$store.dispatch("isTrackCenter");
        }
      } else {
        //console.log('不处理');
      }
    }
  },
  computed: {
    selectDevice: function() {
      if (this.$store.state.user.devices.selectId != 0) {
        var index = this.$store.state.user.devices.index[
          this.$store.state.user.devices.selectId
        ];
        return this.$store.state.user.devices.list[index];
      } else {
        return {};
      }
    },
    devices: function() {
      var arr = this.$store.state.user.devices.list.filter(function(device) { 
        return device.marker && device.marker.coord.length != 0;
      });
      return arr;
    }
  }
};
</script>

<style>
#app {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
}
#app > div:first-child {
  height: 100%;
}
.lbs-popup {
  margin: -103px -133px;
  position: absolute;
  bottom: 145px;
  width: 280px;
}
.lbs-popup:before, .lbs-popup:after {
  left: 113px;
}
.lbs-popup table {
  border-spacing: 0 !important;
}
.lbs-popup td {
  width: 70px;
  padding: 0;
}
.site-logo {
  position: absolute;
  top: 0;
  left: 0;
}
.zoom-out-btn {
  width: 51px;
  height: 47px;
  text-align: center;
  /* padding: 15px 18px; */
  position: absolute;
  right: 20px;
  bottom: 40px;
}
.zoom-in-btn {
  width: 51px;
  height: 47px;
  /* padding: 15px 18px; */
  position: absolute;
  right: 20px;
  bottom: 100px;
}
#custom-msg-dlg .el-form-item__label {
  text-align: center;
}
</style>
