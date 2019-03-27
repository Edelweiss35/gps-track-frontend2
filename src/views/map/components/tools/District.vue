<template>
  <section>
    <el-dialog
      class="Blue"
      title="行政区域围栏"
      append-to-body
      width="80%"
      :visible="$store.state.user.visibles.districtGeoDialog"
      :before-close="handleClose"
      :lock-scroll="false"
    >
      <el-row :gutter="20">
        <el-col :span="6">
          <el-select v-model="provinceValue" placeholder="请选择省" @change="change">
            <el-option
              v-for="(item,index) in province"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="cityValue" placeholder="请选择市" @change="change">
            <el-option
              v-for="(item,index)  in city"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="districtValue" placeholder="请选择县区" @change="change">
            <el-option
              v-for="(item,index) in district"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="save">保存</el-button>
        </el-col>
      </el-row>

      <div class="amap-wrapper">
        <el-amap class="amap-box" ref="map" :events="events" vid="amap-vue"></el-amap>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import { addGeofence } from "@/api/api";
import util from "@/utils/util";
// import { AMap } from "vue-amap";

var map = {};
var districtSearch = {};
export default {
  data() {
    return {
      provinceValue: {},
      cityValue: {},
      districtValue: {},
      province: [],
      city: [],
      district: [],
      events: {
        init: o => {
          this.map = o;
          districtSearch = new AMap.DistrictSearch(o);
        },
        moveend: () => {},
        zoomchange: () => {},
        click: e => {}
      },
      polygons: [],
      geofence: {
        name: "",
        area: "",
        type: "polygon",
        description: "行政区域"
      }
    };
  },
  methods: {
    init() {
      let _this = this;
      this.districtSearch = new AMap.DistrictSearch({
        subdistrict: 1, //返回下一级行政区
        showbiz: false //最后一级返回街道信息
      });

      this.districtSearch.search("中国", function(status, result) {
        if (status == "complete") {
          _this.getData(result.districtList[0]);
        }
      });
    },
    getData(data, level) {
      var bounds = data.boundaries;

      if (bounds) {
        this.geofence.area = util.districtGeofence(bounds);

        for (var i = 0, l = bounds.length; i < l; i++) {
          var polygon = new AMap.Polygon({
            map: this.map,
            strokeWeight: 1,
            strokeColor: "#409EFF",
            fillColor: "#CCF3FF",
            fillOpacity: 0.5,
            path: bounds[i]
          });
          this.polygons.push(polygon);
        }

        this.map.setFitView(); //地图自适应
      }

      //清空下一级别的下拉列表
      if (level === "province") {
        this.city = [];
        this.cityValue = "";
        this.district = [];
        this.districtValue = "";
      } else if (level === "city") {
        this.district = [];
        this.districtValue = "";
      }
      var subList = data.districtList;

      if (subList) {
        var curlevel = subList[0].level;
        if (curlevel === "street") {
          return;
        }
        for (var i = 0, l = subList.length; i < l; i++) {
          this[curlevel].push({
            label: subList[i].name,
            value: JSON.stringify({
              name: subList[i].name,
              level: subList[i].level,
              adcode: subList[i].adcode
            })
          });
        }
      }
    },

    change(obj) {
      var obj = JSON.parse(obj);
      let _this = this;
      //清除地图上所有覆盖物
      for (var i = 0, l = this.polygons.length; i < l; i++) {
        this.polygons[i].setMap(null);
      }
      this.districtSearch.setLevel(obj.level); //行政区级别
      this.districtSearch.setExtensions("all");
      this.districtSearch.search(obj.adcode, function(status, result) {
        if (status === "complete") {
          //  console.log(result);
          _this.getData(result.districtList[0], obj.level);
        }
      });
    },
    save() {
      if (this.geofence.area.length > 4000 || this.geofence.area.length < 400) {
        this.$message({
          type: "error",
          message: "围栏数据异常，请联系管理员"
        });
      }
      this.geofence.name = JSON.parse(this.provinceValue).name;
      if (this.cityValue) {
        this.geofence.name =
          this.geofence.name + "/" + JSON.parse(this.cityValue).name;
      }
      if (this.districtValue) {
        this.geofence.name =
          this.geofence.name + "/" + JSON.parse(this.districtValue).name;
      }
      let geofences = this.$store.state.user.geofences;

      for (var i = 0; i < geofences.length; i++) {
        if (geofences[i].label === this.geofence.name) {
          this.$message({
            type: "error",
            message: "此行政区域围栏已经存在"
          });
          return;
        }
      }
      addGeofence(this.geofence).then(res => {
        this.handleClose();
        this.$store.dispatch("getGeofences");
      });
    },
    clean() {
      this.province = [];
      this.provinceValue = "";
      this.city = [];
      this.cityValue = "";
      this.district = [];
      this.districtValue = "";
      for (var i = 0, l = this.polygons.length; i < l; i++) {
        this.polygons[i].setMap(null);
      }
    },
    handleClose: function() {
      this.$store.dispatch("setVisblesFlag", [
        { key: "districtGeoDialog", value: false }
      ]);
    }
  },
  watch: {
    visible: function() {
      if (this.visible) {
        this.clean();
        this.init();
      }
    }
  },
  mounted() {
    this.init();
    this.provinceValue = "";
  },
  props: ["visible"]
};
</script>
<style>
.amap-wrapper {
  height: 460px;
}
</style>
