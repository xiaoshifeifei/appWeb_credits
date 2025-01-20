<template>
  <div>
    <div class="gva-search-box">
      <el-form ref="searchForm" :inline="true" :model="searchInfo"> </el-form>
    </div>

    <el-drawer
      v-if="dialogFormVisible"
      v-model="dialogFormVisible"
      size="60%"
      :before-close="closeDialog"
      :show-close="false"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg">{{ dialogTitle }}</span>
          <div>
            <el-button @click="closeDialog">
              {{ t("general.close") }}
            </el-button>
            <el-button type="primary" @click="enterDialog">
              {{ t("general.confirm") }}
            </el-button>
          </div>
        </div>
      </template>

      <el-form
        class="myForm"
        ref="apiForm"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item :label="t('tableColumn.id')" prop="id">
          <el-input v-model="form.id" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="t('tableColumn.before')" prop="before">
          <el-input-number v-model="form.before" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="t('tableColumn.desc')" prop="desc">
          <el-input v-model="form.desc" autocomplete="off" />
        </el-form-item>
        <div style="padding-left: 40px; color: black; font-size: 16px">
          {{ t("tableColumn.complete") }}
        </div>
        <el-row class="w-full">
          <el-col :span="8">
            <el-form-item :label="t('tableColumn.type')" prop="type">
              <el-select
                v-model="form.complete.type"
                style="width: 100%"
                placeholder="type"
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
          <el-col :span="8">
            <el-form-item label="value">
              <el-input v-model="form.complete.value" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="value2">
              <el-input v-model="form.complete.value2" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="t('tableColumn.limit')">
              <el-input v-model="form.complete.limit" autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>

        <div style="padding-left: 40px; color: black; font-size: 16px">
          {{ t("tableColumn.award") }}
        </div>

        <el-row class="w-full">
          <el-col :span="8">
            <el-form-item :label="t('tableColumn.complete')" prop="complete">
              <el-select
                v-model="form.award.type"
                style="width: 100%"
                placeholder="type"
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
          <el-col :span="8">
            <el-form-item :label="t('tableColumn.code')">
              <el-input v-model="form.award.code" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="t('tableColumn.num')">
              <el-input v-model="form.award.num" autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="t('tableColumn.unlock')" prop="unlock">
          <el-input v-model="form.unlock.value" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="t('tableColumn.tag')" prop="tag">
          <el-input v-model="form.tag" autocomplete="off" />
        </el-form-item>
      </el-form>
    </el-drawer>

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
            <el-form-item
              :label="t('tableColumn.user')"
              prop="complete"
              v-if="oneSend"
            >
              <!-- <el-select
                virtual-scroll
                multiple
                collapse-tags
                v-model="formMail.receivers"
                style="width: 100%"
                :placeholder="t('general.pleaseSelect')"
                :disabled="oneSend"
              >
                <el-option
                  v-for="item in tableData"
                  :key="item.accountId"
                  :label="item.username"
                  :value="item.accountId"
                />
              </el-select> -->
              <el-input
                v-model="formMail.receivers"
                disabled
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
                <el-input v-model="item.code" autocomplete="off" />
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
            :disabled="oneSend"
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
  getUserList,
  setUserInfo,
  deleteTack,
  updateTack,
  createTack,
  enterSyncApi,
  sendMailGo,
} from "@/api/userInfo";
import { setUserAuthorities } from "@/api/user";
import { ref, watch } from "vue";
import { getAuthorityList } from "@/api/authority";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n"; // added by mohamed hassan to support multilanguage
const { t } = useI18n(); // added by mohamed hassan to support multilanguage
const router = useRouter();

defineOptions({
  name: "userInfo",
});

const apis = ref([]);
const form = ref({
  id: "",
  before: 0,
  desc: "",
  complete: {
    value: 0,
    value2: 0,
    limit: 0,
  },
  award: {
    code: "",
    num: 0,
  },
  unlock: "",
  tag: "",
});

const type = ref("");
const rules = ref({
  id: [{ required: true, message: "请输入id", trigger: "blur" }],
  desc: [{ required: true, message: "请输入desc", trigger: "blur" }],
  complete: [{ required: true, message: "请选择类型", trigger: "blur" }],
  award: [{ required: true, message: "请选择类型", trigger: "blur" }],
  expired: [{ required: true, message: "请选择过期时间", trigger: "blur" }],
  "items.code": [{ required: true, message: "请输入code", trigger: "blur" }],
  "items.num": [{ required: true, message: "请输入数量", trigger: "blur" }],
  "content.lang": [{ required: true, message: "请选择语言", trigger: "blur" }],
  "content.title": [{ required: true, message: "请输入标题", trigger: "blur" }],
  "content.message": [
    { required: true, message: "请输入内容", trigger: "blur" },
  ],
});

const formMail = ref({
  receivers: [],
  expired: "",
  items: [
    {
      code: "",
      num: null,
    },
  ],
  content: [
    {
      lang: "en",
      title: "",
      message: "",
    },
  ],
  status: 0,
});

const rulesMail = ref({
  id: [{ required: true, message: "请输入id", trigger: "blur" }],
  "content.lang": [{ required: true, message: "请选择语言", trigger: "blur" }],
  "content.title": [
    { required: true, message: "请选输入标题", trigger: "blur" },
  ],
  "content.message": [
    { required: true, message: "请选输入内容", trigger: "blur" },
  ],
  expired: [{ required: true, message: "请选择过期时间", trigger: "blur" }],
});

const page = ref(1);
const total = ref(0);
const pageSize = ref(10);
const tableData = ref([]);
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
const handleDateChange = () => {
  if (formMail.value.expired) {
    const isoDate = dayjs(formMail.value.expired).format(
      "YYYY-MM-DDTHH:mm:ssZ"
    );
    formMail.value.expired = isoDate;
  }
};
watch(
  () => tableData.value,
  () => {
    setAuthorityIds();
  }
);
const setAuthorityIds = () => {
  tableData.value &&
    tableData.value.forEach((user) => {
      user.authorityIds =
        user.authorities &&
        user.authorities.map((i) => {
          return i.authorityId;
        });
    });
};
const authOptions = ref([]);
const setOptions = (authData) => {
  authOptions.value = [];
  setAuthorityOptions(authData, authOptions.value);
};
const tempAuth = {};
const changeAuthority = async (row, flag, removeAuth) => {
  if (flag) {
    if (!removeAuth) {
      tempAuth[row.ID] = [...row.authorityIds];
    }
    return;
  }
  await nextTick();
  const res = await setUserAuthorities({
    ID: row.ID,
    authorityIds: row.authorityIds,
  });
  if (res.code === 0) {
    ElMessage({ type: "success", message: "角色设置成功" });
  } else {
    if (!removeAuth) {
      row.authorityIds = [...tempAuth[row.ID]];
      delete tempAuth[row.ID];
    } else {
      row.authorityIds = [removeAuth, ...row.authorityIds];
    }
  }
};

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
const delContent = (index) => {
  formMail.value.content.splice(index, 1);
};
const addContent = () => {
  formMail.value.content.push({
    lang: "en",
    title: "",
    message: "",
  });
};

// 初始化相关
const setAuthorityOptions = (AuthorityData, optionsData) => {
  AuthorityData &&
    AuthorityData.forEach((item) => {
      if (item.children && item.children.length) {
        const option = {
          authorityId: item.authorityId,
          authorityName: item.authorityName,
          children: [],
        };
        setAuthorityOptions(item.children, option.children);
        optionsData.push(option);
      } else {
        const option = {
          authorityId: item.authorityId,
          authorityName: item.authorityName,
        };
        optionsData.push(option);
      }
    });
};
const switchStatus = async (row) => {
  let myUserInfo = JSON.parse(JSON.stringify(row));

  let params = {
    accountId: myUserInfo.accountId,
    status: myUserInfo.status,
  };
  const res = await setUserInfo(params);
  if (res.code === 0) {
    ElMessage({
      type: "success",
      message: `${
        params.status === 0
          ? t("user.enabledSuccessfully")
          : t("user.disabledSuccessfully")
      }`,
    });
    await getTableData();
  }
};
const syncing = ref(false);

const enterSyncDialog = async () => {
  syncing.value = true;
  const res = await enterSyncApi(syncApiData.value);
  syncing.value = false;
  if (res.code === 0) {
    ElMessage({
      type: "success",
      message: res.msg,
    });
    syncApiFlag.value = false;
    getTableData();
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

const handleCurrentChange = (val) => {
  page.value = val;
  getTableData();
};

// 查询
const getTableData = async () => {
  const table = await getUserList({
    page: page.value,
    pageSize: pageSize.value,
    ...searchInfo.value,
  });
  if (table.code === 0) {
    tableData.value = table.data.list;
    total.value = table.data.total;
    page.value = table.data.page;
    pageSize.value = table.data.pageSize;
  }
};
const initPage = async () => {
  getTableData();
  const res = await getAuthorityList({
    page: 1,
    pageSize: 999,
  });
  setOptions(res.data.list);
};

initPage();

// 批量操作
const handleSelectionChange = (val) => {
  if (val.length > 0) {
    let arr = [];
    val.forEach((item) => {
      arr.push(item.accountId);
    });
    formMail.value.receivers = arr;
  }
  // apis.value = val;
};
const multipleTable = ref(null);

const syncApiData = ref({
  newApis: [],
  deleteApis: [],
  ignoreApis: [],
});

const syncApiFlag = ref(false);

// 弹窗相关
const apiForm = ref(null);
const initForm = () => {
  apiForm.value.resetFields();
  form.value = {
    id: "",
    before: 0,
    desc: "",
    complete: {
      value: 0,
      value2: 0,
      limit: 0,
    },
    award: {
      code: "",
      num: 0,
    },
    unlock: "",
    tag: "",
  };
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
    content: [
      {
        lang: "en",
        title: "",
        message: "",
      },
    ],
    status: 0,
  };
};

const dialogTitle = ref("新增");
const dialogFormVisible = ref(false);
const sendMailVisible = ref(false);
const openDialog = (key) => {
  switch (key) {
    case "add":
      dialogTitle.value = "新增";
      break;
    case "edit":
      dialogTitle.value = "编辑";
      break;
    default:
      break;
  }
  type.value = key;
  dialogFormVisible.value = true;
};
const closeDialog = () => {
  initForm();
  dialogFormVisible.value = false;
};
const oneSend = ref(false);
const sendMail = (key) => {
  if (key !== undefined) {
    oneSend.value = true;
    formMail.value.receivers = [];
    formMail.value.receivers.push(key.accountId);
  } else {
    oneSend.value = false;
  }
  sendMailVisible.value = true;
};

const closeMail = () => {
  initMailForm();
  multipleTable.value.clearSelection();
  sendMailVisible.value = false;
};

function isJSON(str) {
  if (typeof str !== "string") {
    return false;
  } else {
    return true;
  }
}
const editTackFunc = async (row) => {
  let rows = JSON.parse(JSON.stringify(row));
  if (isJSON(rows.complete)) {
    rows.complete = JSON.parse(rows.complete)[0]
      ? JSON.parse(rows.complete)[0]
      : {};
  }
  if (isJSON(rows.award)) {
    rows.award = JSON.parse(rows.award)[0] ? JSON.parse(rows.award)[0] : {};
  }
  if (isJSON(rows.unlock)) {
    rows.unlock = JSON.parse(rows.unlock)[0] ? JSON.parse(rows.unlock)[0] : {};
  }
  form.value = rows;
  openDialog("edit");
};

const enterDialog = async () => {
  apiForm.value.validate(async (valid) => {
    if (valid) {
      form.value.complete = JSON.stringify([form.value.complete]);
      form.value.award = JSON.stringify([form.value.award]);
      form.value.unlock = JSON.stringify([form.value.unlock]);
      switch (type.value) {
        case "add":
          {
            form.value.id = Number(form.value.id);
            const res = await createTack(form.value);
            if (res.code === 0) {
              ElMessage({
                type: "success",
                message: t("user.userAddedNote"),
                showClose: true,
              });
            }
            getTableData();
            closeDialog();
          }

          break;
        case "edit":
          {
            const res = await updateTack(form.value);
            if (res.code === 0) {
              ElMessage({
                type: "success",
                message: t("user.userEditedNote"),
                showClose: true,
              });
            }
            getTableData();
            closeDialog();
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
const enterMail = async () => {
  mailForm.value.validate(async (valid) => {
    if (valid) {
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
      const res = await sendMailGo(formMail.value);
      if (res.code === 0) {
        ElMessage({
          type: "success",
          message: "发送成功",
          showClose: true,
        });
      }
      closeMail();
    }
  });
};
const deleteTackFunc = async (row) => {
  ElMessageBox.confirm("此操作将永久删除任务, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    const res = await deleteTack({ id: row.id });
    if (res.code === 0) {
      ElMessage({
        type: "success",
        message: "删除成功!",
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
// :deep(.el-table td.el-table__cell div) {
//   color: #000;
// }
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
</style>
  