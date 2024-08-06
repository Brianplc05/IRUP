<template>
  <div id="q-app" style="display:flex; align-items: center; justify-content: center; min-height: 100vh; position: relative;">
    <div class="q-pa-md row items-start" style="position: relative; z-index: 1;">
      <div class="logcards">
        <div class="text-center">
          <img src="../assets/IRLogo.png" class="custom-image">
          <div class="textwel">WELCOME</div>
          <div class="textdash">Please log in to the Admin Dashboard.</div>
        </div>
        <q-card-section>
          <q-form @submit.prevent="login" class="form">
              <q-input outlined v-model="EmployeeCode" label="Employee Number" style="width: 90%; margin-left: 25px;">
                <template v-slot:prepend>
                  <q-icon name="person"></q-icon>
                </template>
              </q-input>
              <q-input
                outlined
                v-model="WebPassword"
                label="Password"
                :type="showPassword ? 'text' : 'password'"
                style="width: 90%; margin-left: 25px;"
              >
                <template v-slot:prepend>
                  <q-icon name="lock"></q-icon>
                </template>
                <template v-slot:append>
                  <q-icon
                    name="visibility"
                    v-if="!showPassword"
                    @click="showPassword = true"
                  ></q-icon>
                  <q-icon
                    name="visibility_off"
                    v-else
                    @click="showPassword = false"
                  ></q-icon>
                </template>
              </q-input>
              <q-btn type="submit" push :ripple="{ center: true }" class="btnlogin shadow-12" label="LOGIN" color="primary" />
            </q-form>
        </q-card-section>
      </div>
    </div>
    <img src="../assets/uermmmci.png" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0;">
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      EmployeeCode: '',
      WebPassword: '',
      showPassword: false,
    };
  },
  computed: {
    ...mapGetters({ getUser: 'ApplyStore/getUser'}),
  },

  methods: {
    async login() {
      try {
        const logs = {
          EmployeeCode: this.EmployeeCode,
          WebPassword: this.WebPassword
        };

        if (!this.validateNOTE()) { // Changed 'validateLOGIN' to 'validateNOTE'
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'PLEASE ENTER BOTH EMPLOYEE NUMBER AND PASSWORD',
            icon: 'report_problem',
            iconColor: 'white',
            timeout: 2000, // Increased timeout to 2000 milliseconds
            progress: true
          });
          return;
        }
        const response = await this.$store.dispatch("ApplyStore/Login", logs);
        console.log("DATA INSERTED SUCCESSFULLY");
        // Redirect to HRADMIN page after successful login
        this.$router.push('/auth-loading');
      } catch (error) {
        console.error("Error Logging in data:", error);
        this.$q.notify({
          color: 'negative',
          position: 'top',
          message: 'INCORRECT EMPLOYEE NUMBER & PASSWORD',
          icon: 'report_problem',
          iconColor: 'white',
          timeout: 2000,
          progress: true
        });
        // Call onreset after the notification is displayed
      }
    },

    validateNOTE() {
      return (
        this.EmployeeCode &&
        this.WebPassword
      );
    }
  },

};
</script>

<style>
.q-pa-md {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.custom-image {
  width: 180px;
  height: 180px; /* To maintain aspect ratio */
  margin-left: 2px;
}
.q-input {
  margin-bottom: 10px; /* Adjust the value as needed */
}
.logcards {
  background-color: #f2f5f8;
  padding: 1em;
  width: 450px; /* Optional: set a max-width for the card */
  height: 525px;
}
.textwel{
  font-weight: bold;
  font-family: Arial Black;
  display: flex;
  color: #0F4D91;
  font-size: 35px;
  justify-content: center;
}
.textdash{
  font-weight: bold;
  display: flex;
  color: #0F4D91;
  font-size: 18px;
  justify-content: center;
  margin-left: 5px;
}
.btnlogin{
  justify-content: center;
  width: 90%; /* Optional: set a max-width for the card */
  margin-left: 25px;
  height: 50px;
  font-weight: bold;
  font-size: 20px;
}
</style>

