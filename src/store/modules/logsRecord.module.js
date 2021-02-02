import AWS from "aws-sdk";
import awsConstant from "@/constants/aws.constants.js";

const state = {
  updateData: {},
  updateGetLogEventsData: {},
};

const mutations = {
  updateData(state, payload) {
    //console.log("mutations --> updateData");
    switch (payload.type) {
      case "UPDATING_UPDATE_DATA":
        //console.log("mutations --> updateData --> UPDATING_UPDATE_DATA");
        state.updateData = {
          isUpdatingUpdateData: true,
          isUpdatedUpdateData: false,
          errorUpdatingUpdateData: false,
          isprogressUpdateData: false,
          responseData: {},
        };
        break;
      case "UPDATED_UPDATE_DATA":
        //console.log("mutations --> updateData --> UPDATED_UPDATE_DATA");
        state.updateData = {
          isUpdatingUpdateData: false,
          isUpdatedUpdateData: true,
          errorUpdatingUpdateData: false,
          isprogressUpdateData: false,
          responseData: payload.data,
        };
        //console.log("mutations --> updateData --> UPDATED_UPDATE_DATA --> ",   state );
        break;
    }
  },
  updateLogEventsData(state, payload) {
    //console.log("mutations --> updateGetLogEventsData");
    switch (payload.type) {
      case "UPDATING_UPDATE_LOGEVENTS_DATA":
        state.updateGetLogEventsData = {
          isUpdatingUpdateGetLogEventsData: true,
          isUpdatedUpdateGetLogEventsData: false,
          errorUpdatingUpdateGetLogEventsData: false,
          isprogressUpdateGetLogEventsData: false,
          responseData: {},
        };
        break;
      case "UPDATED_UPDATE_LOGEVENTS_DATA":
        state.updateGetLogEventsData = {
          isUpdatingUpdateGetLogEventsData: false,
          isUpdatedUpdateGetLogEventsData: true,
          errorUpdatingUpdateGetLogEventsData: false,
          isprogressUpdateGetLogEventsData: false,
          responseData: payload.data,
        };
        break;
    }
  },
};

const actions = {
  actionFetchUpdateData({ commit }, _params) {
    //console.log("actions --> actionFetchUpdateData");
    commit("updateData", { type: "UPDATING_UPDATE_DATA" });

    AWS.config.update({
      accessKeyId: awsConstant.accessKeyId,
      secretAccessKey: awsConstant.secretAccessKey,
      region: awsConstant.region,
    });

    //set the service
    let cloudwatchlogs = new AWS.CloudWatchLogs({
      apiVersion: awsConstant.apiVersion,
    });

    //use the service
    cloudwatchlogs.describeLogStreams(_params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
      } else {
        //console.log("data", data);
        commit("updateData", { type: "UPDATED_UPDATE_DATA", data: data });
      }
    });
  },

  actionFetchUpdateGetLogEventsData({ commit }, _params) {
    //console.log("actions --> actionFetchUpdateData");
    commit("updateLogEventsData", { type: "UPDATING_UPDATE_LOGEVENTS_DATA" });

    AWS.config.update({
      accessKeyId: awsConstant.accessKeyId,
      secretAccessKey: awsConstant.secretAccessKey,
      region: awsConstant.region,
    });

    //set the service
    let cloudwatchlogs = new AWS.CloudWatchLogs({
      apiVersion: awsConstant.apiVersion,
    });

    //use the service
    cloudwatchlogs.getLogEvents(_params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
      } else {
        commit("updateLogEventsData", {
          type: "UPDATED_UPDATE_LOGEVENTS_DATA",
          data: data,
        });
      }
    });
  },
};
export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
