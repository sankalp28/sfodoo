<template>
  <div>
    <div class="setup-form" >
      <div class="sec-title text-center">
        <h1>Default field mapping</h1>

        <span>You can’t remove any of the default field mappings</span>
      </div>
      <div class="form" >
        <div class="form-wrapper">
          <div class="form-row" v-for="(listItem, index) in myList" :key="index">
            <input
              type="text"
              class="input-field"
              v-model="listItem.sf_name"
              :key="index.myList"
              disabled
            />
            <div class="icon">
            <div class="icon-sync-2"></div>
            </div>
            <input
              type="text"
              class="input-field"
              placeholder="INPUT"
              v-model="listItem.odoo_name"
              :key="index"
              disabled
            />
          </div>
          <div class="form-row" v-for="(drop, index) in dropdown" :key="index.value">
            <select v-model="dropdown[index].sf_name" placeholder="Select" class="input-field">
              <option v-for="(item, index) in sfcompare" :key="index" :label="item" :value="item"></option>
            </select>

            <div class="icon"><div class="icon-sync-2"></div></div>

            <select v-model="dropdown[index].odoo_name" class="input-field">
              <option
                v-for="items in odoocompare"
                :key="items.value"
                :label="items"
                placeholder="Select"
                :value="items"
              ></option>
            </select>
            <a href="javascript:void(0)" class="icon-delete" v-on:click="removelist(index)" title="Delete"></a>
          </div>

          <div v-if="count>=2" class="add-field text-center"> 
            <span v-on:click="addItem()">Add field mapping</span>
          </div>
          <div v-loading="count<2" element-loading-text="Loading field mapping..." class="add-field text-center">            
          </div>
        </div>
      </div>
    <div class="setup-btn text-center">
      <button
        type="button"
        class="input-btn sync-btn"
        v-on:click="performsyn()"
        @click="showModal = false"
      >Performance Sync</button>
    </div>
    </div>

    <Success :successMessage="successMessage" :showModal="showSuccessModal" @close="showSuccessModal = false" />

    <Error :showModal="showErrorModal" @close="showErrorModal = false" />

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
  name: "FieldMapping",
  components: { Success, Error, Progress },
  data() {
    return {
      myList: [],
      SFOptions: [],
      OdooOptions: [],
      showSuccessModal: false,
      showErrorModal: false,
      showProgressModal: false,
      progress: 0,
      value: "",
      sfcompare: [],
      odoocompare: [],
      dropdown: [
        // {
        //   sf_name: "",
        //   odoo_name: ""
        // }
      ],
      postdata: { odoo: "", sf: "" },
      loading:true,
      successMessageSetup:"Your sync has been perform successfully. Shortly you will redirect..",
      successMessageFieldMap:"Your sync has been perform successfully.",
      successMessage:"",
      count:0,
    };
  },

  methods: {
    isEmptyField() {
      console.log("DROP.................", this.dropdown);
      for (let i = 0; i < this.dropdown.length; i++) {
        if (
          this.dropdown[i].sf_name === "" ||
          this.dropdown[i].odoo_name === ""
        ) {
          return true;
        }
      }
      return false;
    },

    isduplicateRecord() {
      if (this.checkDuplicateInObject("sf_name", this.dropdown)) {
        return true;
      }
      if (this.checkDuplicateInObject("odoo_name", this.dropdown)) {
        return true;
      }
      return false;
    },

    checkDuplicateInObject(propertyName, inputArray) {
      var seenDuplicate = false,
        testObject = {};

      inputArray.map(function(item) {
        var itemPropertyName = item[propertyName];
        if (itemPropertyName in testObject) {
          testObject[itemPropertyName].duplicate = true;
          item.duplicate = true;
          seenDuplicate = true;
        } else {
          testObject[itemPropertyName] = item;
          delete item.duplicate;
        }
      });
      return seenDuplicate;
    },
    removelist(index) {
      this.dropdown.splice(index, 1);
    },

    addItem() {
      let sfName = this.sfcompare.length ? this.sfcompare[0] : "";
      let odooName = this.odoocompare.length > 0 ? this.odoocompare[0]:"";

      this.dropdown.push({
        sf_name: sfName,
        odoo_name: odooName
      });
      
    },

    performsyn() {
      if (!this.isEmptyField()) {
        if (!this.isduplicateRecord()) {
          this.$message("Procceed");
          let clone2 = [...this.myList];
          for (var i = 0; i < this.dropdown.length; i++) {
            clone2.push({
              description: " ",
              sf_name: this.dropdown[i].sf_name,
              odoo_name: this.dropdown[i].odoo_name
            });
          }
          this.fetchsyncdata(clone2);
        } else {
          this.$message("Duplicate Records are not allow");
        }
      } else {
        this.$message("Please select the Field");
      }
    },

    performdropdown() {
      console.log("compare-sf", this.sfcompare);
    },
    fetchFieldMap() {
      this.$store.dispatch("compareRecord/actionfieldMap");
    },
    fetchSfFields() {
      this.$store.dispatch("salesForce/actionsfFields");
    },
    fetchodoofields() {
      this.$store.dispatch("Odoo/actionodoofields");
    },
    fetchsyncdata(_obj) {
      this.$store.dispatch("performSync/actionperformsyncData", _obj);
    },
    findModule(){
      return window.location.href.split("/#/")[1];
    }
  },

  computed: {
    ...mapState({ fieldMapdata: state => state.compareRecord.fieldMap }),
    ...mapState({ sffieldMapdata: state => state.salesForce.sffields }),
    ...mapState({ odoofieldMapdata: state => state.Odoo.odoofields }),
    ...mapState({
      performsyncfieldMap: state => state.performSync.performsyncData
    })
  },
  watch: {
    fieldMapdata() {
      //console.log("FIELD MAP DATA----------", this.fieldMapdata.fieldMap);
      this.myList = this.fieldMapdata.fieldMap;
      this.loading=false;
    },
    sffieldMapdata() {
      if (this.sffieldMapdata.responseData.result) {
        this.SFOptions = this.sffieldMapdata.responseData.result.data.response;
        this.SFOptions = Object.keys(this.SFOptions);
        let sf = this.SFOptions;
        let clone = [...sf];
        //let defaultvalue= "Please Select"
        //this.sfcompare.push(defaultvalue)
        this.count++;
        clone.map(data => {
          if (!this.myList.find(element => element.sf_name === data)) {
            // console.log("swati------------",data);
            this.sfcompare.push(data);
          }
        });
      }
    },
    odoofieldMapdata() {
      if (this.odoofieldMapdata.responseData.result) {
        this.OdooOptions = this.odoofieldMapdata.responseData.result.data.response;
        this.OdooOptions = Object.keys(this.OdooOptions);
        let odoo = this.OdooOptions;
        let clone = [...odoo];
        this.count++;
        clone.map(data => {
          if (!this.myList.find(element => element.odoo_name === data)) {
            this.odoocompare.push(data);
          }
        });
      }
    },

    performsyncfieldMap() {
      // console.log(
      //   "this.performsyncfieldMap.responseData.result --> ",
      //   this.performsyncfieldMap.responseData
      // );
      // console.log(
      //   "this.performsyncfieldMap.responseData.result.status ( fieldmap) --> ",
      //   this.performsyncfieldMap.responseData.result.status
      // );

      this.progress = this.performsyncfieldMap.responseData.result.data.progress;

      if (this.performsyncfieldMap.responseData.result) {
        if (this.performsyncfieldMap.responseData.status === "SUCCESS") {
          if (
            this.performsyncfieldMap.responseData.result.data.progress !== 100
          ) {
            this.showProgressModal = true;

            // console.log(
            //   "progress display",
            //   this.performsyncfieldMap.responseData.result.data.progress
            // );
          } else if (
            this.performsyncfieldMap.responseData.result.status ===
              "Completed" &&
            this.performsyncfieldMap.responseData.result.data.progress === 100
          ) {
            // console.log(
            //   "configuired",
            //   this.performsyncfieldMap.responseData.result.data.progress
            // );
            this.showProgressModal = false;
            this.showSuccessModal = true;

            let self = this;
            if(self.findModule() == "setup"){
              setTimeout(function(){
                self.$router.push({ name: "fieldMapping" });
              }, 5000)
            }
          } else {
            this.showErrorModal = true;
          }
        }
      } else {
        //console.log("okkkkkkkkkkk");
      }
    }
  },
  mounted() {
    this.fetchFieldMap();
    this.fetchSfFields();
    this.fetchodoofields();
    if(this.findModule() == "setup"){
      this.successMessage = this.successMessageSetup
    }
    else{
      this.successMessage = this.successMessageFieldMap
    }
  }
};
</script>
