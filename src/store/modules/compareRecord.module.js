import { APIService } from "@/service/api.js";
import urlConstant from "@/constants/uri.constants.js";

const state = {
  relatedData: {},
  fieldMap: {},
  countryData: {},
  stateData: {},
  userData: {},
  AssetsData:{},
};

const mutations = {
  countryData(state, payload) {
    switch (payload.type) {
      case "FETCHED_COUNTRY_ODOO_DATA":
        state.countryData = {
          isFechingCountryData: false,
          errorFechingCountryData: false,
          responseData: payload.data,
        };
        break;
    }
  },
  userData(state, payload) {
    switch (payload.type) {
      case "FETCHED_USER_DATA":
        state.userData = {
          isFechingUserData: false,
          errorFechingUserData: false,
          responseData: payload.data,
        };
        break;
    }
  },
  stateData(state, payload) {
    switch (payload.type) {
      case "FETCHING_STATE_ODOO_DATA":
        state.stateData = {
          isFechingStateData: true,
          errorFechingStateData: false,
          responseData: {},
        };
        break;
      case "FETCHED_STATE_ODOO_DATA":
        state.stateData = {
          isFechingStateData: false,
          errorFechingStateData: false,
          responseData: payload.data,
        };
        break;
    }
  },
  fetchSfOdoo(state, payload) {
    switch (payload.type) {
      case "FETCHING_RELATED_DATA":
        state.relatedData = {
          isFechingRelatedData: true,
          errorFechingRelatedData: false,
          relatedData: {},
        };
        break;
      case "FETCHED_RELATED_DATA":
        state.relatedData = {
          isFechingRelatedData: false,
          errorFechingRelatedData: false,
          relatedData: payload.data,
        };
        break;
    }
  },
  fieldMap(state, payload) {
    switch (payload.type) {
      case "FETCHING_FIELD_MAP":
        state.fieldMap = {
          isFechingFieldMap: true,
          errorFechingFieldMap: false,
          fieldMap: {},
        };
        break;
      case "FETCHED_FIELD_MAP":
        state.fieldMap = {
          isFechingFieldMap: false,
          errorFechingFieldMap: false,
          fieldMap: payload.data,
        };
        break;
    }
  },
};

const actions = {
  actionRecursiveGetUserData({ commit, dispatch }, ref) {
    APIService.get(ref).then((res) => {
      if (res.data.result.data.progress !== 100) {
        dispatch("actionRecursiveGetUserData", ref);
      } else {
        commit("userData", {
          type: "FETCHED_USER_DATA",
          data: res.data.result.data.response,
        });
      }
    });
  },
  actionGetUserData({ dispatch }) {
    APIService.get(urlConstant.baseUrl + urlConstant.odoousers).then((res) => {
      if (res.data.status == "SUCCESS") {
        dispatch("actionRecursiveGetUserData", res.data.ref);
      }
    });
  },
  ////

  actionRecursiveGetCountryData({ commit, dispatch }, ref) {
    APIService.get(ref).then((res) => {
      if (res.data.result.data.progress !== 100) {
        dispatch("actionRecursiveGetCountryData", ref);
      } else {
        commit("countryData", {
          type: "FETCHED_COUNTRY_ODOO_DATA",
          data: res.data.result.data.response,
        });
      }
    });
  },
  actionGetCountryData({ dispatch }) {
    APIService.get(urlConstant.baseUrl + urlConstant.odoocountry).then(
      (res) => {
        if (res.data.status == "SUCCESS") {
          dispatch("actionRecursiveGetCountryData", res.data.ref);
        }
      }
    );
  },
  actionRecursiveGetStateData({ commit, dispatch }, ref) {
    APIService.get(ref).then((res) => {
      if (res.data.result.data.progress !== 100) {
        dispatch("actionRecursiveGetStateData", ref);
      } else {
        commit("stateData", {
          type: "FETCHED_STATE_ODOO_DATA",
          data: res.data.result.data.response,
        });
      }
    });
  },
  actionGetStateData({ dispatch }) {
    APIService.get(urlConstant.baseUrl + urlConstant.odoostate).then((res) => {
      if (res.data.status == "SUCCESS") {
        dispatch("actionRecursiveGetStateData", res.data.ref);
      }
    });
  },
  // actionFetchSfOdoo({ commit, dispatch }, key) {
  //   const urlKey = key ? "/" + key : "";
  //   commit("fetchSfOdoo", { type: "FETCHING_RELATED_DATA" });
  //   APIService.post(urlConstant.baseUrl + urlConstant.getRelated + urlKey).then(
  //     (res) => {
  //        // console.log("get post response",res)
  //        if (res.data.body.ref) {
  //         dispatch('actionFetchSfOdooProgress', res.data.body.ref);
  //       }
  //     }
  //     ).catch((err) => {
  //       window.console.log("actionFetchSfOdoo", err);
  //     });
      
  // },
  actionFetchSfOdoo({commit, dispatch }, _pageObj) {
    commit('fetchSfOdoo', { type: 'FETCHING_RELATED_DATA' });
    APIService.post(urlConstant.baseUrl + urlConstant.getRelated, _pageObj).then(
      (res) => {
        // console.log("page object",_pageObj)
        if (res.data.status == "SUCCESS") {	
          // console.log("Account get url.....",res.data.ref)
          // console.log("Account get url....._pageObj",_pageObj)

          dispatch('actionFetchSfOdooProgress', res.data.ref);
        }
      }
      ).catch((err) => {
        window.console.log("actionFetchSfOdoo", err);
      });
      
  },
  actionFetchSfOdooProgress({ commit, dispatch }, ref) {
    APIService.get(
      ref
    ).then(res => {
      // console.log("Account fetch records....",res.data.status)
      if (res.data.data.progress !== 100) {
          setTimeout(() => {
            dispatch("actionFetchSfOdooProgress", ref);
          }, 1000);
        }
      else {
          commit("fetchSfOdoo", { type: "FETCHED_RELATED_DATA", data: res.data});
      }
    });
  },

  actionfieldMap({ commit }) {
    commit("fieldMap", { type: "FETCHING_FIELD_MAP" });
    APIService.get(urlConstant.baseUrl + urlConstant.fieldMap)
      .then((res) => {
        if (res.data) {
          commit("fieldMap", { type: "FETCHED_FIELD_MAP", data: res.data });
        }
      })
      .catch((err) => {
        window.console.log("actionfieldMap", err);
      });
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
