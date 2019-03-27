<template>
  <div id="gps-tools" class="gps-tools-box">
    <el-popover
      ref="measurePopover"
      popper-class="lbs-bg-transparent"
      placement="bottom"
      trigger="manual"
      v-model="measureVisible"
    >
      <el-radio-group v-model="measure.type" size="small" @change="measureChange">
        <el-radio label="LineString" border>{{$t("map.toolMeasureDistance")}}</el-radio>
        <el-radio label="Polygon" border>{{$t("map.toolMeasureArea")}}</el-radio>
      </el-radio-group>&nbsp;&nbsp;&nbsp;&nbsp;
      <el-button size="small" type="danger" @click="measureCancel">{{$t("common.cancel")}}</el-button>
      <el-button size="small" type="warning" @click="measureClean">{{$t("common.clean")}}</el-button>
    </el-popover>

    <el-popover
      ref="geoPopover"
      popper-class="lbs-bg-transparent"
      placement="bottom-start"
      trigger="manual"
      v-model="geoVisible"
    >
      <Geofence :visible="geoVisible"></Geofence>
    </el-popover>

    <el-popover
      ref="customLayersPopover"
      popper-class="lbs-bg-transparent"
      placement="bottom-start"
      trigger="manual"
      v-model="customLayersVisible"
    >
      <CustomLayer :visible="customLayersVisible"></CustomLayer>
    </el-popover>
    <el-popover
      ref="poisPopover"
      popper-class="lbs-bg-transparent"
      placement="bottom-start"
      trigger="manual"
      v-model="poisVisible"
    >
      <Poi :visible="poisVisible"></Poi>
    </el-popover>

    <el-popover
      ref="msgPopover"
      popper-class="lbs-bg-transparent"
      placement="bottom"
      trigger="manual"
      v-model="messageVisible"
    >
      <Message :visible="messageVisible"></Message>
    </el-popover>

    <el-button-group>
      <el-button type="primary" size="medium" @click="bubbleBtn">
        <font-awesome-icon :icon="$store.state.user.bubble.hide?'comment':'comment-slash'"/>
        {{$t("map.toolBubble")}}
      </el-button>
      <el-button
        type="primary"
        size="medium"
        :disabled="this.$store.state.user.map.mode!=1"
        @click="trackBtn"
      >
        <font-awesome-icon :icon="this.$store.state.user.map.isTrackCenter?'eye':'eye-slash'"/>
        {{$t("map.toolTrack")}}
      </el-button>
      <el-button type="primary" size="medium" v-popover:measurePopover @click="handleMeasure">
        <font-awesome-icon icon="ruler"/>
        {{$t("map.toolMeasure")}}
      </el-button>
      <el-button type="primary" size="medium" @click="handleStatistics">
        <font-awesome-icon icon="chart-bar"/>&nbsp;&nbsp;{{$t("report.report")}}
      </el-button>
      <el-button type="primary" size="medium" @click="handleReportDlg">
        <font-awesome-icon icon="desktop"/>&nbsp;&nbsp;{{$t("report.temperMonitor")}}
      </el-button>
      <!-- <el-button type="primary" size="medium" @click="$parent.downLoad"><font-awesome-icon icon="download"/> 下载</el-button> -->
      <el-button type="primary" size="medium">
        <font-awesome-icon icon="map"/>
        <el-dropdown trigger="click" @command="handleCommandMap">
          <span style="color:#fff">
            &nbsp;&nbsp;{{$t("map.toolMap")}}&nbsp;&nbsp;
            <font-awesome-icon icon="chevron-circle-down"/>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item, index) in $store.state.user.map.types"
              :key="index"
              v-show="item.enable"
              :disabled="$store.state.user.map.type==item.value"
              :command="item.value"
            >{{item.label}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-button>

      <el-button
        v-if="hasPermission('user:layer:view')"
        type="primary"
        size="medium"
        v-popover:customLayersPopover
        @click="handleCustomLayers"
      >
        <font-awesome-icon icon="clone"/>
        {{$t("map.toolLayer")}}
      </el-button>
      <el-button
        v-if="hasPermission('user:poi:view')"
        type="primary"
        size="medium"
        v-popover:poisPopover
        @click="handlePois"
      >
        <font-awesome-icon icon="paint-brush"/>
        {{$t("map.toolPoi")}}
      </el-button>
      <el-button
        v-if="hasPermission('user:geofence:view')"
        type="primary"
        size="medium"
        :disabled="this.$store.state.user.map.mode==2"
        v-popover:geoPopover
        @click="handleGeofence"
      >
        <font-awesome-icon icon="street-view"/>
        {{$t("map.toolFence")}}
      </el-button>
      <el-button type="primary" size="medium" v-popover:msgPopover @click="handleMessage">
        <el-badge :value="this.$store.state.user.eventTotal" class="item">
          <font-awesome-icon icon="bell"/>
          {{$t("map.toolMessage")}}
        </el-badge>
      </el-button>
      <el-button type="primary" size="medium" class="fas" @click="fullScreen">
        <font-awesome-icon :icon="flag?'expand':'arrows-alt'"/>
        {{flag?$t("map.toolExitFullScreen"):$t("map.toolFullScreen")}}
      </el-button>
    </el-button-group>
    <audio id="audio" controls="controls" style="display:none" ref="audio">
      <source src="'../../../static/sound/zs.mp3" type="audio/mpeg">
    </audio>
  </div>
</template>

<script>
import "@/styles/gps-tools.scss";
import util from "@/utils/util";
import Message from "./Message"; //消息
import Geofence from "./Geofence"; //围栏
import CustomLayer from "./Layer"; //自定义图层
import Poi from "./Poi"; //我的兴趣点
import { getEvents } from "@/api/api";

export default {
  name: "toolsbox",
  data() {
    return {
      geoVisible: false,
      messageVisible: false,
      measureVisible: false,
      customLayersVisible: false,
      poisVisible: false,
      msgs: [],
      flag: false,
      fullScreenText: "全屏",

      mapType: localStorage.map ? JSON.parse(localStorage.map).type : "gaode",
      measure: {
        type: "Circle",
        clean: false,
        editable: false
      }
    };
  },
  methods: {
    handleGeofence() {
      this.geoVisible = this.geoVisible ? false : true;
      if (this.geoVisible) {
        this.poisVisible = false;
      }
    },
    handleMessage() {
      this.messageVisible = this.messageVisible ? false : true;
    },
    handleMeasure() {
      this.measureVisible = this.measureVisible ? false : true;
    },
    handleCustomLayers() {
      this.customLayersVisible = this.customLayersVisible ? false : true;
    },
    handlePois() {
      this.poisVisible = this.poisVisible ? false : true;
      if (this.poisVisible) {
        this.geoVisible = false;
      }
    },
    handleStatistics() {
      if (this.$store.state.user.visibles.measureDialog) {
        this.$store.dispatch("setVisblesFlag", [
          { key: "measureDialog", value: false }
        ]);
      } else {
        window.dispatchEvent(new Event("resize"));

        this.$store.dispatch("setVisblesFlag", [
          { key: "measureDialog", value: true }
        ]);
      }
    },
    handleReportDlg() {
      if (this.$store.state.user.visibles.reportDialog) {
        this.$store.dispatch("setVisblesFlag", [
          { key: "reportDialog", value: false }
        ]);
      } else {
        this.$store.dispatch("setVisblesFlag", [
          { key: "reportDialog", value: true }
        ]);
      }
    },
    // showMessages(){
    // 	this.messageVisible = true
    // },
    // hideMessages(){
    // 	this.messageVisible = false
    // },

    bubbleBtn() {
      if (this.$store.state.user.devices.selectId != 0) {
        this.$store.dispatch("isShowBoubble");
      }
    },
    trackBtn() {
      this.$store.dispatch("isTrackCenter");
    },
    measureChange(type) {
      var measure = {
        type: type,
        clean: false,
        editable: true
      };
      this.$store.dispatch("setMeasureEnable", measure);
    },
    measureCancel() {
      var measure = {
        type: this.$store.state.user.measure.type,
        clean: false,
        editable: false
      };
      this.$store.dispatch("setMeasureEnable", measure);
    },
    measureClean() {
      var measure = {
        type: this.$store.state.user.measure.type,
        clean: true,
        editable: false
      };
      this.$store.dispatch("setMeasureEnable", measure);
    },

    handleCommandMap(val) {
      var map = { type: val };
      localStorage.map = JSON.stringify(map);
      this.$store.dispatch("setMapValues", [{ key: "type", value: val }]);
    },
    fullScreen() {
      this.flag = !this.flag;
      if (this.flag) {
        util.fullScreen();
      } else {
        util.exitFullScreen();
      }
    }
  },
  mounted() {},
  components: {
    Message: Message,
    Geofence: Geofence,
    CustomLayer,
    Poi
  },
  watch: {
    "$store.state.user.playAlarmSound": function(nv, ov) {
      if (nv) {
        this.$el.querySelector("#audio").play();
        this.$store.dispatch("setPlayAlarmSound", false);
      }
    }
  }
};
</script>
