<template>
  <q-table
    :rows="items"
    :columns="columns"
    row-key="IRNo"
  >
    <template v-slot:body-cell-viewEmp="props">
      <q-td>
        <q-btn push @click="showEmplo(props.row.IRNo, props.row.DateTimeCreated)" :ripple="{ center: true }" color="accent" icon="description" class="text-black text-bold text-center shadow-5"/>
        <q-dialog v-model="viewEms" persistent full-width>
          <q-card class="EOBG">
            <q-bar>
              <q-space></q-space>
              <q-btn dense flat icon="close" @click="onCancel" v-close-popup>
                <q-tooltip class="bg-white text-primary">Close</q-tooltip>
              </q-btn>
            </q-bar>

            <q-card-section style="border: 0.2em solid #f3f4f7; background-color: #003566;">
              <div style="display: flex; justify-content: space-between; color: #f3f4f7;">
                <div><b>IR NUMBER: {{ IRNo }}</b></div>
                <div><b>DATE CREATED: {{ FormatDate(DateTimeCreated) }}</b></div>
              </div>
            </q-card-section>
            <q-spinner-ios class="spinner" v-if="loading" size="160px" color="primary" style="margin-left: 43.5%; margin-top: 3%;"></q-spinner-ios>
            <q-table flat bordered :rows="disDems" hide-bottom></q-table>
          </q-card>
        </q-dialog>
      </q-td>
    </template>
  </q-table>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      viewEms: false,
      loading: false,
      IRNo: '',
      DateTimeCreated: '',
      disDems: [],
    };
  },

  computed: {
    ...mapGetters({
      demerit: 'ApplyStore/demerit'
    })
  },

  methods: {
    FormatDate(DateTimeCreated) {
      const date = new Date(DateTimeCreated);
      const formattedDate = date.toISOString().split("T")[0];
      return formattedDate;
    },

    async showEmplo(IRNo, DateTimeCreated) {
      this.IRNo = IRNo;
      this.DateTimeCreated = DateTimeCreated;
      this.viewEms = true;
      this.loading = true;
      try {
        await this.viewEmployees(IRNo);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        this.loading = false;
      }
    },

    async viewEmployees(IRNo) {
      try {
        const data = { IRNo: IRNo };
        await this.$store.dispatch('ApplyStore/disDemerit', data);
        this.disDems = this.demerit;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },

    onCancel() {
      this.viewEms = false;
      this.IRNo = '';
      this.DateTimeCreated = '';
      this.disDems = [];
    }
  }
};
</script>
