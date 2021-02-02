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
              <h1>Compare Records </h1>

              <span style="display: none">{{ hide }}</span>
            </div>
            <!-- "heading compare records" end -->

            <!-- "main compare records" start -->
            <div class="content-area__content">
              <!-- "compare table" start -->
              <div class="compare-table">
                <!-- "top pagination dropdown" start -->
                <!-- <div class="toolbar">
                  <div class="setup-btn">
                    <button
                      style="visibility:hidden"
                      type="button"
                      :disabled="Object.keys(selectedSyncData).length === 0"
                      @click="syncTableData"
                      class="input-btn sync-btn"
                    >
                      {{
                        this.isSyncingData
                          ? "Record Syncing..."
                          : this.selectedRowType === "sf_name"
                          ? "Sync to Odoo"
                          : "Sync to SalesForce"
                      }}
                    </button>
                  </div>
                   <div class="pagination-dropdown">
                    <select class="input-field">
                      <option>1-10 of 50</option>
                      <option>test02</option>
                    </select>
                  </div> 
                </div> -->
                <!-- "top pagination dropdown" end -->

                <!-- start -->
                <div class="compare-table__content">
                  <div class="main-table">
                    <!-- "heading : Salesforce, icon , Oddo " start -->

                    <div class="main-head">
                      <div class="main-table-cell">Salesforce</div>
                      <div class="sync"></div>
                      <div class="main-table-cell">Odoo</div>
                    </div>

                    <!-- "heading : Salesforce, icon , Oddo " end -->

                    <!-- "properties heading for SF and odoo" start -->
                    <div class="table-head">
                      <div class="table-cell button"></div>

                      <div class="sf-cell">
                        <div
                          v-for="(field, index) in gridProFilter"
                          :key="field.description + index"
                          class="table-cell"
                        >
                          <span :title="field.sf_name">{{
                            field.description !== " "
                              ? field.description
                              : field.sf_name
                          }}</span>
                        </div>
                      </div>
                      <div class="oddo-cell">
                        <div
                          v-for="(field, index) in gridProFilter"
                          :key="field.description + index"
                          class="table-cell"
                        >
                          <span :title="field.odoo_name">{{
                            field.description !== " "
                              ? field.description
                              : field.odoo_name
                          }}</span>
                        </div>
                      </div>
                    </div>
                    <!-- "properties heading for SF and odoo " end -->

                    <!-- "all records" start -->
                    <div
                      class="table-row"
                      v-for="(row, index) in sfData"
                      :key="index"
                    >
                      <div class="table-cell button">
                        <i
                          class="icon icon-edit"
                          v-on:click="editDetails(index)"
                          title="Edit Record"
                        ></i>
                      </div>
                      <div class="sf-cell">
                        <div
                          class="table-cell"
                          v-for="(sfRow, sfIndex) in gridProList"
                          :key="sfIndex"
                        >
                          <span class="more-text" :title="sfData[index][sfRow.sf_name]">{{ sfData[index][sfRow.sf_name] }}</span>
                        </div>
                      </div>
                      <div class="oddo-cell">
                        <div
                          class="table-cell"
                          v-for="(odooRow, odooIndex) in gridProList"
                          :key="odooIndex"
                        >
                          <span class="more-text" :title="odooData[index][odooRow.odoo_name]">{{ odooData[index][odooRow.odoo_name] }}</span>
                        </div>
                      </div>
                      <EditRecord
                        :countries="countries"
                        :states="states"
                        :users="users"
                        :rowDataSF="sfData[index]"
                        :rowDataOdoo="odooData[index]"
                        :fieldMapData="fieldMapList"
                        v-if="isEditable[index]"
                        @setType="setType"
                      />
                    </div>
                    <!-- "all records" end -->

                    <!-- "Edit page for first" start -->
                    <!-- "Edit page for first" end -->
                  </div>
                </div>
                <!-- end -->

                <!-- "bottom pagination" start -->
                <div class="pagination" v-if="totalRecords > 0" >
                  <el-pagination
                    background
                    layout="prev, pager, next"
                    prev-text="prev"
                    next-text="next"
                    :page-size="10"
                    :current-page.sync="isPageIndexAccount"
                    @prev-click="handleCurrentChange"
                    @next-click="handleCurrentChange"
                    @current-change="handleCurrentChange"
                    :total="totalRecords"
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
    <ErrorModal :showModal="isErrorUpdate" @close="isErrorUpdate = false" />
  </div>
</template>
<script>
// import TableRow from "@/components/common/Table/TableRow";
import EditRecord from "@/components/common/EditRecord";
import ErrorModal from "@/components/common/Modal/Error";
//import Helper from "@/common/helper";
import { mapState } from "vuex";
export default {
  name: "CompareRecord",
  components: {
    // TableRow,
    EditRecord,
    ErrorModal,
  },
  data() {
    return {
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
          value: "UPDATED Records",
          label: "UPDATED Record",
        },
      ],
      value: "ALL",
      showEditModal: false,
      //selectedRowObj: null,
      //selectedRowId: "",
      selectedRowType: "",
      selectedSyncData: {},
      checkedRowObject: {},
      isSyncingData: false,
      isLoading: false,
      isErrorUpdate: false,
      fieldMapList: [],
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
      gridProFilter: [],
      countries: [],
      states: [],
      users: [],
      isEditable: [],
      hide: 1,
      currentClick: 0,
      previousClick: 0,
      type: { sf: "sf", odoo: "odoo" },
      updateType: "",
      alldata: {
        start: 0,
        num_of_recs: 10,
      },
      totalRecords: "",
      isPageIndexAccount: null,
    };
  },
  mounted() {
    const pageIndex = this.getPageIndex() * 1;
    const currentpage = pageIndex ? pageIndex : 1;
    // console.log("currentpage ----> ", currentpage);
    this.isPageIndexAccount = currentpage;
    // console.log("isPageIndexAccount ----> ", this.isPageIndexAccount);
    this.fetchSfData();
    this.fetchFieldMap();
    this.getCountryData();
    this.getStateData();
    this.getUserData();
    this.isEditable = [];
    // this.isPageIndexAccount = 1;
    this.updatePageIndex(this.isPageIndexAccount);

  },
  computed: {
    ...mapState({ relatedData: (state) => state.compareRecord.relatedData }),
    ...mapState({ fieldMapdata: (state) => state.compareRecord.fieldMap }),
    ...mapState({ updateSfData: (state) => state.salesForce.updateSfData }),
    ...mapState({ updateOdooData: (state) => state.Odoo.updateOdooData }),
    ...mapState({ userList: (state) => state.compareRecord.userData.responseData,}),
    ...mapState({ countryList: (state) => state.compareRecord.countryData.responseData,}),
    ...mapState({ stateList: (state) => state.compareRecord.stateData.responseData,}),
  },
  watch: {
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
      if (
        this.relatedData.errorFechingRelatedData == false &&
        this.relatedData.isFechingRelatedData === false
      ) {
        this.sfData = this.relatedData.relatedData.data.response.sf_rec;
        this.odooData = this.relatedData.relatedData.data.response.odoo_rec;
        this.totalRecords = this.relatedData.relatedData.data.response.total_recs;

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
          this.$store.dispatch("compareRecord/actionFetchSfOdoo");
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
          this.$store.dispatch("compareRecord/actionFetchSfOdoo");
        }
        //this.selectedRowObj = null;
        //this.selectedRowId = "";
      } else {
        this.isSyncingData = true;
      }
    },
  },
  methods: {
    // click()
    // {
    // $(this).parent().addClass('active');
    // },

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
    fetchSfData() {
      this.isLoading = true;
      const currentpage = this.getPageIndex() ? this.getPageIndex() : 1;
      const alldata = {
        start: (currentpage - 1) * 10,
        num_of_recs: 10,
      };
      this.$store.dispatch("compareRecord/actionFetchSfOdoo", alldata);
    },
    handleCurrentChange(val) {
      // console.log(`current page: ${val-1}`);
      this.isPageIndexAccount = val;
      const pageObj = {
        start: parseInt(val - 1) * 10,
        num_of_recs: 10,
      };

      localStorage.setItem("pageIndexAccount", val);
      this.isLoading = true;
      this.$store.dispatch("compareRecord/actionFetchSfOdoo", pageObj);
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
      return localStorage.getItem("pageIndexAccount");
    },

    fetchFieldMap() {
      this.$store.dispatch("compareRecord/actionfieldMap");
    },
    // onEditRow(_Obj, rowType) {
    //   this.showEditModal = true;
    //   this.selectedRowObj = Object.assign({}, _Obj);
    //   this.selectedRowObj.rowType = rowType;
    //   if (rowType === "ODOO") {
    //     this.selectedRowObj.state_id =
    //       this.selectedRowObj.state_id[0] || this.selectedRowObj.state_id;
    //     this.selectedRowObj.user_id =
    //       this.selectedRowObj.user_id[0] || this.selectedRowObj.user_id;
    //     this.selectedRowObj.country_id =
    //       this.selectedRowObj.country_id[0] || this.selectedRowObj.country_id;
    //   }
    //   this.selectedRowId = "";
    // },
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
    },
    // onCheckField(_id, rowType, _Obj, _selectedRowObj) {
    //   this.selectedRowId = _id;
    //   this.selectedRowType = rowType;
    //   this.selectedSyncData = _Obj;
    //   //this.checkedRowObject = _selectedRowObj;
    // },
    // syncTableData() {
    //   var key_selected_data = Object.keys(this.selectedSyncData);
    //   var newObj = {};
    //   for (let i = 0; i < key_selected_data.length; i++) {
    //     var newKey = Helper.getObjectByKeySearch(
    //       this.fieldMapdata.fieldMap,
    //       this.selectedRowType,
    //       key_selected_data[i]
    //     );
    //     var objs = {
    //       [newKey[
    //         this.selectedRowType === "sf_name" ? "odoo_name" : "sf_name"
    //       ]]: this.selectedSyncData[key_selected_data[i]],
    //     };
    //     newObj = Object.assign(newObj, objs);
    //   }
    //   newObj = Object.assign(newObj, this.getIdObject());
    //   //window.console.log("Final Obj", newObj);
    //   if (this.selectedRowType === "sf_name") {
    //     this.$store.dispatch("Odoo/actionUpdateOdoo", newObj);
    //   } else {
    //     Object.keys(newObj).forEach((item) => {
    //       if (Array.isArray(newObj[item])) {
    //         newObj[item] = newObj[item][1];
    //       }
    //     });
    //     this.$store.dispatch("salesForce/actionUpdateSF", newObj);
    //   }
    // },
    // getIdObject() {
    //   const _id =
    //     this.selectedRowType === "sf_name"
    //       ? this.checkedRowObject.Account_Number__c
    //       : this.checkedRowObject.x_studio_account_number;
    //   if (this.selectedRowType === "sf_name") {
    //     var recordOdooObj = Helper.getObjectByKeySearch(
    //       this.odooData,
    //       "x_studio_account_number",
    //       _id
    //     );
    //     return { id: recordOdooObj.id };
    //   } else {
    //     var recordSFObj = Helper.getObjectByKeySearch(
    //       this.sfData,
    //       "Account_Number__c",
    //       _id
    //     );
    //     return { Id: recordSFObj.Id };
    //   }
    // },
    // closeModal() {
    //   this.selectedRowObj = null;
    //   this.showEditModal = false;
    // },
    setType(_value) {
      this.updateType = _value;
    },
  },
  beforeDestroy: function () {
    localStorage.removeItem("pageIndexAccount");
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
<style scoped>
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
.more-text {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 87%;
    display: inline-block;
}

</style>