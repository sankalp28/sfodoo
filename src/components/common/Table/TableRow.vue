<template>
  <tr :class="flag == '' ? true : (flag == (rowData.id  ||  rowData.Id) ? 'active' : '' )">
    <td>
      <i @click="handleOnEdit(rowData,rowType)" class="icon icon-edit" title="Edit"></i>
    </td>
    <td v-for="fieldmap in fieldMapData" :key="fieldmap.sf_name">
        <label class="checkbox"  v-if="flag == '' ? true : (flag == (rowData.id  ||  rowData.Id) ? true : false )" >
          <input type="checkbox" @click="checkField($event, rowData.Id || rowData.id, rowType, fieldmap[fieldName] , rowData[fieldmap[fieldName]], rowData)"/>
          <span></span>
        </label>
        
        <span>{{rowData[fieldmap.sf_name] || getOdooName(fieldmap.odoo_name)}}</span>
    </td>
  </tr>
</template>
<script>
// import { CountryList, Users } from "@/assets/json";
import Helper from "@/common/helper";


export default {
  name: "TableRow",
  props: {
    rowData : Object,
    onEdit: { type: Function },
    rowType: String,
    fieldName: String,
    flag: String,
  },
  data(){
    return {
      fieldMapData: this.$store.state.compareRecord.fieldMap.fieldMap,
      checkedRow: '',
      selectedItem: {},
      countries: this.$store.state.compareRecord.countryData.responseData,
      states: this.$store.state.compareRecord.stateData.responseData,
      users: this.$store.state.compareRecord.userData.responseData,
    }
  },
  methods: {
    handleOnEdit(rowData, rowType){
      this.onEdit(rowData, rowType);
    },
    checkField(evt, _id, rowType, key, value, rowData){
     
       if(key === 'BillingCountry') {

         const objCountry = Helper.getObjectByKeySearch(this.countries, 'name', value);
          console.log("dfsdf",objCountry)
          if(objCountry){
            value = objCountry.id;
            console.log("countryid",value)
          }
        } else if(key === 'BillingState') {
          const objState = Helper.getObjectByKeySearch(this.states, 'name', value)
          //  console.log("dfsdf==========",objState)
          if(objState){
            value = objState.id;
            // console.log("state_id", value)
          }
       } if(key === 'OwnerId') {
          const userObject = Helper.getObjectByKeySearch(this.users, 'name', value);
          if(userObject){
            value = userObject.id;
          }
       }

      this.checkedRow = _id.toString();
      const selectedObj = { [key] : value};

      if(Object.prototype.hasOwnProperty.call(this.selectedItem, key)){
        delete this.selectedItem[key];
      } else {
        this.selectedItem = Object.assign(this.selectedItem, selectedObj);
      }
      this.$emit('onCheck', Object.keys(this.selectedItem).length  > 0 ? _id.toString() : '', this.fieldName, this.selectedItem, rowData);
    },
    getOdooName(fieldName){
      if((fieldName === 'country_id' || fieldName === 'state_id' || fieldName === 'user_id') && this.rowType==='ODOO'){
        return this.rowData[fieldName][1];
      } else{
        return this.rowData[fieldName];
      }
    }
  }
};
</script>
