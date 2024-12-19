<template>
  <el-form-item :label="t('tableColumn.code')">
    <el-select
      v-model="searchInfo.code"
      clearable
      :placeholder="t('general.pleaseSelect') + t('tableColumn.code')"
      @change="handleDateChange(1, searchInfo.code)"
    >
      <el-option
        v-for="item in codeArray"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </el-form-item>
  <el-form-item :label="t('tableColumn.gameName')">
    <el-select
      v-model="searchInfo.name"
      clearable
      :placeholder="t('general.pleaseSelect') + t('tableColumn.name')"
      @change="handleDateChange(2, searchInfo.name)"
    >
      <el-option
        v-for="item in nameArray"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </el-form-item>
</template>
  <script setup>
import { ref, watch, watchEffect } from "vue";
import dayjs from "dayjs";
import { getGameList } from "@/api/game";
const codeArray = ref([]);
const nameArray = ref([]);
import { useI18n } from "vue-i18n"; // added by mohamed hassan to support multilanguage
const { t } = useI18n(); // added by mohamed hassan to support multilanguage

defineOptions({
  name: "selectInput",
});

const emits = defineEmits(["update:modelValue", "close"]);

const props = defineProps({
  modelValue: {
    type: Object,
    default: {},
  },
  searchClear: {
    type: Boolean,
    default: false,
  },
});
const data = ref([]);
const searchInfo = ref({
  code: null,
  name: null,
  index: null,
});
const getSearchData = async () => {
  const table = await getGameList({
    page: 1,
    pageSize: 1000000,
  });
  if (table.code === 0) {
    data.value = table.data.list;
    data.value.forEach((item) => {
      codeArray.value.push({ value: item.code, label: item.code });
      nameArray.value.push({ value: item.name, label: item.cnName });
    });
  }
};

getSearchData(); //获取搜索条件
const handleDateChange = (params, params1) => {
  if (params === 1) {
    data.value.forEach((item, index) => {
      if (item.code === params1) {
        searchInfo.value.name = item.name;
        searchInfo.value.index = index;
      }
    });
  } else if (params === 2) {
    data.value.forEach((item, index) => {
      if (item.name === params1) {
        searchInfo.value.code = item.code;
        searchInfo.value.index = index;
      }
    });
  }
  emits("update:modelValue", searchInfo.value);
};

watchEffect(() => {
  //   form.value.expired = props.values;
});
watchEffect(() => {
  if (props.searchClear) {
    searchInfo.value = {
      code: null,
      name: null,
      index: null,
    };
    emits("update:modelValue", searchInfo.value);
    emits("close");
  }
});
const clear = (val) => {
  //   form.value.expired = null;
  emits("update:modelValue", null);
};
</script>
    <style scoped lang="scss">
.isForm {
  display: inline-block;
}
</style>
      