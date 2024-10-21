<template>
  <q-layout view="lHh Lpr lFf">
    <q-header style="height: auto; background-color: #003566">
      <q-toolbar class="container">
        <div class="dis1">
          <q-avatar
            size="80px"
            @click="showMenu = true"
            style="border: 2px solid #ffc619"
          >
            <img
              v-if="loggedInUser"
              :src="avatarUrl + loggedInUser.EmployeeCode"
            />
          </q-avatar>
          <div class="labelhead" v-if="loggedInUser">
            WELCOME, {{ loggedInUser.FirstName }}
          </div>

          <!-- Q-Menu for the prompt -->
          <q-menu v-model="showMenu">
            <q-card class="custom-card">
              <div
                class="text-h6"
                style="margin-left: 10px; margin-top: 15px; color: #003566"
              >
                PROFILE
              </div>
              <div
                class="column items-start"
                style="margin-top: 15px; margin-left: 10px"
              >
                <div class="col1">
                  <q-icon name="person" size="36px" />
                  <p class="item-label" v-if="loggedInUser">
                    {{ loggedInUser.EmployeeCode }}
                  </p>
                </div>
                <div class="col1">
                  <q-icon name="assignment_ind" size="36px" />
                  <p class="item-label" v-if="loggedInUser">
                    {{ loggedInUser.FullName }}
                  </p>
                </div>
                <div class="col1">
                  <q-icon name="business" size="36px" />
                  <p class="item-label" v-if="loggedInUser">
                    {{ loggedInUser.Department_Description }}
                  </p>
                </div>
              </div>
              <q-card-actions align="right" class="custom-card-actions">
                <q-btn
                  push
                  icon="logout"
                  label="LOGOUT"
                  @click="logout"
                  color="secondary"
                  v-close-popup
                  class="button1"
                ></q-btn>
              </q-card-actions>
            </q-card>
          </q-menu>
        </div>
        <div class="dis2">
          <q-img src="../assets/IRLogo.png" class="custom-image"></q-img>
          <q-img src="../assets/UERM Logos.png" class="image"></q-img>
        </div>
      </q-toolbar>
    </q-header>

    <q-list>
      <q-item-label> </q-item-label>
    </q-list>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      FullName: "",
      FirstName: "",
      showMenu: false,
      avatarUrl: process.env.IMAGE_REST_API_URL,
    };
  },

  created() {
    this.$store.dispatch("ApplyStore/initAuth").catch((error) => {
      console.error("Error initializing authentication:", error);
    });
  },

  computed: {
    ...mapGetters({ loggedInUser: "ApplyStore/getUser" }),
    isUserLoggedIn() {
      return !!this.loggedInUser && !!this.loggedInUser.FullName;
    },
  },

  methods: {
    ...mapActions("ApplyStore", ["logoutAction", "googlelogoutAction"]),

    async logout() {
      try {
        const UERMEmail = this.loggedInUser.UERMEmail;
        if (UERMEmail !== null && typeof UERMEmail !== "undefined") {
          await this.googlelogoutAction();
          this.$router.push("/google-authlogout");
        } else {
          await this.logoutAction();
          this.$router.push("/LogoutPage");
        }
      } catch (error) {
        console.error("Error logging out:", error);
      }
    },
  },
};
</script>

<style>
.container {
  height: auto;
  display: flex;
  justify-content: space-between;
}
.dis1 {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Align items to the start */
  width: 50%;
  height: 90px;
  cursor: pointer;
}
.labelhead {
  color: #ffc619;
  font-size: 25px;
  margin-left: 15px;
  font-family: Arial Black;
}
/* .clickable-avatar {
  cursor: pointer;
} */
.custom-card {
  width: 350px;
  height: 300px;
  display: flex;
  flex-direction: column;
  border: 1px solid rgb(191, 207, 228);
}
.custom-card-actions {
  border-top: 2px solid #d5d7da;
  margin-top: auto;
}
.col1 {
  margin-top: 10px;
  display: flex;
  color: #0f4d91;
  justify-content: space-between;
}
.item-label {
  font-weight: bold;
  color: #0c0c0c;
  font-size: 16px;
  margin-top: 5px;
  margin-left: 10px;
  text-align: center;
}
.button1 {
  width: 350px;
  font-size: 15px;
  box-shadow: #000000;
}
/* --------------------------------------------------------------------------------------------- */
.dis2 {
  width: 225px;
  height: 90px;
  padding: 0 10px; /* Optional: Add padding for spacing */
}
.custom-image {
  width: 85px; /* Set the width as needed */
  height: auto; /* Maintain aspect ratio */
  margin-top: 5px;
}
.image {
  width: 105px; /* Set the width as needed */
  height: auto; /* Maintain aspect ratio */
  margin-left: 12px;
  background-color: aliceblue;
}
</style>
