import Vue from 'vue'
import Vuex from 'vuex'
import compareRecord from './modules/compareRecord.module'
import compareAssetRecord from './modules/compareAssetRecord.module'
import salesForce from './modules/salesForce.module'
import Odoo from './modules/odoo.module'
import performSync from './modules/performSync.module';
import auth from './modules/auth.module.js'
import syncRule from "./modules/syncRule.module";
import logsRecord from "./modules/logsRecord.module";

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    compareRecord,
    compareAssetRecord,
    salesForce,
    Odoo,
    performSync,
    auth,
    syncRule,
    logsRecord
  }
})
