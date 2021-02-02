<template>
  <div class="edit-box" style="width:100%;" id="myDIV">
    <div class="table-cell button"></div>
    <div class="edit-box-wrapper">
      <div class="edit-box-main">
        <div class="sf-box">
          <div class="inner">
            <div class="records">
              <h1>Edit SF Records</h1>
              <div class="form">
                <div
                  v-for="(field, index) in fieldMapData"
                  :key="field.sf_name + index"
                  class="form-row"
                >
                  <input
                    type="text"
                    :name="field.sf_name"
                    :id="field.sf_name + type.sf"
                    :value="updateRowDataSF[field.sf_name]"
                    v-on:input="handleOnchangeSF($event)"
                    :disabled="isDisable(field.sf_name)"
                  />
                  <label :for="field.sf_name + type.sf">{{
                    field.description !== " "
                      ? field.description
                      : field.sf_name
                  }}</label>
                </div>

                <div class="button-row">
                  <el-button @click="handleOnUpdateSF">Update</el-button>

                  <el-button @click="syncSfToOdoo">Sync to Odoo</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="oddo-box">
          <div class="inner">
            <div class="records">
              <h1>Edit ODOO Records</h1>

              <div class="form">
                <div
                  v-for="(field, index) in fieldMapData"
                  :key="field.odoo_name + index"
                  class="form-row"
                >
                  <select
                    v-if="field.odoo_name === 'country_id'"
                    placeholder="Select"
                    class="input-field"
                    id="country_id"
                    v-on:input="onChangeSelectOdoo($event)"
                    :disabled="isDisable(field.odoo_name)"
                  >
                    <option
                      v-for="country in countries"
                      :key="country.name"
                      :label="country.name"
                      :value="country.id"
                      :selected="
                        updateRowDataOdoo.country_id * 1 == country.id * 1
                      "
                    ></option>
                  </select>
                  <select
                    v-else-if="field.odoo_name === 'state_id'"
                    placeholder="Select"
                    class="input-field"
                    id="state_id"
                    v-on:input="onChangeSelectOdoo($event)"
                    :disabled="isDisable(field.odoo_name)"
                  >
                    <option
                      v-for="state in states"
                      :key="state.name"
                      :label="state.name"
                      :value="state.id"
                      :selected="updateRowDataOdoo.state_id * 1 == state.id * 1"
                    ></option>
                  </select>
                  <select
                    v-else-if="field.odoo_name === 'user_id'"
                    placeholder="Select"
                    class="input-field"
                    id="user_id"
                    v-on:input="onChangeSelectOdoo($event)"
                    :disabled="isDisable(field.odoo_name)"
                  >
                    <option
                      v-for="user in users"
                      :key="user.name"
                      :label="user.name"
                      :value="user.id"
                      :selected="updateRowDataOdoo.user_id * 1 == user.id * 1"
                    ></option>
                  </select>
                  <input
                    v-else
                    type="text"
                    :name="field.odoo_name"
                    :id="field.odoo_name + type.odoo"
                    :value="rowDataOdoo[field.odoo_name]"
                    v-on:input="handleOnchangeOdoo($event)"
                    :disabled="isDisable(field.odoo_name)"
                  />
                  <label :for="field.odoo_name + type.odoo">{{
                    field.description !== " "
                      ? field.description
                      : field.odoo_name
                  }}</label>
                </div>
                <div class="button-row">
                  <el-button @click="handleOnUpdateOdoo">Update</el-button>
                  <el-button @click="syncOdooToSf">Sync to SF</el-button>
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
//import { mapState } from "vuex";
import Helper from "@/common/helper";

export default {
  name: "EditRecord",
  props: {
    rowDataSF: Object,
    rowDataOdoo: Object,
    fieldMapData: Array,
    countries: Array,
    states: Array,
    users: Array,
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
    };
  },

  created() {},
  mounted() {
    this.setRowDataSF();
    this.setRowDataOdoo();
  },
  watch: {
    rowDataSF() {
      this.setRowDataSF();
    },
    rowDataOdoo() {
      this.setRowDataOdoo();
    },
  },
  methods: {
    setRowDataSF() {
      this.updateRowDataSF = { ...this.rowDataSF };
    },
    setRowDataOdoo() {
      this.updateRowDataOdoo = { ...this.rowDataOdoo };
      // update value instead of collection
      this.updateRowDataOdoo.state_id =
        this.updateRowDataOdoo.state_id[0] || this.updateRowDataOdoo.state_id;
      this.updateRowDataOdoo.user_id =
        this.updateRowDataOdoo.user_id[0] || this.updateRowDataOdoo.user_id;
      this.updateRowDataOdoo.country_id =
        this.updateRowDataOdoo.country_id[0] ||
        this.updateRowDataOdoo.country_id;
    },

    handleOnUpdateSF() {
      this.$emit("setType", this.type.sf);
      this.$store.dispatch("salesForce/actionUpdateSF", this.updateRowDataSF);
    },
    handleOnUpdateOdoo() {
      this.$emit("setType", this.type.odoo);
      this.$store.dispatch("Odoo/actionUpdateOdoo", this.updateRowDataOdoo);
    },

    handleOnchangeSF(evt) {
      const { name, value } = evt.target;
      this.updateRowDataSF[name] = value;
    },

    handleOnchangeOdoo(evt) {
      const { name, value } = evt.target;
      this.updateRowDataOdoo[name] = value;
    },

    onChangeSelectSF(evt) {
      const { id, value } = evt.target;
      this.updateRowDataSF[id] = parseInt(value);
    },

    onChangeSelectOdoo(evt) {
      const { id, value } = evt.target;
      this.updateRowDataOdoo[id] = parseInt(value);
    },

    syncSfToOdoo() {
      //clone object
      let newObj = { ...this.updateRowDataOdoo };
      this.assignValueFromSfToOdoo(this.updateRowDataSF, newObj);
      this.delProperties(newObj);
      newObj.id = this.updateRowDataOdoo.id;

      //find the id of the country name
      const objCountry = Helper.getObjectByKeyExactSearch(
        this.countries,
        "name",
        this.updateRowDataSF.BillingCountry
      );
      if (objCountry) {
        newObj.country_id = objCountry.id;
      }

      //find the id of the state name
      const objState = Helper.getObjectByKeyExactSearch(
        this.states,
        "name",
        this.updateRowDataSF.BillingState
      );
      if (objState) {
        newObj.state_id = objState.id;
      }

      // todo
      // //find the id of the users
      // const userObject = Helper.getObjectByKeySearch(this.users, 'name', newObj.OwnerId);
      // console.log("userObject--> ", userObject)
      // if(userObject){
      //   newObj.OwnerId = userObject.id;
      // }

      this.handleOnUpdateSF();
      this.$store.dispatch("Odoo/actionUpdateOdoo", newObj);
    },

    syncOdooToSf() {
      //clone object
      let newObj = { ...this.updateRowDataSF };
      this.assignValueFromOdooToSf(this.updateRowDataOdoo, newObj);
      this.delProperties(newObj);
      newObj.Id = this.updateRowDataSF.Id;

      //find the id of the country name
      const objCountry = Helper.getObjectByKeyExactSearch(
        this.countries,
        "id",
        this.updateRowDataOdoo.country_id
      );
      if (objCountry) {
        newObj.BillingCountry = objCountry.name;
      }

      //find the id of the state name
      const objState = Helper.getObjectByKeyExactSearch(
        this.states,
        "id",
        this.updateRowDataOdoo.state_id
      );
      if (objState) {
        newObj.BillingState = objState.name;
      }

      // todo
      // //find the id of the users
      // const userObject = Helper.getObjectByKeySearch(this.users, 'name', newObj.OwnerId);
      // console.log("userObject--> ", userObject)
      // if(userObject){
      //   newObj.OwnerId = userObject.id;
      // }

      this.handleOnUpdateOdoo();
      this.$store.dispatch("salesForce/actionUpdateSF", newObj);
    },

    isDisable(_key) {
      //let isFlag = this.disableProperties.includes(_key);
      let isFlag = false;
      isFlag = this.disableProperties.some((data) => data == _key);
      return isFlag;
    },

    //remove some id which we do not need to update
    delProperties(newObj) {
      this.disableProperties.map((property) => {
        if (newObj[property] !== undefined) {
          delete newObj[property];
        }
      });
    },

    assignValueFromSfToOdoo(_sf, _odoo) {
      this.fieldMapData.map((property) => {
        _odoo[property.odoo_name] = _sf[property.sf_name];
      });
    },

    assignValueFromOdooToSf(_odoo, _sf) {
      this.fieldMapData.map((property) => {
        _sf[property.sf_name] = _odoo[property.odoo_name];
      });
    },
  },
};
</script>
