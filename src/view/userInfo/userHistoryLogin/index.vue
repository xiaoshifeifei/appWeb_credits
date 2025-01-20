<template>
  <div>
    <div class="gva-search-box">
      <el-form ref="searchForm" :inline="true" :model="searchInfo">
        <div style="padding-left: 40px; color: red; font-size: 20px">
          展示用户登录方式，谷歌、facebook等等，异地登录，时间等信息
        </div>
      </el-form>
    </div>
    <div class="gva-table-box"></div>
    <el-drawer
      v-if="sendMailVisible"
      v-model="sendMailVisible"
      size="50%"
      :before-close="closeMail"
      :show-close="false"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg">{{ dialogTitle }}</span>
          <div>
            <el-button @click="closeMail"> {{ t("general.close") }} </el-button>
            <el-button type="primary" @click="enterMail">
              {{ t("general.confirm") }}
            </el-button>
          </div>
        </div>
      </template>

      <el-form
        class="myForm"
        ref="mailForm"
        :model="formMail"
        :rules="rulesMail"
        label-width="80px"
      >
        <el-row class="w-full">
          <el-col :span="15">
            <el-form-item :label="t('tableColumn.id')" prop="id">
              <el-input-number
                :disabled="type === 'edit'"
                :min="0"
                v-model="formMail.id"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div style="padding: 0 0 20px 40px; color: black; font-size: 16px">
          {{ t("tableColumn.award") }}
        </div>
        <template v-for="(item, index) in formMail.items" :key="index">
          <el-row class="w-full">
            <el-col :span="6">
              <el-form-item
                :label="t('tableColumn.code')"
                :prop="`items.${index}.code`"
                :rules="rules['items.code']"
              >
                <el-input :min="0" v-model="item.code" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item
                :label="t('tableColumn.num')"
                :prop="`items.${index}.num`"
                :rules="rules['items.num']"
              >
                <el-input
                  style="width: 55%"
                  v-model="item.num"
                  autocomplete="off"
                  @input="item.num = item.num.replace(/[^\d|\.]/g, '')"
                  @change="handleChange(item.num, index, 'v4')"
                />
                <el-button
                  style="margin-left: 20px"
                  type="delete"
                  icon="delete"
                  @click="delItem(index)"
                >
                  {{ t("general.delete") }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <el-form-item>
          <el-button type="success" icon="plus" @click="addItem()">
            {{ t("general.add") }}
          </el-button>
        </el-form-item>
        <template v-for="(item, index) in formMail.content" :key="index">
          <el-row class="w-full">
            <el-col :span="15">
              <el-form-item
                :label="t('tableColumn.lang')"
                :prop="`content.${index}.lang`"
                :rules="rules['content.lang']"
              >
                <el-select
                  v-model="item.lang"
                  style="width: 100%"
                  :placeholder="t('general.pleaseSelect')"
                >
                  <el-option
                    v-for="item in completeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item
                :label="t('tableColumn.title')"
                :prop="`content.${index}.title`"
                :rules="rules['content.title']"
              >
                <el-input :min="0" v-model="item.title" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-button
              style="margin-left: 20px"
              type="delete"
              icon="delete"
              @click="delContent(index)"
            >
              {{ t("general.delete") }}
            </el-button>
            <el-col :span="15">
              <el-form-item
                :label="t('tableColumn.message')"
                :prop="`content.${index}.message`"
                :rules="rules['content.message']"
              >
                <el-input :min="0" v-model="item.message" autocomplete="off" />
              </el-form-item>
            </el-col>
            <div style="width: 100%; height: 20px"></div>
          </el-row>
        </template>
        <el-form-item>
          <el-button type="success" icon="plus" @click="addContent()">
            {{ t("general.add") }}
          </el-button>
        </el-form-item>
        <el-form-item :label="t('tableColumn.status')" prop="status">
          <el-switch
            v-model="formMail.status"
            inline-prompt
            :active-value="0"
            :inactive-value="1"
          />
        </el-form-item>
        <el-form-item :label="t('tableColumn.expired')" prop="expired">
          <el-date-picker
            v-model="formMail.expired"
            type="datetime"
            :placeholder="t('tableColumn.PleaseTime')"
            @change="handleDateChange"
          />
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup>
import {
  systemInboxGetList,
  systemInboxDel,
  systemInboxEdit,
  virtualItemAdd,
} from "@/api/tack";
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n"; // added by mohamed hassan to support multilanguage
const { t } = useI18n(); // added by mohamed hassan to support multilanguage
const router = useRouter();

defineOptions({
  name: "goodsConfiguration",
});

const apis = ref([]);
const form = ref({
  id: null,
  content: {},
  items: [{ code: "", num: null }],
  status: 0, //0开启 1关闭
  expired: "",
});

const type = ref("");
const rules = ref({
  code: [{ required: true, message: "请输入code", trigger: "blur" }],
  desc: [{ required: true, message: "请输入desc", trigger: "blur" }],
  "items.code": [{ required: true, message: "请输入code", trigger: "blur" }],
  "items.num": [{ required: true, message: "请输入数量", trigger: "blur" }],
  "content.lang": [{ required: true, message: "请选择语言", trigger: "blur" }],
  "content.title": [{ required: true, message: "请输入标题", trigger: "blur" }],
  "content.message": [
    { required: true, message: "请输入内容", trigger: "blur" },
  ],
  expired: [{ required: true, message: "请选择过期时间", trigger: "blur" }],
});
const sendMailVisible = ref(false);
const page = ref(1);
const total = ref(0);
const pageSize = ref(10);
const tableData = ref([]);
const tableUser = ref([]);
const searchInfo = ref({});
const completeOptions = ref([
  { label: "EN", value: "en" },
  { label: "CN", value: "cn" },
  { label: "ID", value: "id" },
  { label: "JA", value: "ja" },
  { label: "KM", value: "km" },
  { label: "KO", value: "ko" },
  { label: "MS", value: "ms" },
  { label: "MY", value: "my" },
  { label: "PT", value: "pt" },
  { label: "TH", value: "th" },
  { label: "VI", value: "vi" },
]);
const formMail = ref({
  receivers: [],
  expired: "",
  items: [
    {
      code: "",
      num: null,
    },
  ],
  content: {},
});
const dataGet = (dateStr) => {
  let date = new Date(dateStr);
  let formattedDate =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    date.getDate().toString().padStart(2, "0") +
    " " +
    date.getHours().toString().padStart(2, "0") +
    ":" +
    date.getMinutes().toString().padStart(2, "0") +
    ":" +
    date.getSeconds().toString().padStart(2, "0");
  return formattedDate;
};
const delContent = (index) => {
  delete formMail.value.content[index];
};

let addSz = ref(0);
const addContent = () => {
  addSz.value++;
  let obj = {
    lang: "en",
    title: "",
    message: "",
  };
  objectPush(formMail.value.content, "en" + addSz.value, obj);
};
function objectPush(obj, key, value) {
  obj[key] = value;
}

const handleDateChange = () => {
  if (formMail.value.expired) {
    const isoDate = dayjs(formMail.value.expired).format(
      "YYYY-MM-DDTHH:mm:ssZ"
    );
    formMail.value.expired = isoDate;
  }
};
const addItem = () => {
  formMail.value.items.push({
    code: "",
    num: null,
  });
};
const delItem = (index) => {
  formMail.value.items.splice(index, 1);
};
const closeMail = () => {
  initMailForm();
  sendMailVisible.value = false;
};
const rulesMail = ref({
  id: [{ required: true, message: "请输入id", trigger: "blur" }],
  expired: [{ required: true, message: "请选择过期时间", trigger: "blur" }],
});
const handleChange = (number, index, params, params2) => {
  if (params == "v4") {
    if (number >= 1000000000) {
      if (params2) {
        return number / 1000000000 + "B";
      } else {
        return (formMail.value.items[index].num = number / 1000000000 + "B");
      }
    } else if (number >= 1000000) {
      if (params2) {
        return number / 1000000 + "M";
      } else {
        return (formMail.value.items[index].num = number / 1000000 + "M");
      }
    } else if (number >= 1000) {
      if (params2) {
        return number / 1000 + "K";
      } else {
        return (formMail.value.items[index].num = number / 1000 + "K");
      }
    } else {
      if (params2) {
        return number.toString();
      } else {
        return (formMail.value.items[index].num = number.toString());
      }
    }
  }
};
const enterMail = async () => {
  mailForm.value.validate(async (valid) => {
    if (valid) {
      let arrObj = {};
      for (const key in formMail.value.content) {
        arrObj[formMail.value.content[key].lang] = {
          title: formMail.value.content[key].title,
          message: formMail.value.content[key].message,
        };
      }
      formMail.value.content = arrObj;
      if (formMail.value.items != null && formMail.value.items.length) {
        formMail.value.items.map((item, index) => {
          item.num = item.num + "";
          if (item.num.indexOf("B") !== -1) {
            const newStr = item.num.replace("B", "");
            item.num = Number(newStr) * 1000000000;
          } else if (item.num.indexOf("M") !== -1) {
            const newStr = item.num.replace("M", "");
            item.num = Number(newStr) * 1000000;
          } else if (item.num.indexOf("K") !== -1) {
            const newStr = item.num.replace("K", "");
            item.num = Number(newStr) * 1000;
          } else {
            item.num = Number(item.num);
          }
        });
      }
      const res = await systemInboxEdit(formMail.value);
      if (res.code === 0) {
        ElMessage({
          type: "success",
          message: "修改成功",
          showClose: true,
        });
      }
      closeMail();
      getTableData();
    }
  });
};

const onReset = () => {
  searchInfo.value = {};
};

// 搜索

const onSubmit = () => {
  page.value = 1;
  pageSize.value = 10;
  getTableData();
};

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val;
  getTableData();
};

// 弹窗相关
const mailForm = ref(null);
const initMailForm = () => {
  mailForm.value.resetFields();
  formMail.value = {
    receivers: [],
    expired: "",

    items: [
      {
        code: "",
        num: null,
      },
    ],
    content: {},
  };
};

const handleCurrentChange = (val) => {
  page.value = val;
  getTableData();
};

// 查询
const getTableData = async () => {
  const table = await systemInboxGetList({
    page: page.value,
    pageSize: pageSize.value,
    ...searchInfo.value,
  });
  if (table.code === 0) {
    table.data.list.map((item, index) => {
      if (item.items != null && item.items.length > 0) {
        item.items.map((item2, index2) => {
          item2.num = handleChange(item2.num, index2, "v4", true);
        });
      }
    });
    tableData.value = table.data.list;
    total.value = table.data.total;
    page.value = table.data.page;
    pageSize.value = table.data.pageSize;
  }
};

getTableData();

// 弹窗相关
const apiForm = ref(null);
const initForm = () => {
  apiForm.value.resetFields();
  form.value = {
    code: "",
    desc: "",
  };
};

const dialogTitle = ref("新增");
const dialogFormVisible = ref(false);

const closeDialog = () => {
  initForm();
  dialogFormVisible.value = false;
};
const formKey = ref("");
const editTackFunc = async (row) => {
  let rows = JSON.parse(JSON.stringify(row));
  for (const key in rows.content) {
    rows.content[key] = {
      lang: key,
      ...rows.content[key],
    };
  }
  formMail.value = rows;
  sendMailVisible.value = true;

  type.value = "edit";
};

const enterDialog = async () => {
  apiForm.value.validate(async (valid) => {
    if (valid) {
      switch (type.value) {
        case "add":
          {
            const res = await virtualItemAdd(form.value);
            if (res.code === 0) {
              ElMessage({
                type: "success",
                message: t("user.userAddedNote"),
                showClose: true,
              });
              getTableData();
              closeDialog();
            }
          }
          break;
        case "edit":
          {
            const res = await systemInboxEdit(form.value);
            if (res.code === 0) {
              ElMessage({
                type: "success",
                message: t("user.userEditedNote"),
                showClose: true,
              });
              getTableData();
              closeDialog();
            }
          }
          break;
        default:
          {
            ElMessage({
              type: "error",
              message: t("view.api.unknownOperation"),
              showClose: true,
            });
          }
          break;
      }
    }
  });
};

const deleteTackFunc = async (row) => {
  ElMessageBox.confirm(t("general.deleteConfirm"), t("general.hint"), {
    confirmButtonText: t("general.confirm"),
    cancelButtonText: t("general.cancel"),
    type: "warning",
  }).then(async () => {
    const res = await systemInboxDel({ id: row.id });
    if (res.code === 0) {
      ElMessage({
        type: "success",
        message: t(`general.deleteSuccess`),
      });
      getTableData();
    }
  });
};
const tableRowClassName = ({ row, rowIndex }) => {
  if (rowIndex % 2 == 0) {
    return "";
  } else {
    return "warnBg";
  }
};
</script>
<style scoped lang="scss">
:deep(.el-table tr th .cell) {
  color: #fff !important;
}
:deep(.el-table .warnBg) {
  background-color: #c7e4ea;
  color: #000;
}
:deep(.el-table__body tr:hover > td) {
  background-color: #6dc58b !important;
}
:deep(.el-table__body tr.current-row > td) {
  background-color: #6dc58b !important;
}
</style>

<style scoped lang="scss">
.warning {
  color: #dc143c;
}
.el-input-number {
  width: 50%;
}
</style>
