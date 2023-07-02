<template>
  <q-page padding>
    <div class="btns q-gutter-sm">
      <q-btn
        color="primary"
        icon="add"
        label="Додати доставку"
        @click="isOpenAddOrder = true"
      />

      <q-btn
        color="primary"
        label="Оновити список доставок"
        @click="getDeliveryList()"
      />
    </div>

    <div class="table">
      <div class="q-pa-md">
        <div
          class="no-data"
          v-if="!shippingList.length && !loadingForGetShippingList"
        >
          Непідтверджені доставки відсутні...
        </div>
        <q-inner-loading
          :showing="loadingForGetShippingList"
          v-if="loadingForGetShippingList"
        >
          <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading>
        <div v-for="currentShipping in shippingList" :key="currentShipping.id">
          <q-item>
            <q-item-section top avatar>
              <q-avatar color="warning" text-color="white" icon="delivery" />
            </q-item-section>
            <q-item-section>
              <q-item-label>
                <b>{{ currentShipping.sendDetalies }}</b></q-item-label
              >
              <q-item-label
                style="font-size: small"
                lines="4"
                v-for="book in currentShipping.booksInPeckage"
                :key="book"
                ><i> - {{ book }}</i></q-item-label
              >
            </q-item-section>
            <q-item-section side top>
              <q-item-label lines="2">
                Дата відправки: <br />
                {{ currentShipping.dateOfSending }}</q-item-label
              >
            </q-item-section>
          </q-item>
          <div style="width: fit-content; margin: auto">
            <p>
              Статус:
              {{ currentShipping.statusFromAPI }}
            </p>
            <q-btn
              color="positive"
              label="Підтвердити отримання"
              @click="confirmReceiving(currentShipping)"
            />
          </div>
        </div>
      </div>
    </div>

    <q-dialog v-model="isOpenAddOrder">
      <q-card bordered class="card">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Додати доставку</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-select
            filled
            v-model="currentTypeOFSending"
            :options="typesOfSending"
            label="Тип відправки:"
          />
          <q-input label="Деталі відправлення" v-model="sendDetalies"></q-input>
          <q-input label="ТТН" v-model="ttnNumber"></q-input>
          <q-input label="Вартість доставки" v-model="deliveryCost"></q-input>
          <q-input
            type="date"
            label="Дата відправлення"
            v-model="dateOfSending"
          ></q-input>
          <q-select
            filled
            v-model="booksInPeckage"
            multiple
            :options="avaibleBooksForSend"
            counter
            style="width: 250px"
          />
          <q-btn
            :loading="loadindForAddOrder"
            color="primary"
            icon="check"
            label="Додати"
            @click="addShiping()"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="isConfirmReceivingOpen">
      <q-card bordered class="card">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Підтвердження</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-input
            label="Вартість доставки"
            v-model="currentShippingForReceiving.deliveryCost"
          ></q-input>
          <div
            v-for="book in currentShippingForReceiving.booksInDelivery"
            :key="book"
          >
            <q-badge color="secondary"> Стан книги: {{ book.title }} </q-badge>
            <q-slider v-model="book.book_condition" :min="0" :max="10" />
          </div>
          <q-btn
            color="primary"
            icon="check"
            label="Підтвердити"
            @click="sendConfirmReceiving()"
          />
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
      isOpenAddOrder: false,
      isDeliveryInfoOpen: false,
      isConfirmReceivingOpen: false,

      loadingForGetShippingList: false,

      // Інформація про доставку
      typesOfSending: ["Нова пошта", "УкрПошта", "OLX-доставка"],
      currentTypeOFSending: "",
      sendDetalies: "",
      ttnNumber: "",
      booksInPeckage: [],
      deliveryCost: "",
      dateOfSending: "",
      avaibleBooksForSend: [],

      loadindForAddOrder: false,

      shippingList: [],
      booksList: [],

      currentShippingForReceiving: {},

      novaPoshtaAPI: "b8e107c6c15f9b44c6a3fa695b0ae676",
      phone: "380987467378",
      documents: [],
      listFromNP: [],
    };
  },
  methods: {
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
        console.log(result);
        this.booksList = result.list;
        console.log("bookList", this.booksList);
        this.separateBooksbyStatus();
      } catch (error) {
        console.log("error", error);
      }
    },
    async addShiping() {
      let shipping = {
        currentTypeOFSending: this.currentTypeOFSending,
        sendDetalies: this.sendDetalies,
        ttnNumber: this.ttnNumber,
        booksInPeckage: JSON.stringify(this.booksInPeckage),
        deliveryCost: this.deliveryCost,
        dateOfSending: this.dateOfSending,
      };
      const url = "https://www.ukrge.site/viy/API/add_shipping.php";
      const json = JSON.stringify(shipping);
      try {
        this.loadindForAddOrder = true;
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
        if (result.message === "Done") {
          this.isOpenAddOrder = false;

          this.currentTypeOFSending = "";
          this.sendDetalies = "";
          this.ttnNumber = "";
          this.booksInPeckage = [];
          this.deliveryCost = "";
          this.dateOfSending = "";
          this.getDeliveryList();
        } else alert("Хм... Щось пішло не так....");
      } catch (error) {
        alert("Сталася помилка при спробі додавання книги");
      } finally {
        this.loadindForAddOrder = false;
      }
    },
    async getDeliveryList() {
      const url = "https://www.ukrge.site/viy/API/get_delivery_list.php";
      try {
        this.loadingForGetShippingList = true;
        let response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
        let result = await response.json();
        this.shippingList = result.list;

        for (let i = 0; i < this.shippingList.length; i++) {
          this.shippingList[i].booksInPeckage = JSON.parse(
            this.shippingList[i].booksInPeckage.replace(/&quot;/g, '"')
          );
        }
        await this.getDataFromNP();
        this.deliveryStatus();

        this.getBooksList();
      } catch (error) {
        console.log("error", error);
      } finally {
        this.loadingForGetShippingList = false;
      }
    },
    separateBooksbyStatus() {
      this.avaibleBooksForSend = [];
      this.booksList.forEach((book) => {
        if (book.status === "Оплачено" || book.status === "Замовлено")
          this.avaibleBooksForSend.push(book.title);
      });
    },
    confirmReceiving(currentShipping) {
      this.currentShippingForReceiving = currentShipping;

      this.currentShippingForReceiving.booksInDelivery = [];
      for (
        // додавання об'єктів книг зі властивістю стану
        let j = 0;
        j < this.currentShippingForReceiving.booksInPeckage.length;
        j++
      ) {
        this.currentShippingForReceiving.booksInDelivery.push({
          title: this.currentShippingForReceiving.booksInPeckage[j],
          book_condition: 10,
        });
      }

      console.log("here", this.currentShippingForReceiving);

      this.isConfirmReceivingOpen = true;
    },
    async sendConfirmReceiving() {
      let shippingForSend = {
        id: this.currentShippingForReceiving.id,
        cost: this.currentShippingForReceiving.deliveryCost,
        books: JSON.stringify(this.currentShippingForReceiving.booksInDelivery),
        user: this.user.name,
      };
      const url = "https://www.ukrge.site/viy/API/confirm_shipping.php";
      const json = JSON.stringify(shippingForSend);
      console.log(json);
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
        console.log(result);
        if (result.message === "Done") {
          this.isConfirmReceivingOpen = false;
          this.getDeliveryList();
          // $q.notify({
          //   type: "positive",
          //   message: "Запис успішно додано.",
          // });
        } else alert("Хм... Щось пішло не так...");
      } catch (error) {
        alert("Сталася помилка при спробі додавання книги");
      }
    },
    async getDataFromNP() {
      for (let i = 0; i < this.shippingList.length; i++) {
        if (this.shippingList[i].currentTypeOFSending === "Нова пошта") {
          this.documents.push({
            DocumentNumber: this.shippingList[i].ttnNumber,
            Phone: this.phone,
          });
        }
      }

      if(!this.documents.length) return

      let body = {
        apiKey: this.novaPoshtaAPI,
        modelName: "TrackingDocument",
        calledMethod: "getStatusDocuments",
        methodProperties: {
          Documents: this.documents,
        },
      };

      const url = "https://api.novaposhta.ua/v2.0/json/";
      const json = JSON.stringify(body);
      try {
        let response = await fetch(url, {
          method: "POST",
          body: json,
        });
        let result = await response.json();
        if (result.success === true) {
          this.listFromNP = result.data;
        } else console.log("Не вдалося отримати дані від Нової Пошти");
      } catch (error) {
        alert("Сталася помилка при спробі додавання книги");
      }
    },
    deliveryStatus() {
      for (let j = 0; j < this.shippingList.length; j++) {
        if (this.shippingList[j].currentTypeOFSending === "Нова пошта") {
          for (let i = 0; i < this.listFromNP.length; i++) {
            const element = this.listFromNP[i];
            if (element.Number == this.shippingList[j].ttnNumber) {
              this.shippingList[j].statusFromAPI = element.Status;
            }
          }
        } else this.shippingList[j].statusFromAPI = "В розробці...";
      }
      console.log(this.shippingList);
    },
  },
  computed: {},
  created() {
    if (user.name === "") this.$router.push("/");
    this.getDeliveryList();
  },
};
</script>

<style scoped>
.card {
  width: 300px;
  overflow: hidden;
}
</style>
