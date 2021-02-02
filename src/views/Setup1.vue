<template>
  <div class="page-wrapper">
    <div class="mobile-menu">
      <i class="icon icon-mobile-menu"></i>
    </div>

    <!-- <NagvigationMenu /> -->

    <div class="content-area">
      <div class="relative">
        <div class="content-wrapper">
          <div class="router-view">
            <div class="sec-title">
              <h1>Field Mapping</h1>
            </div>

            <div class="content-area__content">
              <div class="content-wrapper">
                <div class="mapping-field">
                  <Fieldmapping />
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
import Fieldmapping from "./Fieldmapping";
export default {
  name: "Setup1",
  components: { Fieldmapping },
};
</script>
