<template>
  <el-form-item :label="t('tableColumn.placeholder') + t('tableColumn.time')">
    <el-date-picker
      :style="{ width: '400px' }"
      v-model="value2"
      type="datetimerange"
      range-separator="To"
      :disabled-date="disabledDate"
      @calendar-change="handleCalendarChange"
      start-placeholder="Start date"
      end-placeholder="End date"
      @change="change"
      :default-time="defaultTime"
      :shortcuts="shortcuts"
      @clear="clear"
    />
  </el-form-item>
</template>
<script setup>
import { ref, watch, watchEffect } from "vue";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n"; // added by mohamed hassan to support multilanguage
const { t } = useI18n(); // added by mohamed hassan to support multilanguage

defineOptions({
  name: "dataTime",
});
const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59, 999),
];
const emits = defineEmits(["update:modelValue", "close"]);

const props = defineProps({
  modelValue: {
    type: Array,
    default: [],
  },
  showTime: {
    type: Boolean,
    default: false,
  },
  paramsValue: {
    type: Boolean,
    default: false,
  },
  single: {
    type: Boolean,
    default: false,
  },
});
const value2 = ref([]);

const shortcuts = [
  {
    text: "Today",
    value: () => {
      const now = new Date();
      const start = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0
      );
      const end = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59
      );
      return [start, end];
    },
  },
  {
    text: "Yesterday",
    value: () => {
      const now = new Date();
      const end = new Date();
      const start = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 1
      );
      end.setTime(start.getTime() + 3600 * 1000 * 24 - 1);
      return [start, end];
    },
  },
];
const open = ref(false);
const oldData = ref([]);
const handleCalendarChange = (val) => {
  oldData.value = val;

  // if (oldData.value) {
  //   const now2 = new Date(val[0]);
  //   now2.setHours(23, 59, 59, 999);
  //   oldData.value[1] = now2;
  // }
  if (oldData.value[0] && oldData.value[1]) {
    emits("update:modelValue", oldData.value);
  }
};

const disabledDate = (time) => {
  if (oldData.value && oldData.value[1] === null) {
    const data = oldData.value[0];
    const now = new Date(data);
    now.setHours(0, 0, 0, 0);
    const now2 = new Date(data);
    now2.setHours(23, 59, 59, 999);

    return time > now2 || time < now;
  }
};

const change = (val) => {
  if (value2.value && value2.value.length) {
    const timeData = value2.value.map((item) => {
      return item;
    });
    emits("update:modelValue", timeData);
  } else {
    emits("close");
    emits("update:modelValue", []);
  }
};

const clear = (val) => {
  value2.value = [];
  emits("update:modelValue", []);
  emits("close");
};
watchEffect(() => {
  if (props.paramsValue) {
    value2.value = [];
    emits("close");
  }
});
</script>
  <style scoped lang="scss">
</style>
    