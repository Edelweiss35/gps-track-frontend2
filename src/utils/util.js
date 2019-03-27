import moment from "moment";
import store from "../vuex/store";
import "../assets/css/iconfont/iconfont";
import conver from "./conver";
import messages from "../i18n/langs/index";
export default {
  popupFooter: function(attributes) {
    let footer = "";

    // temperature
    footer += "<table>";
    footer += "<tr>";
    for (var i = 0; i < 4; i++) {
      var temperatureTxt = "";
      if (
        attributes["temp" + i] &&
        store.state.common.setting.bubbleShow.temperature
      ) {
        if (store.state.common.setting.tempUnit == "°F") {
          temperatureTxt += Math.round(attributes["temp" + i] * 1.8 + 32);
        } else {
          temperatureTxt += Math.round(attributes["temp" + i]);
        }
        temperatureTxt += store.state.common.setting.tempUnit;
      } else temperatureTxt = "--" + store.state.common.setting.tempUnit;
      footer =
        footer +
        "<td><span title='Temperature " +
        (i + 1) +
        '\'> <i class="fa fa-thermometer-three-quarters bubble-icon"></i>&nbsp; ' +
        temperatureTxt +
        "</span></td>";
    }
    footer += "</tr>";

    // Humidity
    footer += "<tr>";
    for (var i = 0; i < 4; i++) {
      var humidTxt = "";
      if (
        attributes["humid" + i] &&
        store.state.common.setting.bubbleShow.temperature
      ) {
        humidTxt = Math.round(attributes["humid" + i]) + "%";
      } else humidTxt = "--" + "%";
      footer =
        footer +
        "<td><span  title='Humidity " +
        (i + 1) +
        '\'> <i class="fa fa-tint bubble-icon"></i>&nbsp; ' +
        humidTxt +
        "</span></td>";
    }
    footer += "</tr>";

    // battery
    footer += "<tr>";
    footer =
      footer +
      (store.state.common.setting.bubbleShow.battery
        ? "<td><div  title='Battery Level: " +
          (attributes.battery ? attributes.battery : "--") +
          "%'  data-charge=\"" +
          Math.round((attributes.battery / 100) * 6) +
          '" class="battery"></div> &nbsp;'
        : "");
    footer =
      footer +
      (attributes.voltage && store.state.common.setting.bubbleShow.battery
        ? Math.round(attributes.voltage) + "V</td>"
        : "");

    // power
    footer =
      footer +
      (!attributes.hasOwnProperty("power") ||
      !store.state.common.setting.bubbleShow.power
        ? ""
        : "<td><span  title='Power'> <i class=\"fa fa-plug bubble-icon icon-" +
          (attributes.power == 1 ? "normal" : "alert") +
          '"></i> &nbsp;' +
          (attributes.power == 1 ? "ON" : "OFF") +
          "</span></td>");

    // cooler
    footer =
      footer +
      (!attributes.hasOwnProperty("cooler")
        ? ""
        : '<td><span  title=\'Fan\'> <svg aria-hidden="true"  class="bubble-icon icon-' +
          (attributes.cooler == 1 ? "normal" : "alert") +
          '"><use xlink:href="#icon-fan"></use></svg> &nbsp;' +
          (attributes.cooler == 1 ? "ON" : "OFF") +
          "</span></td>");

    // door
    footer =
      footer +
      (!attributes.hasOwnProperty("door")
        ? ""
        : '<td><span  title=\'Door\'> <svg aria-hidden="true"  class="bubble-icon icon-' +
          (attributes.door == 1 ? "normal" : "alert") +
          '"><use xlink:href="#icon-' +
          (attributes.door == 0 ? "lockopen" : "lockclose") +
          '"></use></svg> &nbsp;' +
          (attributes.door == 1 ? "Close" : "Open") +
          "</span></td>");
    footer += "</tr>";

    // fuel
    footer += "<tr>";
    footer =
      footer +
      (!attributes.hasOwnProperty("fuel")
        ? ""
        : '<td><span  title=\'Fuel\'> <svg aria-hidden="true"  class="bubble-icon"><use xlink:href="#icon-fuel"></use>&nbsp;</svg> &nbsp;' +
          Math.round(attributes.fuel) +
          "%" +
          "</span></td>");

    footer =
      footer +
      (attributes.ignition == undefined
        ? ""
        : "" +
          (attributes.ignition
            ? "<td><span title='ACC:" +
              attributes.ignition +
              '\'> <svg aria-hidden="true"  class="bubble-icon"><use xlink:href="#icon-fadongji"></use></svg>&nbsp;</span></td>'
            : "<td><span title='ACC:" +
              attributes.ignition +
              '\'> <svg aria-hidden="true"  class="bubble-icon"><use xlink:href="#icon-fadongji"></use></svg>&nbsp;</span></td>'));
    footer =
      footer +
      (attributes.defense == undefined
        ? ""
        : "" +
          (attributes.defense
            ? '<td><span title=\'设防\'> <svg aria-hidden="true"  class="bubble-icon"><use xlink:href="#icon-lockclose"></use></svg>&nbsp;</span></td>'
            : '<td><span title=\'撤防\'> <svg aria-hidden="true"  class="bubble-icon"><use xlink:href="#icon-lockopen"></use></svg>&nbsp;</span></td>'));

    footer =
      footer +
      (!attributes.turn
        ? ""
        : '<td><span title=\'正反转\'> <svg aria-hidden="true"  class="bubble-icon"><use xlink:href="#icon-jiaobanche"></use></svg>&nbsp;' +
          attributes.turn +
          "</span></td>");
    footer += "</tr></table>";
    // footer =
    //   footer +
    //   (!attributes.fuelPercentage
    //     ? ''
    //     : '<span title=\'油量\'><svg aria-hidden="true"  class="bubble-icon"><use xlink:href="#icon-fuel"></use></svg>' +
    //       attributes.fuelPercentage +
    //       '%</span>')
    if (footer != "") {
      footer =
        "<hr style='height:1px;border:none;border-top:1px dashed #0066CC;'>" +
        footer;
    }
    return footer;
  },
  popupTopRight: function(position) {
    var html = "";
    var attributes = JSON.parse(position.attributes);
    if (attributes.rssi) {
      html =
        '<svg title=\'GSM信号\' class="icon" aria-hidden="true"><use xlink:href="#icon-gongyong-xinhao' +
        attributes.rssi +
        '"></use></svg>';
    }
    html =
      html +
      (position.mode == 0
        ? '<span title=\'GPS定位\'><svg aria-hidden="true"  class="bubble-icon"><use xlink:href="#icon-gps"></use></svg><span>' +
          (!attributes.sat
            ? ""
            : ' <span style="font-size : 0.8em;">' + attributes.sat + "</span>")
        : position.mode == 1
        ? '<svg aria-hidden="true"  class="bubble-icon"><use xlink:href="#icon-jizhan"></use></svg>' +
          (!position.accuracy
            ? ""
            : '<span style="font-size : 0.3em;">' +
              position.accuracy +
              "m</span>")
        : '<svg aria-hidden="true"  class="bubble-icon"><use xlink:href="#icon-wifi"></use></svg>');

    return html;
  },
  popupContent: function(device) {
    var attributes = JSON.parse(device.position.attributes);

    var speed =
      store.state.common.setting.speedUnit == "MPH"
        ? device.position.speed * 0.62
        : device.position.speed;
    var todayTrip =
      store.state.common.setting.speedUnit == "MPH"
        ? attributes.todaytrip * 0.62
        : attributes.todaytrip;
    var trip =
      store.state.common.setting.speedUnit == "MPH"
        ? attributes.trip * 0.62
        : attributes.trip;
    var distanceUnit =
      store.state.common.setting.speedUnit == "MPH" ? "miles" : "km";

    return [
      messages[store.state.common.system.lang].map.popupStatus +
        ":  " +
        (device.motion == 1
          ? speed +
            " " +
            store.state.common.setting.speedUnit.toLowerCase() +
            " (" +
            this.formartCourse(device.position.course) +
            ")"
          : messages[store.state.common.system.lang].map.popupStop +
            "(" +
            this.beforeTime(device.position.time) +
            ")") +
        (attributes.alarm ? "[" + attributes.alarm + "]" : ""),
      messages[store.state.common.system.lang].map.popupMileage +
        ":  " +
        (todayTrip ? todayTrip : 0) +
        "/" +
        (trip ? trip : 0) +
        " " +
        distanceUnit,
      messages[store.state.common.system.lang].common.time +
        ":  " +
        this.dateFormat(device.position.time, "YYYY-MM-DD HH:mm:ss")
    ];
  },
  bubble: function(
    name,
    motion,
    speed,
    course,
    accuracy,
    mode,
    time,
    state,
    position
  ) {
    return (
      "<ul><li><b>" +
      name +
      '</b><span class="bubble-mode">' +
      (state.rssi
        ? ' &nbsp;<svg title=\'GSM信号\' class="icon" aria-hidden="true"><use xlink:href="#icon-gongyong-xinhao' +
          state.rssi +
          '"></use></svg>'
        : "") +
      (mode == 0
        ? " <i title='GPS定位' class=\"iconfont icon-height-light-6\"></i>" +
          (!state.sat
            ? ""
            : ' <span style="font-size : 0.3em;">' + state.sat + "</span>")
        : mode == 1
        ? " <i title='基站' class=\"iconfont icon-jizhan\"></i>" +
          (!accuracy
            ? ""
            : '<span style="font-size : 0.3em;">' + accuracy + "m</span>")
        : mode == 2
        ? " <i title='wifi' class=\"iconfont icon-wifi\"></i>" +
          (!accuracy
            ? ""
            : '<span style="font-size : 0.3em;">' + accuracy + "m</span>")
        : "") +
      "</span></li>" +
      "<li>状态:" +
      (motion == 1
        ? parseInt(speed) + "km/h (" + this.formartCourse(course) + ")"
        : "静止(" + this.beforeTime(time) + ")") +
      (state.alarm
        ? "[<font color=red>" +
          store.state.user.alarms[state.alarm] +
          "</font>]"
        : "") +
      " </li>" +
      "<li>里程:" +
      (state.todaytrip ? state.todaytrip : 0) +
      "/" +
      (state.trip ? state.trip : 0) +
      "km</li>" +
      "<li>时间:" +
      this.dateFormat(time, "YYYY-MM-DD HH:mm:ss") +
      "</li>" +
      "<li>时间:" +
      this.dateFormat(time, "YYYY-MM-DD HH:mm:ss") +
      "</li>" +
      this.state(state) +
      "</ul>"
    );
  },
  state: function(state) {
    if (state) {
      return (
        "<li>" +
        (state.battery
          ? "<div title='电量" +
            state.battery +
            "%' data-charge=\"" +
            Math.round((state.battery / 100) * 6) +
            '" class="battery"></div> '
          : "") +
        (!state.voltage
          ? ""
          : "<i title='电压' class=\"fa fa-plug\"></i>" + state.voltage + "v") +
        (!state.ignition
          ? ""
          : "" +
            (state.ignition
              ? "<span title='ACC:" +
                state.ignition +
                '\'><svg aria-hidden="true"  class="bubble-icon"><use xlink:href="#icon-fadongji"></use></svg></span>'
              : "<span title='ACC:" +
                state.ignition +
                '\'><svg aria-hidden="true"  class="bubble-icon"><use xlink:href="#icon-fadongji"></use></svg></span>')) +
        (!state.defense
          ? ""
          : "" +
            (state.defense
              ? '<span title=\'设防\'><svg aria-hidden="true"  class="bubble-icon"><use xlink:href="#icon-lockclose"></use></svg></span>'
              : '<span title=\'撤防\'><svg aria-hidden="true"  class="bubble-icon"><use xlink:href="#icon-lockopen"></use></svg></span>')) +
        (!state.temp
          ? ""
          : '<span title=\'温度\'><svg aria-hidden="true"  class="bubble-icon"><use xlink:href="#icon-temp"></use></svg>' +
            state.temp +
            "℃</span>") +
        (!state.temp0
          ? ""
          : '<span title=\'温度0\'><svg aria-hidden="true"  class="bubble-icon"><use xlink:href="#icon-temp"></use></svg>' +
            state.temp0 +
            "℃</span>") +
        (!state.temp1
          ? ""
          : '<span title=\'温度1\'><svg aria-hidden="true"  class="bubble-icon"><use xlink:href="#icon-temp"></use></svg>' +
            state.temp1 +
            "℃</span>") +
        (!state.temp2
          ? ""
          : '<span title=\'温度2\'><svg aria-hidden="true"  class="bubble-icon"><use xlink:href="#icon-temp"></use></svg>' +
            state.temp2 +
            "℃</span>") +
        (!state.temp3
          ? ""
          : '<span title=\'温度3\'><svg aria-hidden="true"  class="bubble-icon"><use xlink:href="#icon-temp"></use></svg>' +
            state.temp3 +
            "℃</span>") +
        (!state.turn
          ? ""
          : '<span title=\'正反转\'><svg aria-hidden="true"  class="bubble-icon"><use xlink:href="#icon-jiaobanche"></use></svg>' +
            store.state.user.deviceStates[state.turn] +
            "</span>") +
        (!state.fuelPercentage
          ? ""
          : '<span title=\'油量\'><svg aria-hidden="true"  class="bubble-icon"><use xlink:href="#icon-fuel"></use></svg>' +
            state.fuelPercentage +
            "%</span>") +
        (!state.image
          ? ""
          : '<span title=\'照片\' class="show-image"><svg aria-hidden="true"  class="bubble-icon"><use xlink:href="#icon-photo"></use></svg><div id="img-popup"><img src="http://oss.taiyangos.com/device-media/014143372469/' +
            state.image +
            '"/></div></span>') +
        "</li>"
      );
    } else {
      return "";
    }
  },

  formartCourse: function(course) {
    if (course <= 5 || course > 355) {
      return messages[store.state.common.system.lang].map.popupNorth;
    } else if (course > 5 && course <= 85) {
      return messages[store.state.common.system.lang].map.popupNorthEast;
    } else if (course > 85 && course <= 95) {
      return messages[store.state.common.system.lang].map.popupEast;
    } else if (course > 95 && course <= 175) {
      return messages[store.state.common.system.lang].map.popupSouthEast;
    } else if (course > 175 && course <= 185) {
      return messages[store.state.common.system.lang].map.popupSouth;
    } else if (course > 185 && course <= 265) {
      return messages[store.state.common.system.lang].map.popupSouthWest;
    } else if (course > 265 && course <= 275) {
      return messages[store.state.common.system.lang].map.popupWest;
    } else if (course > 275 && course <= 355) {
      return messages[store.state.common.system.lang].map.popupNorthWest;
    } else {
      return "未知";
    }
  },
  //时间格式化
  dateFormat: function(t, f) {
    if (t == undefined) {
      return "";
    }
    return moment(t).format(f);
  },
  //获取前多少天的日期
  getBefareDay: function(d) {
    return moment()
      .subtract(d, "days")
      .hour(0)
      .minute(0)
      .second(0);
  },
  motion: function(time) {
    var now = moment();
    var then = moment(time);
    if (now.diff(then, "minute") <= 5) {
      return 1;
    } else {
      return 0;
    }
  },
  beforeTime: function(val) {
    let nowDate = new Date();
    let replyDate = new Date(val);
    let diffSeconds = (nowDate.getTime() - Number(replyDate.getTime())) / 1000;
    let years = 365 * 24 * 60 * 60;
    let months = 30 * 24 * 60 * 60;
    let days = 24 * 60 * 60;
    let hours = 60 * 60;
    let minutes = 60;
    let seconds = 1;
    if (diffSeconds < seconds) {
      return "1秒以前";
    } else if (seconds <= diffSeconds && diffSeconds < minutes) {
      return (
        Math.floor(diffSeconds / seconds) +
        messages[store.state.common.system.lang].map.popupSecond
      );
    } else if (minutes <= diffSeconds && diffSeconds < hours) {
      return (
        Math.floor(diffSeconds / minutes) +
        messages[store.state.common.system.lang].map.popupMinute
      );
    } else if (hours < diffSeconds && diffSeconds < days) {
      return (
        Math.floor(diffSeconds / hours) +
        messages[store.state.common.system.lang].map.popupHour
      );
    } else if (days < diffSeconds && diffSeconds < months) {
      return (
        Math.floor(diffSeconds / days) +
        messages[store.state.common.system.lang].map.popupDay
      );
    } else if (months < diffSeconds && diffSeconds < years) {
      return (
        Math.floor(diffSeconds / months) +
        messages[store.state.common.system.lang].map.popupMonth
      );
    } else {
      return (
        Math.floor(diffSeconds / years) +
        messages[store.state.common.system.lang].map.popupYear
      );
    }
  },
  stopTime: function(diff) {
    let years = 365 * 24 * 60 * 60;
    let months = 30 * 24 * 60 * 60;
    let days = 24 * 60 * 60;
    let hours = 60 * 60;
    let minutes = 60;
    if (minutes <= diff && diff < hours) {
      return (
        Math.floor(diff / minutes) +
        " " +
        messages[store.state.common.system.lang].map.popupMinute
      );
    } else if (hours < diff && diff < days) {
      return (
        Math.floor(diff / hours) +
        " " +
        messages[store.state.common.system.lang].map.popupHour
      );
    } else if (days < diff && diff < months) {
      return (
        Math.floor(diff / days) +
        " " +
        messages[store.state.common.system.lang].map.popupDay
      );
    } else if (months < diff && diff < years) {
      return (
        Math.floor(diff / months) +
        " " +
        messages[store.state.common.system.lang].map.popupMonth
      );
    } else {
      return (
        Math.floor(diff / years) +
        " " +
        messages[store.state.common.system.lang].map.popupYear
      );
    }
  },
  fullScreen: function() {
    //全屏显示
    var docElm = document.documentElement;
    //W3C
    if (docElm.requestFullscreen) {
      docElm.requestFullscreen();
    }
    //FireFox
    else if (docElm.mozRequestFullScreen) {
      docElm.mozRequestFullScreen();
    }
    //Chrome等
    else if (docElm.webkitRequestFullScreen) {
      docElm.webkitRequestFullScreen();
    }
    //IE11
    else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else {
      "您的浏览器版本过低,暂不支持此操作</br>请升级浏览器后再操作".showTips();
    }
  },
  exitFullScreen: function() {
    //退出全屏
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else {
      "您的浏览器版本过低,暂不支持此操作</br>请升级浏览器后再操作".showTips();
    }
  },

  /**
   * 将list装换成tree
   * @param {Object} myId 数据主键id
   * @param {Object} pId  数据关联的父级id
   * @param {Object} list list集合
   */
  listToTree: function(myId, pId, list) {
    function exists(list, parentId) {
      for (var i = 0; i < list.length; i++) {
        if (list[i][myId] == parentId) return true;
      }
      return false;
    }
    list.map(item => {
      return Object.assign(item, { label: item.name, value: item.id });
    });

    var nodes = [];
    // get the top level nodes
    for (var i = 0; i < list.length; i++) {
      var row = list[i];
      if (!exists(list, row[pId])) {
        if (row.children) {
          delete row.children;
        }
        nodes.push(row);
      }
    }

    var toDo = [];
    for (var i = 0; i < nodes.length; i++) {
      toDo.push(nodes[i]);
    }
    while (toDo.length) {
      var node = toDo.shift(); // the parent node
      // get the children nodes
      for (var i = 0; i < list.length; i++) {
        var row = list[i];
        if (row[pId] == node[myId]) {
          //var child = {id:row.id,text:row.name};
          if (node.children) {
            node.children.push(row);
          } else {
            node.children = [row];
          }
          toDo.push(row);
        }
      }
    }
    return nodes;
  },

  //按日查询
  getDayAll: function(start_time, end_time) {
    var bd = new Date(start_time),
      be = new Date(end_time);
    var bd_time = bd.getTime(),
      be_time = be.getTime(),
      time_diff = be_time - bd_time;
    var d_arr = [];
    for (var i = 0; i <= time_diff; i += 86400000) {
      var ds = new Date(bd_time + i);
      d_arr.push(this.dateFormat(ds, "YYYY-MM-DD"));
    }
    return d_arr;
  },
  //行政区域围栏提取边界经纬度
  districtGeofence: function(bounds) {
    // console.log(bounds);
    var areaPoints = "";
    var bound = bounds[0];
    var points = [];
    for (var i = 1; i < bounds.length; i++) {
      if (bound.length < bounds[i].length) bound = bounds[i];
    }
    //console.log("bound.length="+bound.length);
    var mod = 1;
    if (bound.length > 160) {
      mod = Math.ceil(bound.length / 160);
    }
    //console.log("mod="+mod);
    for (var i = 0; i < bound.length; i++) {
      if (i % mod == 0) {
        var point = conver.gcj02towgs84(bound[i].lng, bound[i].lat);
        points.push(point[1].toFixed(6) + " " + point[0].toFixed(6));
      }
    }
    //console.log("points.length="+points.length);
    var area = points.join(", ");
    //console.log("area.length="+area.length);
    //console.log(area);
    return area;
  }
  ////////////////////////////////////////////////////////////////////////
};
