<template>
  <el-form class="isForm" ref="apiForm" :model="form" :rules="rules">
    <el-form-item :label="title" :prop="searchTime ? '' : 'expired'">
      <el-date-picker
        v-model="form.expired"
        type="datetime"
        :placeholder="
          searchTime
            ? t('tableColumn.placeholder')
            : t('tableColumn.PleaseTime')
        "
        @change="handleDateChange"
        @clear="clear"
      />
    </el-form-item>
  </el-form>
</template>
<script setup>
import { ref, watch, watchEffect } from "vue";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n"; // added by mohamed hassan to support multilanguage
const { t } = useI18n(); // added by mohamed hassan to support multilanguage

defineOptions({
  name: "singleTime",
});

const emits = defineEmits(["update:modelValue", "closeTime"]);

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
  values: {
    type: String,
    default: "",
  },
  searchTime: {
    type: Boolean,
    default: false,
  },
  paramsValue: {
    type: Boolean,
    default: false,
  },
});

const form = ref({
  expired: null,
});
const apiForm = ref(null);

const rules = ref({
  expired: [{ required: true, message: "请选择过期时间", trigger: "blur" }],
});
const handleDateChange = () => {
  if (form.value.expired) {
    emits("closeTime", false);
    emits("update:modelValue", form.value.expired);
  } else {
    emits("closeTime", true);
    emits("update:modelValue", null);
  }
};

watchEffect(() => {
  form.value.expired = props.values;
});
watchEffect(() => {
  if (props.paramsValue) {
    form.value.expired = null;
  }
});
const clear = (val) => {
  form.value.expired = null;
  emits("update:modelValue", null);
  emits("closeTime", true);
};
</script>
  <style scoped lang="scss">
.isForm {
  display: inline-block;
}
</style>
    