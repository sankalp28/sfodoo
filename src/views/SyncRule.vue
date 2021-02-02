<template>
  <div class="content-area">
    <div class="relative">
      <div class="content-wrapper">
        <div class="router-view">
          <div class="sec-title">
            <h1>Define Sync Rule</h1>
          </div>

          <div
            class="content-area__content"
            v-loading="loading"
            element-loading-text="Loading..."
          >
            <div class="content-wrapper">
              <div class="setup-section define-rule">
                <div class="title-block">
                  <div class="sec-title">Salesforce</div>
                  <div class="icon icon-sync"></div>
                  <div class="sec-title">Odoo CRM</div>

                  <p>
                    Sync Saleforce and Oddo in both ways according to the
                    following rules
                  </p>
                </div>

                <div class="define-rule__content">
                  <div class="rule-row">
                    <span>IF field modified</span>
                    <!-- <select class="input-field">
                      <option>Saleforce</option>
                      <option>Odoo</option>
                    </select>-->

                    <select v-model="dbSelected" class="input-field">
                      <option
                        v-for="(item, index) in db"
                        :key="index"
                        :value="item"
                        >{{ item }}</option
                      >
                    </select>

                    <span>mapped field</span>
                    <!-- <select class="input-field">
                      <option>Account No</option>
                      <option>Name</option>
                      <option>Owner Id</option>
                      <option>Billing Street</option>
                      <option>Billing City</option>
                    </select>-->

                    <select
                      class="input-field"
                      v-model="mappingFieldsSelected"
                      @change="changeHandler"
                    >
                      <option
                        v-for="(item, index) in mappingFields"
                        :key="index"
                        :value="item"
                        >{{ item }}</option
                      >
                    </select>

                    <div class="add-field">
                      <span @click="addNewRowFilter">Add Filter</span>
                    </div>
                    <!-- "dynamic filter" start-->
                  </div>
                  <div
                    class="rule-row"
                    v-for="(row, index) in rowFilter"
                    :key="index"
                  >
                    <div class="delete-field"></div>
                    <select
                      class="input-field"
                      v-model="row.field"
                      @change="displaydropdown($event, index)"
                    >
                      <option
                        v-for="(item, index) in fields"
                        :key="index"
                        :value="item"
                        >{{ item }}</option
                      >
                    </select>
                    <span>=</span>

                    <input
                      v-show="!showentity[index]"
                      type="text"
                      class="input-field"
                      v-model="row.value"
                      maxlength="50"
                    />
                    <select
                      v-show="showentity[index]"
                      class="input-field"
                      v-model="row.value"
                    >
                      <option
                        v-for="(list, index) in selecteddropdownlist[index]"
                        :key="index"
                        :value="list.id"
                        >{{ list.name }}</option
                      >
                    </select>

                    <div class="delete-field" @click="deleteRowFilter(index)">
                      <span>Delete</span>
                    </div>
                    <!--<button type="button" class="delete-field" @click="deleteRowFilter(index)">
                            Delete {{ index }}
                    </button>-->
                    <!-- "dynamic filter" end -->
                  </div>

                  <div class="rule-row">
                    <span>THEN field update</span>
                    <!-- <select class="input-field">
                      <option>Odoo</option>
                      <option>Salesforce</option>
                    </select>-->

                    <select
                      class="input-field"
                      v-model="dbAlternativeSelected"
                      disabled
                    >
                      <option
                        v-for="(item, index) in db"
                        :key="index"
                        :value="item"
                        >{{ item }}</option
                      >
                    </select>

                    <span>mapped field</span>
                    <!-- <select class="input-field">
                      <option>Account No</option>
                      <option>Name</option>
                      <option>Owner Id</option>
                      <option>Billing Street</option>
                      <option>Billing City</option>
                    </select>-->
                    <select
                      class="input-field"
                      disabled
                      v-model="mappingFieldsAlternativeSelected"
                    >
                      <option
                        v-for="(item, index) in mappingFieldsAlternative"
                        :key="index"
                        :value="item"
                        >{{ item }}</option
                      >
                    </select>
                  </div>
                </div>

                <div class="form-btn">
                  <button
                    type="button"
                    class="input-btn sync-btn"
                    @click="SynRule"
                  >
                    Performance Sync
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Success
      :showModal="showSuccessModal"
      :successMessage="successMessage"
      @close="showSuccessModal = false"
    />

    <Error
      :showModal="showErrorModal"
      :errorMessage="errorMessage"
      @close="showErrorModal = false"
    />

    <Progress
      :progress="progress"
      :showModal="showProgressModal"
      @close="showProgressModal = false"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import Success from "@/components/common/Modal/Success";
import Error from "@/components/common/Modal/Error";
import Progress from "@/components/common/Modal/Progress";

export default {
  name: "SyncRule",
  components: { Success, Error, Progress },
  data() {
    return {
      //db related data
      db: ["SF", "Odoo"],
      dbSelected: "",
      dbAlternativeSelected: "",
      progress: 0,
      selecteddropdownlist: [],
      mappingFieldsSelected: "",
      mappingFields: [],
      mappingFieldsAlternativeSelected: "",
      mappingFieldsAlternative: [],
      mappingFieldsSF: [],
      mappingFieldsOdoo: [],

      rowSaleforceFilter: [],
      rowOdooFilter: [],
      rowFilter: [],

      //assign db fields
      fieldsSelected: "",
      fields: [],
      //total fields at each db
      fieldsSaleforce: [],
      fieldsOdoo: [],

      // fieldMapdataState: 0,
      // sffieldMapdataState: 0,
      // odoofieldMapdataState: 0,
      showentity: [],
      counter: 0,
      loading: true,
      showSuccessModal: false,
      showErrorModal: false,
      showProgressModal: false,
      sfFieldsType: [],
      odooFieldsType: [],
      successMessage: "Your sync has been perform successfully.",
      errorMessage:
        "There is some issue in your sync contact your administrator.",
      countries: [],
      states: [],
      users: [],
    };
  },
  computed: {
    ...mapState({ fieldMapdata: (state) => state.compareRecord.fieldMap }),
    ...mapState({ sffieldMapdata: (state) => state.salesForce.sffields }),
    ...mapState({ odoofieldMapdata: (state) => state.Odoo.odoofields }),
    ...mapState({ SyncRuleMapdata: (state) => state.syncRule.updateRule }),
    ...mapState({ countryList: (state) => state.compareRecord.countryData }),
    ...mapState({ stateList: (state) => state.compareRecord.stateData }),
    ...mapState({ userList: (state) => state.compareRecord.userData }),
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

    stateList() {
      if (
        !this.stateList.isFechingStateData &&
        !this.stateList.errorFechingStateData
      ) {
        this.states = this.$store.state.compareRecord.stateData.responseData;
      }
    },
    countryList() {
      if (
        !this.countryList.isFechingCountryData &&
        !this.countryList.errorFechingCountryData
      ) {
        this.countries = this.$store.state.compareRecord.countryData.responseData;
      }
    },
    SyncRuleMapdata() {
      //if(this.SyncRuleMapdata){
      //this.SyncRuleMapdata.responseData.status = "ERROR";
      // console.log(
      //  ",,,,start,,,,,,SyncRuleMapdata,,,,,,,,,,",
      //  this.SyncRuleMapdata
      //);

      // console.log(
      //   ",,,,start,,,,,,responseData,,,,,,,,,,",
      //   this.SyncRuleMapdata.responseData
      // );
      // console.log(
      //   ",,,,start,,,,,,status,,,,,,,,,,",
      //   this.SyncRuleMapdata.responseData.status
      // );

      if (this.SyncRuleMapdata.responseData['status']) {
        if (
          this.SyncRuleMapdata.responseData.status === "Failed" ||
          this.SyncRuleMapdata.responseData.status === "ERROR"
        ) {
          this.showProgressModal = false;
          this.showSuccessModal = false;
          this.showErrorModal = true;
          this.loading = false;
        } else if (
          this.SyncRuleMapdata.responseData.status == "waiting" ||
          this.SyncRuleMapdata.responseData.status == "processing" ||
          this.SyncRuleMapdata.responseData.data.progress != 100
        ) {
          this.progress = this.SyncRuleMapdata.responseData.data.progress;
          this.showProgressModal = true;
          this.showSuccessModal = false;
          this.showErrorModal = false;
        } else if (this.SyncRuleMapdata.responseData.status == "Completed") {
          this.showProgressModal = false;
          this.showErrorModal = false;
          this.showSuccessModal = true;
          this.loading = false;
        } else {
          this.showProgressModal = false;
          this.showSuccessModal = false;
          this.showErrorModal = false;
          this.loading = false;
        }

        // console.log(
        //   ",,,end,,,,,,,responseData,,,,,,,,,,",
        //   this.SyncRuleMapdata.responseData
        // );
        // console.log(
        //   ",,,,end,,,status,,,,,,,,,,,,,",
        //   this.SyncRuleMapdata.responseData.status
        // );
        //this.SyncRuleMapdata.responseData.data.progress == 100

        //}
      }
    },

    counter(_newValue, _oldValue) {
      if (_newValue == 3) {
        console.log(_oldValue);
        // console.log("this.fieldsSaleforce", this.fieldsSaleforce);
        // console.log("this.fieldsOdoo", this.fieldsOdoo);
        this.setDefault();
        this.loading = false;
      }
    },
    fieldMapdata() {
      //this.counter = this.counter + 1;
      //this.fieldMapdataState = 1;
      //this.setDefault();
      // console.log("fieldMapdata===============", this.fieldMapdata);

      if (this.fieldMapdata.isFechingFieldMap == false) {
        //console.log(this.sffieldMapdata);
        this.counter = this.counter + 1;
        let self = this;
        this.fieldMapdata.fieldMap.forEach(function(item) {
          self.mappingFieldsSF.push(item.sf_name);
          self.mappingFieldsOdoo.push(item.odoo_name);
        });
      }

      //this.fieldsSaleforce=this.sffieldMapdata.fieldMap;
      //this.fieldsOdoo=this.odoofieldMapdata.fieldmap;
    },

    sffieldMapdata() {
      //this.counter = this.counter + 1;
      //this.sffieldMapdataState = 1;
      //this.setDefault();
      // console.log(
      //   "isFechingSFFieldsData --> ",
      //   this.sffieldMapdata.isFechingSFFieldsData
      // );

      if (this.sffieldMapdata.isFechingSFFieldsData == false) {
        //console.log(this.sffieldMapdata);
        this.counter = this.counter + 1;
        // console.log("----", this.sffieldMapdata);
        // console.log("----", this.sffieldMapdata.responseData);
        // console.log("----", this.sffieldMapdata.responseData.result);
        let res = this.sffieldMapdata;
        let result =
          res &&
          res.responseData &&
          res.responseData.result &&
          res.responseData.result.data &&
          res.responseData.result.data.response
            ? this.sffieldMapdata.responseData.result.data.response
            : [];
        this.fieldsSaleforce = Object.keys(result);

        // console.log("--------------------", result);
        this.sfFieldsType = result;
      }

      // if (this.sffieldMapdata.responseData.result) {
      //   let result = this.sffieldMapdata.responseData.result.data.response;
      //   this.fieldsSaleforce = Object.keys(result);
      // }

      //this.fieldsSaleforce=this.sffieldMapdata.fieldMap;
    },

    odoofieldMapdata() {
      //this.odoofieldMapdataState = 1;
      //this.setDefault();

      if (this.odoofieldMapdata.isFechingODOOFieldsData == false) {
        //console.log(this.sffieldMapdata);
        this.counter = this.counter + 1;
        let result = this.odoofieldMapdata.responseData.result.data.response;
        this.fieldsOdoo = Object.keys(result);
        this.oddooFieldsType = result;

        this.fieldsOdoo.map((key) => {
          this.odooFieldsType[key] = result[key].type;
        });
      }
      // //this.fieldsOdoo=this.odoofieldMapdata.fieldmap;
      // if (!this.odoofieldMapdata.isFechingODOOFieldsData) {
      //   let result = this.odoofieldMapdata.responseData.result.data.response;
      //   this.fieldsOdoo = Object.keys(result);
      // }

      // if (this.odoofieldMapdata.responseData.result) {
      //   let result = this.odoofieldMapdata.responseData.result.data.response;
      //   this.fieldsOdoo = Object.keys(result);
      // }
    },

    dbSelected: function(_newValue, _oldValue) {
      this.rowFilter = [];
      // console.log("_newValue====" + _newValue);
      console.log(_oldValue);
      //alert(_newValue , this.db[0])

      if (_newValue == this.db[0]) {
        this.dbAlternativeSelected = this.db[1];
        //this.fields = this.fieldsSaleforce;
        this.fields = this.mappingFieldsSF;
        this.mappingFields = this.mappingFieldsSF;
        this.mappingFieldsAlternative = this.mappingFieldsOdoo;
      } else {
        this.dbAlternativeSelected = this.db[0];
        //this.fields = this.fieldsOdoo;
        this.fields = this.mappingFieldsOdoo;
        this.mappingFields = this.mappingFieldsOdoo;
        this.mappingFieldsAlternative = this.mappingFieldsSF;
      }

      this.fieldsSelected = this.fields.length ? this.fields[0] : "";
      this.mappingFieldsSelected =
        this.mappingFields.length > 0 ? this.mappingFields[0] : "";
      this.mappingFieldsAlternativeSelected =
        this.mappingFieldsAlternative.length > 0
          ? this.mappingFieldsAlternative[0]
          : "";
    },
  },
  mounted() {
    this.$store.dispatch("salesForce/actionsfFields");
    this.$store.dispatch("compareRecord/actionfieldMap");
    this.$store.dispatch("Odoo/actionodoofields");
    this.countryData();
    this.stateData();
    this.userData();
    // console.log("sfsfsf",this.countryData)
    //this.setDefault();
  },

  methods: {
    countryData() {
      this.$store.dispatch("compareRecord/actionGetCountryData", "");
    },
    stateData() {
      this.$store.dispatch("compareRecord/actionGetStateData", "");
    },
    userData() {
      this.$store.dispatch("compareRecord/actionGetUserData", "");
    },

    displaydropdown(event, index) {
      // console.log("value",event.target.value);

      // console.log("this.dbSelected",this.dbSelected)
      // console.log("value",index);
      // if (this.dbSelected === "sf") {
      //   if (event.target.value === "parent_id") {
      //     console.log("hello");
      //   }
      // }

      if (
        this.dbSelected === "Odoo" &&
        (event.target.value == "state_id" ||
          event.target.value == "country_id" ||
          event.target.value == "user_id" ||
          event.target.value == "parent_id")
      ) {
        //   console.log("hello");
        //   console.log("hello", this.selecteddropdownlist);
        this.showentity[index] = true;
        if (event.target.value === "state_id") {
          this.selecteddropdownlist[index] = this.states;
        } else if (event.target.value === "country_id") {
          this.selecteddropdownlist[index] = this.countries;
        } else if (event.target.value === "user_id") {
          this.selecteddropdownlist[index] = this.users;
        } else if (event.target.value === "parent_id") {
          this.selecteddropdownlist[index] = this.users;
        }
      } else {
        this.showentity[index] = false;
      }
    },
    setDefaultModalFlag() {
      this.showProgressModal = false;
      this.showSuccessModal = false;
      this.showErrorModal = false;
    },

    setDefault() {
      // if (
      //   this.fieldMapdataState == 1 &&
      //   this.sffieldMapdataState == 1 &&
      //   this.odoofieldMapdataState == 1
      // ) {
      //   this.dbSelected = "Saleforce";
      //   this.dbAlternativeSelected = "odoo";
      // }

      this.dbSelected = this.db[0];
      this.dbAlternativeSelected = this.db[1];
    },

    changeHandler(_event) {
      // console.log("_event", _event);
      // console.log("_event", _event.target);
      // console.log("_event", _event.target.selectedIndex);
      let selectedIndex = _event.target.selectedIndex;
      this.mappingFieldsAlternativeSelected =
        this.mappingFieldsAlternative.length > 0
          ? this.mappingFieldsAlternative[selectedIndex]
          : "";
      // window.console.log(
      //   this.mapping_DB1_Fields.indexOf(this.mappingFieldsSelected)
      // );
    },

    addNewRowFilter() {
      //console.log("addNewRowFilter");
      //console.log("this.fieldsSelected -->", this.fieldsSelected);

      this.rowFilter.push({
        field: this.fieldsSelected,
        value: "",
      });
    },

    deleteRowFilter(_index) {
      this.rowFilter.splice(_index, 1);
    },

    SynRule() {
      this.loading = true;
      //console.log("dbSelected -> ", this.dbSelected);
      //console.log("dbAlternativeSelected -> ", this.dbAlternativeSelected);
      //console.log("mappingFieldsSelected: -> ", this.mappingFieldsSelected);
      // console.log(
      //   "mappingFieldsAlternativeSelected:: -> ",
      //   this.mappingFieldsAlternativeSelected
      // );
      // console.log("this.rowFilter --> ", this.rowFilter);
      var testArray = this.rowFilter;
      let field_modified = {
        field: this.mappingFieldsSelected,
        db: this.dbSelected,
      };
      let filter = {};

      let update_field = {
        field: this.mappingFieldsAlternativeSelected,
        db: this.dbAlternativeSelected,
      };

      let isErorMessage = this.validate();
      // if (isErorMessage != ""){
      //   console.log("NEHA-------",isErorMessage)
      //   this.$message(isErorMessage)
      //   return false;
      //}
      if (isErorMessage == "") {
        let filterArray = new Array();
        if (testArray.length > 0) {
          testArray.map((item) => {
            if (item.field) {
              this.pushData(filterArray, item.field, item.value);
            }
          });
        }
        //console.log("filterArray --> ", filterArray);
        filter = this.convertAssociateArrayToObject(filterArray);
        //console.log("filter --> ", filter);
        this.setDefaultModalFlag();
        let request = {
          field_modified: field_modified,
          filter: filter,
          update_field: update_field,
          start_time: null,
          end_time: null,
        };
        //console.log("request --> ", JSON.stringify(request));
        this.$store.dispatch("syncRule/actionSyncRule", request);
      } else {
        this.$message(isErorMessage);
        this.loading = false;
      }
    },

    validate() {
      let errorMsg = "";
      //console.log(" this.rowFilter -->..................... ", this.rowFilter);

      this.rowFilter.map((data) => {
        if (this.dbSelected == this.db[0]) {
          //console.log("-----type 1----", this.sfFieldsType[data.field]);

          // console.log("swati 2=============", data);
          if (data.field == "ParentId") {
            if (data.value == "") {
              //   // if (!isNaN(data.value)) {
              if (errorMsg == "") {
                errorMsg = data.field + " cannot be blank. ";
              }
            }
            //   // else {
            //   //   data.value = data.value * 1;
            //   // }
          }

          //check for validation
          // if (
          //   this.sfFieldsType[data.field] == "string" ||
          //   this.sfFieldsType[data.field] == "textarea"
          // ) {
          //   data.value = data.value.toString();
          // } else if (
          //   this.sfFieldsType[data.field] == "int" ||
          //   this.sfFieldsType[data.field] == "reference"
          // ) {
          //   if (data.value.trim() != "" && Number.isInteger(data.value)) {
          //     data.value = parseInt(data.value);
          //   } else {
          //     if (errorMsg == "") {
          //       errorMsg = data.field + " property should be integer ";
          //     }
          //   }
          // }
        } else {
          // console.log("-----type 2----", this.odooFieldsType[data.field]);
          // console.log("swati=============", data);

          // if (
          //   this.odooFieldsType[data.field] == "string" ||
          //   this.odooFieldsType[data.field] == "textarea"
          // ) {
          //   data.value = data.value.toString();
          // } else if (
          //   this.odooFieldsType[data.field] == "int" ||
          //   this.odooFieldsType[data.field] == "reference"
          // ) {
          //   data.value = parseInt(data.value);
          // }
          // console.log("DATA FILED", data.field);
          // console.log("data value", data.value);
          // console.log("error", errorMsg);

          if (
            data.field == "user_id" ||
            data.field == "state_id" ||
            data.field == "parent_id" ||
            data.field == "country_id"
          ) {
            if (data.value == "") {
              // if (!isNaN(data.value)) {
              if (errorMsg == "") {
                errorMsg = data.field + " cannot be blank. ";
                // this.$message(isErorMessage)
              }
            } else {
              data.value = data.value * 1;
            }
          }
        }
      });

      // console.log("this.sfFieldsType --> ", this.sfFieldsType);
      // console.log("this.odooFieldsType --> ", this.odooFieldsType);

      return errorMsg;
    },

    pushData(_filterArray, _key, _value) {
      if (!_filterArray[_key]) {
        _filterArray[_key] = new Array();
      }
      _filterArray[_key].push(_value);
    },

    convertAssociateArrayToObject(test) {
      let jsonObject = {};

      for (const property in test) {
        jsonObject[property] = test[property];
      }

      return jsonObject;
    },
  },
};
</script>
