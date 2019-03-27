<template>
  <div class="gps-menu" v-show="this.$store.state.user.visibles.deviceMenu">
    <el-collapse v-model="activeName">
      <el-collapse-item :title="$t('map.menuDeviceList')" name="1">
        <template slot="title">
          &nbsp;&nbsp;&nbsp;&nbsp; {{$t("map.menuDeviceList")}}
          <div class="online-state">
            <el-tooltip class="item" effect="dark" :content="$t('setting.online')" placement="bottom">
              <span>
                <svg-icon icon-class="luntai" class-name="menu-icon-luntai green-light"/>
                {{$store.state.user.onlineState.online}}
              </span>&nbsp;&nbsp;&nbsp;&nbsp;
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="$t('setting.offline')" placement="bottom">
              <span>
                <svg-icon icon-class="luntai" class-name="menu-icon-luntai gray-light"/>
                {{$store.state.user.onlineState.offline}}
              </span>&nbsp;&nbsp;&nbsp;&nbsp;
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="$t('map.inactive')" placement="bottom">
              <span>
                <font-awesome-icon icon="question-circle"/>
                {{$store.state.user.onlineState.notactive}}
              </span>
            </el-tooltip>
          </div>
        </template>
        <div class="title" style="background: #ffffff;height:5px;padding: 0px 12px;">
          <el-button-group v-show="false">
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('map.menuDeviceAdd')"
              placement="top-start"
            >
              <el-button
                type="primary"
                size="small"
                icon="el-icon-plus"
                @click.stop="handleAdd"
                :disabled="!hasPermission('user:device:add')"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('common.edit')"
              placement="top-start"
            >
              <el-button
                type="primary"
                size="small"
                icon="el-icon-edit"
                @click.stop="handleEdit"
                :disabled="!this.isOwner || this.$store.state.user.devices.selectId==0 || !hasPermission('user:device:update')"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('common.delete')"
              placement="top-start"
            >
              <el-button
                type="primary"
                size="small"
                icon="el-icon-delete"
                @click.stop="deleteConfirm"
                :disabled="!this.isOwner || this.$store.state.user.devices.selectId==0||!hasPermission('user:device:delete')"
              ></el-button>
            </el-tooltip>
          </el-button-group>

          <el-cascader
            popper-class="menu"
            :disabled="this.$store.state.user.devices.selectId==0"
            placeholder
            expand-trigger="hover"
            :options="optionsMenu"
            @change="handleChangeMenu"
          ></el-cascader>
          <span class="oper-menu">
            <i class="el-icon-menu"></i>
            {{$t("map.menuOperation")}}
          </span>
        </div>

        <el-row>
          <el-col :span="22" :offset="1" style="padding: 10px 0;">
            <el-input :placeholder="$t('map.searchDevice')" v-model="filterDeviceName"></el-input>
          </el-col>
        </el-row>
        <el-tree
          ref="tree"
          :data="$store.state.user.menuTreeData.nodes"
          show-checkbox
          node-key="id"
          :default-expand-all="true"
          :highlight-current="true"
          :props="defaultProps"
          :render-content="renderContent"
          @current-change="currentChange"
          @check-change="handleCheckChange"
          draggable
          @node-drag-start="handleDragStart"
          @node-drag-enter="handleDragEnter"
          @node-drag-leave="handleDragLeave"
          @node-drag-over="handleDragOver"
          @node-drag-end="handleDragEnd"
          @node-drop="handleDrop"
          :allow-drop="allowDrop"
          :filter-node-method="filterNode"
          :default-checked-keys="$store.state.user.menuTreeData.checkedKeys"
          @node-contextmenu="handleContext"
        ></el-tree>
        <el-dialog
          :title="'['+this.selectDevice.name+'] ' + $t('map.bindFence')"
          :visible.sync="bindGeoVisible"
          width="40%"
          append-to-body
          :lock-scroll="false"
        >
          <Binds :visible="bindGeoVisible" :by="by"></Binds>
        </el-dialog>

        <el-dialog
          :title="$t('map.commandSend')"
          :visible.sync="$store.state.user.visibles.commandDialog"
          width="50%"
          :lock-scroll="false"
        >
          <CommandView
            :id="commandId"
            :device="selectDevice"
            :visible="$store.state.user.visibles.commandDialog"
          ></CommandView>
        </el-dialog>

        <el-dialog :title="$t('map.commandRecord')" :visible.sync="recordsVisible" width="80%" :lock-scroll="false">
          <Records :device="selectDevice" :visible="recordsVisible"></Records>
        </el-dialog>

        <el-dialog
          :title="$t('map.media')"
          :visible.sync="mediaVisible"
          width="60%"
          append-to-body
          :lock-scroll="false"
        >
          <Medias :device="selectDevice" :visible="mediaVisible"></Medias>
        </el-dialog>

        <el-dialog
          :title="selectDevice.name + ' ' + $t('map.parkingStatistics')"
          :visible.sync="stopVisible"
          width="50%"
          :lock-scroll="false"
        >
          <Stop :device="selectDevice" :visible="stopVisible"></Stop>
        </el-dialog>

        <el-dialog
          :title="selectDevice.name + ' ' + $t('map.mileageStatistics')"
          :visible.sync="mileageVisible"
          width="50%"
          :lock-scroll="false"
        >
          <Mileage :device="selectDevice" :visible="mileageVisible"></Mileage>
        </el-dialog>

        <DeviceBox 
          :device="selectDevice"
          :types="deviceTypes"
          :users="users">
        </DeviceBox>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import "@/styles/gps-menu.scss";
import util from "@/utils/util";
import DeviceBox from "./Device"; //设备新增
import Binds from "../common/Binds"; //绑定围栏
import CommandView from "../command/CommandView"; //命令下发发送界面
import Records from "../command/Records";
import Medias from "../media/index";
import Stop from "../statistics/Stop";
import Mileage from "../statistics/Mileage";
import { delDevice, updateDevice, deleteGroup, moveGroup, getUserAccounts, getDeviceTypes } from "@/api/api";
import moment from "moment";
export default {
  name: "deviceMenu",
  props: ["selectDeviceId"],
  data() {
    return {
      activeName: "1",
      filterDeviceName: "",
      selectDevice: {}, //选中的列表中的设备,
      deviceTypes: [],
      users: [],
      isOwner: false,
      optionsMenu: [
        {
          value: "deviceInfo",
          label: this.$t("map.menuOperDevInfo")
        },
        {
          value: "history",
          label: this.$t("map.menuOperHistory")
        },
        {
          value: "geofence",
          label: this.$t("map.menuOperGeofence")
        },
        {
          value: "statistics",
          label: this.$t("map.menuOperStatistics"),
          children: [
            {
            	value: 'mileage',
            	label: this.$t("map.mileageStatistics"),
            	disabled: false,
            }, 
            {
            	value: 'speed',
            	label: this.$t('report.speed'),
            	disabled: false,
            },
            {
              value: "statisticsStop",
              label: this.$t("map.parkingStatistics"),
              disabled: false
            }
          ]
        },
        {
          value: "command",
          label: this.$t("map.menuOperCommand"),
          disabled: this.$store.state.common.user.roleKeys == "demo",
          children: []
        },
        
        // {
        //   value: "media",
        //   label: this.$t("map.menuOperMedia")
        // }
      ],
      bindGeoVisible: false,
      by: 1,
      devicesList: [],
      commandVisible: false,
      recordsVisible: false,
      mediaVisible: false,
      stopVisible: false,
      mileageVisible: false,
      commandId: 0,
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },

  methods: {
    loadCommand() {
      this.optionsMenu[4].children = [];
      var cmdIds = this.$store.state.user.dict.cmdIdsByType[
        this.selectDevice.typeId
      ];

      var cmdViews = this.$store.state.user.dict.commandViews;
      if (cmdIds) {
        cmdIds.forEach(cmdId => {
          this.optionsMenu[4].children.push({
            value: cmdId,
            label: cmdViews[cmdId].name
          });
        });
        this.optionsMenu[4].children.push({
          value: 0,
          label: "[命令记录]"
        });
      }
    },
    handleAdd: function() {
      this.$store.dispatch("setVisblesFlag", [
        { key: "deviceAddForm", value: true }
      ]);
    },

    deleteConfirm() {
      if (!this.$store.state.user.devices.selectId) {
        this.$message({
          message: "请先选择设备",
          type: "error"
        });
        return;
      }
      this.$confirm("你确定要删除该设备吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      }).then(() => {
        delDevice(this.$store.state.user.devices.selectId).then(res => {
          this.$store.dispatch("initData"); //初始化设备数据
        });
      })
      .catch(() => {});
    },

    handleEdit: function() {
      if (this.$store.state.user.devices.selectId != 0) {
        this.$store.dispatch("setVisblesFlag", [
          { key: "deviceEditForm", value: true }
        ]);
      } else {
        this.$message({
          message: this.$t("map.selectAlert"),
          type: "error"
        });
      }
    },
    handleChangeMenu(menu) {
      if (this.$store.state.user.devices.selectId == 0) {
        this.$message({
          message: this.$t("map.selectAlert"),
          type: "error"
        });
        return;
      }

      switch (menu[0]) {
        case "deviceInfo":
          if (this.selectDevice.id != 0) {
            this.$store.dispatch("setVisblesFlag", [
              { key: "deviceEditForm", value: true }
            ]);
          } else {
            this.$message({
              message: this.$t("map.selectAlert"),
              type: "error"
            });
          }
          break;
        case "history":
          //切换地图模式为轨迹回放
          this.$store.dispatch("setMapValues", [{ key: "mode", value: 2 }]);

          break;
        case "geofence":
          this.by = 1;
          this.bindGeoVisible = true;
          break;

        case "command":
          this.commandId = menu[1];
          if (this.commandId != 0) {
            //this.commandVisible = true
            this.$store.dispatch("setVisblesFlag", [
              { key: "commandDialog", value: true }
            ]);
          } else {
            this.recordsVisible = true;
          }
          break;
        // case "media":
        //   this.mediaVisible = true;
        //   break;
        case "statistics":
          if (menu[1] == "statisticsStop") {
            this.stopVisible = true;
          }
          else if (menu[1] == "mileage") {
            this.mileageVisible = true;
          }
          else if (menu[1] == "speed") {
            this.$store.dispatch("setVisblesFlag", [
              { key: "measureDialog", value: true },
              { key: "reportDialogRef", value: true}
            ]);
          }
          break;
      }
    },
    renderContent(h, { node, data, store }) {
      var dom;
      switch (data.type) {
        case "group":
          dom = (
            <span>
              <svg-icon
                icon-class="group"
                class-name="menu-icon-question blue"
              />{" "}
              {node.label}
            </span>
          );
          break;
        case "device":
          var dev = this.$store.state.user.devices.list[
            this.$store.state.user.devices.index[data._id]
          ];
          if(typeof dev == 'undefined' || dev == null) {
            status = 0;
            motion = 0;
          }
          else {
            var status = dev.hasOwnProperty('status') ? dev.status : 0;
            var motion = dev.hasOwnProperty('motion') ? dev.motion : 0;
          }
          if (status == 1) {
            //在线
            if (motion == 1) {
              dom = (
                <span>
                  <svg-icon
                    icon-class="luntai"
                    class-name="menu-icon-luntai green icon_spin"
                  />{" "}
                  {node.label}
                </span>
              );
            } else {
              dom = (
                <span>
                  <svg-icon
                    icon-class="luntai"
                    class-name="menu-icon-luntai green"
                  />{" "}
                  {node.label}
                </span>
              );
            }
          } else if (status == 0) {
            dom = (
              <span>
                <svg-icon icon-class="luntai" class-name="menu-icon-luntai" />{" "}
                {node.label}
              </span>
            );
          } else {
            dom = (
              <span>
                <svg-icon
                  icon-class="question"
                  class-name="menu-icon-question"
                />{" "}
                {node.label}
              </span>
            );
          }
          break;
      }

      return dom;
    },
    handleContext(event, node) {
      this.currentChange(node);
      this.loadCommand();
      this.showContextMenu(event);
    },
    showContextMenu(event) {
      const cascader = this.$el.querySelector(".el-cascader");
      if (cascader) {
        cascader.style.top = parseInt(event.pageY) - 100 + "px";
        cascader.style.left = parseInt(event.pageX) + "px";
      }
      cascader.click();
    },
    currentChange(node) {
      if (node.type === "device") {
        let device = this.$store.state.user.devices.list[
          this.$store.state.user.devices.index[node._id]
        ];
        this.selectDevice = device;
        this.$store.dispatch("setSelectDeviceId", node._id);
        this.isOwner = false;
        if(this.$store.state.user.devices.idsOwned != null && this.$store.state.user.devices.idsOwned.length != 0 ) {
          this.$store.state.user.devices.idsOwned.forEach(item => {
            if (item.id == device.id) {
              this.isOwner = true;
              return;
            }
          });
        }
        if (device.lastUpdate) {
          this.$store.dispatch("setMapValues", [{ key: "mode", value: 1 }]);
        } else {
          this.$message({
            message: this.$t('map.inactive'),
            type: "error"
          });
        }
      }
    },
    handleCheckChange(data, checked, indeterminate) {
      //节点勾选
      if (data.type === "device") {
        this.$store.dispatch("setMarkersVisible", {
          key: this.$store.state.user.devices.index[data._id],
          value: checked
        });
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },

    handleDragStart(node, ev) {
      // console.log('drag start', node);
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      //console.log('tree drag enter: ', dropNode.label);
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      // console.log('tree drag leave: ', dropNode.label);
    },
    handleDragOver(draggingNode, dropNode, ev) {
      //console.log('tree drag over: ', dropNode.label);
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      // console.log('tree drag end: ', dropNode && dropNode.label, dropType);
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      var targetNode = {};
      if (dropType == "inner") {
        targetNode = dropNode.data;
      } else {
        targetNode = this.findP(
          this.$store.state.user.menuTreeData.nodes,
          dropNode.data
        );
      }

      let param = {
        type: draggingNode.data.type,
        id: draggingNode.data._id,
        groupId: targetNode.name == 'root' ? 0 : targetNode._id
      };
      moveGroup(param).then(res => {
        this.$message({
          message: "移动成功！",
          type: "success"
        });
      });
    },
    allowDrop(draggingNode, dropNode) {
      return dropNode.data.type !== "device";
    },
    //找父节点
    findP(zNodes, node) {
      for (var i = 0; i < zNodes.length; i++) {
        if (node.parentId == 0) {
          return { id: 0, name: "root" };
        } else if (node.parentId == zNodes[i]._id) {
          return zNodes[i];
        }
      }
    }
  },

  components: {
    DeviceBox,
    Binds: Binds,
    CommandView: CommandView,
    Records,
    Medias,
    Stop,
    Mileage
  },
  mounted() {
    getDeviceTypes().then(data => {
      this.deviceTypes = data
    })
  },
  watch: {
    filterDeviceName(val) {
      this.$refs.tree.filter(val);
    },
    "$store.state.user.devices.selectId": function() {
      this.$refs.tree.setCurrentKey(this.$store.state.user.devices.selectId);
    }
  }
};
</script>
<style>
.oper-menu {
  float: right;
  position: absolute;
  right: 53px;
  top: 47px;
  color: #fff;
  pointer-events: none;
  font-size: 13px;
}

.gps-menu .el-cascader__label {
  display: none;
}
.gps-menu .el-cascader .el-input__inner {
  border-color: #409eff;
  border-radius: 3px;
  height: 32px;
  background-color: #409eff;
}
.online-state {
  float: right;
  margin-right: 20px;
}
.icon_spin {
  -moz-animation: spin 2s infinite linear;
  -o-animation: spin 2s infinite linear;
  -webkit-animation: spin 2s infinite linear;
  animation: spin 2s infinite linear;
  -webkit-transform-origin: 50% 49% 0px;
}
@-moz-keyframes spin {
  0% {
    -moz-transform: rotate(0deg);
  }
  100% {
    -moz-transform: rotate(360deg);
  }
}
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@-o-keyframes spin {
  0% {
    -o-transform: rotate(0deg);
  }
  100% {
    -o-transform: rotate(360deg);
  }
}
@-ms-keyframes spin {
  0% {
    -ms-transform: rotate(0deg);
  }
  100% {
    -ms-transform: rotate(360deg);
  }
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.menu-icon-luntai {
  font-size: 16px;
  height: 28px;
  margin-left: 2px;
}
.menu-icon-question {
  font-size: 14px;
  height: 28px;
  margin-left: 2px;
}
.gps-menu .el-cascader {
  opacity: 0;
  position: absolute;
}
.el-cascader-menu::-webkit-scrollbar {
  width: 3px;
}
.el-cascader-menu::-webkit-scrollbar-thumb {
  background-color: #aaa;
}
.gps-menu {
  /* -webkit-box-shadow: 0px 0px 8px 5px #aaa;
  -moz-box-shadow:    0px 0px 8px 5px #aaa;
  box-shadow:         0px 0px 8px 5px #aaa; */
}
.gps-menu .el-tree {
  height: 400px;
  overflow-y: scroll;
}
.el-tree::-webkit-scrollbar {
  width: 5px;
}
.el-tree::-webkit-scrollbar-track {
  background-color: #ddd;
  border-radius: 5px;
}
.el-tree::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: #aaa;
}
</style>
