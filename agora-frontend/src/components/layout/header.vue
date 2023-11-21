<template>
  <div>
    {{ num1 }} + {{ num2 }} = {{ sum }}
    <br />
    <button @click="num1++">num1自加</button>
    <button @click="handleClick">num2自加</button>
  </div>
</template>

<script lang="ts">
import { ref, computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
export default defineComponent({
  setup() {
    const store = useStore();
    const num1 = ref(1);
    const num2 = ref(1);
    let sum = computed(() => {
      return num1.value + store.state.testnum;
    });
    const handleClick = () => {
      store.commit('m_testaddnum');
    };
    return {
      num1,
      num2,
      handleClick,
      sum,
    };
  },
});
</script>
