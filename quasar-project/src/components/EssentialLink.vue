<template>
  <q-item
    clickable
    tag="a"
    :href="link"
    :class="{ 'selected-item': isSelected }"
    @click="$emit('select')"
  >
    <q-item-section>
      <div class="q-col">
        <q-icon :name="icon" :size="iconSize"/>
      </div>
      <div class="q-col">
        <q-item-label>{{ title }}</q-item-label>
      </div>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: false,
    },
    iconSize: {
      type: String,
      default: '35px',
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
  }
});
</script>

<style scoped>
.q-col {
  display: flex;
  align-items: center;
  justify-content: center;
}
.selected-item {
  background-color: #FFC619;
  color: #003566;
  border-left: 8px solid #003566;
}
</style>
