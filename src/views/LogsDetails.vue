<template>
  <div class="page-wrapper">
    <div class="mobile-menu">
      <i class="icon icon-mobile-menu"></i>
    </div>

    <div class="content-area" style="height: 100%;">
      <div class="relative">
        <div
          class="content-wrapper"
          v-loading="isLoading"
          element-loading-text="Loading..."
        >
          <div class="router-view">
            <div class="sec-title">
              <h1>
                Logs Details for
                {{ type == update ? "Update" : "Sync And Update" }}
              </h1>
              <h2>Log Events({{ totalEvents }})</h2>
            </div>

            <div class="content-area__content">
              <div class="compare-table">
                <div class="log-details">
                  <div class="log-details-row clearfix log-details-header">
                    <div class="log-details-col" @click="allSelectedToggle">
                      <span
                        :class="
                          isAllSelected() == true
                            ? 'arrow-right arrow-down'
                            : 'arrow-right'
                        "
                      ></span>
                    </div>
                    <div class="log-details-col time">Timestamp</div>
                    <div class="log-details-col message">Message</div>
                  </div>

                  <div
                    class="log-details-row clearfix"
                    v-for="(row, index) in events"
                    :key="index"
                  >
                    <div
                      class="log-details-col"
                      @click="selectedRowToggle(index)"
                    >
                      <span
                        :title="row.message"
                        :class="
                          isAvailable(index) > -1
                            ? 'arrow-right arrow-down'
                            : 'arrow-right'
                        "
                      ></span>
                    </div>
                    <div class="log-details-col time">
                      {{ timeConverter(row.timestamp) }}
                    </div>
                    <div class="log-details-col message">
                      <span :title="row.message">{{ row.message }}</span>
                    </div>
                    <div
                      :class="
                        isAvailable(index) > -1 ? 'displayBlock' : 'displayNone'
                      "
                      :id="'row' + index"
                    >
                      <span >{{ row.message }} </span>
                    </div>
                  </div>

                <div class="log-details-col message " :if="this.events.length==0">
                  <span>No logs at this moment</span>
                </div>


                  <!-- <div class="prevNext">
                    <span>
                      <a v-if="nextBackwardToken" @click="prevData"> prev </a>
                      <span v-else> prev </span>
                    </span>
                    .........
                    <span>
                      <a v-if="nextForwardToken" @click="nextData"> next </a>
                      <span v-else> next </span>
                    </span>
                  </div> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "LogsDetails",
  components: {},
  data() {
    return {
      update: 1,
      syncUpdate: 2,
      type: this.$route.params.type,
      totalEvents: 0,
      events: [],
      nextToken: null,
      nextBackwardToken: "",
      nextForwardToken: "",
      params: {
        limit: 50,
        logGroupName: "/aws/lambda/AssetSyncRuleExecute",
        logStreamName: this.$route.params.name.replaceAll("%2F", "/").replaceAll("%5B", "[").replaceAll("%5D", "]"),
        nextToken: null,
        startFromHead: true,
      },
      isLoading: false,
      selectedRow: [],
    };
  },
  mounted() {
    this.loadUpdate();
  },
  computed: {
    ...mapState({
      updatGetLogEvents: (state) => state.logsRecord.updateGetLogEventsData,
    }),
  },
  watch: {
    updatGetLogEvents() {
      this.isLoading = true;
      //console.log(this.updatGetLogEvents);
      if (
        this.updatGetLogEvents &&
        this.updatGetLogEvents.isUpdatedUpdateGetLogEventsData == true
      ) {
        this.isLoading = false;
        this.events = this.updatGetLogEvents.responseData.events;
        this.totalEvents = this.events.length;
        this.nextBackwardToken = this.updatGetLogEvents.responseData
          .nextBackwardToken
          ? this.updatGetLogEvents.responseData.nextBackwardToken
          : null;
        this.nextForwardToken = this.updatGetLogEvents.responseData
          .nextForwardToken
          ? this.updatGetLogEvents.responseData.nextForwardToken
          : null;
      }

      if (
        this.updatGetLogEvents &&
        this.updatGetLogEvents.isUpdatedUpdateGetLogEventsData == true
      ) {
        this.isLoading = false;
      }
    },
  },
  methods: {
    allSelectedToggle() {
      if (!this.isAllSelected() && this.events) {
        this.selectedRow = []
        for (let index = 0; index < this.events.length; index++) {
          this.addIndex(index);
        }
      }
      else{
        this.selectedRow = []
      }
      //console.log("this.selectedRow --> ", this.selectedRow);
    },

    isAllSelected() {
      let all = false;
      if (this.events.length > 0 && this.selectedRow.length > 0 && this.selectedRow.length == this.events.length) {
        all = true;
      }
      return all;
    },
    selectedRowToggle(_index) {
      //console.log("_value --> ", _index);
      const index = this.isAvailable(_index);
      //console.log("index --> ", index);
      if (index == -1) {
        this.addIndex(_index);
      } else {
        this.removeIndex(index);
      }
      //console.log("this.selectedRow --> ", this.selectedRow);
    },

    isAvailable(_index) {
      let index = this.selectedRow.indexOf(_index);
      return index;
    },

    addIndex(_value) {
      this.selectedRow.push(_value);
    },

    removeIndex(_index) {
      this.selectedRow.splice(_index, 1);
    },

    loadUpdate() {
      this.isLoading = true;
      //set the default value
      if (this.type == this.syncUpdate) {
        this.params = {
          //limit: 50,
          logGroupName: "/aws/lambda/AssetSyncRuleExecute",
          logStreamName: this.params.logStreamName,
          nextToken: this.nextToken,
          startFromHead: true,
        };
      } else {
        this.params = {
          //limit: 50,
          logGroupName: "/aws/lambda/OdooAssetUpdateExecute",
          logStreamName: this.params.logStreamName,
          nextToken: this.nextToken,
          startFromHead: true,
        };
      }

      this.$store.dispatch(
        "logsRecord/actionFetchUpdateGetLogEventsData",
        this.params
      );
    },

    timeConverter(UNIX_timestamp) {
      var a = new Date(UNIX_timestamp);
      var year = a.getFullYear();
      var month =
        a.getMonth() + 1 >= 10 ? a.getMonth() + 1 : "0" + (a.getMonth() + 1);
      var date = a.getDate() >= 10 ? a.getDate() : a.getDate();
      var hour = a.getHours() >= 10 ? a.getHours() : "0" + a.getHours();
      var min = a.getMinutes() >= 10 ? a.getMinutes() : "0" + a.getMinutes();
      var sec = a.getSeconds() >= 10 ? a.getSeconds() : "0" + a.getSeconds();
      var time =
        year + "/" + month + "/" + date + " " + hour + ":" + min + ":" + sec;
      return time;
    },

    prevData() {
      //this.nextToken = this.nextBackwardToken;
      //this.loadUpdate();
    },

    nextData() {
      //this.nextToken = this.nextForwardToken;
      //this.loadUpdate();
    },
  },
};
</script>

<style>
.log-details {
  margin: 0;
  padding: 0;
}
.log-details .log-details-row {
  margin: 0;
  padding: 0;
  display: block;
  font-size: 14px;
  padding: 8px;
}
.log-details .log-details-row:nth-child(even) {
  background: #fafafa;
}

.log-details .log-details-row .log-details-col:nth-child(1) {
  width: 5%;
  float: left;
}
.log-details .log-details-row .log-details-col:nth-child(2) {
  width: 25%;
  float: left;
}
.log-details .log-details-row .log-details-col:nth-child(3) {
  width: 69%;
  text-overflow: ellipsis;
  overflow: hidden;
  float: left;
  white-space: nowrap;
  transition: 0.3s;
}
.log-details .log-details-row .log-details-col {
  margin: 0;
  padding: 0;
}
.log-details .log-details-row .log-details-col .arrow-right {
  width: 22px;
  height: 22px;

  display: inline-block;
  cursor: pointer;
}
.clearfix:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}

.log-details .mystyle .log-details-col:nth-child(3) {
  width: auto;
  text-overflow: unset;
  overflow: visible;
  float: none;
  white-space: normal;
}

.log-details .log-details-header {
  border-bottom: solid 2px #e2e2e2;
  font-size: 12px;
  font-weight: 600;
}
.prevNext {
  text-align: center;
}
.textCenter {
  text-align: center;
}
h2 {
  font-size: 16px;
}

.displayNone {
  display: none;
}

.displayBlock {
  display: block;
}
</style>
