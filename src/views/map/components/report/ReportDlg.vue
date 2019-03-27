<template>
  <div id="report-dlg" class="report-dlg">
    <div id="report-filter" class="report-filter">
      <div id="filter-input" class="filter-input">
        <el-cascader
          :options="$store.state.user.menuTreeData.nodes"
          change-on-select
          size="small"
          v-model="optionSelected"
          @change="updateDeviceIds"
          :placeholder="$t('report.selectDevice')"
        ></el-cascader>
        <!-- <el-select v-model="optionSelected" :placeholder="$t('report.selectDevice')" size="small">
          <el-option :key="'0'" :label="$t('report.allDevices')" :value="0"></el-option>
          <el-option
            v-for="item in this.$store.state.user.deviceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select> -->
      </div>
      <div id="filter-submit" class="filter-submit">
        <el-button size="small" @click="showAllDevs">{{$t('report.allDevices')}}</el-button>
      </div>
    </div>
    <div id="report-items" class="report-items">
      <report-item v-for="(device,index) in deviceList" :key="index" :device="device"></report-item>
    </div>
  </div>
</template>

<script>
import ReportItem from "./ReportItem";

export default {
  name: "report-dlg",
  data() {
    return {
      optionSelected: [],
      deviceIds: [],
    };
  },
  computed: {
    deviceList: function() {
      if (this.deviceIds.length == 0) {
        return this.$store.state.user.devices.list;
      } else {
        return this.$store.state.user.devices.list.filter(item => {
          return this.deviceIds.find(element => {
            return element == item.id
          });
        });
      }
    }
  },
  methods: {
    showAllDevs() {
      this.deviceIds = [];
    },
    updateDeviceIds(value) {
      this.deviceIds = [];
      if(value.length != 0)  {
        var lastIndex = value[value.length - 1];
        this.getDeviceIds(lastIndex);
      }
    },
    getDeviceIds(id) {
      var node = this.$store.state.user.menuTreeData.list.filter(item => {
        if(item.id == id) return item
      })[0];
      if(node.type == 'device') this.deviceIds.push(node._id);
      else {
        var nodes = this.$store.state.user.menuTreeData.list.forEach(item => {
          if(item.parentId == node.id)
            this.getDeviceIds(item.id);          
        });
      } 
    }
  },
  components: {
    "report-item": ReportItem
  }
};
</script>

<style>
.report-dlg {
  position: absolute;
  right: 30px;
  top: 80px;
  width: 650px;
  max-height: 554px !important;
  line-height: 20px;
  border-radius: 10px;
  background-color: rgba(174, 174, 174, 0.7);
  color: rgba(16, 16, 16, 1);
  font-size: 14px;
  text-align: center;
  font-family: Roboto;
  border: 1px solid rgba(187, 187, 187, 1);
  max-height: 100%;
  overflow-y: scroll;
  padding: 10px;
}

.report-dlg::-webkit-scrollbar {
  width: 0;
}

.report-dlg::-webkit-scrollbar-track {
  background-color: rgba(187, 187, 187, 0.7);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

.report-dlg::-webkit-scrollbar-thumb {
  background-color: rgba(200, 200, 200, 0.7);
  outline: 1px solid slategrey;
}

.report-filter {
  display: block;
  overflow: auto;
}

.filter-input {
  width: 70%;
  float: left;
  padding: 0 50px;
}

.filter-submit {
  float: left;
  width: 30%;
  text-align: left;
}

.report-dlg .el-select {
  width: 100%;
}
</style>
