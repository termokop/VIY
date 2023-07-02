<template>
  <q-scroll-area
    style="
      height: calc(100% - 295px);
      margin-top: 295px;
      background-color: #1d1d1d;
      color: white;
    "
  >
    <q-list padding>
      <q-item clickable v-ripple to="/books" @click="$emit('closeDrawer')">
        <q-item-section avatar>
          <q-icon name="book" />
        </q-item-section>
        <q-item-section> Книги </q-item-section>
      </q-item>

      <q-item clickable v-ripple to="/delivery" @click="$emit('closeDrawer')">
        <q-item-section avatar>
          <q-icon name="local_shipping" />
        </q-item-section>
        <q-item-section> Доставки </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <span class="q-mx-auto version"> {{ name }}<sup>&copy;</sup> </span>
        </q-item-section>
      </q-item>
    </q-list>
  </q-scroll-area>

  <q-img
    class="absolute-top"
    src="../assets/logo.png"
    style="width: 100%; background-color: #1d1d1d"
  >
  </q-img>
</template>

<script>
import { user } from "src/store/store";
import { name } from "../store/store";

export default {
  name: "vLeftMenu",
  emits: ["closeDrawer"],
  data() {
    return {
      user,
      name,
    };
  },
  methods: {},
};
</script>
