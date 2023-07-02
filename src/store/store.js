import { reactive } from "vue";

export const name = "BookBerry";

export const user = reactive({
  name: "",
  rights: "",
  logout() {
    this.name = "";
    this.rights = "";
  },
  login(name, rights) {
    this.name = name;
    this.rights = rights;
  },
});
