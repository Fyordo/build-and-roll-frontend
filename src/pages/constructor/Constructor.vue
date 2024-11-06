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
          <VaDivider />
        </div>
      </template>
      <template #step-content-4>
        <VaOptionList
            v-model="model.spells"
            :options="spellsOptions.map(e => e.title)"
        />
      </template>
    </VaStepper>
  </VaForm>
</template>

<script>
import {defineComponent} from "vue";
import {ref} from 'vue';
import {useForm, defineVaStepperSteps} from 'vuestic-ui'

export default defineComponent({
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
    const model = ref({name: '', race: '', class: '', stats: stats, spells: []})

    const {validate} = useForm('stepForm')

    const raceOptions = [
        "Человек",
        "Эльф",
        "Орк",
    ];

    const classOptions = [
      "Колдун",
      "Клирик",
      "Мечник",
      "Лучник",
    ];

    const spellsOptions = [
      {
        id: 1,
        title: "Заклинание 1"
      },
      {
        id: 2,
        title: "Заклинание 2"
      },
      {
        id: 3,
        title: "Заклинание 3"
      }
    ];

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
        }
      },
    ]))
    return {
      currentStep,
      model,
      steps,
      raceOptions,
      classOptions,
      spellsOptions,
      stats
    };
  },
});
</script>

<style scoped>
.title-and-level{
  display: flex;
  justify-content: space-between;
}

.stats-selector{
  max-width: 500px;
}
</style>