<template>
  <q-page padding>
    <div class="btns q-gutter-sm">
      <q-btn
        color="primary"
        label="Оновити список книг"
        @click="getBooksList()"
      />

      <q-btn
        color="primary"
        icon="add"
        label="Додати книги"
        @click="addBookDialog = true"
      />
    </div>

    <div class="booksList">
      <q-card
        class="book"
        :class="getRowClassName(book.status)"
        v-for="book in booksList"
        :key="book.id"
        @click.prevent="seeBookDetailes(book)"
      >
        <template v-if="!book.detalies">
          <q-card-section class="author">
            <div class="text-subtitle2">{{ book.author }}</div>
          </q-card-section>
          <q-card-section class="title">
            <div class="text-subtitle1">
              <b>{{ book.title }}</b>
            </div>
          </q-card-section>
          <q-card-section class="publisher">
            <i>{{ book.publisher }}</i>
          </q-card-section>
        </template>

        <template v-if="book.detalies">
          <q-card-section class="detalies">
            <div>Кількість: {{ book.amount }}</div>
          </q-card-section>
          <q-card-section class="detalies">
            <div>Стан: {{ book.book_condition }}/10</div>
          </q-card-section>
          <q-card-section class="detalies">
            Ціна книги: {{ book.priceOfBook }} грн.
          </q-card-section>
          <q-card-section class="detalies">
            Статус: {{ book.status }}
          </q-card-section>
          <q-card-section
            class="detalies"
            v-if="book.shipping1 && book.shipping1 !== '0'"
          >
            Вартість доставки: {{ book.shipping1 }} грн.
          </q-card-section>
          <q-btn
            class="edit-btn"
            icon="edit"
            flat
            round
            dense
            @click.stop="openEditDialog(book)"
          />
        </template>
      </q-card>
    </div>

    <q-dialog v-model="addBookDialog">
      <q-card bordered class="card">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Додати книги</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-input label="Автор" v-model="author"></q-input>
          <q-input label="Назва" v-model="title"></q-input>
          <q-input label="Видавництво" v-model="publisher"></q-input>
          <q-input label="Ціна книги (грн)" v-model="priceOfBook"></q-input>
          <q-input
            label="Вартість доставки до №1 (грн)"
            v-model="shipping1"
          ></q-input>
          <q-input type="number" label="Кількість" v-model="amount"></q-input>
          <q-input label="Стан книги" v-model="book_condition"></q-input>
          <q-select filled v-model="status" :options="options" label="Статус" />
          <q-btn
            :loading="loadingForDialog"
            color="primary"
            icon="check"
            label="Додати"
            @click="addBooks()"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="editBookDialog">
      <q-card bordered class="card">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Редагування книги</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-input label="Автор" v-model="author"></q-input>
          <q-input label="Назва" v-model="title"></q-input>
          <q-input label="Видавництво" v-model="publisher"></q-input>
          <q-input label="Ціна книги (грн)" v-model="priceOfBook"></q-input>
          <q-input
            label="Вартість доставки до №1 (грн)"
            v-model="shipping1"
          ></q-input>
          <q-input type="number" label="Кількість" v-model="amount"></q-input>
          <q-input label="Стан книги" v-model="book_condition"></q-input>
          <q-select filled v-model="status" :options="options" label="Статус" />
          <p>
            Останнє редагування: <i>{{ userEditLast }}</i>
          </p>
          <q-btn
            :loading="loadingForDialog"
            color="primary"
            icon="check"
            label="Зберегти зміни"
            @click="editBookInfo()"
          />
          <!-- <q-btn
            :loading="loadingForDialog"
            color="red"
            label="Видалити"
            @click="removeTheBook()"
          /> -->
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { user } from "src/store/store";

export default {
  name: "vMenu",
  data() {
    return {
      user,
      addBookDialog: false,
      editBookDialog: false,

      filter: "",

      // для додавання нової книги
      options: [
        "Замовлено",
        "Оплачено",
        "В дорозі до пункту №1",
        "В пункті №1",
        "В дорозі до пункту №2",
        "В пункті №2",
        "Продано",
      ],
      author: "",
      title: "",
      publisher: "",
      priceOfBook: "",
      shipping1: "",
      amount: 0,
      book_condition: "",
      status: "",
      idForEdit: "",
      userEditLast: "",

      loadingForDialog: false,

      booksList: [],
    };
  },
  methods: {
    openEditDialog(book) {
      this.editBookDialog = true;
      console.log(book);

      this.author = book.author;
      this.title = book.title;
      this.publisher = book.publisher;
      this.priceOfBook = book.priceOfBook;
      this.shipping1 = book.shipping1;
      this.amount = book.amount;
      this.book_condition = book.book_condition;
      this.status = book.status;
      this.idForEdit = book.id;
      this.userEditLast = book.user;
    },
    async editBookInfo() {
      let bookInfo = {
        author: this.author,
        title: this.title,
        publisher: this.publisher,
        priceOfBook: this.priceOfBook,
        shipping1: this.shipping1,
        amount: this.amount,
        book_condition: this.book_condition,
        status: this.status,
        id: this.idForEdit,
        user: this.user.name,
      };
      const url = "https://www.ukrge.site/viy/API/edit_book_info.php";
      const json = JSON.stringify(bookInfo);
      try {
        this.loadingForDialog = true;
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
        console.log(result);
        if (result.message === "Done") {
          this.editBookDialog = false;
          // $q.notify({
          //   type: "positive",
          //   message: "Запис успішно додано.",
          // });
          this.getBooksList();
        } else alert("Хм... Щось пішло не так...");
      } catch (error) {
        alert("Сталася помилка при спробі додавання книги");
      } finally {
        this.loadingForDialog = false;
      }
    },
    async addBooks() {
      let bookInfo = {
        author: this.author,
        title: this.title,
        publisher: this.publisher,
        priceOfBook: this.priceOfBook,
        shipping1: this.shipping1,
        amount: this.amount,
        book_condition: this.book_condition,
        status: this.status,
        user: this.user.name,
      };
      const url = "https://www.ukrge.site/viy/API/add_book.php";
      const json = JSON.stringify(bookInfo);
      try {
        this.loadingForDialog = true;
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
        console.log(result);
        if (result.message === "Done") {
          this.addBookDialog = false;
          // $q.notify({
          //   type: "positive",
          //   message: "Запис успішно додано.",
          // });
          this.getBooksList();
        } else alert("Хм... Щось пішло не так...");
      } catch (error) {
        alert("Сталася помилка при спробі додавання книги");
      } finally {
        this.loadingForDialog = false;
      }
    },
    async getBooksList() {
      const url = "https://www.ukrge.site/viy/API/get_books_list.php";
      try {
        let response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
        let result = await response.json();
        this.booksList = result.list;
        this.booksList.forEach((e, i) => {
          this.booksList[i].detalies = false;
        });
        console.log(this.booksList);
      } catch (error) {
        console.log("error", error);
      } finally {
        this.loadingForDialog = false;
      }
    },
    getRowClassName(status) {
      if (status === "В пункті №1") return "punkt-1";
      if (status === "В дорозі до пункту №1") return "to-punkt-1";
      if (status === "Оплачено") return "paid";
      if (status === "В дорозі до пункту №2") return "to-punkt-2";
      if (status === "В пункті №2") return "punkt-2";
      else return "noinfo";
    },
    seeBookDetailes(book) {
      book.detalies = !book.detalies;
    },
  },
  created() {
    if (user.name === "") this.$router.push("/");
    this.getBooksList();
  },
  computed: {},
};
</script>

<style scoped>
.punkt-1 {
  background-color: rgb(13, 127, 198);
}

.to-punkt-1 {
  background-color: rgb(163, 129, 5);
}

.paid {
  background-color: rgb(205, 205, 8);
  color: black;
}

.to-punkt-2 {
  background-color: chocolate;
}

.punkt-2 {
  background-color: green;
}

.noinfo {
  background-color: red;
}

.card {
  width: 300px;
  overflow: hidden;
}

.booksList {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-top: 15px;
}

.book {
  width: 210px;
  margin: 5px;
  height: 280px;
  /* background-color: aqua; */

  display: flex;
  align-items: space-between;
  flex-wrap: wrap;
}

.detalies {
  margin: auto;
  width: 100%;
}

.title,
.author,
.publisher {
  margin: auto;
  width: 100%;
  text-align: center;
}

.edit-btn {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>
