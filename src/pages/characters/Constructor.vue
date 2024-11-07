<template>
  <VaForm ref="stepForm">
    <VaStepper
        ref="linearStepper"
        v-model="currentStep"
        :steps="steps"
        linear
    >
      <template #step-content-0>
        <VaInput
            v-model="model.name"
            label="Имя персонажа"
            :rules="[
            (v) => !!v || 'Required',
          ]"
            required-mark
        />
      </template>
      <template #step-content-1>
        <VaSelect
            v-model="model.race"
            label="Раса"
            :rules="[
            (v) => !!v || 'Required',
          ]"
            required-mark
            :options="raceOptions"
            :text-by="(option) => option.name"
            :track-by-by="(option) => option.id"
        />
      </template>
      <template #step-content-2>
        <VaSelect
            v-model="model.class"
            label="Класс"
            :rules="[
            (v) => !!v || 'Required',
          ]"
            required-mark
            :options="classOptions"
            :text-by="(option) => option.name"
            :track-by-by="(option) => option.id"
        />
      </template>
      <template #step-content-3>
        <div v-for="(item, index) in stats" class="stats-selector">
          <div class="title-and-level">
            <h2>{{ item.title }}</h2>
            <VaCounter
                v-model="stats[index].level"
                outline
                increase-icon="arrow_upward"
                decrease-icon="arrow_downward"
                color="#0FB58D"
            />
          </div>
          <VaDivider/>
        </div>
      </template>
      <template #step-content-4>
        <div class="grid sm:grid-cols-2 md:grid-cols-5 gap-6 mb-6">
          <VaInput
              v-model="spellsFilter"
              class="sm:col-span-2 md:col-span-3"
              placeholder="Filter..."
          />
          <br>
        </div>

        <VaDataTable
            v-model="selectedSpells"
            :items="spellsOptions"
            :columns="spellsColumns"
            :per-page="spellsPerPage"
            :current-page="spellsCurrentPage"
            selectable
            :filter="spellsFilter"
            @filtered="filtered = $event.items"
        >
          <template #bodyAppend>
            <tr>
              <td colspan="6">
                <div class="flex justify-center mt-4">
                  <VaPagination
                      v-model="spellsCurrentPage"
                      :pages="pages"
                  />
                </div>
              </td>
            </tr>
          </template>
        </VaDataTable>
      </template>
    </VaStepper>
  </VaForm>
</template>

<script>
import {defineComponent} from "vue";
import {ref} from 'vue';
import {useForm, defineVaStepperSteps} from 'vuestic-ui'
import axiosAgregator from "@/server/axiosAgregator.js";

export default defineComponent({
  mounted() {
    this.loadData();
  },
  methods: {
    saveList(){
      // TODO Сохранение листа персонажа
    },
    loadData() {
      axiosAgregator.sendGet("/api/v1/lib/race/all").then(res => {
        this.raceOptions = res.data.map(raceOption => {
          return {
            id: raceOption.id,
            name: raceOption.name,
          }
        });
      })
      axiosAgregator.sendGet("/api/v1/lib/class/all").then(res => {
        this.classOptions = res.data.map(classOptions => {
          return {
            id: classOptions.id,
            name: classOptions.name,
          }
        });
      })
    }
  },
  data() {
    const currentStep = ref(0);

    const stats = [
      {
        id: 1,
        title: "Сила",
        level: 0,
      },
      {
        id: 2,
        title: "Ловкость",
        level: 0,
      },
      {
        id: 3,
        title: "Телосложение",
        level: 0,
      },
      {
        id: 4,
        title: "Интеллект",
        level: 0,
      },
      {
        id: 5,
        title: "Мудрость",
        level: 0,
      },
      {
        id: 6,
        title: "Харизма",
        level: 0,
      }
    ];
    const model = ref({name: '', race: {}, class: {}, stats: stats, spells: []})

    const {validate} = useForm('stepForm')

    const raceOptions = [];

    const classOptions = [];

    const steps = ref(defineVaStepperSteps([
      {
        label: 'Введите имя персонажа',
        beforeLeave: (step) => {
          step.hasError = !validate()
        },
      },
      {
        label: 'Выберите расу', beforeLeave: (step) => {
          step.hasError = !validate()
        }
      },
      {
        label: 'Выберите класс', beforeLeave: (step) => {
          step.hasError = !validate()
          axiosAgregator.sendGet(`/api/v1/lib/spell/all?classId=${this.model.class.id}`).then(res => {
            this.spellsOptions = res.data;
          })
        }
      },
      {
        label: 'Выберите характеристики', beforeLeave: (step) => {
          step.hasError = !validate()
          model.stats = stats;
        }
      },
      {
        label: 'Выберите заклинания', beforeLeave: (step) => {
          step.hasError = !validate()
          this.saveList()
        }
      },
    ]))

    const spellsColumns = [
      { key: "name", label: "Название", sortable: true },
      { key: "level", label: "Уровень", sortable: true },
      { key: "school", label: "Школа", sortable: true },
    ];
    return {
      currentStep,
      model,
      steps,
      raceOptions,
      classOptions,
      stats,

      selectedSpells: [],
      spellsOptions: [],
      spellsFilter: "",
      spellsColumns: spellsColumns,
      spellsPerPage: 10,
      spellsPage: 1,
      spellsCurrentPage: 1,
      filtered: [],
    };
  },
  computed: {
    pages() {
      return this.spellsPerPage && this.spellsPerPage !== 0
          ? Math.ceil(this.spellsOptions.length / this.spellsPerPage)
          : this.spellsOptions.length;
    },
  },
});
</script>

<style scoped>
.title-and-level {
  display: flex;
  justify-content: space-between;
}

.stats-selector {
  max-width: 500px;
}
</style>