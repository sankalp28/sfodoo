<template>
  <div class="edit-box" style="width: 100%" id="myDIV">
    <div class="table-cell button"></div>
    <div class="edit-box-wrapper">
      <div class="edit-box-main">
        <div class="sf-box">
          <div class="inner">
            <div class="records">
              <h1>Edit SF Records</h1>
              <!-- <div class="form">
                <div
                  v-for="(field, index) in fieldMapData"
                  :key="field + index"
                  class="form-row"
                >
                  <input
                    type="text"
                    name="field"
                    :id="field"
                    :value="updateRowDataSF.Id"
                  />
                  <label for="field.Account__c"></label>
                </div>

                <div class="button-row">
                  <el-button @click="handleOnUpdateSF">Update</el-button>

                  <el-button @click="syncSfToOdoo">Sync to Odoo</el-button>
                </div>
              </div> -->
              <div class="form">
                <div class="row-h1">
                  <div class="form-row">
                    <input type="text" disabled :value="updateRowDataSF.Id" />
                    <label for="AssetID">Asset ID</label>
                  </div>
                </div>
                <div class="row-h2">
                  <div class="form-row">
                    <input
                      type="text"
                      disabled
                      :value="updateRowDataSF.Type_of_Asset__c"
                    />
                    <label for="Type_of_Asset_c">Type of asset</label>
                  </div>
                </div>
                <div class="row-h3">
                  <div class="form-row">
                    <input
                      type="text"
                      disabled
                      :value="
                        updateRowDataSF.Type_of_Asset__c == 'Transmitter'
                          ? ''
                          : updateRowDataSF.SerialNumber
                      "
                    />
                    <label for="R_Serial_Number_c">R Serial Number</label>
                  </div>
                  <div class="form-row">
                    <input
                      type="text"
                      disabled
                      :value="
                        updateRowDataSF.Type_of_Asset__c == 'Transmitter'
                          ? updateRowDataSF.SerialNumber
                          : ''
                      "
                    />
                    <label for="T_Serial_Number_c">T Serial Number</label>
                  </div>
                </div>
                <div class="row-h4">
                  <div class="form-row">
                    <input
                      type="text"
                      disabled
                      :value="updateRowDataSF.R_PID__c"
                    />
                    <label for="R_PID__c">R PID</label>
                  </div>
                  <div class="form-row">
                    <input
                      type="text"
                      disabled
                      :value="updateRowDataSF.R_PID_2__c"
                    />
                    <label for="R_PID_2__c">R PID2</label>
                  </div>
                  <div class="form-row">
                    <input
                      type="text"
                      disabled
                      name="R_PID_3__c"
                      :value="updateRowDataSF.R_PID_3__c"
                    />
                    <label for="R_PID_3__c">R PID3</label>
                  </div>
                  <div class="form-row">
                    <input
                      type="text"
                      disabled
                      :value="updateRowDataSF.R_PID_4__c"
                    />
                    <label for="R_PID_4__c">R PID4</label>
                  </div>
                  <div class="form-row">
                    <input
                      type="text"
                      disabled
                      :value="updateRowDataSF.T_PID__c"
                    />
                    <label for="T_PID__c">T PID</label>
                  </div>
                </div>
                <div class="checkbox-comp2">
                  <label class="checkbox">
                    <input
                      type="checkbox"
                      disabled
                      :checked="updateRowDataSF.Odoo_Update_Needed__c"
                      value="checkbox"
                    />
                    <span>Odoo Update Needed</span></label
                  >
                </div>
                <div class="button-row">
                  <el-button
                    type="primary"
                    :disabled="
                      updateRowDataSF.Odoo_Update_Needed__c == 1 ? false : true
                    "
                    @click="onClickSyncToOddo"
                  >
                    Sync to Odoo</el-button
                  >
                </div>
                <!-- :disabled="updateRowDataSF.Id == 'a0D4T000000NUbe' ? false : true " 
                :disabled="
                      updateRowDataSF.Odoo_Update_Needed__c == 1 ? false : true
                    " 
                    -->
              </div>
            </div>
          </div>
        </div>

        <div class="oddo-box">
          <div class="inner">
            <div class="records">
              <h1>Edit Odoo Records</h1>
              <div class="form">
                <div class="row-h1">
                  <div class="form-row">
                    <input
                      type="text"
                      name="x_studio_salesforce_token"
                      :value="updateRowDataSF.x_studio_salesforce_token"
                    />
                    <label for="x_studio_salesforce_token"
                      >Salesforce Token</label
                    >
                  </div>
                </div>
                <div class="row-h2">
                  <div class="form-row">
                    <input
                      type="text"
                      name="device_type_id"
                      :value="updateRowDataSF.device_type_id"
                    />
                    <label for="device_type_id">Device Type</label>
                  </div>
                </div>
                <div class="row-h3">
                  <div class="form-row">
                    <input type="text" :value="updateRowDataSF.name" />
                    <label for="name">Serial Number</label>
                  </div>
                </div>
                <div class="row-h4">
                  <div class="form-row">
                    <input
                      type="text"
                      :value="updateRowDataSF.pid_name_concat"
                    />
                    <label for="pid_name_concat">PIDS</label>
                  </div>
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
// import Helper from "@/common/helper";

export default {
  name: "EditAssetRecord",
  props: {
    rowDataSF: Object,
    rowDataOdoo: Object,
    fieldMapData: Array,
    countries: Array,
    states: Array,
    users: Array,
    selectedType: String,
    IsPageIndex: Number,
    isEditable: Boolean,
  },
  data() {
    return {
      type: { sf: "sf", odoo: "odoo" },
      updateRowDataSF: {},
      updateRowDataOdoo: {},
      disableProperties: [
        "Id",
        "id",
        "attributes",
        "x_studio_account_number",
        "Account_Number__c",
        "user_id",
        "OwnerId",
        "parent_id",
        "ParentId",
      ],
      newObj: {
        sf_recs: [
          {
            Id: null,
            SerialNumber: null,
            Account__c: null,
            R_PID__c: null,
            R_PID_2__c: null,
            R_PID_3__c: null,
            R_PID_4__c: null,
            T_PID__c: null,
            Type_of_Asset__c: null,
            Odoo_Update_Needed__c: null,
          },
        ],
      },
    };
  },
  computed: {
    ...mapState({ assetsData: (state) => state.compareAssetRecord.assetsData }),
    ...mapState({ syncToOdoo: (state) => state.compareAssetRecord.syncToOdoo }),
  },
  created() {},
  mounted() {
    this.setRowDataSF();
  },
  watch: {
    //  syncToOdoo()
    //   {
    //   if(!this.syncToOdoo.isUpdatingSyncToOdoo && !this.syncToOdoo.isUpdatedSyncToOdoo && !this.syncToOdoo.errorUpdatingSyncToOdoo){
    //    if(this.syncToOdoo.responseData.response.status==="SUCCESS"){

    //   if(this.selectedType=="Ids"){
    //       const searchId = {
    //         Id: this.updateRowDataSF.Id,
    //       };
    //     console.log("new record",this.newObj);
    //    this.$store.dispatch("compareAssetRecord/actionGetRelatedAssetsData", searchId);
    //      }
    //       else {
    //       const alldata = {
    //       start: (this.IsPageIndex-1)*10,
    //       num_of_recs: 10,
    //       };
    //       if(this.selectedType == "Update Needed"){
    //        alldata.type= "updated_only"

    //       }
    //         this.$store.dispatch("compareAssetRecord/actionGetRelatedAssetsData", alldata);
    //          this.isEditable=[];
    //       }
    //     }
    //   }
    //   },

    rowDataSF() {
      this.setRowDataSF();
    },
  },
  methods: {
    onClickSyncToOddo() {
      this.newObj["sf_recs"][0].Id = this.updateRowDataSF.Id;
      this.newObj["sf_recs"][0].Account__c = this.updateRowDataSF.Account__c;
      this.newObj[
        "sf_recs"
      ][0].Type_of_Asset__c = this.updateRowDataSF.Type_of_Asset__c;
      this.newObj[
        "sf_recs"
      ][0].SerialNumber = this.updateRowDataSF.SerialNumber;
      this.newObj["sf_recs"][0].R_PID__c = this.updateRowDataSF.R_PID__c;
      this.newObj["sf_recs"][0].R_PID_2__c = this.updateRowDataSF.R_PID_2__c;
      if (this.updateRowDataSF.R_PID_3__c)
        this.newObj["sf_recs"][0].R_PID_3__c = this.updateRowDataSF.R_PID_3__c;
      if (this.updateRowDataSF.R_PID_4__c)
        this.newObj["sf_recs"][0].R_PID_4__c = this.updateRowDataSF.R_PID_4__c;
      if (this.updateRowDataSF.Odoo_Update_Needed__c)
        this.newObj[
          "sf_recs"
        ][0].Odoo_Update_Needed__c = this.updateRowDataSF.Odoo_Update_Needed__c;
      if (this.updateRowDataSF.T_PID__c)
        this.newObj["sf_recs"][0].T_PID__c = this.updateRowDataSF.T_PID__c;

      this.$store.dispatch("compareAssetRecord/actionSyncToOdoo", this.newObj);
      //.then(()=>{
      //     if(this.selectedType=="Id"){
      //     const searchId = {
      //       Id: this.updateRowDataSF.Id,
      //     };
      //   console.log("new record",this.newObj);
      //  this.$store.dispatch("compareAssetRecord/actionGetRelatedAssetsData", searchId);
      //     }
      //     else {
      //        const alldata = {
      //       start: this.IsPageIndex*10,
      //     num_of_recs: 10,
      //     };
      //     if(this.selectedType == "Update Needed"){
      //      alldata.type= "updated_only"
      //     }
      //       this.$store.dispatch("compareAssetRecord/actionGetRelatedAssetsData", alldata);
      //     }

      // })

      //  await this.$store.dispatch("compareAssetRecord/actionGetRelatedAssetsData", this.newObj);

      //  setTimeout(() => {

      // }, 10000);
      // if(this.showSuccessModal==true)
      // {
      // console.log("value in sync to odoo", this.showSuccessModal)
      // this.$store.dispatch("compareAssetRecord/actionGetRelatedAssetsData", searchId);
      // }
    },
    setRowDataSF() {
      this.updateRowDataSF = { ...this.rowDataSF };
    },
    isDisable(_key) {
      //let isFlag = this.disableProperties.includes(_key);
      let isFlag = false;
      isFlag = this.disableProperties.some((data) => data == _key);
      return isFlag;
    },
  },
};
</script>
<style scoped>
.search-filter {
  display: flex;
  margin: 10px 0;
}
.search-filter .input-field {
  width: 170px;
  margin-left: 10px;
  margin-right: 10px;
}
.row-h1 {
  margin-bottom: 18px;
  box-shadow: 0px 0px 4px #c5c5c5;
  padding: 10px;
  border-radius: 4px;
}
.row-h2 {
  box-shadow: 0px 0px 4px #c5c5c5;
  padding: 10px;
  margin-bottom: 18px;
  border-radius: 4px;
}
.row-h3 {
  height: 113px;
  box-shadow: 0px 0px 4px #c5c5c5;
  padding: 10px;
  margin-bottom: 18px;
  border-radius: 4px;
}
.row-h4 {
  height: 303px;
  box-shadow: 0px 0px 4px #c5c5c5;
  padding: 10px;
  margin-bottom: 18px;
  border-radius: 4px;
}
.checkbox-comp {
  min-height: 25px;
}
.checkbox-comp2 {
  font-size: 14px;
}
.search-filter {
  margin: 10px 0;
}
.search-filter .input-field {
  width: 170px;
  padding: 5.5px;
  font-size: 13px;
  color: #626262;
}
.main-head .sync1 {
  position: absolute !important;
  left: 12px;
  right: 0px;
  margin: auto !important;
}
.pagination {
  display: flex;
  margin-top: 34px;
  margin-bottom: 30px;
  justify-content: flex-end;
}
.pagination .el-pagination {
  display: flex;
}
</style>

<style>
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background-color: #13ade8 !important;
  color: #fff;
}
</style>
