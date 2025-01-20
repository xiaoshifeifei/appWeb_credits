<template>
  <div>
    <div class="gva-search-box">
      <el-form ref="searchForm" :inline="true" :model="searchInfo">
        <el-form-item :label="t('tableColumn.orderNo')">
          <el-input
            clearable
            v-model="searchInfo.orderNo"
            :placeholder="t('tableColumn.orderNo')"
          />
        </el-form-item>
        <el-form-item :label="t('tableColumn.accountId')">
          <el-input
            clearable
            v-model="searchInfo.accountId"
            :placeholder="t('tableColumn.accountId')"
          />
        </el-form-item>
        <!-- <el-form-item
          :label="t('tableColumn.placeholder') +  t('tableColumn.time')"
        >
          <el-date-picker
            :style="{ width: '300px' }"
            v-model="value2"
            type="daterange"
            unlink-panels
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            :shortcuts="shortcuts"
          />
        </el-form-item> -->
        <DataTime
          v-model="value2"
          :paramsValue="paramsValue"
          @close="paramsValue = false"
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
          :label="t('tableColumn.orderNo')"
          min-width="180"
          prop="orderNo"
        >
          <template #default="scope">
            <div>{{ scope.row.orderNo }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('tableColumn.productId')"
          min-width="90"
          prop="productId"
        >
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('tableColumn.accountId')"
          min-width="90"
          prop="accountId"
        />
        <el-table-column
          align="center"
          :label="t('tableColumn.price')"
          min-width="90"
          prop="price"
        >
        </el-table-column>

        <el-table-column
          align="center"
          :label="t('tableColumn.discount')"
          min-width="90"
          prop="discount"
        />
        <el-table-column
          align="center"
          :label="t('tableColumn.status')"
          min-width="120"
          prop="status"
        >
          <template #default="scope">
            <div>
              {{
                scope.row.status === 0
                  ? t("tableColumn.status0")
                  : scope.row.status === 1
                  ? t("tableColumn.status1")
                  : scope.row.status === 2
                  ? t("tableColumn.status2")
                  : scope.row.status === 3
                  ? t("tableColumn.status3")
                  : scope.row.status === 4
                  ? t("tableColumn.status4")
                  : scope.row.status
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('tableColumn.origin')"
          min-width="120"
          prop="origin"
        >
          <template #default="scope">
            <div>
              {{
                scope.row.origin === 1
                  ? t("tableColumn.android")
                  : scope.row.origin
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('tableColumn.paid')"
          min-width="150"
          prop="paid"
        />
        <el-table-column
          align="center"
          :label="t('tableColumn.payMethod')"
          min-width="120"
          prop="payMethod"
        >
          <template #default="scope">
            <div>
              {{
                scope.row.payMethod === 1
                  ? t("tableColumn.googlePay")
                  : scope.row.payMethod
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('tableColumn.created')"
          min-width="170"
          prop="created"
        >
          <template #default="scope">
            <div>{{ dataGet(scope.row.created) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('tableColumn.expired')"
          min-width="170"
          prop="expired"
        >
          <template #default="scope">
            <div>{{ dataGet(scope.row.expired) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('tableColumn.finished')"
          min-width="170"
          prop="finished"
        >
          <template #default="scope">
            <div>{{ dataGet(scope.row.finished) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('tableColumn.updated')"
          min-width="170"
          prop="updated"
        >
          <template #default="scope">
            <div>{{ dataGet(scope.row.updated) }}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column
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
        </el-table-column> -->
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
        <el-row class="w-full">
          <el-col :span="12">
            <el-form-item :label="t('tableColumn.id')" prop="id">
              <el-input-number
                :disabled="type === 'edit'"
                :min="0"
                v-model="form.id"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <div style="padding: 0 0 20px 40px; color: black; font-size: 16px">
          {{ t("tableColumn.items") }}
        </div>
        <template v-for="(item, index) in form.items" :key="index">
          <el-row class="w-full">
            <el-col :span="12" v-if="item.code || type !== null">
              <el-form-item :label="t('tableColumn.code')" prop="code">
                <el-input v-model="item.code" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="item.num || type !== null">
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
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <el-row class="w-full">
          <el-col :span="12">
            <el-form-item :label="t('tableColumn.type')" prop="type">
              <el-input-number
                :min="0"
                v-model="form.type"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item :label="t('tableColumn.status')" prop="status">
          <el-switch
            v-model="form.status"
            inline-prompt
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-row class="w-full">
          <el-col :span="12">
            <el-form-item :label="t('tableColumn.price')" prop="price">
              <el-input type="number" v-model="form.price" autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="w-full">
          <el-col :span="12">
            <el-form-item :label="t('tableColumn.discount')" prop="discount">
              <el-input
                type="number"
                v-model="form.discount"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- <el-form-item :label="t('tableColumn.expired')" prop="expired">
          <el-date-picker
            v-model="form.expired"
            type="datetime"
          :placeholder="t('tableColumn.PleaseTime')"
            @change="handleDateChange"
          />
        </el-form-item> -->
      </el-form>
    </el-drawer>
  </div>
</template>
  
  <script setup>
import {
  getMallOrderList,
  mallProductDel,
  mallProductEdit,
  mallProductAdd,
} from "@/api/tack";
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import DataTime from "@/components/DataTime/index.vue";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n"; // added by mohamed hassan to support multilanguage
const { t } = useI18n(); // added by mohamed hassan to support multilanguage
const router = useRouter();

defineOptions({
  name: "goodsConfiguration",
});
const paramsValue = ref(false);
const apis = ref([]);
const form = ref({
  id: null,
  items: [{ code: "", num: null }],
  type: null,
  status: null,
  price: "",
  discount: "",
  expired: "",
});
const value2 = ref([]);

const type = ref("");
const rules = ref({
  id: [{ required: true, message: "请输入id", trigger: "blur" }],
  type: [{ required: true, message: "请输入type", trigger: "blur" }],
  desc: [{ required: true, message: "请输入desc", trigger: "blur" }],
  expired: [{ required: true, message: "请选择过期时间", trigger: "blur" }],
  "items.num": [{ required: true, message: "请选输入数量", trigger: "blur" }],
});

const page = ref(1);
const total = ref(0);
const pageSize = ref(10);
const tableData = ref([]);
const searchInfo = ref({});

const onReset = () => {
  searchInfo.value = {};
  value2.value = [];
  paramsValue.value = true;
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
  const table = await getMallOrderList({
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
const handleChange = (number, index, params, params2) => {
  if (params === "v4") {
    if (number >= 1000000000) {
      if (params2) {
        return number / 1000000000 + "B";
      } else {
        return (form.value.items[index].num = number / 1000000000 + "B");
      }
    } else if (number >= 1000000) {
      if (params2) {
        return number / 1000000 + "M";
      } else {
        return (form.value.items[index].num = number / 1000000 + "M");
      }
    } else if (number >= 1000) {
      if (params2) {
        return number / 1000 + "K";
      } else {
        return (form.value.items[index].num = number / 1000 + "K");
      }
    } else {
      if (params2) {
        return number.toString();
      } else {
        return (form.value.items[index].num = number.toString());
      }
    }
  }
};
const initPage = async () => {
  // const end = new Date();
  // const start = new Date();
  // start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
  // value2.value = [start, end];
  getTableData();
};

initPage();

// 批量操作
const handleSelectionChange = (val) => {
  apis.value = val;
};

// 弹窗相关
const apiForm = ref(null);
const initForm = () => {
  apiForm.value.resetFields();
  form.value = {
    id: null,
    items: [{ code: "", num: null }],
    type: null,
    status: null,
    price: "",
    discount: "",
    expired: "",
  };
};
const switchStatus = async (row) => {
  let myUserInfo = JSON.parse(JSON.stringify(row));
  myUserInfo.items.map((item) => {
    // item.num = Number(item.num);
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
  const res = await mallProductEdit(myUserInfo);
  if (res.code === 0) {
    ElMessage({
      type: "success",
      message: `${
        myUserInfo.status === 1
          ? t("user.enabledSuccessfully")
          : t("user.disabledSuccessfully")
      }`,
    });
    getTableData();
  } else {
    getTableData();
  }
};
const handleDateChange = (params, index) => {
  if (index === 0) {
    let date = new Date(params);
    let formattedDate =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      date.getDate().toString().padStart(2, "0") +
      " " +
      "00" +
      ":" +
      "00" +
      ":" +
      "00";
    const dataTime = new Date(formattedDate).getTime();
    const myTime = new Date(dataTime);
    const isoDate = dayjs(myTime).format("YYYY-MM-DDTHH:mm:ssZ");
    searchInfo.value.start = isoDate;
  } else if (index === 1) {
    let date = new Date(params);
    let formattedDate =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      date.getDate().toString().padStart(2, "0") +
      " " +
      "23" +
      ":" +
      "59" +
      ":" +
      "59";
    const dataTime = new Date(formattedDate).getTime();
    const myTime = new Date(dataTime);

    const isoDate = dayjs(myTime).format("YYYY-MM-DDTHH:mm:ssZ");
    searchInfo.value.end = isoDate;
  }
};

const dialogTitle = ref("新增");
const dialogFormVisible = ref(false);
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

const editTackFunc = async (row) => {
  let rows = JSON.parse(JSON.stringify(row));
  form.value = rows;
  openDialog("edit");
};

const enterDialog = async () => {
  apiForm.value.validate(async (valid) => {
    if (valid) {
      if (form.value.items != null && form.value.items.length) {
        form.value.items.map((item, index) => {
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
      switch (type.value) {
        case "add":
          {
            const res = await mallProductAdd(form.value);
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
            const res = await mallProductEdit(form.value);
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
    const res = await mallProductDel({ id: row.id });
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
.warning {
  color: #dc143c;
}
.el-input-number {
  width: 50%;
}
</style>
  