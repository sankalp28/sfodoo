<template>
  <el-dialog
    title="Edit Records"
    :visible.sync="showModal"
    width="30%"
    :before-close="()=>{ this.$emit('close') }"
    custom-class="modal"
    @closed="$emit('close')"
  >
    <div class="edit-records">
      <div class="form">
        <div v-for="(field,index) in fieldMapData" :key="field.description+index" class="form-row">
          <!-- <span > Country List </span> -->
          <select
            v-if="getFieldName(field) === 'country_id'"
            placeholder="Select"
            class="input-field"
            id="country_id"
            v-on:input="onChangeSelect($event)"
          >
            <option
              v-for="(country) in countries"
              :key="country.name"
              :label="country.name"
              :value="country.id"
              :selected="updateRowData.country_id == country.id"
            ></option>
          </select>
          <select
            v-else-if="getFieldName(field) === 'state_id'"
            placeholder="Select"
            class="input-field"
            id="state_id"
            v-on:input="onChangeSelect($event)"
          >
            <option
              v-for="(state) in states"
              :key="state.name"
              :label="state.name"
              :value="state.id"
              :selected="updateRowData.state_id == state.id"
            ></option>
          </select>
          <select
            v-else-if="getFieldName(field) === 'user_id'"
            placeholder="Select"
            class="input-field"
            id="user_id"
            v-on:input="onChangeSelect($event)"
          >
            <option
              v-for="(user) in users"
              :key="user.name"
              :label="user.name"
              :value="user.id"
              :selected="updateRowData.user_id == user.id"
            ></option>
          </select>
          <input
            v-else
            type="text"
            :name="rowData.rowType=='SF' ? field.sf_name : field.odoo_name"
            :id="field.description"
            :value="rowData[field.sf_name] || rowData[field.odoo_name]"
            

            placeholder="Enter Name"
            v-on:input="handleOnchange($event)"
          />
          <label
           :for="field.description !== ' ' ? field.description : getFieldName(field)"
          >{{field.description !== " " ? field.description : getFieldName(field)}}</label>
        </div>
      </div>
    </div>
    <span slot="footer" class="button-row">
      <el-button
        @click="handleOnUpdate"
        :disabled="updateSfData.isUpdatingSFData || updateOdooData.isUpdatingOdooData"
      >{{updateSfData.isUpdatingSFData || updateOdooData.isUpdatingOdooData ? 'Updating..' : 'Update'}}</el-button>
      <!-- <el-button type="primary" @click="handleOnUpdateAndSync">Update &amp; Sync</el-button> -->
      <!-- <el-button @click="test">Test</el-button> -->
    </span>
  </el-dialog>
</template>
<script>
import { mapState } from "vuex";
//import { CountryList, stateList, Users } from "@/assets/json";
// import { Users } from "@/assets/json";

export default {
  name: "EditRecords",
  props: {
    showModal: Boolean,
    rowData: Object
  },
  data() {
    return {
      updateRowData: {},
      editName: "",
      fieldMapData: this.$store.state.compareRecord.fieldMap.fieldMap,
      countries: this.$store.state.compareRecord.countryData.responseData,
      states: this.$store.state.compareRecord.stateData.responseData,
      users: this.$store.state.compareRecord.userData.responseData,
    };
  },
  created() {},
  mounted() {
    this.countries = this.$store.state.compareRecord.countryData.responseData;
    this.states = this.$store.state.compareRecord.stateData.responseData;
    this.userData();

    this.updateRowData = this.rowData;
    this.editName = this.rowData.rowType;
    
  },
  computed: {
    ...mapState({ updateSfData: state => state.salesForce.updateSfData }),
    ...mapState({ updateOdooData: state => state.Odoo.updateOdooData }),
    ...mapState({ countryData1: state => state.compareRecord.countryData.responseData }),
    ...mapState({ stateData1: state => state.compareRecord.stateData.responseData }),
    ...mapState({ userList: state => state.compareRecord.userData.responseData }),




  },
  watch: {

    userList(){
             if(!this.userList.isFechingUserData &&  !this.userList.errorFechingUserData  ){

       this.users= this.$store.state.compareRecord.userData.responseData;

             }
    },

    // countryData1(){
    //   this.$store.dispatch("compareRecord/actionGetCountryData",'');
    // },
    // stateData1(){
    //   this.$store.dispatch("compareRecord/actionGetStateData",'');
    // },
    updateSfData() {
      if (!this.updateSfData.isUpdatingSFData) {
          this.$emit("close");
          this.$store.dispatch("compareRecord/actionFetchSfOdoo");
      }
    },
    updateOdooData() {
      if (!this.updateOdooData.isUpdatingOdooData) {
          this.$emit("close");
          this.$store.dispatch("compareRecord/actionFetchSfOdoo");
      }
    }

  },
  methods: {
    userData(){
      this.$store.dispatch("compareRecord/actionGetUserData", '');
    },
   
    handleOnUpdate() {
      delete this.updateRowData.rowType;
      delete this.updateRowData.attributes;
      // delete this.updateRowData.Id;

      if (this.editName === "SF") {
        this.$store.dispatch("salesForce/actionUpdateSF", this.updateRowData);
      } else {
        this.$store.dispatch("Odoo/actionUpdateOdoo", this.updateRowData);
      }
    },
    handleOnUpdateAndSync(evt) {
      alert("Update and Sync", evt);
    },
    handleOnchange(evt) {
      const { name, value } = evt.target;
      this.updateRowData[name] = value;
    },
    getFieldName(_fieldObj) {
      if (this.editName === "SF") {
        return _fieldObj.sf_name;
      } else {
        return _fieldObj.odoo_name;
      }
    },
    onChangeSelect(evt) {
      const { id, value } = evt.target;
      this.updateRowData[id] = parseInt(value);
    }
  }
};
</script>
<style>
</style>
