<template>
  <div class="page-wrapper">
    <div class="mobile-menu">
      <i class="icon icon-mobile-menu"></i>
    </div>

    <!-- <NagvigationMenu /> -->

    <div class="content-area" style="height: 100%">
      <div class="relative">
        <div
          class="content-wrapper"
          v-loading="isLoading || isSyncingData"
          element-loading-text="Loading..."
        >
          <div class="router-view">
            <!-- "heading compare records" start -->
            <div class="sec-title">
              <h1>Compare Asset Records</h1>

              <span style="display: none">{{ hide }}</span>
            </div>
            <!-- "heading compare records" end -->

            <!-- "main compare records" start -->

            <!-- "top pagination dropdown" end -->

            <!-- start -->
            <div class="content-area__content">
              <div class="compare-table">
                <div class="toolbar">
                  <div class="setup-btn">
                    <el-button type="primary" v-on:click="performanceSync()"
                      ><b>Sync & Update</b></el-button
                    >
                  </div>
                </div>
                <div class="compare-table__content">
                  <div class="main-table">
                    <div class="main-head">
                      <div class="main-table-cell">Salesforce</div>
                      <div class="sync1"></div>
                      <div class="main-table-cell">Odoo</div>
                    </div>
                    <div class="search-filter">
                      <el-select
                        v-model="selectedType"
                        placeholder="Select"
                        v-on:input="onChangeSelect($event)"
                      >
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                      <input
                        class="input-field"
                        v-model="searchValue"
                        v-if="IsSearchVisible"
                        placeholder="Search Here"
                      />
                      <el-button type="primary" v-on:click="search()">
                        Search</el-button
                      >
                    </div>

                    <div class="table-head">
                      <div class="table-cell button"></div>
                      <div class="sf-cell">
                        <!-- <div class="table-cell"><span>Asset Number</span></div> -->
                        <div
                          v-for="(sflist, index) in gridSFList"
                          :key="sflist.description + index"
                          class="table-cell"
                        >
                          <span :title="sflist.sf_name">{{
                            sflist.description !== " "
                              ? sflist.description
                              : sflist.sf_name
                          }}</span>
                        </div>
                        <!-- <div class="table-cell"><span>Account No</span></div> -->
                      </div>
                      <div class="oddo-cell">
                        <!-- <div class="table-cell"><span>Name</span></div>
                        <div class="table-cell"><span>Account No</span></div> -->
                        <div
                          v-for="(list, index) in gridOdooList"
                          :key="list.description + index"
                          class="table-cell"
                        >
                          <span :title="list.odoo_name">{{
                            list.description !== " "
                              ? list.description
                              : list.odoo_name
                          }}</span>
                        </div>
                      </div>
                    </div>
                    <!-- <div class="table-row">
                      <div class="table-cell button" v-on:click="myFunction">
                        <i class="icon icon-edit" title="Edit Record"></i>
                      </div>
                      <div class="sf-cell">
                        <div class="table-cell"><span>Nikhil Jain</span></div>
                        <div class="table-cell"><span>859678ER58</span></div>
                      </div>
                      <div class="oddo-cell">
                        <div class="table-cell"><span>Nikhil </span></div>
                        <div class="table-cell"><span>859678ER58</span></div>
                      </div>
                    </div> -->
                    <div
                      class="table-row"
                      v-for="(row, index) in assets"
                      :key="index"
                    >
                      <div class="table-cell button">
                        <i
                          class="icon icon-edit"
                          v-on:click="editDetails(index)"
                          title="Edit Asset Record"
                        ></i>
                      </div>

                      <div class="sf-cell">
                        <div class="table-cell">
                          <span>{{ assets[index].Id }}</span>
                        </div>
                        <div class="table-cell">
                          <span>{{ assets[index].Account__c }}</span>
                        </div>
                      </div>
                      <div class="oddo-cell">
                        <div class="table-cell">
                          <span>{{
                            assets[index].x_studio_salesforce_token
                          }}</span>
                        </div>
                        <div class="table-cell">
                          <span>{{ assets[index].id }}</span>
                        </div>
                      </div>
                      <EditAssetRecord
                        :countries="countries"
                        :states="states"
                        :users="users"
                        :rowDataSF="assets[index]"
                        :rowDataOdoo="assets[index]"
                        :fieldMapData="assets"
                        :selectedType="selectedType"
                        :IsPageIndex="IsPageIndex"
                        v-if="isEditable[index]"
                        @setType="setType"
                      />
                    </div>

                    <div class="pagination" v-if="assets.length > 0">
                      <el-pagination
                        background
                        layout="prev, pager, next"
                        prev-text="prev"
                        next-text="next"
                        :page-size="10"
                        :current-page="IsPageIndex"
                        @prev-click="handleCurrentChange"
                        @next-click="handleCurrentChange"
                        @current-change="handleCurrentChange"
                        :total="total_records"
                      >
                      </el-pagination>
                    </div>
                    <!-- "bottom pagination" end -->
                  </div>
                  <!-- "compare table" end -->
                </div>
                <!-- "main compare records" end -->
              </div>
            </div>
          </div>
        </div>
        <Success
          :successMessage="updatedlist"
          :showModal="showSuccessModal"
          @close="showSuccessModal = false"
        />
        <SyncSuccess
          :showModal="showSyncSuccessModal"
          @close="showSyncSuccessModal = false"
        />
        <Progress
          :progress="progress"
          :showModal="showProgressModal"
          @close="showProgressModal = false"
        />
        <ErrorModal
          :errorMsg="errorMsg"
          :showModal="isErrorUpdate"
          @close="isErrorUpdate = false"
        />
      </div>
    </div>
  </div>
</template>
<script>
// import TableRow from "@/components/common/Table/TableRow";
// import EditRecord from "@/components/common/EditRecord";
import EditAssetRecord from "@/components/common/EditAssetRecord";
import Success from "@/components/common/Modal/Success";
import SyncSuccess from "@/components/common/Modal/SyncSuccess";
import Progress from "@/components/common/Modal/Progress";
import ErrorModal from "@/components/common/Modal/AssetError";
//import Helper from "@/common/helper";
import { mapState } from "vuex";
export default {
  name: "CompareAssetsRecord",
  components: {
    // TableRow,
    EditAssetRecord,
    SyncSuccess,
    ErrorModal,
    Success,
    Progress,
  },
  data() {
    return {
      selected: "",
      sfData: [],
      odooData: [],
      options: [
        {
          value: "ALL",
          label: "ALL",
        },
        {
          value: "Ids",
          label: "Ids",
        },
        {
          value: "Update Needed",
          label: "Update Needed",
        },
      ],
      value: "ALL",
      selectedType: "ALL",
      IsSearchVisible: false,
      showEditModal: false,
      //selectedRowObj: null,
      //selectedRowId: "",
      selectedRowType: "",
      selectedSyncData: {},
      checkedRowObject: {},
      total_records: "",
      isSyncingData: false,
      isLoading: false,
      isErrorUpdate: false,
      fieldMapList: [],

      gridSFList: [
        {
          description: "Salesforce Id ",
        },
        {
          description: "Salesforce Account",
        },
      ],
      gridOdooList: [
        {
          description: " X_studio_salesforce_token ",
        },
        {
          description: "Odoo Id",
        },
      ],
      gridProList: [
        {
          //description: "Unique Account Number",
          odoo_name: "x_studio_account_number",
          sf_name: "Account_Number__c",
        },
        {
          //description: "Account Name",
          odoo_name: "name",
          sf_name: "Name",
        },
      ],
      alldata: {
        start: 0,
        num_of_recs: 10,
      },
      searchValue: "",
      gridProFilter: [],
      countries: [],
      states: [],
      users: [],
      assets: [],
      isEditable: [],
      hide: 1,
      currentClick: 0,
      previousClick: 0,
      type: { sf: "sf", odoo: "odoo" },
      updateType: "",
      searchFValidated: false,
      showSuccessModal: false,
      showSyncSuccessModal: false,
      showErrorModal: false,
      showProgressModal: false,
      progress: 0,
      IsPageIndex: null,
      errorMsg: "",
      ErrorDisplay: "",
      confirmationMsg: false,
      updatedlist: "",
      createdlist: "Record Created in Odoo with  Saleforce Id",
      isCreating: null,
      isErrorCreating: null,
      previousSelected: "ALL",
      hideEdit: false,
    };
  },
  mounted() {
    const isDataFetched = this.isDataFetched() || "true";
    if (isDataFetched == "true") {
      this.IsPageIndex = this.getPageIndex() * 1;
    } else {
      this.IsPageIndex = 1;
    }
    this.selectedType = this.getSelectedType() || "ALL";
    this.IsSearchVisible = this.selectedType == "Ids" ? true : false;
    this.previousSelected = this.getSelectedType() || "ALL";
    // console.log("IsPageIndex ===> ", this.IsPageIndex),
    this.updatePageIndex(this.IsPageIndex);
    // this.fetchSfData();
    this.fetchFieldMap();
    this.getCountryData();
    this.getStateData();
    this.getUserData();
    this.getRelatedAssetsData();
    this.isEditable = [];
  },
  computed: {
    ...mapState({
      assetsSyncRecord: (state) => state.compareAssetRecord.assetsSync,
    }),
    ...mapState({ assetsData: (state) => state.compareAssetRecord.assetsData }),
    ...mapState({ syncToOdoo: (state) => state.compareAssetRecord.syncToOdoo }),
    ...mapState({ assetsSync: (state) => state.compareAssetRecord.assetsSync }),
    ...mapState({ relatedData: (state) => state.compareRecord.relatedData }),
    ...mapState({ fieldMapdata: (state) => state.compareRecord.fieldMap }),
    // ...mapState({ updateSfData: (state) => state.salesForce.updateSfData }),
    // ...mapState({ updateOdooData: (state) => state.Odoo.updateOdooData }),
    ...mapState({
      userList: (state) => state.compareRecord.userData.responseData,
    }),
    ...mapState({
      countryList: (state) => state.compareRecord.countryData.responseData,
    }),
    ...mapState({
      stateList: (state) => state.compareRecord.stateData.responseData,
    }),
  },
  watch: {
    syncToOdoo() {
      this.isLoading = true;
      // console.log("page index", this.IsPageIndex);
      // console.log("function", this.getPageIndex());
      if (
        !this.syncToOdoo.isUpdatingSyncToOdoo &&
        !this.syncToOdoo.isUpdatedSyncToOdoo &&
        !this.syncToOdoo.errorUpdatingSyncToOdoo
      ) {
        if (this.syncToOdoo.responseData.response.status === "SUCCESS") {
          // console.log("syn to odoo response came");
          if (
            this.syncToOdoo.responseData.response.created_id_list.length > 0
          ) {
            // console.log("Record created in odoo with id");

            this.syncToOdoo.responseData.response.created_id_list.map(
              (item) => {
                //  this.createdlist= this.createdlist+' '+ item + '.'
                this.updatedlist =
                  "Record Created in Odoo with  Saleforce Id" +
                  " " +
                  item +
                  ".";
              }
            );
            this.isCreating = true;
            this.confirmationMsg = true;
            this.isLoading = false;
            this.showSuccessModal = true;
          }
          if (
            this.syncToOdoo.responseData.response.updated_id_list.length > 0
          ) {
            this.syncToOdoo.responseData.response.updated_id_list.map(
              (item) => {
                this.updatedlist =
                  "Record Updated in Odoo with  Salesforce Id" +
                  " " +
                  item +
                  ".";
                // if(this.selectedType=="Update Needed"){

                //   this.isEditable[this.previousClick] = false;
                //    this.isEditable[this.currentClick] = false
                // }
              }
            );
            this.isCreating = false;
            this.confirmationMsg = true;

            // this.updatedlist= this.updatedlist+'.'

            if (this.selectedType == "Update Needed") {
              this.isEditable[this.previousClick] = false;
              this.isEditable[this.currentClick] = false;
            }
            if (this.selectedType == "Ids") {
              const searchId = {
                Id: this.searchValue,
              };
              // console.log("new record", this.newObj);
              this.$store.dispatch(
                "compareAssetRecord/actionGetRelatedAssetsData",
                searchId
              );
            } else {
              const currentpage = this.getPageIndex() ? this.getPageIndex() : 1;
              // const currentpage=this.getPageIndex()?this.getPageIndex():1;
              // const currentpage=this.getPageIndex()
              const alldata = {
                start: (currentpage - 1) * 10,
                num_of_recs: 10,
              };
              if (this.selectedType == "Update Needed") {
                alldata.type = "updated_only";
                this.isEditable = [];
              }
              this.$store.dispatch(
                "compareAssetRecord/actionGetRelatedAssetsData",
                alldata
              );
            }

            this.isLoading = false;
            this.showSuccessModal = true;
          }
          if (
            this.syncToOdoo.responseData.response.not_updated_list.length > 0
          ) {
            this.isLoading = false;
            this.isErrorUpdate = true;
            this.syncToOdoo.responseData.response.not_updated_list.map(
              (item) => {
                this.errorMsg =
                  "Error could not update the record in Odoo with Salesforce Id" +
                  " " +
                  item +
                  ".";
              }
            );
          }
        }
      }
    },

    assetsSyncRecord() {
      //  this.showProgressModal = true;
      this.progress = this.assetsSyncRecord.assetsSync.progress;

      // if (
      //   !this.assetsSyncRecord.isFechingAssetsSync &&
      //   !this.assetsSyncRecord.iserrorFechingAssetsSync
      // ) {
      // console.log("assest sync", this.assetsSyncRecord.assetsSync.progress);

      if (this.assetsSyncRecord.assetsSync.progress !== 100) {
        this.showProgressModal = true;
        // this.showSuccessModal = true;
      }
      if (this.assetsSyncRecord.assetsSync.progress === 100) {
        this.showProgressModal = false;
        this.showSyncSuccessModal = true;
      }

      //  if (this.assetsSyncRecord) {
      //    console.log("assest syncooooooo",this.assetsSyncRecord)

      //         if (this.assetsSyncRecord.responseData.status === "SUCCESS") {
      //           if (
      //             this.assetsSyncRecord.responseData.result.data.progress !== 100
      //           ) {
      //             this.showProgressModal = true;

      // console.log(
      //   "progress display",
      //   this.performsyncfieldMap.responseData.result.data.progress
      // );
      // } else if (
      //   this.assetsSyncRecord.responseData.result.status ===
      //     "Completed" &&
      //   this.assetsSyncRecord.responseData.result.data.progress === 100
      // ) {
      //   // console.log(
      //   //   "configuired",
      //   //   this.performsyncfieldMap.responseData.result.data.progress
      //   // );
      //   this.showProgressModal = false;
      //   this.showSuccessModal = true;

      // }
      //}
    },
    assetsData() {
      this.isLoading = true;
      // console.log("asstsdata...calling....");
      if (
        !this.assetsData.isFechingAssetsData &&
        !this.assetsData.errorFechingAssetsData
      ) {
        this.assets = this.$store.state.compareAssetRecord.assetsData.assetsData.result;

        this.total_records = this.$store.state.compareAssetRecord.assetsData.assetsData.total_recs;
        if (this.assets.length == 0) {
          // console.log("unique .....");
          this.isLoading = false;
          this.errorMsg = "No Record Found";
          this.isErrorUpdate = true;
        }
        if (this.assets && this.assets.length > 0) {
          this.isLoading = false;
          this.isSyncingData = false;
        }
      }
    },
    userList() {
      if (
        !this.userList.isFechingUserData &&
        !this.userList.errorFechingUserData
      ) {
        this.users = this.$store.state.compareRecord.userData.responseData;
      }
    },
    countryList() {
      if (
        !this.countryList.isFechingUserData &&
        !this.countryList.errorFechingUserData
      ) {
        this.countries = this.$store.state.compareRecord.countryData.responseData;
      }
    },
    stateList() {
      if (
        !this.stateList.isFechingUserData &&
        !this.stateList.errorFechingUserData
      ) {
        this.states = this.$store.state.compareRecord.stateData.responseData;
      }
    },
    fieldMapdata() {
      if (
        this.fieldMapdata.isFechingFieldMap == false &&
        this.fieldMapdata.errorFechingFieldMap == false
      ) {
        this.fieldMapList = this.fieldMapdata.fieldMap;
        this.fieldMapdata.fieldMap.forEach((e) => {
          if (this.isHeadingAvailable(e.odoo_name)) {
            this.gridProFilter.push(e);
          }
        });
      }
    },

    relatedData() {
      //alert(this.isLoading + "--" + this.isSyncingData)
      if (
        this.relatedData.errorFechingRelatedData == false &&
        this.relatedData.isFechingRelatedData === false
      ) {
        this.sfData = this.relatedData.relatedData.data.response.sf_rec;
        this.odooData = this.relatedData.relatedData.data.response.odoo_rec;

        if (
          (this.sfData && this.sfData.length > 0) ||
          (this.odooData && this.odooData.length > 0)
        ) {
          this.isLoading = false;
          this.isSyncingData = false;
        }
      }
    },
    updateSfData() {
      if (!this.updateSfData.isUpdatingSFData) {
        //console.log(this.updateSfData.responseData);
        if (this.updateSfData.responseData.result.status === "Failed") {
          this.isErrorUpdate = true;
        }
        if (this.updateType == this.type.sf) {
          this.isSyncingData = true;
          this.$store.dispatch("compareAssetRecord/actionFetchSfOdoo");
        }
      } else {
        this.isSyncingData = true;
      }
    },
    updateOdooData() {
      if (!this.updateOdooData.isUpdatingOdooData) {
        if (this.updateOdooData.responseData.result.status === "Failed") {
          this.isErrorUpdate = true;
        }
        if (this.updateType == this.type.odoo) {
          this.isSyncingData = true;
          this.$store.dispatch("compareAssetRecord/actionFetchSfOdoo");
        }
        //this.selectedRowObj = null;
        //this.selectedRowId = "";
      } else {
        this.isSyncingData = true;
      }
    },
  },
  methods: {
    performanceSync() {
      this.$store.dispatch("compareAssetRecord/actionAssetSync");
    },
    displayModalMsg() {
      if (this.confirmationMsg) {
        return this.isCreating ? this.createdlist : this.updatedlist;

        //   if(this.isCreating){
        //     return this.createdlist
        //   }
        //   else{
        //     return this.updatedlist
        //   }
      }

      //  return this.confirmationMsg ? this.isCreating ? this.createdlist:this.updatedlist:""
    },
    displayErrorMsg() {
      if (this.errorMsg) {
        return this.isErrorCreating ? this.ErrorDisplay : this.errorMsg;
      }
    },

    search() {
      localStorage.setItem("dataFetched", true);
      // console.log("hello ");
      this.isLoading = true;
      this.assets = [];
      this.isEditable = [];
      if (this.selectedType !== this.previousSelected) {
        this.previousSelected = this.selectedType;
        this.IsPageIndex = 1;
      }
      if (this.selectedType == "ALL") {
        this.IsPageIndex = 1;
        // console.log("hello all");
        const alldata = {
          start: 0,
          num_of_recs: 10,
        };
        //  const currentpage=this.getPageIndex()?this.getPageIndex():1;
        // const alldata = {
        // start: (currentpage-1)*10,
        // num_of_recs: 10,
        // };
        this.$store.dispatch(
          "compareAssetRecord/actionGetRelatedAssetsData",
          alldata
        );
      } else if (this.selectedType == "Ids") {
        this.IsPageIndex = 1;
        // console.log("hello ids");
        const searchId = {
          Id: this.searchValue,
        };
        this.$store.dispatch(
          "compareAssetRecord/actionGetRelatedAssetsData",
          searchId
        );
      } else if (this.selectedType == "Update Needed") {
        this.IsPageIndex = 1;
        const updateSearch = {
          start: 0,
          num_of_recs: 10,
          type: "updated_only",
        };
        this.$store.dispatch(
          "compareAssetRecord/actionGetRelatedAssetsData",
          updateSearch
        );
        // console.log("hello update");
      }

      localStorage.setItem("pageIndex", this.IsPageIndex);
    },
    myFunction() {
      var element = document.getElementById("myDIV");
      element.classList.toggle("mystyle");
    },
    // click()
    // {
    // $(this).parent().addClass('active');
    // },
    // onChangeSelect (e) {
    //   this.$emit('input', e)
    //   this.selected = e
    //   console.log(e)
    //   if(e=="Ids"){
    //       this.searchFValidated = true
    //   }else{
    //       this.searchFValidated = false
    //   }
    // },

    onChangeSelect(evt) {
      this.IsSearchVisible = evt == "Ids" ? true : false;
      this.selectedType = evt;
      this.searchValue = "";
      localStorage.setItem("selectedType", evt);
      localStorage.setItem("dataFetched", false);
    },
    handleCurrentChange(val) {
      // console.log(`current page: ${val-1}`);
      // this.assets=[];
      this.IsPageIndex = val;
      this.isEditable = [];
      const pageObj = {
        start: parseInt(val - 1) * 10,
        num_of_recs: 10,
      };
      if (this.selectedType == "Update Needed") {
        pageObj.type = "updated_only";
      }
      // this.pageObj["page_num"] = ;
      localStorage.setItem("pageIndex", val);
      this.isLoading = true;
      this.$store.dispatch(
        "compareAssetRecord/actionGetRelatedAssetsData",
        pageObj
      );
    },
    updatePageIndex(evt) {
      // console.log(" evt ===>", evt);
      if (evt == null) {
        evt = 0;
        this.alldata = { start: evt, num_of_recs: 10 };
      } else {
        // console.log("NOT null evt ===>", evt);
        // console.log("NOT null parseInt ===>", parseInt(evt - 1) * 10);
        this.alldata = { start: parseInt(evt - 1) * 10, num_of_recs: 10 };
      }
    },
    getPageIndex() {
      return localStorage.getItem("pageIndex");
    },
    getSelectedType() {
      return localStorage.getItem("selectedType");
    },
    isDataFetched() {
      return localStorage.getItem("dataFetched");
    },

    getUserData() {
      this.$store.dispatch("compareRecord/actionGetUserData", "");
    },
    getCountryData() {
      this.$store.dispatch("compareRecord/actionGetCountryData", "");
    },
    getStateData() {
      this.$store.dispatch("compareRecord/actionGetStateData", "");
    },
    isHeadingAvailable(_data) {
      let isAvailable = false;
      isAvailable = this.gridProList.some((data) => data.odoo_name == _data);
      return isAvailable;
    },
    getRelatedAssetsData() {
      // console.log("this.pageObj", this.pageObj);

      if (this.selectedType == "ALL") {
        const currentpage = this.getPageIndex() ? this.getPageIndex() : 1;
        const alldata = {
          start: (currentpage - 1) * 10,
          num_of_recs: 10,
        };
        this.$store.dispatch(
          "compareAssetRecord/actionGetRelatedAssetsData",
          alldata
        );
      } else if (this.selectedType == "Update Needed") {
        const currentpage = this.getPageIndex() ? this.getPageIndex() : 1;
        const alldata = {
          start: (currentpage - 1) * 10,
          num_of_recs: 10,
          type: "updated_only",
        };

        this.$store.dispatch(
          "compareAssetRecord/actionGetRelatedAssetsData",
          alldata
        );
      }
      //       else if(this.selectedType=='Ids')
      //       {
      //          const searchId = {
      //           Id: this.searchValue,
      //         };
      //  this.$store.dispatch(
      //         "compareAssetRecord/actionGetRelatedAssetsData",
      //         searchId
      //       );
      //       }
    },
    fetchSfData() {
      this.isLoading = true;
      this.$store.dispatch("compareAssetRecord/actionFetchSfOdoo");
    },
    fetchFieldMap() {
      this.$store.dispatch("compareRecord/actionfieldMap");
    },

    editDetails(_selectedRowIndex) {
      this.hide = this.hide + 1;
      this.previousClick = this.currentClick;
      this.currentClick = _selectedRowIndex;

      if (this.previousClick == this.currentClick) {
        this.isEditable[this.currentClick] = !this.isEditable[
          this.currentClick
        ];
      } else {
        this.isEditable[this.previousClick] = false;
        this.isEditable[this.currentClick] = true;
      }
      // console.log("currentClick", this.currentClick);
      // console.log("isEditable", this.isEditable);
    },
    setType(_value) {
      this.updateType = _value;
    },
  },
  beforeDestroy: function () {
    // console.log("beforeDestroy called");
    localStorage.removeItem("pageIndex");
    localStorage.removeItem("selectedType");

    // localStorage.removeItem(this.pageIndex);
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
.pagination ul {
  padding: 0;
  background: transparent;
  border-radius: 2px;
  margin: 0px 4px;
}
.el-pagination button,
.el-pagination button span {
  height: 35px !important;
  line-height: 35px !important;
}
.el-pagination {
  padding: 0;
}
.pagination .btn-next,
.pagination .btn-prev {
  margin: 0 !important;
}
.search-filter button {
  margin-left: 5px;
}
</style>