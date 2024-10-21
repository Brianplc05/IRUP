<template>
  <div
    class="flex flex-center column q-pa-md"
    style="min-height: 100vh; position: relative; z-index: 1"
  >
    <q-spinner-pie class="spinner" color="primary" />
    <div class="q-mt-md" style="color: #0a335f; font-size: 28px">
      Authenticating, Please wait...
    </div>
  </div>
  <img
    src="../../assets/LoadingBG.png"
    alt="Loading Image"
    class="background-image q-mt-lg"
  />
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "IRLOGIN",

  computed: {
    ...mapGetters({ getUser: "ApplyStore/getUser" }),
  },

  mounted() {
    this.authenticateUser();
  },

  methods: {
    authenticateUser() {
      setTimeout(() => {
        if (this.getUser) {
          this.$router.push("/Main");
        } else {
          this.$router.push("/IRLogin");
        }
      }, 2000);
    },
  },
};
</script>

<style scoped>
.spinner {
  width: 15vw;
  height: 15vw;
  max-width: 150px;
  max-height: 150px;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 97.5%;
  z-index: 0;
  object-fit: cover;
  overflow: hidden;
}
</style>
