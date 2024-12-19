<template>
  <div>
    <div class="gva-search-box">
      <el-form ref="searchForm" :inline="true" :model="searchInfo">
        <el-form-item :label="t('tableColumn.dayAndWeek')">
          <el-select
            v-model="searchInfo.type"
            clearable
            :placeholder="t('general.pleaseSelect')"
          >
            <el-option
              v-for="item in methodOptions"
              :key="item.value"
              :label="t(`tableColumn.${item.label}`)"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="search" @click="onSubmit">
            {{ t("general.search") }}
          </el-button>
          <el-button icon="refresh" @click="onReset">
            {{ t("general.reset") }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="gva-table-box">
      <div class="gva-btn-list">
        <el-button type="primary" icon="plus" @click="openDialog('add')">
          {{ t("general.add") }}
        </el-button>
      </div>
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
          min-width="90"
          :label="t('tableColumn.id')"
          prop="id"
        >
          <template #default="scope">
            <el-link type="primary" @click="clickBetDetail(scope.row.id)">{{
              scope.row.id
            }}</el-link>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          :label="t('tableColumn.desc')"
          min-width="150"
          prop="desc"
        />

        <el-table-column
          align="center"
          :label="t('tableColumn.complete')"
          min-width="400"
          prop="complete"
        >
          <template #default="scope">
            <div
              v-for="(item, index) in scope.row.complete"
              :key="index"
              class="spanZ"
            >
              <div
                v-for="(item1, key, index1) in item"
                :key="index1"
                class="spanClass"
              >
                <span v-if="item1 !== ''" class="spanRi">
                  <span>{{ t(`tableColumn.${key}`) }}: </span>
                  <span>{{ item1 }}</span>
                </span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('tableColumn.award')"
          min-width="200"
          prop="award"
        >
          <template #default="scope">
            <div v-for="(item, index) in scope.row.award" :key="index">
              <div v-for="(item1, key, index1) in item" :key="index1">
                <span class="span1">{{ t(`tableColumn.${key}`) }}:</span>
                <span v-if="key == 'code'" class="span2">{{
                  t(`tableColumn.${item1}`)
                }}</span>
                <span v-else class="span2">{{ item1 }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column
          align="center"
          :label="t('tableColumn.start')"
          min-width="180"
          prop="start"
        >
          <template #default="scope">
            <div>{{ dataGet(scope.row.start) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('tableColumn.end')"
          min-width="180"
          prop="end"
        >
          <template #default="scope">
            <div>{{ dataGet(scope.row.end) }}</div>
          </template>
        </el-table-column> -->
        <el-table-column
          align="center"
          :label="t('tableColumn.unlock')"
          min-width="200"
          prop="unlock"
        >
          <template #default="scope">
            <!-- <div>{{ scope.row.unlock }}</div> -->
            <div v-for="(item, index) in scope.row.unlock" :key="index">
              <div v-for="(item1, key, index1) in item" :key="index1">
                <span class="span1">{{ t(`tableColumn.${key}`) }}:</span>
                <span class="span2">{{ item1 }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('tableColumn.tag')"
          min-width="200"
          prop="tag"
        >
          <template #default="scope">
            <!-- <div>{{ scope.row.tag }}</div> -->
            <div v-for="(item1, key, index1) in scope.row.tag" :key="index1">
              <span class="span1">{{ t(`tableColumn.${key}`) }}:</span>
              <span class="span2">{{ item1 }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('tableColumn.before')"
          min-width="150"
          prop="before"
        />
        <el-table-column
          align="center"
          fixed="right"
          :label="t('general.operations')"
          min-width="200"
        >
          <template #default="scope">
            <!-- <el-button
              type="primary"
              icon="edit"
             size="small"
              @click="editTackFunc(scope.row)"
            >
               {{ t("general.edit") }}
            </el-button> -->
            <el-button
              icon="delete"
              size="small"
              @click="deleteTackFunc(scope.row)"
            >
              {{ t("general.delete") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="gva-pagination">
        <el-pagination
          :current-page="page"
          :page-size="pageSize"
          :page-sizes="[10, 30, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div> -->
    </div>

    <el-drawer
      v-model="dialogFormVisible"
      size="40%"
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
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup>
import {
  dailyOrWeeklyGet,
  dailyOrWeeklyDel,
  dailyOrWeeklyAdd,
} from "@/api/tack";
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n"; // added by mohamed hassan to support multilanguage
const { t } = useI18n(); // added by mohamed hassan to support multilanguage
const router = useRouter();

defineOptions({
  name: "dailyOrWeekly",
});

const apis = ref([]);
const form = ref({
  id: "",
});
const methodOptions = ref([
  {
    value: "daily",
    label: "daily",
  },
  {
    value: "weekly",
    label: "weekly",
  },
]);

const type = ref("");
const rules = ref({
  id: [{ required: true, message: "请输入id", trigger: "blur" }],
  desc: [{ required: true, message: "请输入desc", trigger: "blur" }],
  complete: [{ required: true, message: "请选择请求方式", trigger: "blur" }],
  award: [{ required: true, message: "请输入api介绍", trigger: "blur" }],
});

const page = ref(1);
const total = ref(0);
const pageSize = ref(9999);
const tableData = ref([]);
const searchInfo = ref({ type: "daily" });

const onReset = () => {
  searchInfo.value = { type: "daily" };
};
// 搜索

const onSubmit = () => {
  page.value = 1;
  pageSize.value = 9999;

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
  if (searchInfo.value.type == "daily") {
    searchInfo.value.type = "daily";
  }
  const table = await dailyOrWeeklyGet({
    page: page.value,
    pageSize: pageSize.value,
    ...searchInfo.value,
  });
  if (table.code === 0) {
    table.data.map((item, index) => {
      if (item.complete && item.complete.length > 0 && item.complete[0].value) {
        item.complete[0].value = handleChange(
          item.complete[0].value,
          0,
          "v1",
          true
        );
      }
      if (
        item.complete &&
        item.complete.length > 0 &&
        item.complete[0].value2
      ) {
        item.complete[0].value2 = handleChange(
          item.complete[0].value2,
          0,
          "v2",
          true
        );
      }
      if (item.award && item.award.length > 0 && item.award[0].num) {
        item.award[0].num = handleChange(item.award[0].num, 0, "v3", true);
      }
    });
    tableData.value = table.data;
    total.value = table.data.total;
    page.value = table.data.page;
    pageSize.value = table.data.pageSize;
  }
};
const handleChange = (number, index, params, params2) => {
  if (params === "v1") {
    if (number >= 1000000000) {
      if (params2) {
        return number / 1000000000 + "B";
      } else {
        return (form.value.complete[index].value = number / 1000000000 + "B");
      }
    } else if (number >= 1000000) {
      if (params2) {
        return number / 1000000 + "M";
      } else {
        return (form.value.complete[index].value = number / 1000000 + "M");
      }
    } else if (number >= 1000) {
      if (params2) {
        return number / 1000 + "K";
      } else {
        return (form.value.complete[index].value = number / 1000 + "K");
      }
    } else {
      if (params2) {
        return number.toString();
      } else {
        return (form.value.complete[index].value = number.toString());
      }
    }
  } else if (params === "v2") {
    if (number >= 1000000000) {
      if (params2) {
        return number / 1000000000 + "B";
      } else {
        return (form.value.complete[index].value2 = number / 1000000000 + "B");
      }
    } else if (number >= 1000000) {
      if (params2) {
        return number / 1000000 + "M";
      } else {
        return (form.value.complete[index].value2 = number / 1000000 + "M");
      }
    } else if (number >= 1000) {
      if (params2) {
        return number / 1000 + "K";
      } else {
        return (form.value.complete[index].value2 = number / 1000 + "K");
      }
    } else {
      if (params2) {
        return number.toString();
      } else {
        return (form.value.complete[index].value2 = number.toString());
      }
    }
  } else if (params === "v3") {
    if (number >= 1000000000) {
      if (params2) {
        return number / 1000000000 + "B";
      } else {
        return (form.value.award[index].num = number / 1000000000 + "B");
      }
    } else if (number >= 1000000) {
      if (params2) {
        return number / 1000000 + "M";
      } else {
        return (form.value.award[index].num = number / 1000000 + "M");
      }
    } else if (number >= 1000) {
      if (params2) {
        return number / 1000 + "K";
      } else {
        return (form.value.award[index].num = number / 1000 + "K");
      }
    } else {
      if (params2) {
        return number.toString();
      } else {
        return (form.value.award[index].num = number.toString());
      }
    }
  }
};

getTableData();
// 批量操作
const handleSelectionChange = (val) => {
  apis.value = val;
};

// 弹窗相关
const apiForm = ref(null);
const initForm = () => {
  apiForm.value.resetFields();
  form.value = {
    id: "",
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
const clickBetDetail = (id) => {
  let query = {};
  query["id"] = id;
  router.push({ name: "taskDetails", query });
};

const enterDialog = async () => {
  apiForm.value.validate(async (valid) => {
    if (valid) {
      switch (type.value) {
        case "add":
          {
            form.value.id = Number(form.value.id);
            form.value.type = searchInfo.value.type;
            const res = await dailyOrWeeklyAdd(form.value);
            if (res.code === 0) {
              ElMessage({
                type: "success",
                message: t(`general.addSuccess`),
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

const deleteTackFunc = async (row) => {
  ElMessageBox.confirm(t("general.deleteConfirm"), t("general.hint"), {
    confirmButtonText: t("general.confirm"),
    cancelButtonText: t("general.cancel"),
    type: "warning",
  }).then(async () => {
    const res = await dailyOrWeeklyDel({
      id: row.id,
      type: searchInfo.value.type,
    });
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
.warning {
  color: #dc143c;
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
.spanZ {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}
.spanCla {
  width: 50%;
}
.spanClass {
  display: inline;
}
.spanRi {
  margin-right: 30px;
}
</style>
