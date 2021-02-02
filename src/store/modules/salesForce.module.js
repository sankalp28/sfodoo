import { APIService } from "@/service/api.js";
import urlConstant from "@/constants/uri.constants.js";

const state = {
  updateSfData: {},
  sffields: {},
};

const mutations = {
  sfupdate(state, payload) {
    switch (payload.type) {
      case "UPDATING_SF_DATA":
        state.updateSfData = {
          isUpdatingSFData: true,
          isUpdatedSFData: false,
          errorUpdatingSFData: false,
          responseData: {},
        };
        break;
      case "UPDATED_SF_DATA":
        state.updateSfData = {
          isUpdatingSFData: false,
          isUpdatedSFData: false,
          errorUpdatingSFData: false,
          responseData: payload.data,
        };
        break;
    }
  },

  sfFields(state, payload) {
    switch (payload.type) {
      case "FETCHING_SF_FIELDS":
        state.sffields = {
          isFechingSFFieldsData: true,
          errorFechingSFFieldsData: false,
          responseData: {},
        };
        break;
      case "FETCHED_SF_FIELDS":
        state.sffields = {
          isFechingSFFieldsData: false,
          errorFechingSFFieldsData: false,
          responseData: payload.data,
        };
        break;
    }
  },
};

const actions = {
  actionUpdateSF({ commit, dispatch }, _obj) {
    commit("sfupdate", { type: "UPDATING_SF_DATA" });
    APIService.post(urlConstant.baseUrl + urlConstant.sfupdate, _obj).then(
      (res) => {
        if (res.data.ref) {
          const key = res.data.ref.split("/");
          dispatch("actionUpdateProgressSF", key.pop());
        }
      }
    );
  },

  actionUpdateProgressSF({ commit, dispatch }, key) {
    APIService.get(urlConstant.baseUrl + urlConstant.sfupdate + "/" + key).then(
      (res) => {
        if (res.data.result.data.progress !== 100) {
          setTimeout(() => {
            dispatch("actionUpdateProgressSF", res.data.result.key);
            // //commit('fetchSfOdoo', {
            // commit("sfupdate", {
            //   type: "UPDATED_SF_DATA",
            //   data: res.data,
            // });
          }, 1000);
        } else {
          APIService.trash(
            urlConstant.baseUrl + urlConstant.sfupdate + "/" + key
          );

          commit("sfupdate", {
            type: "UPDATED_SF_DATA",
            data: res.data,
          });
        }
      }
    );
  },

  actionsfFields({ commit, dispatch }) {
    commit("sfFields", { type: "FETCHING_SF_FIELDS" });
    APIService.get(urlConstant.baseUrl + urlConstant.sffields)
      .then((res) => {
        if (res.data.ref) {
          const key = res.data.ref.split("/");
          dispatch("actionProgressSFField", key.pop());
          commit("sfFields", { type: "FETCHED_SF_FIELDS", data: res.data });
        }
      })
      .catch((err) => {
        window.console.log("actionfieldMap", err);
      });
  },
  ////
  actionProgressSFField({ commit, dispatch }, key) {
    APIService.get(urlConstant.baseUrl + urlConstant.sffields + "/" + key).then(
      (res) => {
        if (res.data.result.data.progress !== 100) {
          setTimeout(() => {
            dispatch("actionProgressSFField", res.data.result.key);
          }, 1000);
        } else {
          APIService.trash(
            urlConstant.baseUrl + urlConstant.sffields + "/" + key
          );
          commit("sfFields", {
            type: "FETCHED_SF_FIELDS",
            data: res.data,
          });
        }
      }
    );
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
