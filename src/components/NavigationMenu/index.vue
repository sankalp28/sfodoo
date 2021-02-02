<template>
  <div class="left-menu-section">
    <div class="logo">
      <i class="icon icon-close"></i>

      <img src="@/assets/images/logo.png" alt />
    </div>

    <nav>
      <div class="account-droupdown">
        <el-select
          v-model="value"
          placeholder="Select"
          v-on:input="onChangeSelect($event)"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <ul>
        <li v-if="value === 'Account Objects'">
          <!-- <a class="dropdown" >
            <i class="icon icon-sync-3" ></i> Sync
          </a>
          <ul class="dropdown-container"  >
            <li v-if="value === 'Account Objects'"> -->
          <router-link to="/syncRule">
            <!-- <i class="icon icon-outlined-circle"></i> Define Sync Rule -->
            <i class="icon icon-sync-3"></i> Define Sync Rule
          </router-link>
        </li>
        <!-- </ul> -->

        <li v-if="value === 'Account Objects'">
          <router-link to="/fieldMapping">
            <i class="icon icon-field-mapping"></i> Field Mapping
          </router-link>
        </li>

        <li></li>
        <li v-if="value === 'Account Objects'">
          <router-link to="/compareRecord">
            <i class="icon icon-compare-record"></i> Compare Records
          </router-link>
        </li>

        <li v-if="value === 'Asset Objects'">
          <router-link to="/CompareAssetsRecord">
            <i class="icon icon-compare-record"></i> Compare Asset Records
          </router-link>
        </li>

        <li v-if="value === 'Asset Objects'">
          <router-link
            to="/logs"
            :class="isLogsDetials ? 'router-link-exact-active' : ''"
          >
            <i class="icon icon-log"></i> Logs
          </router-link>
        </li>

        <li>
          <a
            href="javascript:void(0)"
            @click="logOut()"
            class="router-link-active"
            ><i class="icon icon-logout"></i> Log Out
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>
<script>
export default {
  name: "NavigationMenu",
  data() {
    return {
      isMount: true,
      isAccountSelected: null,
      options: [
        {
          value: "Account Objects",
          label: "Account Objects",
        },
        {
          value: "Asset Objects",
          label: "Asset Objects",
        },
      ],
      value: "Account Objects",
      isLogsDetials: false,
      accountObjectUrlList : ["fieldMapping", "syncRule", "compareRecord"]
    };
  },
  mounted() {

    this.setBackground();

    this.isAccountSelected = this.getdata();
    //console.log("mounted get msg ===> ", this.isAccountSelected);
    this.setdata(this.isAccountSelected);
    this.onChangeSelect(this.value);

    var dropdown = document.getElementsByClassName("dropdown");
    //console.log("dropdown...........", dropdown.length);
    var i;
    for (i = 0; i < dropdown.length; i++) {
      dropdown[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var dropdownContent = this.nextElementSibling;
        if (dropdownContent.style.display === "block") {
          dropdownContent.style.display = "none";
        } else {
          dropdownContent.style.display = "block";
        }
      });
    }
    // Get the modal
    var modal = document.getElementById("myModal");

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  },
  methods: {

    setBackground() {
      if (
        window.location &&
        window.location.href &&
        window.location.href.includes("/logsDetails/")
      ) {
        this.isLogsDetials = true;
      }
    },

    logOut() {
      localStorage.clear();
      this.$router.push("/");
    },
    onChangeSelect(evt) {
      //console.log("hi", evt);
      if (evt === "Account Objects") {
        localStorage.setItem("objectType", true);
        this.isAccountSelected = true;
        if (this.isMount == false) {
          this.$router.push({ name: "fieldMapping" });
        }
      } else {
        localStorage.setItem("objectType", false);
        this.isAccountSelected = false;
        if (this.isMount == false) {
          this.$router.push({ name: "CompareAssetsRecord" });
        }
      }

      this.isMount = false;
      // this.isAccountSelected=(evt=="Account Objects")?true:false;
    },
    setdata(evt) {
      //console.log("set data value", evt);
      if (evt === "true") {
        //console.log("true");
        localStorage.setItem("objectType", true);
        this.isAccountSelected = true;
        this.value = "Account Objects";
      } else if (evt === "false") {
        //console.log("false");
        localStorage.setItem("objectType", false);
        this.isAccountSelected = true;
        this.value = "Asset Objects";
      } else {
        //console.log("objectType value null -> set true");
        localStorage.setItem("objectType", true);
        this.isAccountSelected = false;
        this.value = "Asset Objects";
      }
    },
    getdata() {

      let getObjectType = localStorage.getItem("objectType");
      // alert(this.$route.name)
      // console.log(getObjectType,"getObjectType --->>>")
        if(getObjectType == undefined) 
        {
            let routeName = this.$route.name;
            var index = this.accountObjectUrlList.indexOf(routeName);
            // console.log(index,"index==>")
            if(index >= 0){
              localStorage.setItem("objectType", true);
              return localStorage.getItem("objectType");
            }
            else{
              localStorage.setItem("objectType", false);
              return localStorage.getItem("objectType");
            }
        }
      return localStorage.getItem("objectType");
    },
  },
  watch: {
    $route(to) {
      if (to.name == "logsDetails") {
        this.isLogsDetials = true;
      } else {
        this.isLogsDetials = false;
      }

      //console.log("to --> ", to.name);
      //console.log("from --> ", from);
    },
  },
};
</script>

<style>
.account-droupdown .el-input__inner:hover {
  background: #0eacea;
  color: #fff;
  box-shadow: 0px 0px 16px 0px rgba(7, 138, 190, 0.5);
}
.account-droupdown .el-select {
  width: 100%;
}
</style>
