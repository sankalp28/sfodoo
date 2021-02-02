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
                  <li class="current">
                    <router-link to="/logs">
                      Update
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/logs">
                      Sync and Update
                    </router-link>
                  </li>
                </ul>
                <div class="logs">
                  <div class="sec-title">
                    <h1>Log streams({{ total }})</h1>
                  </div>
                  <table class="table">
                    <thead>
                      <tr>
                        <th>
                          <label class="checkbox">
                            <input
                              type="checkbox"
                              name="showhide"
                              onchange="checkAll(this)"
                            /><span></span>
                          </label>
                        </th>
                        <th>Log stream</th>
                        <th>Last event time</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <label class="checkbox">
                            <input
                              type="checkbox"
                              name="check"
                              id="check_1"
                            /><span></span>
                          </label>
                        </td>
                        <td>
                          <router-link to="/logsDetails">
                            2020/11/22/[$LATEST]b35jdd444jjjggg996jj55jjjv55vv66
                          </router-link>
                        </td>
                        <td>2020/11/22 12:3326(UTC+05:30)</td>
                      </tr>
                      <tr>
                        <td>
                          <label class="checkbox">
                            <input
                              type="checkbox"
                              name="check"
                              id="check_2"
                            /><span></span>
                          </label>
                        </td>
                        <td>
                          <router-link to="/logsDetails">
                            2020/11/22/[$LATEST]b35jdd444jjjggg996jj55jjjv55vv66
                          </router-link>
                        </td>
                        <td>2020/11/22 12:3326(UTC+05:30)</td>
                      </tr>
                      <tr>
                        <td>
                          <label class="checkbox">
                            <input
                              type="checkbox"
                              name="check"
                              id="check_3"
                            /><span></span>
                          </label>
                        </td>
                        <td>
                          <router-link to="/logsDetails">
                            2020/11/22/[$LATEST]b35jdd444jjjggg996jj55jjjv55vv66
                          </router-link>
                        </td>
                        <td>2020/11/22 12:3326(UTC+05:30)</td>
                      </tr>
                      <tr>
                        <td>
                          <label class="checkbox">
                            <input
                              type="checkbox"
                              name="check"
                              id="check_4"
                            /><span></span>
                          </label>
                        </td>
                        <td>
                          <router-link to="/logsDetails">
                            2020/11/22/[$LATEST]b35jdd444jjjggg996jj55jjjv55vv66
                          </router-link>
                        </td>
                        <td>2020/11/22 12:3326(UTC+05:30)</td>
                      </tr>
                      <tr>
                        <td>
                          <label class="checkbox">
                            <input
                              type="checkbox"
                              name="check"
                              id="check_5"
                            /><span></span>
                          </label>
                        </td>
                        <td>
                          <router-link to="/logsDetails">
                            2020/11/22/[$LATEST]b35jdd444jjjggg996jj55jjjv55vv66
                          </router-link>
                        </td>
                        <td>2020/11/22 12:3326(UTC+05:30)</td>
                      </tr>
                      <tr>
                        <td>
                          <label class="checkbox">
                            <input
                              type="checkbox"
                              name="check"
                              id="check_6"
                            /><span></span>
                          </label>
                        </td>
                        <td>
                          <router-link to="/logsDetails">
                            2020/11/22/[$LATEST]b35jdd444jjjggg996jj55jjjv55vv66
                          </router-link>
                        </td>
                        <td>2020/11/22 12:3326(UTC+05:30)</td>
                      </tr>
                      <tr>
                        <td>
                          <label class="checkbox">
                            <input
                              type="checkbox"
                              name="check"
                              id="check_7"
                            /><span></span>
                          </label>
                        </td>
                        <td>
                          <router-link to="/logsDetails">
                            2020/11/22/[$LATEST]b35jdd444jjjggg996jj55jjjv55vv66
                          </router-link>
                        </td>
                        <td>2020/11/22 12:3326(UTC+05:30)</td>
                      </tr>
                      <tr>
                        <td>
                          <label class="checkbox">
                            <input
                              type="checkbox"
                              name="check"
                              id="check_8"
                            /><span></span>
                          </label>
                        </td>
                        <td>
                          <router-link to="/logsDetails">
                            2020/11/22/[$LATEST]b35jdd444jjjggg996jj55jjjv55vv66
                          </router-link>
                        </td>
                        <td>2020/11/22 12:3326(UTC+05:30)</td>
                      </tr>
                      <tr>
                        <td>
                          <label class="checkbox">
                            <input
                              type="checkbox"
                              name="check"
                              id="check_9"
                            /><span></span>
                          </label>
                        </td>
                        <td>
                          <router-link to="/logsDetails">
                            2020/11/22/[$LATEST]b35jdd444jjjggg996jj55jjjv55vv66
                          </router-link>
                        </td>
                        <td>2020/11/22 12:3326(UTC+05:30)</td>
                      </tr>
                      <tr>
                        <td>
                          <label class="checkbox">
                            <input
                              type="checkbox"
                              name="check"
                              id="check_10"
                            /><span></span>
                          </label>
                        </td>
                        <td>
                          <router-link to="/logsDetails">
                            2020/11/22/[$LATEST]b35jdd444jjjggg996jj55jjjv55vv66
                          </router-link>
                        </td>
                        <td>2020/11/22 12:3326(UTC+05:30)</td>
                      </tr>
                    </tbody>
                  </table>
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
// import AWS from "aws-sdk";
// import awsConstant from "@/constants/aws.constants.js";
//import { mapState } from "vuex";

export default {
  name: "Logs",
  components: {},
  data() {
    return {
      total: 0,
      params: {
        descending: false,
        limit: 5,
        logGroupName: "/aws/lambda/AssetSyncRuleExecute",
        //logStreamNamePrefix: "string",
        nextToken: null,
        //orderBy: LastEventTime,
      },
      isLoading: false,
    };
  },
  mounted() {
    console.log("this.isLoading --> ", this.isLoading);

    //set the default value
    this.setDefaultValue();

    // //set the service
    // let cloudwatchlogs = new AWS.CloudWatchLogs({
    //   apiVersion: awsConstant.apiVersion,
    // });

    // //use the service
    // cloudwatchlogs.describeLogStreams(this.params, function(err, data) {
    //   console.log("this.isLoading --> ", this.isLoading);
    //   console.log("this.total --> ", this.total);
    //   console.log("this.params --> ", this.params);
    //   if (err) {
    //     console.log(err, err.stack);
    //   } else {
    //     console.log("data", data);
    //   }
    // });

    this.isLoading = false;

    this.$store.dispatch("logsRecord/actionFetchUpdateData", this.params);

  },
  computed: {
    // ...mapState({
    //   updateRecords: (state) => state.logsRecord.update,
    // }),
  },
  watch: {
    //   updateRecords() {
    //     //this.isLoading = true;
    //     console.log("updateRecords ", this.updateRecords);
    // }
  },
  methods: {
    setDefaultValue() {
      this.isLoading = true;
      // AWS.config.update({
      //   accessKeyId: awsConstant.accessKeyId,
      //   secretAccessKey: awsConstant.secretAccessKey,
      //   region: awsConstant.region,
      // });
    },
    test() {
      console.log("testing..........");
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
</style>
