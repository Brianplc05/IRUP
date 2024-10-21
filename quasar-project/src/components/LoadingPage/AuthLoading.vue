<template>
  <div
    class="flex flex-center column q-pa-md"
    style="min-height: 100vh; position: relative; z-index: 1"
  >
    <q-spinner-pie class="spinner" color="primary" />
    <div class="q-mt-md loading-text">Authenticating, Please wait...</div>
  </div>
  <img
    src="../../assets/LoadingBG.png"
    alt="Loading Image"
    class="background-image"
  />
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "AuthLoading",

  computed: {
    ...mapGetters({ getUser: "ApplyStore/getUser" }),
  },

  mounted() {
    this.authenticateUser();
  },

  methods: {
    async authenticateUser() {
      if (!this.getUser) {
        console.error("User is not logged in, redirecting to login.");
        this.$router.push("/Login");
        return;
      }
      try {
        // Dispatch the action only if getUser exists
        await this.$store.dispatch(
          "ApplyStore/getAccessRight",
          this.getUser.EmployeeCode
        );
        this.$router.push("/Dashboard");
        console.log(this.$route);
      } catch (error) {
        console.error("Authentication failed:", error);
        this.$router.push("/Login");
      }
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
  z-index: 1; /* Ensure it's above the background */
}

.loading-text {
  color: #0a335f; /* Adjust if needed */
  font-size: 28px;
  z-index: 1; /* Ensure it's above the background */
  text-align: center; /* Center text alignment */
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%; /* Adjusted height to cover the whole screen */
  z-index: 0;
  object-fit: cover;
  opacity: 0.7; /* Added opacity for better text visibility */
}
</style>
