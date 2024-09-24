<template>
  <div class="flex flex-center column q-pa-md auth-loading">
    <q-spinner-pie
      :size="$q.screen.lt.md ? '100px' : '150px'"
      color="primary"
    />
    <div class="text-h6 q-mt-md" style="color: #0a335f">
      Authenticating, Please wait...
    </div>
  </div>
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
      } catch (error) {
        console.error("Authentication failed:", error);
        this.$router.push("/Login");
      }
    },
  },
};
</script>

<style scoped>
.auth-loading {
  background-color: aliceblue;
  width: 100%;
  height: 100vh;
}
</style>
