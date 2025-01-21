<template>
  <div>
    <div class="gva-search-box">
      <el-form ref="searchForm" :inline="true" :model="searchInfo">
        <el-form-item :label="t('tableColumn.accountId')">
          <el-input
            clearable
            v-model="searchInfo.accountId"
            @blur="searchChange($event, 'accountId')"
            :placeholder="t('tableColumn.accountId')"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item :label="t('tableColumn.sender')">
          <el-input
            clearable
            v-model="searchInfo.sender"
            @blur="searchChange($event, 'sender')"
            :placeholder="t('tableColumn.sender')"
            style="width: 200px"
          />
        </el-form-item>

        <DataTime
          v-model="value2"
          :showTimes="showTimes"
          :paramsValue="paramsValue"
          @close="(paramsValue = false), (showTimes = false)"
        ></DataTime>
        <el-form-item>
          <el-button type="success" icon="search" @click="onSubmit">
            {{ t("general.search") }}
          </el-button>
          <el-button icon="refresh" @click="onReset">
            {{ t("general.reset") }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="gva-table-box">
      <!-- <div class="gva-btn-list">
        <el-button type="success" icon="plus" @click="openDialog('add')">
             {{ t("general.add") }}
        </el-button>
      </div> -->
      <el-table
        border
        :data="tableData"
        @selection-change="handleSelectionChange"
        highlight-current-row
        :header-cell-style="{
          backgroundColor: 'var(--el-tab-bgc)',
          Color: '#FFF',
        }"
        :row-class-name="tableRowClassName"
      >
        <el-table-column type="selection" align="center" width="60" />
        <el-table-column
          align="center"
          :label="t('tableColumn.accountId')"
          min-width="80"
          prop="accountId"
        />
        <el-table-column
          align="center"
          :label="t('tableColumn.sender')"
          min-width="100"
          prop="sender"
        />
        <el-table-column
          align="center"
          :label="t('tableColumn.id')"
          min-width="80"
          prop="id"
        />
        <el-table-column
          align="center"
          :label="t('tableColumn.items')"
          min-width="220"
          prop="items"
        >
          <template #default="scope">
            <!-- <div>{{ scope.row.items }}</div> -->
            <div v-for="(item, index) in scope.row.items" :key="index">
              <div v-for="(item1, key, index1) in item" :key="index1">
                <span class="span1">{{ t(`tableColumn.${key}`) }}:</span>
                <span class="span2" :class="key == 'code' ? 'span3' : ''">
                  <span v-if="item1 == 'diamond' || item1 == 'gold_coin'">
                    {{ t(`tableColumn.${item1}`) }}
                  </span>
                  <span v-else>{{ item1 }}</span>
                </span>
              </div>
              <span
                class="span4"
                v-if="
                  scope.row.items.length > 1 &&
                  scope.row.items.length - 1 > index
                "
              >
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('tableColumn.content')"
          min-width="400"
          prop="content"
        >
          <template #default="scope">
            <!-- <div>{{ scope.row.content }}</div> -->
            <div
              v-for="(item, key, index) in scope.row.content"
              :key="index"
              class="hideSpan"
            >
              <span class="span4" v-if="index > 0"></span>
              <span> {{ t("tableColumn.lang") }}: </span>
              <span> {{ key }} </span>
              <div v-for="(item1, key1, index1) in item" :key="index1">
                <span v-if="key1 == 'message'">
                  {{
                    key1 == "title"
                      ? t("tableColumn.title")
                      : key1 == "message"
                      ? t("tableColumn.message")
                      : key1
                  }}:
                </span>
                <span
                  class="textSpan"
                  v-if="key1 == 'message'"
                  :class="key == 'code' ? 'span3' : ''"
                >
                  {{ item1 }}
                </span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('tableColumn.created')"
          min-width="200"
          prop="created"
        >
          <template #default="scope">
            <div>{{ dataGet(scope.row.created) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('tableColumn.expired')"
          min-width="200"
          prop="expired"
        >
          <template #default="scope">
            <div>{{ dataGet(scope.row.expired) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('tableColumn.status')"
          min-width="150"
          prop="status"
        >
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              inline-prompt
              :active-value="0"
              :inactive-value="1"
              @change="
                () => {
                  switchStatus(scope.row);
                }
              "
            />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          fixed="right"
          :label="t('general.operations')"
          min-width="200"
        >
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              icon="edit"
              @click="editTackFunc(scope.row)"
            >
              {{ t("general.edit") }}
            </el-button>
            <el-button
              size="small"
              icon="delete"
              @click="deleteTackFunc(scope.row)"
            >
              {{ t("general.delete") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="gva-pagination">
        <el-pagination
          :current-page="page"
          :page-size="pageSize"
          :page-sizes="[10, 30, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
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
            <el-button @click="closeMail"> {{ t("general.close") }}</el-button>
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
              <el-input
                :disabled="type === 'edit'"
                v-model="formMail.id"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item :label="t('tableColumn.type')" prop="type">
              <el-input
                :disabled="type === 'edit'"
                v-model="formMail.type"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item :label="t('tableColumn.accountId')" prop="accountId">
              <el-input
                :disabled="type === 'edit'"
                v-model="formMail.accountId"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item :label="t('tableColumn.sender')" prop="sender">
              <el-input
                :disabled="type === 'edit'"
                v-model="formMail.sender"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div
          style="
            padding: 0 0 20px 40px;
            color: black;
            font-size: 16px;
            font-weight: 700;
          "
        >
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
                <el-select
                  clearable
                  v-model="item.code"
                  :placeholder="t('tableColumn.placeholder')"
                >
                  <el-option
                    v-for="item1 in codeOptions"
                    :key="item1.code"
                    :label="t(`tableColumn.${item1.code}`)"
                    :value="item1.code"
                  />
                </el-select>
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
        <div
          style="
            padding: 0 0 20px 40px;
            color: black;
            font-size: 16px;
            font-weight: 700;
          "
        >
          {{ t("tableColumn.content") }}
        </div>
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

        <SingleTime
          v-model="valueExpired"
          :title="t('tableColumn.expired')"
          :values="formMail.expired"
          @closeTime="closeTime"
        ></SingleTime>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup>
import {
  InboxGetList,
  InboxDel,
  InboxEdit,
  virtualItemAdd,
  virtualItemGetList,
} from "@/api/tack";
import { ref, watchEffect } from "vue";
import DataTime from "@/components/DataTime/index.vue";
import SingleTime from "@/components/DataTime/singleTime.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n"; // added by mohamed hassan to support multilanguage
const { t } = useI18n(); // added by mohamed hassan to support multilanguage
const router = useRouter();

defineOptions({
  name: "goodsConfiguration",
});

const apis = ref([]);
const mySender = ref(0);
const paramsValue = ref(false);
const form = ref({
  id: null,
  content: {},
  items: [{ code: "", num: null }],
  status: 0, //0开启 1关闭
  expired: "",
});
const value2 = ref([]);
const valueExpired = ref("");
const type = ref("");
const rules = ref({
  code: [{ required: true, message: "请输入code", trigger: "blur" }],
  desc: [{ required: true, message: "请输入desc", trigger: "blur" }],
  expired: [{ required: true, message: "请选择过期时间", trigger: "blur" }],
  "items.code": [{ required: true, message: "请输入code", trigger: "blur" }],
  "items.num": [{ required: true, message: "请输入数量", trigger: "blur" }],
  "content.lang": [{ required: true, message: "请选择语言", trigger: "blur" }],
  "content.title": [{ required: true, message: "请输入标题", trigger: "blur" }],
  "content.message": [
    { required: true, message: "请输入内容", trigger: "blur" },
  ],
});
const sendMailVisible = ref(false);
const codeOptions = ref([]);
const page = ref(1);
const total = ref(0);
const pageSize = ref(10);
const tableData = ref([]);
const tableUser = ref([]);
const searchInfo = ref({});
const showTimeBo = ref(false);
const showTimes = ref(false);
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
const shortcuts = [
  {
    text: "Today",
    value: () => {
      const end = new Date();
      const start = new Date();
      return [start, end];
    },
  },
  {
    text: "Yesterday",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24);
      end.setTime(end.getTime() - 3600 * 1000 * 24);
      return [start, end];
    },
  },

  {
    text: "Last week",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: "Last month",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
  {
    text: "Last 3 months",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    },
  },
];
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

const addItem = () => {
  formMail.value.items.push({
    code: "",
    num: null,
  });
};

const closeTime = (val) => {
  showTimeBo.value = val;
};

const delItem = (index) => {
  formMail.value.items.splice(index, 1);
};
let addSz = 0;
const addContent = () => {
  addSz++;
  let obj = {
    lang: "en",
    title: "",
    message: "",
  };
  objectPush(formMail.value.content, "en" + addSz, obj);
};
function objectPush(obj, key, value) {
  obj[key] = value;
}

// 示例使用

const delContent = (index) => {
  delete formMail.value.content[index];
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
  if (showTimeBo.value) {
    return ElMessage.warning(
      t("tableColumn.placeholder") + t("tableColumn.expired")
    );
  }
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
      if (valueExpired.value) {
        formMail.value.expired = valueExpired.value;
      }
      const res = await InboxEdit(formMail.value);
      if (res.code === 0) {
        ElMessage({
          type: "success",
          message: t("user.enabledSuccessfully"),
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
  value2.value = [];
  paramsValue.value = true;
  showTimes.value = true;
  getTableData();
};
const searchChange = (e, params) => {
  if (params && e.target.value == "") {
    searchInfo.value[params] = null;
  }
  onSubmit();
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
const switchStatus = async (row) => {
  let myUserInfo = JSON.parse(JSON.stringify(row));
  myUserInfo.items.map((item) => {
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

  const res = await InboxEdit(myUserInfo);
  if (res.code === 0) {
    ElMessage({
      type: "success",
      message: `${
        myUserInfo.status === 0
          ? t("user.enabledSuccessfully")
          : t("user.disabledSuccessfully")
      }`,
    });
    getTableData();
  } else {
    getTableData();
  }
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
  if (value2.value && value2.value.length) {
    searchInfo.value.start = value2.value[0];
    searchInfo.value.end = value2.value[1];
  } else {
    searchInfo.value.start = null;
    searchInfo.value.end = null;
  }
  if (!searchInfo.value.sender) {
    mySender.value = -1;
  } else {
    mySender.value = searchInfo.value.sender;
  }
  const table = await InboxGetList({
    page: page.value,
    pageSize: pageSize.value,
    ...searchInfo.value,
    sender: mySender.value,
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
const initPage = async () => {
  const itemData = await virtualItemGetList({
    page: page.value,
    pageSize: 9999,
  });
  if (itemData.code === 0) {
    codeOptions.value = itemData.data.list;
  }
  getTableData();
};
initPage();

// 批量操作
const handleSelectionChange = (val) => {
  apis.value = val;
};

const syncApiData = ref({
  newApis: [],
  deleteApis: [],
  ignoreApis: [],
});

// 弹窗相关
const apiForm = ref(null);
const initForm = () => {
  apiForm.value.resetFields();
  form.value = {
    code: "",
    desc: "",
  };
};

const dialogTitle = ref(t("general.add"));
const dialogFormVisible = ref(false);
const openDialog = (key) => {
  switch (key) {
    case "add":
      dialogTitle.value = t("general.add");
      break;
    case "edit":
      dialogTitle.value = t("general.edit");
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

const deleteTackFunc = async (row) => {
  ElMessageBox.confirm(t("general.deleteConfirm"), t("general.hint"), {
    confirmButtonText: t("general.confirm"),
    cancelButtonText: t("general.cancel"),
    type: "warning",
  }).then(async () => {
    const res = await InboxDel({ id: row.id });
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
watchEffect(() => {
  if (value2.value) {
    if (searchInfo.value && searchInfo.value.accountId) {
      return;
    }
    getTableData();
  }
});
</script>


<style scoped lang="scss">
.warning {
  color: #dc143c;
}
.el-input-number {
  width: 50%;
}
.span1 {
  display: inline-block;
  width: 50%;
  text-align: right;
}
.span2 {
  display: inline-block;
  width: calc(49% - 8px);
  text-align: left;
  padding-left: 8px;
}
.span3 {
  font-weight: 700;
}
.span4 {
  display: block;
  border-bottom: 1px solid var(--border-color);
  width: 80%;
  margin: auto;
}
.textSpan {
  word-break: break-all;
  text-align: left;
}
</style>
