<template>
  <div>
    <div class="page-wrapper">
      <section class="setup-section">
        <div class="auto-container">
          <div class="row">
            <div class="title-block">
              <div class="sec-title">Salesforce</div>
              <div class="icon icon-sync"></div>
              <div class="sec-title">Oddo CRM</div>
            </div>
          </div>
        </div>
      </section>
      <section class="setupform-section">
        <div class="auto-container">
          <Fieldmapping />
        </div>
      </section>
    
    </div>
  </div>
</template>

<script>
import Fieldmapping from "./Fieldmapping";
export default {
  name: "Setup",
  components: { Fieldmapping }
};
</script>
