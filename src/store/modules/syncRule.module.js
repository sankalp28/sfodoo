import { APIService } from "@/service/api.js";
import urlConstant from "@/constants/uri.constants.js";

const state = {
  updateRule: {},
 
};

const mutations = {
  ruleUpdate(state, payload) {
    switch (payload.type) {
      case "UPDATING_RULE":
        state.updateRule = {
          isUpdatingRule: true,
          isUpdatedRule: false,
          errorUpdatingRule: false,
          responseData: {}
        };
        break;
      case "UPDATED_RULE":
        state.updateRule = {
          isUpdatingRule: false,
          isUpdatedRule: false,
          errorUpdatingRule: false,
          responseData: payload.data
        };
        break;
    }
  }
};

const actions = {
  actionSyncRule({ commit, dispatch }, _data) {
    commit("ruleUpdate", { type: "UPDATING_RULE" });
    //console.log("actionSyncRule---");
    APIService.post(urlConstant.baseUrl + urlConstant.syncRule, _data).then(
      res => {
        if (res.data.ref) {
          const key = res.data.ref.split("/");
          dispatch("actionUpdateProgressSyncRule", key.pop());
        }
      }
    );
  },

  actionUpdateProgressSyncRule({ commit, dispatch }, key) {
    //console.log("key --> ", urlConstant.baseUrl + urlConstant.syncRule + "/" + key);
    let keyData = key;
    let deleteApi = urlConstant.baseUrl + urlConstant.syncRule + "/" + key;
    APIService.get(urlConstant.baseUrl + urlConstant.syncRule + "/" + key).then(
      res => {
        // console.log("res -->", res);
        // console.log("key -->", key);
        // console.log("res.data -->", res.data);  
        // console.log("res.data.status -->", res.data.status);  
        // console.log("res.data.data -->", res.data.data);
        //Completed, Failed,	error, waiting, progress
        if ( res.data.status == "waiting" ||  res.data.status == "processing" ) {
          //console.log("res.data-->", res.data);
          //console.log("  progress-->", res.data.data.progress);

          setTimeout(() => {
            dispatch("actionUpdateProgressSyncRule", keyData);
            commit("ruleUpdate", {
              type: "UPDATED_RULE",
              data: res.data
            });
          }, 1000);
        } else if (res.data.status == "Failed" || res.data.status == "FAIL") {
          //console.log("Failed , FAIL--> ", res.data);
          commit("ruleUpdate", {
            type: "UPDATED_RULE",
            data: res.data
          });
        } else {
          APIService.trash(deleteApi);
          commit("ruleUpdate", {
            type: "UPDATED_RULE",
            data: res.data
          });
        }
      }
    );
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
