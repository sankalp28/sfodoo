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
              <h1>Logs Records</h1>
            </div>

            <div class="content-area__content">
              <div class="compare-table">
                <ul class="tabs">
                  <li :class="this.current == this.update ? 'current' : ''">
                    <a @click="loadUpdate">
                      Update
                    </a>
                  </li>
                  <li :class="this.current == this.syncUpdate ? 'current' : ''">
                    <a @click="loadSyncUpdate">
                      Sync and Update
                    </a>
                  </li>
                </ul>
                <div class="logs">
                  <div class="sec-title">
                    <h1>Log streams({{ totalStreams }})</h1>
                  </div>
                  <table class="table">
                    <thead>
                      <tr>
                        <th>
                          <!-- <label class="checkbox">
                            <input
                              type="checkbox"
                              name="showhide"
                              onchange="checkAll(this)"
                            /><span></span>
                          </label> -->
                        </th>
                        <th>Log stream</th>
                        <th>Last event time</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, index) in logStreams" :key="index">
                        <td>
                          <label class="checkbox">
                            <!-- <input
                              type="checkbox"
                              name="check"
                              id="check_1"
                            /><span></span> -->{{index+1}}
                          </label>
                        </td>
                        <td>
                          <router-link
                            :to="{
                              name: 'logsDetails',
                              params: {
                                type: current,
                                name: row.logStreamName,
                              },
                            }"
                            >{{ row.logStreamName }}</router-link
                          >
                        </td>
                        <td>
                          {{ timeConverter(row.lastEventTimestamp) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p class="loadMoreRecords" v-if="logStreams && logStreams.length==0">
                  <a v-if="nextToken" @click="loadMore">No logs at this moment</a>
                </p>

                <p class="loadMoreRecords" v-else-if="nextToken">
                  <a v-if="nextToken" @click="loadMore">Load more Records...</a>
                </p>
                <p class="loadMoreRecords" v-else>
                  No newer logs at this moment
                </p>
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
  name: "Logs",
  components: {},
  data() {
    return {
      update: 1,
      syncUpdate: 2,
      current: 1,
      totalStreams: 0,
      logStreams: [],
      nextToken: "",
      params: {
        //descending: true,
        //limit: 0,
        logGroupName: "",
        nextToken: null,
        orderBy:"LastEventTime"
      },
      isLoading: false,
    };
  },
  mounted() {
    //set the default value
    if (this.current == this.update) {
      this.loadUpdate();
    } else {
      this.loadSyncUpdate();
    }
  },
  computed: {
    ...mapState({
      updateRecords: (state) => state.logsRecord.updateData,
    }),
  },
  watch: {
    updateRecords() {
      this.isLoading = true;
      //console.log("updateRecords --> this.updateRecords --> ", this.updateRecords);
      //console.log("updateRecords --> this.updateRecords.isUpdatedUpdateData -> ", this.updateRecords.isUpdatedUpdateData);
      //console.log(this.updateRecords);
      if (
        this.updateRecords &&
        this.updateRecords.isUpdatedUpdateData == true
      ) {
        this.isLoading = false;
        // console.log(this.updateRecords.responseData);
        // console.log(this.updateRecords.responseData.logStreams);
        // console.log(this.updateRecords.responseData.nextToken);
        if (this.nextToken) {
          this.logStreams.push(...this.updateRecords.responseData.logStreams);
        } else {
          this.logStreams = this.updateRecords.responseData.logStreams;
        }
        //this.logStreams=[];
        this.totalStreams = this.logStreams.length;
        this.nextToken = this.updateRecords.responseData.nextToken
          ? this.updateRecords.responseData.nextToken
          : null;
      }
    },
  },
  methods: {
    loadUpdate() {
      this.nextToken = null;
      this.current = this.update;
      this.isLoading = true;
      this.params = {
        descending: true,
        //limit: 50,
        logGroupName: "/aws/lambda/OdooAssetUpdateExecute",
        nextToken: null,
        orderBy:"LastEventTime"
      };
      this.$store.dispatch("logsRecord/actionFetchUpdateData", this.params);
    },
    loadMoreUpdate() {
      this.current = this.update;
      this.isLoading = true;
      this.params = {
        descending: true,
        //limit: 50,
        logGroupName: "/aws/lambda/OdooAssetUpdateExecute",
        nextToken: this.nextToken,
        orderBy:"LastEventTime"
      };
      this.$store.dispatch("logsRecord/actionFetchUpdateData", this.params);
    },
    loadSyncUpdate() {
      this.nextToken = null;
      this.current = this.syncUpdate;
      this.isLoading = true;
      this.params = {
        descending: true,
        //limit: 50,
        logGroupName: "/aws/lambda/AssetSyncRuleExecute",
        nextToken: this.nextToken,
        orderBy:"LastEventTime"
      };
      this.$store.dispatch("logsRecord/actionFetchUpdateData", this.params);
    },
    loadMoreSyncUpdate() {
      this.current = this.syncUpdate;
      this.isLoading = true;
      this.params = {
        descending: true,
        //limit: 50,
        logGroupName: "/aws/lambda/AssetSyncRuleExecute",
        nextToken: this.nextToken,
        orderBy:"LastEventTime"
      };
      this.$store.dispatch("logsRecord/actionFetchUpdateData", this.params);
    },
    loadMore() {
      if (this.current == this.update) {
        this.loadMoreUpdate();
      } else {
        this.loadMoreSyncUpdate();
      }
    },
    timeConverter(UNIX_timestamp) {
      var a = new Date(UNIX_timestamp);
      var year = a.getFullYear();
      var month = this.twoDigitFormat(a.getMonth() + 1);
      var date = this.twoDigitFormat(a.getDate());
      var hour = this.twoDigitFormat(a.getHours());
      var min = this.twoDigitFormat(a.getMinutes());
      var sec = this.twoDigitFormat(a.getSeconds());
      var time =
        year + "/" + month + "/" + date + " " + hour + ":" + min + ":" + sec;
      return time;
    },
    twoDigitFormat(_data) {
      let data = _data;
      data = data >= 10 ? data : "0" + data;
      return data;
    },

  },
};
</script>

<style>
.tabs {
  overflow: hidden;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}
.tabs li {
  float: left;
  margin: 0 0.5em 0 0;
}
.tabs a {
  position: relative;
  background: #ddd;
  background-image: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#fff),
    to(#ddd)
  );
  background-image: -webkit-linear-gradient(top, #fff, #ddd);
  background-image: -moz-linear-gradient(top, #fff, #ddd);
  background-image: -ms-linear-gradient(top, #fff, #ddd);
  background-image: -o-linear-gradient(top, #fff, #ddd);
  background-image: linear-gradient(to bottom, #fff, #ddd);
  padding: 0.5em 2em;
  float: left;
  text-decoration: none;
  color: #000000;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
  -webkit-border-radius: 5px 0 0 0;
  -moz-border-radius: 5px 0 0 0;
  border-radius: 5px 0 0 0;
  -moz-box-shadow: 0 2px 2px rgba(0, 0, 0, 0.4);
  -webkit-box-shadow: 0 2px 2px rgba(0, 0, 0, 0.4);
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.4);
  font-size: 15px;
}
.tabs a:hover,
.tabs a:hover::after,
.tabs a:focus,
.tabs a:focus::after {
  background: #fff;
}
.tabs a:focus {
  outline: 0;
}
.tabs a::after {
  content: "";
  position: absolute;
  z-index: 1;
  top: 0;
  right: -0.5em;
  bottom: 0;
  width: 1em;
  background: #ddd;
  background-image: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#fff),
    to(#ddd)
  );
  background-image: -webkit-linear-gradient(top, #fff, #ddd);
  background-image: -moz-linear-gradient(top, #fff, #ddd);
  background-image: -ms-linear-gradient(top, #fff, #ddd);
  background-image: -o-linear-gradient(top, #fff, #ddd);
  background-image: linear-gradient(to bottom, #fff, #ddd);
  -moz-box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.4);
  -webkit-box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.4);
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.4);
  -webkit-transform: skew(10deg);
  -moz-transform: skew(10deg);
  -ms-transform: skew(10deg);
  -o-transform: skew(10deg);
  transform: skew(10deg);
  -webkit-border-radius: 0 5px 0 0;
  -moz-border-radius: 0 5px 0 0;
  border-radius: 0 5px 0 0;
}
.tabs .current a {
  background: #0578a3;
  z-index: 3;
  color: #fff;
}
.tabs .current a::after {
  background: #0578a3;
  z-index: 3;
}
.logs {
  margin: 10px 0 0 0;
}
.logs .table tbody tr td label span:before,
.logs .table tbody tr td label span:after {
  visibility: visible !important;
}
.logs .table thead tr th {
  padding: 8px;
  position: relative;
  text-align: left;
}
.logs .table thead tr th:nth-child(1) {
  width: 5%;
}
.logs .table thead tr th:nth-child(2) {
  width: 60%;
}
.logs .table thead tr th:nth-child(3) {
  width: 35%;
}
.logs .sec-title h1 {
  font-size: 16px;
  color: #626262 !important;
}
.loadMoreRecords {
  text-align: center;
}
</style>
