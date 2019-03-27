<template>
  <div id="measure-dlg" class="measure-dlg">
    <div class="filter-wrapper">
      <el-button type="default" class="close-btn" circle icon="el-icon-close" v-on:click="handleClose"></el-button>
      <el-tooltip class="item" effect="dark" :content="$t('report.selectDevice')" placement="top">
        <el-select v-model="device_id" :placeholder="$t('report.selectDevice')" class="device-id">
          <el-option
            v-for="item in this.$store.state.user.deviceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" :content="$t('report.timeRange')" placement="top">
        <el-date-picker
          v-model="startAndEnd"
          type="daterange"
          :picker-options="pickerOptions2"
          :range-separator="$t('report.to')"
          :start-placeholder="$t('report.startTime')"
          :end-placeholder="$t('report.endTime')"
          align="right">
        </el-date-picker>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" :content="$t('report.paramType')" placement="top">
        <el-select v-model="attr_id" :placeholder="$t('report.paramType')" class="attr-id">
          <el-option
            v-for="(item, index) in attrOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" :content="$t('report.interval')" placement="top">
        <el-select v-model="interval" :placeholder="$t('report.interval')" class="interval">
          <el-option
            v-for="(item, index) in intervalOptions"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-tooltip>
      <el-button type="primary" icon="el-icon-search" v-on:click="initChartValues">{{$t("common.query")}}</el-button>
      <el-button type="default" :disabled="$store.state.common.user.roleKeys == 'demo'" icon="el-icon-download" v-on:click="download">{{$t("report.download")}}</el-button>
    </div>
    <img src="../../../../assets/images/logo_pdf.png" id="logo-pdf" style="display:none;" />
    <div class="statistics-wrapper">
      <h1 class="statistics-title">{{title}}</h1>
      <div class="device-info-wrapper">
        <div class="logo-wrapper">
          <img src="../../../../assets/images/logo_statistics.png" width="100%" alt>
        </div>
        <div class="info-wrapper" v-if="deviceDetail.devNumber != null">
          <p>
            <span class="info-element">
              {{$t("report.devNumber")}}:&nbsp;&nbsp;
              <b>{{deviceDetail.devNumber.toLowerCase()}}</b>
            </span>
            <span class="info-element">
              {{$t("report.devVIN")}}:&nbsp;&nbsp;
              <b>{{deviceDetail.devVIN.toLowerCase()}}</b>
            </span>
            <span class="info-element">
              {{$t("report.containerType")}}:&nbsp;&nbsp;
              <b>{{deviceDetail.containerType.toLowerCase()}}</b>
            </span>
          </p>
          <p>
            <span class="info-element">
              {{$t("report.refrigModel")}}:&nbsp;&nbsp;
              <b>{{deviceDetail.refrigModel.toLowerCase()}}</b>
            </span>
            <span class="info-element">
              {{$t("report.refrigSN")}}:&nbsp;&nbsp;
              <b>{{deviceDetail.refrigSN.toLowerCase()}}</b>
            </span>
          </p>
          <p>
            <span class="info-element">
              {{$t("report.startTime")}}:&nbsp;&nbsp;
              <b>{{startFormated}}</b>
            </span>
            <span class="info-element">
              {{$t("report.endTime")}}:&nbsp;&nbsp;
              <b>{{endFormated}}</b>
            </span>
          </p>
        </div>
      </div>
      <div class="chart-wrapper">
        <div id="part-chart" v-if="chartType == 1">
          <h2 class="chart-title">
            {{attr_id == 1 ? $t("report.temp1") : $t("report.humid1")}}
          </h2>
          <h3 class="chart-title">
            {{$t("report.temperSensorSN")}}&nbsp;&nbsp;&nbsp;
            <b>{{deviceDetail.temper_sensor_sn_1}}</b>
          </h3>
          <line-chart :chart-data="chartData[0]" :title="attrOptions[this.attr_id - 1].label"></line-chart>

          <h2 class="chart-title">
            {{attr_id == 1 ? $t("report.temp2") : $t("report.humid2")}}
          </h2>
          <h3 class="chart-title">
            {{$t("report.temperSensorSN")}}&nbsp;&nbsp;&nbsp;
            <b>{{deviceDetail.temper_sensor_sn_2}}</b>
          </h3>
          <line-chart :chart-data="chartData[1]" :title="attrOptions[this.attr_id - 1].label"></line-chart>

          <h2 class="chart-title">
            {{attr_id == 1 ? $t("report.temp3") : $t("report.humid3")}}
          </h2>
          <h3 class="chart-title">
            {{$t("report.temperSensorSN")}}&nbsp;&nbsp;&nbsp;
            <b>{{deviceDetail.temper_sensor_sn_3}}</b>
          </h3>
          <line-chart :chart-data="chartData[2]" :title="attrOptions[this.attr_id - 1].label"></line-chart>

          <h2 class="chart-title">
            {{attr_id == 1 ? $t("report.temp4") : $t("report.humid4")}}
          </h2>
          <h3 class="chart-title">
            {{$t("report.temperSensorSN")}}&nbsp;&nbsp;&nbsp;
            <b>{{deviceDetail.temper_sensor_sn_4}}</b>
          </h3>
          <line-chart :chart-data="chartData[3]" :title="attrOptions[this.attr_id - 1].label"></line-chart>
        </div>
        <div id="float-chart" v-else-if="chartType == 2">
          <h2 class="chart-title">{{subTitle}}</h2>
          <line-chart :chart-data="chartData[0]" :title="attrOptions[this.attr_id - 1].label"></line-chart>
        </div>
        <div id="boolean-chart" v-else-if="chartType == 3">
          <h2 class="chart-title">{{subTitle}}</h2>
          <line-chart :chart-data="chartData[0]" :type="'bar'" :title="attrOptions[this.attr_id - 1].label"></line-chart>
        </div>
      </div>
    </div>
  </div>
</template>
    
<script>
import util from "@/utils/util";
import LineChart from "./LineChart";
import moment from "moment";
import { Message } from "element-ui";

import {
  getHistoryPosition,
  getDeviceDetail,
  getAlarmSetting
} from "@/api/api";

var base64Image = null;

export default {
  name: "measure-dlg",
  components: {
    LineChart
  },
  data() {
    return {
      base64Image: "",

      tempData: [],
      deviceDetail: {
        
      },

      title: "",
      subTitle: "",
      chartType: 1,

      device_id: null,
      attr_id: 1,
      start: "",
      end: "",
      interval: 15,

      isDateChanged: true,

      chartData: [[], [], [], []],

      intervalOptions: [
        {label: "1", value: "1"},
        {label: "2", value: "2"},
        {label: "5", value: "5"},
        {label: "10", value: "10"},
        {label: "15", value: "15"},
        {label: "30", value: "30"},
        {label: "60", value: "60"},
      ],

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

      pFont: null
    };
  },

  mounted() {
    this.init();
    var imgUrl = document.getElementById("logo-pdf").getAttribute("src");
    this.imgToBase64(imgUrl, function(base64) {
      base64Image = base64;
    });
    fetch("/static/font/simhei.ttf")
      .then(response => response.blob())
      .then(response => this.fontToBase64(response))
      .then(response => {
        this.pFont = response.split(',')[1];
      });
  },

  methods: {
    init() {
      this.start = moment(Date.now() - 1000 * 60 * 60 * 24).format(
        "YYYY-MM-DD HH:mm"
      );
      this.end = moment(Date.now()).format("YYYY-MM-DD HH:mm");
      this.initChartValues();
    },

    initChartValues() {
      if(this.device_id != null) {
        getAlarmSetting(this.device_id).then(data => {
          if ("settings" in data && data.settings.length > 2) {
            this.settings = JSON.parse(data.settings);
          }
        });
      }
      
      this.chartType = this.attrOptions[this.attr_id - 1].type;
      this.title = this.attrOptions[this.attr_id - 1].title;
      this.chartData = [[], [], [], []];
      if (this.isDateChanged && this.device_id != null) {
        getHistoryPosition({
          id: this.device_id,
          start: this.start,
          end: this.end,
          interval: this.interval,
        }).then(data => {
          this.tempData = data;
          this.setChartData();
        });

        getDeviceDetail({ device_id: this.device_id }).then(data => {
          console.log(data)
          this.deviceDetail = {
            devNumber: data.devNumber ? data.devNumber : "N/A",
            devVIN: data.devVIN ? data.devVIN : "N/A",
            containerType: data.containerType ? data.containerType : "N/A",
            refrigSN: data.refrigSN ? data.refrigSN : "N/A",
            refrigModel: data.refrigModel ? data.refrigModel  : "N/A",
            temp1SN: data.temp1SN ? data.temp1SN : "N/A",
            temp2SN: data.temp2SN ? data.temp2SN : "N/A",
            temp3SN: data.temp3SN ? data.temp3SN : "N/A",
            temp4SN: data.temp4SN ? data.temp4SN : "N/A",
          };
        });
      } else {
        this.setChartData();
      }
      window.dispatchEvent(new Event("resize"));
    },

    setChartData() {
      var where = this.attrOptions[this.attr_id - 1].where;
      var keys = this.attrOptions[this.attr_id - 1].keysInDB;
      this.tempData.forEach(item => {
        var time = item.time;
        var data = {};
        if (where == "position") data = item;
        else data = JSON.parse(item.attributes);

        keys.forEach((key, index) => {
          this.chartData[index].push([time, data[key]]);
        });
      });
    },

    moment() {
      return moment();
    },

    download() {
      if (this.tempData.length == 0) {
        Message({ message: "No data to download", type: "warning" });
        return;
      }
      var attr_id = this.attr_id - 1;

      /* get table data from temp */
      var columns = this.attrOptions[attr_id].columns;
      var data = this.createTable();
      var myfont = this.pFont;
      /* table header columns just in case of parameter type 1 (temperature and humidity) */
      var headerText = [
        this.$t("report.number"),
        this.$t("report.date"),
        this.$t("report.time"),
        this.$t("report.section1"),
        this.$t("report.section2"),
        this.$t("report.section3"),
        this.$t("report.section4"),
      ];
      // var headerText = ["No", "Time", "Section 1", "Section 2", "Section 3", "Section 4",];
      var headerIdx;
      var doc = new jsPDF();
      var fCellX = 0;
      var fCellY = 0;
      var raw = "";
      var cellIdx;
      var oPageCount = 0;
      var rowIdxPage = 0;
      var totalPagesExp = Math.ceil((data.length - 66) / 77) + 1;

      if(this.$store.state.common.system.lang == 'zh_CN') {
        doc.addFileToVFS('simhei.ttf', this.pFont);
        doc.addFont('simhei.ttf', 'simhei', 'normal');
        doc.setFont('simhei');
      }
      
      // pdf title
      doc.setFontSize(18);
      doc.setTextColor(50);
      var txtWidth = doc.getTextWidth(this.attrOptions[attr_id].tableTitle);
      var pageWidth =
        doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
      doc.text(
        (pageWidth - txtWidth) / 2,
        22,
        this.attrOptions[attr_id].tableTitle
      );

      // pdf logo image
      if (base64Image) {
        doc.addImage(base64Image, "PNG", 15, 25, 40, 16);
      }

      // common device information
      doc.setFontSize(7);

      doc.text(this.$t("report.devNumber") + ": ", 72 - doc.getTextDimensions(this.$t("report.devNumber")).w, 29);
      doc.text(this.deviceDetail.devNumber, 74, 29);
      doc.text(this.$t("report.refrigModel") + ": ", 112 - doc.getTextDimensions(this.$t("report.refrigModel")).w, 29);
      doc.text(this.deviceDetail.refrigModel, 114, 29);
      doc.text(this.$t("report.containerType") + ": ", 153 - doc.getTextDimensions(this.$t("report.containerType")).w, 29);
      doc.text(this.deviceDetail.containerType, 155, 29);

      doc.text(this.$t("report.devVIN") + ": ", 72 - doc.getTextDimensions(this.$t("report.devVIN")).w, 33);
      doc.text(this.deviceDetail.devVIN, 74, 33);
      doc.text(this.$t("report.refrigSN") + ": ", 112 - doc.getTextDimensions(this.$t("report.refrigSN")).w, 33);
      doc.text(this.deviceDetail.refrigSN, 114, 33);

      /* add sensor data according to parameter to pdf */
      if (attr_id < 2) {
        doc.text(this.$t("report.tempSensor1") + ": ", 72 - doc.getTextDimensions(this.$t("report.tempSensor1")).w, 37);
        doc.text(this.deviceDetail.temp1SN, 74, 37);
        doc.text(this.$t("report.tempSensor2") + ": ", 112 - doc.getTextDimensions(this.$t("report.tempSensor2")).w, 37);
        doc.text(this.deviceDetail.temp2SN, 114, 37);

        doc.text(this.$t("report.tempSensor3") + ": ", 72 - doc.getTextDimensions(this.$t("report.tempSensor3")).w, 41);
        doc.text(this.deviceDetail.temp3SN, 74, 41);
        doc.text(this.$t("report.tempSensor4") + ": ", 112 - doc.getTextDimensions(this.$t("report.tempSensor4")).w, 41);
        doc.text(this.deviceDetail.temp4SN, 114, 41);
        doc.text(this.$t("report.temperUnit") + ": ", 153 - doc.getTextDimensions(this.$t("report.temperUnit")).w, 41);
        doc.text(this.attrOptions[0].unit, 155, 41);
      }
      var footer = this.$t("common.page") + " ";
      var pageContent = function (data) {
        var _footer = footer + data.pageCount;
        if (typeof doc.putTotalPages === 'function') {
            _footer += " / " + totalPagesExp;
        }
        doc.setFontSize(10);
        doc.text(_footer, doc.internal.pageSize.width / 2 - 5, doc.internal.pageSize.height - 10);
      };
      
      /* add table data. */
      doc.autoTable(columns, data, { 
        startY: 50,
        styles: {
          cellPadding: 0.5,
          fontSize: 6,
          halign: "center",
        },
        headerStyles: {
          font: "simhei",
          fontStyle: "normal",
          cellPadding: 0.5,
          fillColor: [200, 200, 200], 
          textColor: [50, 50, 50],
          fontSize: 6
        },
        addPageContent: pageContent,
        theme: "grid",
        drawHeaderCell: function(cell, data) {  
          if (attr_id < 2) {
            if (data.column.index <= 2) {
              if (data.column.index == 0) {
                headerIdx = 0;
              } 
              doc.rect(
                cell.x,
                cell.y - cell.height,
                cell.width,
                cell.height * 2,
                "B"
              );
              doc.autoTableText(
                headerText[headerIdx++],
                cell.x + cell.width / 2,
                cell.y,
                {
                  halign: "center",
                  valign: "middle",
                }
              );
              return false;
            }

            if (data.column.index % 3 == 2 && data.column.index > 3) {
              doc.rect(
                fCellX,
                cell.y - cell.height,
                cell.x + cell.width - fCellX,
                cell.height,
                "B"
              );
              doc.rect(cell.x, cell.y, cell.width, cell.height, "B");
              
              doc.autoTableText(
                headerText[headerIdx],
                (fCellX + cell.x + cell.width) / 2,
                cell.y - cell.height / 2,
                {
                  halign: "center",
                  valign: "middle",
                }
              );
              doc.autoTableText(
                cell.raw,
                cell.x + cell.width / 2,
                cell.y + cell.height / 2,
                {
                  halign: "center",
                  valign: "middle",
                }
              );
              headerIdx++;
              return false;
            }
            if (data.column.index % 3 == 0) {
              fCellX = cell.x;
            }
          }

          return true;
        },
        drawCell: function (cell, data) {
          if (data.column.index == 1) {
            if(oPageCount != data.pageCount) {
              rowIdxPage = 0;
              raw = "";
            }
            rowIdxPage++;
            if(data.table.rows.length - 1 == data.row.index || 
              (rowIdxPage == 66 && data.pageCount == 1) || 
              rowIdxPage == 77 || 
              raw != cell.raw) {
              if(raw != "") {
                doc.rect(cell.x, fCellY, cell.width, cell.height * cellIdx, 'B');
                doc.autoTableText(raw, cell.x + cell.width / 2, fCellY - 1.3 + cell.height * cellIdx / 2, {
                  halign: 'center',
                  valign: 'center',
                })
              }
              raw = cell.raw;
              fCellY = cell.y;
              cellIdx = 1;
            }
            oPageCount = data.pageCount;
            cellIdx++;
            return false;
          }
        }
      });
      
      doc.save(this.attrOptions[this.attr_id - 1].tableTitle + ".pdf");
    },

    handleClose() {
      this.$store.dispatch("setVisblesFlag", [
        { key: "measureDialog", value: false }
      ]);
    },

    imgToBase64(src, callback) {
      var outputFormat = src.substr(-3) === "png" ? "image/png" : "image/jpeg";
      var img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = function() {
        var canvas = document.createElement("CANVAS");
        var ctx = canvas.getContext("2d");
        var dataURL;
        canvas.height = this.naturalHeight;
        canvas.width = this.naturalWidth;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
      };
      img.src = src;
      if (img.complete || img.complete === undefined) {
        img.src =
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        img.src = src;
      }
    },

    fontToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },

    createTable() {
      var tmp = this.tempData;

      var attrOption = this.attrOptions[this.attr_id - 1];
      var type = attrOption.type;
      var where = attrOption.where;
      var keysInDB = attrOption.keysInDB;

      var data = [];

      if (type == 1) {
        tmp.forEach((item, index) => {
          var attributes = JSON.parse(item.attributes);
          var dataEntry = [];
          dataEntry.push(index + 1);
          dataEntry.push(moment(item.time).format("YYYY/MM/DD"));
          dataEntry.push(moment(item.time).format("HH:mm"));

          for (var i = 0; i < 4; i++) {
            var temper = attributes.hasOwnProperty("temp" + i)
              ? Math.round(attributes["temp" + i]) + " °C"
              : "--/--";
            var humid = attributes.hasOwnProperty("humid" + i)
              ? Math.round(attributes["humid" + i]) + " %"
              : "--/--";
            var stemper = attributes.hasOwnProperty("stemp" + i) ? Math.round(attributes["stemp" + i]) + "°C" : "--";
            var shumid = attributes.hasOwnProperty("shumid" + i) ? Math.round(attributes["shumid" + i]) + "%" : "--";

            dataEntry.push(temper);
            dataEntry.push(humid);
            
            dataEntry.push(
              stemper + "/" + shumid
            );
          }
          data.push(dataEntry);
        });
      } else {
        tmp.forEach((item, index) => {
          var dataEntry = [];
          dataEntry.push(index + 1);
          dataEntry.push(moment(item.time).format("YYYY/MM/DD"));
          dataEntry.push(moment(item.time).format("HH:mm"));

          var attributes = JSON.parse(item.attributes);
          var key = keysInDB[0];
          var value = where == "attributes" ? attributes[key] : item[key];
          if (typeof value != undefined) {
            if (type == 2) {
              dataEntry.push(value.toFixed(1) + " " + attrOption.unit);
            } else {
              dataEntry.push(value == 1 ? "ON" : "OFF");
            }
            data.push(dataEntry);
          }
        });
      }
      return data;
    }
  },

  computed: {
    attrOptions() {
      return [
        {
          value: 1,
          label: this.$t("report.temper"),
          keysInDB: ["temp0", "temp1", "temp2", "temp3"],
          where: "attributes",
          type: 1,
          title: this.$t("report.temper") + this.$t("report.statistics"),
          unit: "°C",
          // columns: ["No", "Time", "Temperature", "Humidity", "Expected", "Temperature", "Humidity", "Expected", "Temperature", "Humidity", "Expected", "Temperature", "Humidity", "Expected"],
          columns: [
            this.$t("report.number"),
            this.$t("report.time"),
            "",
            this.$t("report.temper"),
            this.$t("report.humidity"),
            this.$t("report.expected"),
            this.$t("report.temper"),
            this.$t("report.humidity"),
            this.$t("report.expected"),
            this.$t("report.temper"),
            this.$t("report.humidity"),
            this.$t("report.expected"),
            this.$t("report.temper"),
            this.$t("report.humidity"),
            this.$t("report.expected"),
          ],
          tableTitle: this.$t("report.tempHumidReport")
        },
        {
          value: 2,
          label: this.$t("report.humidity"),
          keysInDB: ["humid0", "humid1", "humid2", "humid3"],
          where: "attributes",
          type: 1,
          title: this.$t("report.humidity") + this.$t("report.statistics"),
          unit: "%",
          // columns: ["No", "Time", "Temperature", "Humidity", "Expected", "Temperature", "Humidity", "Expected", "Temperature", "Humidity", "Expected", "Temperature", "Humidity", "Expected"],
          columns: [
            this.$t("report.number"),
            this.$t("report.time"),
            "",
            this.$t("report.temper"),
            this.$t("report.humidity"),
            this.$t("report.expected"),
            this.$t("report.temper"),
            this.$t("report.humidity"),
            this.$t("report.expected"),
            this.$t("report.temper"),
            this.$t("report.humidity"),
            this.$t("report.expected"),
            this.$t("report.temper"),
            this.$t("report.humidity"),
            this.$t("report.expected"),
          ],
          tableTitle: this.$t("report.tempHumidReport")
        },
        {
          value: 3,
          label: this.$t("report.cooler"),
          keysInDB: ["cooler"],
          where: "attributes",
          type: 3,
          title: this.$t("report.cooler") + this.$t("report.statistics"),
          // columns: ["No", "Time", "Cooler State"],
          columns: [
            this.$t("report.number"),
            this.$t("report.date"),
            this.$t("report.time"),
            this.$t("report.coolerState")   
          ],
          tableTitle: this.$t("report.coolerOpsReport")   
        },
        {
          value: 4,
          label: this.$t("report.fuel"),
          keysInDB: ["fuel"],
          where: "attributes",
          type: 2,
          title: this.$t("report.fuel") + this.$t("report.statistics"),
          unit: "%",
          // columns: ["No", "Time", "Fuel Quantity"],
          columns: [
            this.$t("report.number"),
            this.$t("report.date"),
            this.$t("report.time"),
            this.$t("report.fuel")   
          ],
          tableTitle: this.$t("report.fuelQuantityReport")   
        },
        {
          value: 5,
          label: this.$t("report.batteryV"),
          keysInDB: ["voltage"],
          where: "attributes",
          type: 2,
          title: this.$t("report.batteryV") + this.$t("report.statistics"),
          unit: "V",
          // columns: ["No", "Time", "Battery Voltage"],
          columns: [
            this.$t("report.number"),
            this.$t("report.date"),
            this.$t("report.time"),
            this.$t("report.batteryV")   
          ],
          tableTitle: this.$t("report.batteryVReport")   
        },
        {
          value: 6,
          label: this.$t("report.door"),
          keysInDB: ["door"],
          where: "attributes",
          type: 3,
          title: this.$t("report.door") + this.$t("report.statistics"),
          // columns: ["No", "Time", "Door State"],
          columns: [
            this.$t("report.number"),
            this.$t("report.date"),
            this.$t("report.time"),
            this.$t("report.doorState")   
          ],
          tableTitle: this.$t("report.accessReport")   
        },
        {
          value: 7,
          label: this.$t("report.vibrate"),
          keysInDB: ["vibrate"],
          where: "attributes",
          type: 3,
          title: this.$t("report.vibrate") + this.$t("report.statistics"),
          // columns: ["No", "Time", "Parking"],
          columns: [
            this.$t("report.number"),
            this.$t("report.date"),
            this.$t("report.time"),
            this.$t("report.vibrate")   
          ],
          tableTitle: this.$t("report.vibrateReport")   
        },
        {
          value: 8,
          label: this.$t("report.batteryL"),
          keysInDB: ["battery"],
          where: "attributes",
          type: 2,
          title: this.$t("report.batteryL") + this.$t("report.statistics"),
          unit: "%",
          // columns: ["No", "Time", "Battery Level"],
          columns: [
            this.$t("report.number"),
            this.$t("report.date"),
            this.$t("report.time"),
            this.$t("report.batteryL")   
          ],
          tableTitle: this.$t("report.batteryLReport") 
        },
        {
          value: 9,
          label: this.$t("report.power"),
          keysInDB: ["power"],
          where: "attributes",
          type: 3,
          title: this.$t("report.power") + this.$t("report.statistics"),
          // columns: ["No", "Time", "Power State"],
          columns: [
            this.$t("report.number"),
            this.$t("report.date"),
            this.$t("report.time"),
            this.$t("report.power")   
          ],
          tableTitle: this.$t("report.powerReport") 
        },
        {
          value: 10,
          label: this.$t("report.speed"),
          keysInDB: ["speed"],
          where: "position",
          type: 2,
          title: this.$t("report.speed") + this.$t("report.statistics"),
          unit: "Km/h",
          // columns: ["No", "Time", "Speed"],
          columns: [
            this.$t("report.number"),
            this.$t("report.date"),
            this.$t("report.time"),
            this.$t("report.speed")   
          ],
          tableTitle: this.$t("report.speedReport") 
        }
      ];
    },

    pickerOptions2() {
      return {
        shortcuts: [
          {
            text: this.$t("common.lastWeek"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: this.$t("common.lastMonth"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: this.$t("common.last3Month"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      };
    },
      
    startAndEnd: {
      get: function() {
        this.isDateChanged = true;
        return [this.start, this.end];
      },
      set: function(newValue) {
        this.start = newValue[0];
        this.end = newValue[1];
      }
    },

    startFormated() {
      return moment(this.start).format("YYYY-MM-DD HH:mm");
    },

    endFormated() {
      return moment(this.end).format("YYYY-MM-DD HH:mm");
    }
  },
  watch: {
    "$store.state.user.visibles.reportDialogRef": function(nv, ov) {
      if(nv) {
        this.device_id = this.$store.state.user.devices.selectId;
        this.attr_id = 10;
        this.initChartValues();
        this.$store.dispatch("setVisblesFlag", [
          { key: "reportDialogRef", value: false}
        ]);
      }
      else {

      }
    }
  },
};
</script>

<style>
#table-print > table {
  border-spacing: 0px !important;
}

#table-print thead {
  background-color: #ddd;
}

#table-print td,
#table-print th {
  border: 1px solid gray;
  text-align: center;
  font-size: 9px;
}

#measure-dlg {
  position: absolute;
  width: 60%;
  height: 80%;
  min-height: 500px;
  top: 10%;
  left: 20%;
  padding: 30px 50px;
  background-color: rgba(255, 255, 255, 0.8);
  overflow-y: auto;
  border: 1px solid #aaa;
  border-radius: 8px;
  /* box-shadow: 0px 0px 5px 5px rgba(100, 100, 100, 0.5); */
}

#measure-dlg::-webkit-scrollbar {
  width: 7px;
}

#measure-dlg::-webkit-scrollbar-track {
  /* -webkit-box-shadow: inset 0 0 6px rgba(100, 100, 100, 0.3); */
}

#measure-dlg::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background-color: #aaa;
  outline: 1px solid slategrey;
}

.filter-wrapper {
  text-align: center;
}

.chart-title {
  text-align: center;
}

.chart-wrapper {
  background: #fff;
  padding: 16px 16px 0;
  margin-bottom: 32px;
}

.statistics-title {
  text-align: center;
}

.device-info-wrapper {
  width: 100%;
  /* padding: 20px 0; */
  display: block;
  overflow: auto;
  background-color: white;
}

.device-info-wrapper .logo-wrapper {
  width: 20%;
  padding: 20px 10px;
  float: left;
}

.device-info-wrapper .info-wrapper {
  width: 80%;
  padding: 10px 10px;
  float: left;
  overflow: hidden;
}

.info-element {
  padding: 5px 8px;
  font-size: 16px;
  line-height: 35px;
  width: 30%;
  word-break: keep-all;
}

.device-id {
  width: 100px;
}
.attr-id {
  width: 160px;
}
.filter-wrapper .el-range-separator {
  padding: 1px;
  width: auto;
}
.filter-wrapper .el-date-editor {
  width: 250px;
}
.interval {
  width: 80px;
}
#measure-dlg .close-btn {
  border: none;
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: transparent;
  font-size: 15px;
}
</style>
