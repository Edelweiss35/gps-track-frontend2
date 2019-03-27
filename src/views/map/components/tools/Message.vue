<template>
  <section class="lbs-bg-transparent lbs-bg-transparent2 alarm-dlg">
    <el-tooltip class="item" effect="dark" :content="$t('common.deleteSelected')" placement="top-start">
      <el-button
        type="warning"
        size="mini"
        @click="removeHandler"
        :disabled="this.currentEvent==null || this.currentEvent.id==0 || $store.state.common.user.roleKeys == 'demo'">
        <i class="fa fa-trash"></i>
      </el-button>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" :content="$t('common.deleteAll')" placement="top-start">
      <el-button
        type="danger"
        size="mini"
        :disabled="$store.state.common.user.roleKeys == 'demo'"
        @click="removeAllHandler">
        <i class="fa fa-trash"></i> &nbsp; All
      </el-button>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" :content="$t('common.readAll')" placement="top-start">
      <el-button
        type="success"
        size="mini"
        :disabled="$store.state.common.user.roleKeys == 'demo'"
        @click="readAllHandler">
        <i class="fa fa-book"></i>
      </el-button>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" :content="$t('common.customMsg')" placement="top-start">
      <el-button
        type="info"
        size="mini"
        :disabled="$store.state.common.user.roleKeys == 'demo'"
        @click="showCustomMsg">
        <i class="fa fa-comment"></i>
      </el-button>
    </el-tooltip>
    <el-table
      :data="deviceMsgData.events"
      highlight-current-row
      @row-click="readEventMsg"
      @current-change="currentChange"
    >
      <el-table-column property="deviceId" :label="$t('common.device')">
        <template slot-scope="scope">
          <i v-show="!scope.row.read" style="color:#FF4949">
            <font-awesome-icon icon="circle"/>
          </i>
          <i v-show="scope.row.read">&nbsp;&nbsp;&nbsp;</i>
          <span
            class="name-width"
          >{{$store.state.user.devices.list[$store.state.user.devices.index[scope.row.deviceId]].name}}</span>
        </template>
      </el-table-column>
      <el-table-column property="type" :label="$t('common.message')">
        <template slot-scope="scope">
          <el-tag
            size="small"
            :type="scope.row.type === 0?'danger':scope.row.type === 1?'success':scope.row.type === 2?'primary':'warning'"
            close-transition
          >
            {{
              ($store.state.user.customMsgs[$store.state.user.status[scope.row.type]] && $store.state.user.customMsgs[$store.state.user.status[scope.row.type]] != "") ? 
              $store.state.user.customMsgs[$store.state.user.status[scope.row.type]] :
              $t('map.'+$store.state.user.status[scope.row.type]).replace('value', scope.row.value)
            }}
          </el-tag>
          <el-tag size="small" type="primary" v-show="scope.row.geoName">{{scope.row.geoName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
       
        property="time"
        :label="$t('common.time')"
        :formatter="dateFormat"
      ></el-table-column>
    </el-table>
    <el-pagination
      small
      :background="true"
      layout="prev, pager, next"
      :current-page="deviceMsgData.page"
      @current-change="handleCurrentChange"
      :total="deviceMsgData.total"
    ></el-pagination>
  </section>
  
</template>
<script>
import util from "@/utils/util";
import { getEvents, readEvent, deleteEvent, deleteAllEvents, readAllEvents } from "@/api/api";
export default {
  data() {
    return {
      deviceMsgData: {},
      currentEvent: {
        id: 0
      },
    };
  },
  methods: {
    init() {
      this.getEvents();
    },
    updateEventsCount() {
      let params = {
        page: this.deviceMsgData.page
      };
      getEvents(params).then(data => {
        this.$store.dispatch("getEvents", {
          alarms: [],
          totalCount: data.total
        });
      });
    },
    getEvents() {
      let params = {
        page: this.deviceMsgData.page
      };
      getEvents(params).then(data => {
        this.deviceMsgData = data;
        this.$store.dispatch("getEvents", []);
        let alarms = [];
        data.events.forEach(event => {
          if (event.latitude) {
            alarms.push({
              id: event.id,
              coord: [event.longitude, event.latitude],
              color: event.read ? "255, 215, 0" : "255, 0, 0",
              visible: true
            });
          }
        });
        // console.log(alarms);
        this.$store.dispatch("getEvents", {
          alarms: alarms,
          totalCount: data.total
        });
      });
    },
    //时间格式化
    dateFormat: function(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return util.dateFormat(date, "MM-DD HH:mm:ss");
    },
    getDeviceName: function(row, column) {
      var deviceId = row[column.property];
      if (deviceId == undefined) {
        return "";
      }
      return this.$store.state.user.devices.list[
        this.$store.state.user.devices.index[deviceId]
      ].name;
    },
    handleCurrentChange(val) {
      this.deviceMsgData.page = val;
      this.getEvents();
    },
    readEventMsg(row, event, column) {
      if (!row.read) {
        readEvent(row.id).then(res => {
          row.read = true;
          this.$store.dispatch("setMessageValue", {
            key: "eventCount",
            value: this.$store.state.user.message.eventCount - 1
          });
        });
      }
      if (row.latitude) {
        this.$store.dispatch("setMapValues", [
          { key: "center", value: [row.longitude, row.latitude] },
          { key: "zoom", value: 18 }
        ]);
      }
    },
    removeHandler() {
      if (this.currentEvent.id) {
        deleteEvent(this.currentEvent.id).then(data => {
          this.getEvents();
          this.currentEvent = {};
        });
      }
    },
    removeAllHandler() {
      this.$confirm(this.$t('system.deleteMsg'), this.$t('report.confirm'), {
        confirmButtonText: this.$t('report.confirm'),
        cancelButtonText: this.$t('report.cancel'),
        type: "warning",
        lockScroll: false
      }).then(() => {
        deleteAllEvents().then(data => {
          this.getEvents();
          this.currentEvent = null;
        });
      })
      .catch(() => {});
      
    },
    readAllHandler() {
      readAllEvents().then(data => {
        this.getEvents();
      });
    },
    showCustomMsg() {
      this.$store.dispatch("setVisblesFlag", [
        { key: "customMsgDialog", value: true }
      ]);
    },
    currentChange(currentRow, oldCurrentRow) {
      this.currentEvent = currentRow;
    }
  },
  watch: {
    visible: function() {
      if (this.visible) {
        this.init();
      } else {
        this.$store.dispatch("getEvents", []);
      }
    },
    "$store.state.user.alarmSettingChanged": function() {
      if (this.visible) {
        this.init();
      } else {
        this.updateEventsCount();
      }
      this.$store.dispatch("setAlarmSettingFlag", false);
    }
  },
  mounted() {
    this.updateEventsCount();
    setInterval(() => {
      this.updateEventsCount();
    }, 3000);
  },

  props: ["visible"]
};
</script>
<style>
.el-table .read-row {
  background: #eff2f7;
}
.name-width {
  /* overflow: hidden; */
  /* text-overflow: ellipsis; */
  /* white-space: nowrap; */
}
.alarm-dlg {
  text-align: center;
  width: 520px;
}
.alarm-dlg .el-button {
  width: 70px;
  border-radius: 20px;
}
.el-table .cell, .el-table th div {
  text-align: center;
  padding-right: 10px;
  overflow: visible;
  text-overflow: unset;
}
</style>
