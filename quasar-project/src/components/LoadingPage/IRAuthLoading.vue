<template>
  <div class="flex flex-center column q-pa-md auth-loading">
    <q-spinner-pie size="150px" color="primary" />
    <div class="text-h6 q-mt-md" style="color: #0a335f;">Authenticating, Please wait...</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'IRLOGIN',

  computed: {
    ...mapGetters({ getUser: 'ApplyStore/getUser'}),
  },

  mounted() {
    this.authenticateUser();
  },

  methods: {
    authenticateUser() {
      setTimeout(() => {
        if (this.getUser) {
          this.$router.push('/Main');
        } else {
          this.$router.push('/IRLogin');
        }
      }, 2000);
    }
  }
};
</script>

<style scoped>
.auth-loading {
  background-color: aliceblue;
  width: 100%;
  height: 100vh;
}
</style>

