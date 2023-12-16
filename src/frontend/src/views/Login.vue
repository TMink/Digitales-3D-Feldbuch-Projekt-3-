<!--
 * Created Date: 29.11.2023 01:45:54
 * Author: Julian Hardtung
 * 
 * Last Modified: 08.12.2023 14:32:08
 * Modified By: Julian Hardtung
 * 
 * Description: Vue component for user login
 -->


<template>
  <div id="wrapper">
    <Navigation active_tab_prop="" />

    <v-img cover :height="getHeight()"
      src="https://cdn.discordapp.com/attachments/537612240409329714/1179100383516299326/Background.png?ex=65788dce&is=656618ce&hm=1293c8ed1ee66a8d3707737d52fa50fc96a5e0ef73b21f9a0a392ee9e8d56f56&">
      <v-row class="align-center text-center justify-center pt-16 mt-16">
        <v-col>
          <v-icon><v-img src="src/assets/logos/3DDF_Icon.png"></v-img></v-icon>

          <h1 class="text-h4 font-weight-thin mb-4">
            {{ toolbar_title }}
          </h1>
          <h4 class="subheading">
            LOGIN
          </h4>
          <v-row no-gutters>
            <v-spacer></v-spacer>
            <v-text-field v-model="form.username" variant="outlined" label="Username"></v-text-field>
            <v-spacer></v-spacer>
          </v-row>
          <v-row no-gutters>
            <v-spacer></v-spacer>
            <v-text-field v-model="form.password" variant="outlined" type="input" label="Password"></v-text-field>
            <v-spacer></v-spacer>
          </v-row>

          <v-btn v-on:click="login()" color="secondary" class="ma-2" 
          prepend-icon="mdi-account-plus-outline">Login</v-btn>
          <v-row no-gutters text-xs-center>
            <v-spacer></v-spacer>
            <a href="url" class="pa-2">Forgot password</a>
            <a v-on:click="routeRegistration()" class="pa-2">Sign-up</a>
            <v-spacer></v-spacer>
          </v-row>
        </v-col>
      </v-row>
    </v-img>
  </div>
</template>
    
<script>
import { fromOfflineDB } from '../ConnectionToOfflineDB.js'
import Navigation from '../components/Navigation.vue'
import { useUserStore } from '../Authentication.js';
import { useWindowSize } from 'vue-window-size';

export default {
  name: 'Landingpage',
  components: {
    Navigation,
  },
  setup() {
    const userStore = useUserStore();
    const { width, height } = useWindowSize();
    return {
      userStore,
      windowWidth: width,
      windowHeight: height,
    };

  },
  emits: ['view'],
  data() {
    return {
      activities: [],
      toolbar_title: this.$t('fieldbook'),
      form: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    routeRegistration() {
      this.$router.push({ name: 'Registration' });
    },
    /**
     * Logging in the user with the given username + passsword
     */
    async login() {
      try {
        await this.userStore.login(this.form);
        this.$router.push({ name: "ActivitiesOverview" });
      } catch (error) {
        console.log("Login failed: " + error)
      }
    },
    getHeight() {
      if(this.windowHeight > 600){
        return this.windowHeight - 115;
      } else {
        return this.windowHeight + 115;
      }
        
    },
  }
}
</script>
    
<style scoped>
</style>
    