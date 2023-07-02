<template>
  <q-layout view="lHh Lpr lFf" id="main">
    <q-header elevated class="bg_header text-white" v-if="user.name !== ''">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="title">
          <!-- <img src="../assets/logo.png" style="width: 80px" /> -->
          <p style="margin: 0">{{name}}</p>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      bordered
      v-if="user.name !== ''"
    >
      <v-left-menu @closeDrawer="leftDrawerOpen = false"></v-left-menu>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";
import { user } from "src/store/store";
import { name } from "src/store/store";
import vLeftMenu from "src/components/vLeftMenu.vue";

export default defineComponent({
  name: "MainLayout",

  components: { vLeftMenu },

  data() {
    return {
      leftDrawerOpen: false,
      isLoggined: false,
      user,
      name,
    };
  },
  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
  },
});
</script>

<style scoped>
#main {
  background-color: #1d1d1d;
  color: white;
}
</style>
