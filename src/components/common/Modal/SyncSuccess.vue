<template>
  <el-dialog
    title="Awesome !"
    :visible.sync="showModal"
    width="30%"
    :before-close="()=>{ this.$emit('close') }"
    custom-class="modal sucess-msg"
    @closed="$emit('close')"
  >
    <div class="msg-icon sucess-icon">
      <i class="icon icon-success"></i>
    </div>

    <p>{{successMessage}}</p>

    <!-- <span slot="footer" class="button-row">
   
      <el-button type="primary" @click="handleOnUpdateAndSync">Update &amp; Sync</el-button>
    </span>-->
  </el-dialog>
</template>
<script>
export default {
  name: "Success",
  props: {
    showModal: {
      type: Boolean
    },
    successMessage: {
      type: String,
      default:
        "Your sync has been perform successfully. Shortly you will redirect.."
    },
    rowData: {
      type: Object
    }
  },
  data() {
    return {
      updateRowData: Object.assign({}, this.rowData),
      fieldMapData: this.$store.state.compareRecord.fieldMap.fieldMap,
      isVisible: true
    };
  },
  methods: {}
};
</script>
<style>
</style>