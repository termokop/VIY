<template>
  <q-page class="flex flex-center">
    <div class="page" v-if="user.name === ''">
      <div class="img">
        <img alt="VIY logo" src="~assets/logo.png" style="width: 150px" />
      </div>
      <div class="login-form">
        <q-input
          v-model="name"
          label-color="black"
          bg-color="white"
          label="Логін"
          outlined
          class="log-el"
        />

        <q-input
          v-model="password"
          label-color="black"
          bg-color="white"
          label="Пароль"
          outlined
          class="log-el"
        />

        <q-btn
          color="primary"
          label="Вхід"
          class="log-el"
          @click="login()"
        ></q-btn>
      </div>
    </div>
  </q-page>
</template>

<script>
import { user } from "../store/store.js";

export default {
  name: "IndexPage",
  data() {
    return {
      name: "",
      password: "",
      loggined: false,
      user,
    };
  },
  methods: {
    async login() {
      let loginObj = {
        name: this.name,
        password: this.password,
      };
      const url = "https://www.ukrge.site/viy/API/login.php";
      const json = JSON.stringify(loginObj);
      try {
        let response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: json,
        });
        let result = await response.json();
        if (result.message === "Success") {
          this.loggined = true;
          console.log(user);
          user.login(result.name, result.rights);
          this.$router.push("/books");
        } else alert("Невірно введений логін або пароль");
      } catch (error) {
        alert("Сталася помилка при спробі входу");
        // alert(error);
      }
    },
  },
  created() {
    if (user.name !== "") this.$router.push("/books");
  },
};
</script>

<style scoped>
.page {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.login-form {
  margin: 20px;
  padding: 30px;
  width: fit-content;
}
.log-el {
  width: 250px;
  margin: 10px;
}

.img {
  width: 100%;
  display: flex;
}

img {
  margin: auto;
  padding: 0;
}
</style>
