<template>
  <div>
    <div class="gva-search-box">
      <el-form ref="searchForm" :inline="true" :model="searchInfo">
        <el-form-item :label="t('tableColumn.accountId')">
          <el-input
            clearable
            v-model="searchInfo.accountId"
            :placeholder="t('tableColumn.accountId')"
            @blur="searchChange($event, 'accountId')"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item :label="t('tableColumn.code')">
          <el-select
            clearable
            v-model="searchInfo.code"
            :placeholder="t('tableColumn.placeholder')"
            @change="searchChange()"
          >
            <el-option
              v-for="item in completeOptions"
              :key="item.code"
              :label="t(`tableColumn.${item.code}`)"
              :value="item.code"
            />
          </el-select>
        </el-form-item>

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
          min-width="90"
          :label="t('tableColumn.accountId')"
          prop="accountId"
        >
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('tableColumn.code')"
          min-width="90"
          prop="code"
        />
        <el-table-column
          align="center"
          min-width="90"
          :label="t('tableColumn.in')"
          prop="in"
        >
        </el-table-column>
        <el-table-column
          align="center"
          min-width="90"
          :label="t('tableColumn.out')"
          prop="out"
        >
        </el-table-column>

        <el-table-column
          align="center"
          min-width="150"
          :label="t('tableColumn.bet')"
          prop="bet"
        >
        </el-table-column>

        <el-table-column
          align="center"
          min-width="90"
          :label="t('tableColumn.win')"
          prop="win"
        >
        </el-table-column>

        <el-table-column
          align="center"
          min-width="90"
          :label="t('tableColumn.inOut')"
          prop="inOut"
        >
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
  </div>
</template>
  
  <script setup>
import { getUserItemInOut } from "@/api/userInfo";
import { ElMessage } from "element-plus";
import { virtualItemGetList } from "@/api/tack";
import DataTime from "@/components/DataTime/index.vue";
import { ref, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n"; // added by mohamed hassan to support multilanguage
const { t } = useI18n(); // added by mohamed hassan to support multilanguage
const router = useRouter();
const route = useRoute();

defineOptions({
  name: "userInfo",
});

const page = ref(1);
const total = ref(0);
const pageSize = ref(10);
const tableData = ref([]);
const searchInfo = ref({});
const completeOptions = ref([]);
const paramsValue = ref(false);
const showTimes = ref(false);
const value2 = ref([]);

const searchChange = (e, params) => {
  if (searchInfo.value && !searchInfo.value.code) {
    searchInfo.value.code = completeOptions.value[0].code;
  }
  if (params && e.target.value == "") {
    searchInfo.value[params] = null;
  }
  onSubmit();
};
const onReset = () => {
  searchInfo.value = {};
  searchInfo.value.code = completeOptions.value[0].code;
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
  getTableData();
};

const handleCurrentChange = (val) => {
  page.value = val;
  getTableData();
};

// 查询
const getTableData = async () => {
  if (!searchInfo.value.code || searchInfo.value.code === null) {
    searchInfo.value.code = completeOptions.value[0].code;
  }

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

  const table = await getUserItemInOut({
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
  searchInfo.value.accountId = route.query.id;
  const itemData = await virtualItemGetList({
    page: page.value,
    pageSize: 9999,
  });
  if (itemData.code === 0) {
    completeOptions.value = itemData.data.list;
    if (completeOptions.value.length) {
      searchInfo.value.code = completeOptions.value[0].code;
      getTableData();
    }
  }
};

initPage();

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
.myForm {
  padding-bottom: 50px;
}
</style>
  