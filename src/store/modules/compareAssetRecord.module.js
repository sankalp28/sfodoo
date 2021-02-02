import { APIService } from "@/service/api.js";
import urlConstant from "@/constants/uri.constants.js";

const state = {
  assetsSync:{},
  relatedData: {},
  fieldMap: {},
  countryData: {},
  stateData: {},
  userData: {},
  assetsData: {},
  syncToOdoo:{},
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
  assetsData(state, payload) {
    switch (payload.type) {
      case "FETCHING_ASSETS_DATA":
        state.assetsData = {
          isFechingAssetsData: true,
          errorFechingAssetsData: false,
          assetsData: {},
        };
        break;
      case "FETCHED_ASSETS_DATA":
        state.assetsData = {
          isFechingAssetsData: false,
          errorFechingAssetsData: false,
          assetsData: payload.data,
        };
        break;
    }
  },
  assetsSync(state, payload) {
    switch (payload.type) {
      case "FETCHING_ASSETS_SYNC":
        state.assetsSync = {
          isFechingAssetsSync: true,
          errorFechingAssetsSync: false,
          assetsSync: {},
        };
        break;
      case "FETCHED_ASSETS_SYNC":
        state.assetsSync = {
          isFechingAssetsSync: false,
          errorFechingAssetsSync: false,
          assetsSync: payload.data,
        };
        break;
    }
  },
  syncToOdoo(state, payload) {
    switch (payload.type) {
      case 'SYNCING_ODOO_DATA':
        state.syncToOdoo = {
          isUpdatingSyncToOdoo: true,
          isUpdatedSyncToOdoo: false,
          errorUpdatingSyncToOdoo: false,
          responseData: {},
        };
        break;
      case 'SYNCED_ODOO_DATA':
        state.syncToOdoo = {
          isUpdatingSyncToOdoo: false,
          isUpdatedSyncToOdoo: false,
          errorUpdatingSyncToOdoo: false,
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
  //SYNC TO ODOO CODE
  actionSyncToOdoo({ commit, dispatch }, _obj) {
    commit('syncToOdoo', { type: 'SYNCING_ODOO_DATA' });
    APIService.post(urlConstant.amazonUrl + urlConstant.assetOdooSync, _obj).then(
      res => {
        // console.log("sync to odoo post",res)
        if (res.data.body.ref) {
          dispatch('actionSyncToOdooProgress', res.data.body.ref);
        }
      }
    ).catch((err) => {
      window.console.log("actionSYNCINGAssetsData", err);
    });
  },
  actionSyncToOdooProgress({ commit, dispatch }, ref) {

    APIService.get(
      ref
    ).then(res => {
      // console.log("sync to odoo get",res)

      if (res.data.progress!== 100) {
        // console.log('Fetch Progresssssss', res.data.progress);
        setTimeout(() => {
          dispatch('actionSyncToOdooProgress', ref);
        }, 1000);
      } else {
        // APIService.trash(urlConstant.baseUrl + urlConstant.odooUpdate + '/' + key);
        APIService.trash(ref);
        // console.log("res.data ---> ", res.data.progress);
        commit('syncToOdoo', {
          type: 'SYNCED_ODOO_DATA',
          data: res.data,
        });
      }
    });
  },
  //ENDS
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
  actionFetchSfOdoo({ commit, dispatch }, key) {
    const urlKey = key ? "/" + key : "";
    commit("fetchSfOdoo", { type: "FETCHING_RELATED_DATA" });
    APIService.get(urlConstant.baseUrl + urlConstant.getRelated + urlKey).then(
      (res) => {
        // console.log(res,"Assets fetchSfOdoo --->>>")
        if (res.data.ref) {
          const key1 = res.data.ref.split("/");
          dispatch("actionFetchSfOdoo", key1.pop() + "");
        } else if (res.data.data.progress !== 100) {
          setTimeout(() => {
            dispatch("actionFetchSfOdoo", res.data.key);
            // commit('fetchSfOdoo', {
            //   type: 'FETCHED_RELATED_DATA',
            //   data: res.data,
            // });
          }, 200);
        } else {
          APIService.trash(
            urlConstant.baseUrl + urlConstant.getRelated + urlKey
          );
          commit("fetchSfOdoo", {
            type: "FETCHED_RELATED_DATA",
            data: res.data,
          });
        }
      }
    );
  },
  // actionFetchAssetRecord({ commit, dispatch }, key) {
  //   const urlKey = key ? "/" + key : "";
  //   commit("assetsData", { type: "FETCHING_ASSET_DATA" });
  //   APIService.get(urlConstant.baseUrl2 + urlConstant.assets, urlKey).then(
  //     (res) => {
  //       if (res.data.body.ref) {
  //         console.log("RESPONSE", res.data.body.ref);

  //         const key1 = res.data.body.ref.split("/");

  //         console.log("key printing", key1);

  //         dispatch("actiongetAssetData", key1.pop() + "");
  //         commit("assetsData", {
  //           type: "FETCHED_ASSET_DATA",
  //           data: res.data.body.ref,
  //         });
  //         console.log("hello module final", res.body.ref);
  //       }
  //     }
  //   );
  // },
//   actiongetAssetData({ commit ,dispatch}, _pageObj) {
//     commit("assetsData", { type: "FETCHING_ASSET_DATA" });
//     APIService.post(urlConstant.baseUrl2 + urlConstant.assets, _pageObj).then(
//       (res) => {
//         if (res.data.body.ref) {
//           console.log("POST RESPonse", res);
//              dispatch("actionAsset", res);

//           // console.log("post rest new resp", res);

//           // APIService.get(res.data.body.ref).then((re) => {
           
//           //   if(re.data.progress==100){
//           //     console.log("get resp", re.data.progress);

//           //   // dispatch("actiongetAssetData", re.data.response);
//           //  commit("assetsData", { type: "FETCHED_ASSET_DATA", data: re.data.response });
//           //   }
//           // });
//         }
//       }
//     );
//   },

// actionAsset({ commit ,dispatch},res){
//   // if(res.data.progress){
//   APIService.get(res.data.body.ref).then((re) => {
//     console.log("get resp", re.data.progress);
//     console.log("get resp re print", re);

         
//     if(re.data.progress==0){
//       setTimeout(() => {
//         dispatch("actionAsset", res);
//         // commit('fetchSfOdoo', {
//         //   type: 'FETCHED_RELATED_DATA',
//         //   data: res.data,
//         // });
//       },500);

//     //  dispatch("actionAsset", res);
//     }
//     commit("assetsData", { type: "FETCHED_ASSET_DATA", data: re.data.response });

//   }).catch((err) => {
//     console.log("error log", err);
//   });
//   // }
// },

actionAssetStateData({ commit, dispatch },ref){	
  commit("assetsData", { type: "FETCHING_ASSETS_DATA" });	
  APIService.get(ref).then((res) => {	
      if (res.data.progress !== 100) {	
        setTimeout(() => {	
          // console.log("waiting...");
          // console.log("2 get asset",res)	

          dispatch("actionAssetStateData",ref);	
        }, 200);	
      } 
      else {
        APIService.trash(ref);
        // console.log("received...",ref);
        commit("assetsData", { type: "FETCHED_ASSETS_DATA", data: res.data.response,	
      });	
      }

  }).catch((err) => {
    window.console.log("actionAssetStateData", err);
  });	
},	
actionGetRelatedAssetsData({ dispatch }, _pageObj)  {	
  APIService.post(urlConstant.amazonUrl + urlConstant.getRelatedAsset, _pageObj).then((res) => {	
    if (res.data.body.status == "SUCCESS") {	
        // console.log("POST RESPonse", res);
        dispatch("actionAssetStateData", res.data.body.ref);	
    } 	
  }).catch((err) => {
    window.console.log("actionGetRelatedAssetsData", err);
  });	
},
//asset syn 
actionAssetSync({ commit ,dispatch}) {
  commit("assetsSync", { type: "FETCHING_ASSETS_SYNC" });
  APIService.get(urlConstant.amazonUrl + urlConstant.getAssetSync)
    .then((res) => {
      // console.log("syncing asses",res)
      if (res.data.body.ref) {
        dispatch("actionAssetSyncData", res.data.body.ref);	

        // commit("assetsSync", { type: "FETCHED_ASSETS_SYNC", data: res.data });
      }
    })
    .catch((err) => {
      window.console.log("actionAssetSync", err);
    });
},
actionAssetSyncData({ commit, dispatch },ref){	
  commit("assetsSync", { type: "FETCHING_ASSETS_SYNC" });	
  APIService.get(ref).then((res) => {
    // console.log("2 get sync",res)	
      if (res.data.progress !== 100) {	
        setTimeout(() => {	
          dispatch("actionAssetSyncData",ref);	
        }, 1000);	
      } 
      else {
        APIService.trash(ref);       
        commit("assetsSync", { type: "FETCHED_ASSETS_SYNC", data: res.data,	
      });	
      }

  }).catch((err) => {
    window.console.log("actionAssetSyncData", err);
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
