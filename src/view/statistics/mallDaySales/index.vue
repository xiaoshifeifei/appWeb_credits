<template>
  <div>
    <div class="gva-search-box">
      <el-form ref="searchForm" :inline="true" :model="searchInfo">
        <DataTime
          v-model="value2"
          :showTime="true"
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
      <el-table
        border
        ref="multipleTable"
        :data="tableData"
        @selection-change="handleSelectionChange"
        highlight-current-row
        :header-cell-style="{
          backgroundColor: 'var(--el-tab-bgc)',
          Color: '#FFF',
        }"
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          align="center"
          min-width="120"
          :label="t('tableColumn.days')"
          prop="day"
        >
          <template #default="scope">
            <div>
              {{ dataGet(scope.row.day) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('tableColumn.productSales')"
          min-width="400"
          prop="productSales"
        >
          <template #default="scope">
            <!-- {{ scope.row.productSales }} -->
            <div v-for="(item, index) in scope.row.productSales" :key="index">
              <div
                v-for="(item1, key, index1) in item"
                :key="index1"
                class="spanCla"
              >
                <span>
                  <span class="span1"
                    >{{
                      key == "productName"
                        ? t(`tableColumn.productName`)
                        : key == "productId"
                        ? t(`tableColumn.productId`)
                        : key == "accountCount"
                        ? t(`tableColumn.accountCount`)
                        : key == "purchaseAmount"
                        ? t(`tableColumn.purchaseAmount`)
                        : key == "purchaseTimes"
                        ? t(`tableColumn.purchaseTimes`)
                        : key
                    }}:</span
                  >
                  <span class="span2">{{ item1 }}</span>
                </span>
              </div>
              <span
                class="span4"
                v-if="
                  scope.row.productSales.length > 1 &&
                  scope.row.productSales.length - 1 > index
                "
              >
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          fixed="right"
          :label="t('general.operations')"
          min-width="100"
        >
          <template #default="scope">
            <el-button type="primary" size="small" @click="seeFunc(scope.row)">
              {{ t("general.see") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-drawer
      v-if="dialogFormVisible"
      v-model="dialogFormVisible"
      size="100%"
      append-to-body
      :before-close="closeDialog"
      :show-close="false"
      style="background-color: #f7f7f7"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg">{{ dialogTitle }}</span>
          <div>
            <el-button @click="closeDialog">
              {{ t("components.commandMenu.close") }}
            </el-button>
          </div>
        </div>
      </template>

      <el-form class="myForm" ref="apiForm" :model="form" label-width="120px">
        <el-row class="w-full">
          <el-col :span="12">
            <el-form-item :label="t('tableColumn.days')">
              <el-input v-model="form.day" readonly autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-table
          :data="form.productSales"
          border
          style="width: 1000px; margin-top: 20px"
        >
          <el-table-column
            prop="productName"
            align="center"
            :label="t(`tableColumn.productName`)"
            width="200"
          />
          <el-table-column
            prop="productId"
            align="center"
            :label="t(`tableColumn.productId`)"
            width="200"
          />
          <el-table-column
            prop="accountCount"
            align="center"
            :label="t(`tableColumn.accountCount`)"
            width="200"
          />
          <el-table-column
            prop="purchaseAmount"
            align="center"
            :label="t(`tableColumn.purchaseAmount`)"
            width="200"
          />
          <el-table-column
            prop="purchaseTimes"
            align="center"
            :label="t(`tableColumn.purchaseTimes`)"
            width="200"
          />
        </el-table>
      </el-form>
    </el-drawer>
  </div>
</template>
  
  <script setup>
import { getMallDaySales } from "@/api/userInfo";
import { ElMessage } from "element-plus";
import { ref, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";
import DataTime from "@/components/DataTime/index.vue";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n"; // added by mohamed hassan to support multilanguage
const { t } = useI18n(); // added by mohamed hassan to support multilanguage
const router = useRouter();
const route = useRoute();

defineOptions({
  name: "userInfo",
});
const AAA = ref([
  {
    accountCount: 1,
    productId: 1,
    productName: 1,
    purchaseAmount: 1,
    purchaseTimes: 1,
  },
  {
    accountCount: 2,
    productId: 2,
    productName: 2,
    purchaseAmount: 2,
    purchaseTimes: 2,
  },
]);
const page = ref(1);
const total = ref(0);
const pageSize = ref(10);
const tableData = ref([]);
const searchInfo = ref({});
const dialogTitle = ref(t("view.dictionary.sysDictionary.details"));
const form = ref({});
const dialogFormVisible = ref(false);
const paramsValue = ref(false);
const showTimes = ref(false);
const value2 = ref([]);
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
const dataGet = (dateStr) => {
  let date = new Date(dateStr);
  let formattedDate =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    date.getDate().toString().padStart(2, "0") +
    " ";
  return formattedDate;
};

const seeFunc = async (row) => {
  let rows = JSON.parse(JSON.stringify(row));
  rows.day = dataGet(rows.day);
  form.value = rows;
  dialogFormVisible.value = true;
};
const closeDialog = () => {
  initForm();
  dialogFormVisible.value = false;
};
const apiForm = ref(null);
const initForm = () => {
  apiForm.value.resetFields();
  form.value = {};
};
const onReset = () => {
  searchInfo.value = {};
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const isoDate = now.toISOString();
  const now2 = new Date();
  now2.setHours(23, 59, 59, 999);
  const isoDate2 = now2.toISOString();
  const isoArr = [isoDate, isoDate2];
  const timeData = isoArr.map((item) => {
    return item;
  });

  value2.value = timeData;
  showTimes.value = true;
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
  // getTableData();
};

const handleCurrentChange = (val) => {
  page.value = val;
  // getTableData();
};

// 查询
const getTableData = async () => {
  if (value2.value && value2.value.length) {
    searchInfo.value.start = value2.value[0];
    searchInfo.value.end = value2.value[1];
  } else {
    searchInfo.value.start = null;
    searchInfo.value.end = null;
    return ElMessage.warning(
      t("tableColumn.placeholder") + t("tableColumn.time")
    );
  }

  const table = await getMallDaySales({
    page: page.value,
    pageSize: pageSize.value,
    ...searchInfo.value,
  });
  if (table.code === 0) {
    tableData.value = table.data;
  }
};
const init = async () => {
  setTimeout(() => {
    getTableData();
  }, 10);
};
init();
// 批量操作
const handleSelectionChange = (val) => {
  if (val.length > 0) {
    let arr = [];
    val.forEach((item) => {
      arr.push(item.accountId);
    });
  }
};
const multipleTable = ref(null);

const tableRowClassName = ({ row, rowIndex }) => {
  if (rowIndex % 2 == 0) {
    return "";
  } else {
    return "warnBg";
  }
};
watchEffect(() => {
  if (value2.value) {
    getTableData();
  }
});
</script>

  <style scoped lang="scss">
.warning {
  color: #dc143c;
}
.myForm {
  width: 70%;
  padding-bottom: 50px;
  margin: auto;
}
.nameKey {
  color: #000;
  font-weight: 700;
  font-size: 16px;
  margin: 20px 0;
}
.nameKey1 {
  color: #999;
  font-weight: 600;
  font-size: 14px;
  // margin: 10px 0;
}
.temple {
  display: flex;
  justify-content: flex-start;
}

.temp1 {
  width: 100%;
}
.origin {
  width: calc(100% - 50px);
  padding-left: 50px;
  margin-bottom: 30px;
}
.pose {
  // margin-left: -50px;
  color: #666;
}

.span1 {
}
.span2 {
}
.span3 {
  font-weight: 700;
}
.span4 {
  display: block;
  border-bottom: 1px solid var(--border-color);
  width: 50%;
  margin: auto;
}
.spanCla {
  display: inline-block;
  margin-right: 20px;
}
.myForm {
  & :deep(.el-table tr th .cell) {
    color: #333 !important;
  }
}
</style>
  