<template>
  <div id="q-app" style="min-height: 100vh; position: relative;">
    <div class="q-pa-md row items-start" style="position: relative; z-index: 1;">
      <div class="logcard">
        <div style="display: flex; justify-content: space-between;">
          <div style="height: 550px; width: 600px;">
            <img src="../assets/FINALPOST.png" class="imgs">
          </div>

          <div class="signin">
            <div class="text-center">
              <img src="../assets/UERM Logos.png"  class="q-ma-s " style="margin-top: 20px; width: 40%; height: 38%;">
              <div class="textSign">SIGN IN</div>
              <div class="textIn">To access the Incident Report System, please make sure you meet the following requirements:</div>
              <div class="text3">1. Use your provided UERM email.</div>
              <div class="text3">2. Google Authenticator Application.</div>
            </div>


            <div style="margin-top: 15px; margin-left: 105px;">
              <div id="google-signin-button"></div>
            </div>

          </div>
        </div>
      </div>
    </div>
    <img src="../assets/uermmmci.png" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0;">
  </div>
</template>


<script>
import { jwtDecode } from '../helper/decodeToken.js';

export default {
  data() {
    return {};
  },

  mounted() {
    this.loadGoogleSignIn();
  },

  methods: {
    loadGoogleSignIn() {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('Google Sign-In script loaded successfully');
        if (google.accounts && google.accounts.id) {
          window.google.accounts.id.initialize({
            client_id: '264446525375-15c8aro7mmfufsccssk4sccelk8oasgs.apps.googleusercontent.com',
            callback: this.handleCredentialResponse
          });
          window.google.accounts.id.renderButton(
            document.getElementById('google-signin-button'),
            {
              theme: 'outline',
              size: 'large',
              width: 200,
              height: 40,
              longtitle: true,
              scope: 'profile email'
            }
          );
          console.log('Google Sign-In button rendered');
        } else {
          console.error('Error: Google Sign-In library not available');
        }
      };
      script.onerror = (error) => {
        console.error('Error loading Google Sign-In script:', error);
      };
      document.head.appendChild(script);
    },

    async handleCredentialResponse(googleToken) {
      console.log('Encoded JWT ID token: ' + googleToken.credential);
      try {
        const decodedToken = jwtDecode(googleToken.credential);
        const payload = {
            UERMEmail: decodedToken.Email
        }
        console.log('ETO AY EMAIL:', payload);
        const response = await this.$store.dispatch("ApplyStore/googleLogin", payload);
        console.log("DATA INSERTED SUCCESSFULLY");
        this.$router.push('/google-authload');
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }
};
</script>

<style>
.q-input {
  margin-bottom: 10px; /* Adjust the value as needed */
}
.logcard {
  padding: 1em;
  width: 1250px; /* Optional: set a max-width for the card */
  height: 580px;
  margin-top: 150px;
  background-color: transparent;
}
.signin{
  border-top: 1em solid #FFC619;
  border-bottom: 1em solid #0F4D91;
  height: 550px;
  width: 550px;
  background-color: #ffffff;
}
.textSign{
  font-weight: bold;
  font-family: Arial Black;
  display: flex;
  color: #0F4D91;
  font-size: 35px;
  justify-content: center;
}
.textIn {
  color: #000000;
  font-weight: bold;
  font-size: 18px;
  text-align: left; /* Added this line */
  margin-left: 25px;
  margin-top: 10px;
}
.text3 {
  color: #000000;
  font-size: 18px;
  text-align: left; /* Added this line */
  margin-left: 65px;
  margin-top: 4px;
}
.imgs {
  height: 330px;
  width: 580px;
  margin-top: 100px;
  margin-left: 20px;
}
</style>

