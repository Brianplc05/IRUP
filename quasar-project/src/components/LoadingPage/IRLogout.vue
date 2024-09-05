<template>
  <div class="flex flex-center column q-pa-md auth-loading">
    <q-spinner-oval size="150px" color="primary" />
    <div class="text-h5 q-mt-md" style="color: #0a335f">
      Logging Out, Please wait...
    </div>
  </div>
</template>

<script>
export default {
  name: "LogoutPage",
  mounted() {
    setTimeout(() => {
      this.$router.push("/IRLogin");
    }, 2000); // Redirect after 2 seconds (adjust as needed)
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
