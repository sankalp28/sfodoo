<template>
  <el-dialog
    :visible.sync="showModal"
    width="30%"
    :before-close="()=>{ this.$emit('close') }"
    custom-class="modal data-progress"
    @closed="$emit('close')"
  >
    <span>Data Sync</span>
    <el-progress :percentage="progress"></el-progress>
    <p>{{progressMessage}}</p>

    <!-- <span slot="footer" class="button-row">
   
      <el-button type="primary" @click="handleOnUpdateAndSync">Update &amp; Sync</el-button>
    </span>-->
  </el-dialog>
</template>
<script>
export default {
  name: "Progress",
  props: {
    showModal: {
      type: Boolean
    },
    progressMessage: {
      type: String,
      default:
        "This process could take a while depending on the amount of data you are synchronizing"
    },
    rowData: {
      type: Object
    },
    progress: {
      type: Number
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