<template>
  <el-dialog
    title="Error !"
    :visible.sync="showModal"
    width="30%"
    :before-close="()=>{ this.$emit('close') }"
    custom-class="modal error-msg"
    @closed="$emit('close')"
  >
    <div class="msg-icon error-icon">
      <i class="icon icon-close"></i>
    </div>

    <p>{{errorMessage}}</p>

    <!-- <span slot="footer" class="button-row">
   
      <el-button type="primary" @click="handleOnUpdateAndSync">Update &amp; Sync</el-button>
    </span>-->
  </el-dialog>
</template>
<script>
export default {
  name: "Error",
  props: {
    showModal: {
      type: Boolean
    },
    errorMessage: {
      type: String,
      default: "There is some issue in your sync contact your administrator"
    }
  },
  data() {
    return {
      // updateRowData: Object.assign({}, this.rowData),
      // fieldMapData: this.$store.state.compareRecord.fieldMap.fieldMap,
      isVisible: true
    };
  },
  methods: {}
};
</script>
<style>
</style>