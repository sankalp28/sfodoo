<template>
  <div class="content-area">
			<div class="relative">
				<div class="content-wrapper">
					<div class="router-view">
						<div class="sec-title">
						<h1>Compare Records</h1>
						</div>
						<div class="content-area__content">
							<div class="compare-table">
								<div class="compare-table__content">
									<div class="main-table">
									<div class="main-head">
										<div class="main-table-cell">Salesforce</div>
										<div class="sync"></div>
										<div class="main-table-cell">Oddo</div>
									</div>
            <!-- "heading compare records" end -->
                <!-- start -->
                     <div class="search-filter">
                      <el-select v-model="value" placeholder="Select" v-on:input="onChangeSelect($event)">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      >
    </el-option>
      </el-select>
                        <input class="input-field" :value="searchvalue"  v-if="IsSearchVisible" placeholder="Search Here">
                         <el-button>Search</el-button>
                    </div>
                    <div class="table-head">
                      <div class="table-cell button"></div>
                      <div class="sf-cell">
                        <div
                          v-for="(field, index) in gridSFList"
                          :key="field.description + index"
                          class="table-cell">
                          <span :title="field.sf_name">{{
                            field.description !== " "
                              ? field.description
                              : field.sf_name
                          }}</span>
                        </div>
                      </div>
                      <div class="oddo-cell">
                        <div
                          v-for="(field, index) in gridOdooList"
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
                          <span>{{ sfData[index][sfRow.sf_name] }}</span>
                        </div>
                      </div>
                      <div class="oddo-cell">
                        <div
                          class="table-cell"
                          v-for="(odooRow, odooIndex) in gridProList"
                          :key="odooIndex"
                        >
                          <span>{{ odooData[index][odooRow.odoo_name] }}</span>
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
                  </div>
                </div>
                <div class="pagination">
                  <el-pagination 
                    background
                    layout="prev, pager, next"
                    prev-text="prev"
                    next-text="next"
                   :page-size="10"
                    @prev-click="handleCurrentChange"
                    @next-click="handleCurrentChange"
                    @current-change="handleCurrentChange"
                    :total="100"
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
   
</template>
<script>
// import TableRow from "@/components/common/Table/TableRow";
import EditRecord from "@/components/common/EditRecord";
// import ErrorModal from "@/components/common/Modal/Error";
//import Helper from "@/common/helper";
import { mapState } from "vuex";
export default {
  name: "CompareAssetsRecord",
  components: {
    // TableRow,
    EditRecord,
    
  },
  data() {
    return {

selected: '',
      sfData: [],
      odooData: [],
      options: [{
          value: 'ALL',
          label: 'ALL'
        }, {
          value: 'Ids',
          label: 'Ids'
        },
        {
          value: 'UPDATED Records',
          label: 'Updated Record'
        }, 
    ],
    value:'ALL',
      IsSearchVisible:false,
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
      gridSFList: [
        {
          description: "salesforce Id ",
          
        },
        {
          description: "salesforce Account",
       
        },
      ],
      gridOdooList: [
        {
          description: " x_studio_salesforce_token ",
          
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
      searchFValidated: false,
    };
  },
  mounted() {
    this.fetchSfData();
    this.fetchFieldMap();
    this.getCountryData();
    this.getStateData();
    this.getUserData();
    this.isEditable = [];
  },
  computed: {
    ...mapState({ relatedData: (state) => state.compareRecord.relatedData }),
    ...mapState({ fieldMapdata: (state) => state.compareRecord.fieldMap }),
    ...mapState({ updateSfData: (state) => state.salesForce.updateSfData }),
    ...mapState({ updateOdooData: (state) => state.Odoo.updateOdooData }),
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

        if(
          (this.sfData && this.sfData.length > 0) ||
          (this.odooData && this.odooData.length > 0)
        ) 
        {
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
     onChangeSelect(evt){
      
      
        this.IsSearchVisible=(evt=="Ids")?true:false;
      

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
    fetchSfData() {
      this.isLoading = true;
      this.$store.dispatch("compareRecord/actionFetchSfOdoo");
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
};
</script>
<style scoped>
.search-filter{
  display: flex;
  margin:10px 0;

}
.search-filter .input-field{
width:170px;
margin-left: 10px;
margin-right: 10px;
}

</style>
