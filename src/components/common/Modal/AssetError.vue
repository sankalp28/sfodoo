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

    <p>{{errorMsg}}</p>

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
    
    errorMsg: {
      type: String,
      default: "No Records Found"
    }
  },
  data() {
    return {
      
      isVisible: true
    };
  },
  methods: {}
};
</script>
<style>
</style>