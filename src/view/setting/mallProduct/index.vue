<template>
  <div>
    <div class="gva-search-box">
      <el-form ref="searchForm" :inline="true" :model="searchInfo">
        <el-form-item label="key">
          <el-input v-model="searchInfo.Key" placeholder="key" />
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
          :label="t('tableColumn.id')"
          min-width="100"
          prop="id"
        />
        <el-table-column
          align="center"
          :label="t('tableColumn.name')"
          min-width="150"
          prop="name"
        />
        <el-table-column
          align="center"
          :label="t('tableColumn.type')"
          min-width="150"
          prop="type"
        >
          <template #default="scope">
            <div>
              {{
                scope.row.type === 0
                  ? t("tableColumn.seizeASeat")
                  : scope.row.type === 1
                  ? t("tableColumn.goldCoins")
                  : scope.row.type === 2
                  ? t("tableColumn.diamonds")
                  : scope.row.type === 3
                  ? t("tableColumn.pigCoins1")
                  : scope.row.type === 4
                  ? t("tableColumn.pigCoins2")
                  : scope.row.type === 5
                  ? t("tableColumn.pigDiamonds1")
                  : scope.row.type === 6
                  ? t("tableColumn.pigDiamonds2")
                  : scope.row.type
              }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          :label="t('tableColumn.items')"
          min-width="300"
          prop="items"
        >
          <template #default="scope">
            <div v-for="(item, index) in scope.row.items" :key="index">
              <div
                v-for="(item1, key, index1) in item"
                :key="index1"
                class="spanCla"
              >
                <span>{{ t(`tableColumn.${key}`) }}: </span>
                <span
                  v-if="key == 'code'"
                  :class="key == 'code' ? 'span3' : ''"
                >
                  {{ t(`tableColumn.${item1}`) }}
                </span>
                <span v-else :class="key == 'code' ? 'span3' : ''">
                  {{ item1 }}
                </span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('tableColumn.price')"
          min-width="80"
          prop="price"
        />
        <el-table-column
          align="center"
          :label="t('tableColumn.discount')"
          min-width="80"
          prop="discount"
        />
        <el-table-column
          align="center"
          :label="t('tableColumn.expired')"
          min-width="150"
          prop="expired"
        >
          <template #default="scope">
            <div>{{ dataGet(scope.row.expired) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('tableColumn.created')"
          min-width="150"
          prop="created"
        >
          <template #default="scope">
            <div>{{ dataGet(scope.row.created) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('tableColumn.status')"
          min-width="80"
          prop="status"
        >
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              inline-prompt
              :active-value="1"
              :inactive-value="0"
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
              <el-form-item
                :label="t('tableColumn.code')"
                :prop="`items.${index}.code`"
                :rules="rules['items.code']"
              >
                <!-- <el-input v-model="item.code" autocomplete="off" /> -->
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
              <el-select
                v-model="form.type"
                style="width: 100%"
                :placeholder="t('general.pleaseSelect')"
              >
                <el-option
                  v-for="item in completeOptions"
                  :key="item.value"
                  :label="t(`tableColumn.${item.label}`)"
                  :value="item.value"
                />
              </el-select>
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
              <el-input
                v-model="form.price"
                autocomplete="off"
                @input="form.price = form.price.replace(/[^\d|\.]/g, '')"
                @change="handleChange(form.price, 0, 'v1')"
              />
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

        <SingleTime
          v-model="value2"
          :values="form.expired"
          :title="t('tableColumn.expired')"
          :showTime="true"
          @closeTime="closeTime"
        ></SingleTime>
        <div style="padding: 0 0 20px 40px; color: red; font-size: 12px">
          类型提示：
          <div style="margin: 5px 0">0 //占位</div>
          <div style="margin: 5px 0">1 //金币</div>
          <div style="margin: 5px 0">2 //钻石</div>
          <div style="margin: 5px 0">3 //小猪金币存钱罐1</div>
          <div style="margin: 5px 0">4 //小猪金币存钱罐2</div>
          <div style="margin: 5px 0">5 //小猪钻石存钱罐1</div>
          <div style="margin: 5px 0">6 //小猪钻石存钱罐2</div>
        </div>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup>
import {
  mallProductGetList,
  mallProductDel,
  mallProductEdit,
  mallProductAdd,
  virtualItemGetList,
} from "@/api/tack";
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import SingleTime from "@/components/DataTime/singleTime.vue";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n"; // added by mohamed hassan to support multilanguage
const { t } = useI18n(); // added by mohamed hassan to support multilanguage
const router = useRouter();

defineOptions({
  name: "goodsConfiguration",
});

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
const codeOptions = ref([]);
const type = ref("");
const value2 = ref("");
const rules = ref({
  id: [{ required: true, message: "请输入id", trigger: "blur" }],
  type: [{ required: true, message: "请选择类型", trigger: "blur" }],
  desc: [{ required: true, message: "请输入desc", trigger: "blur" }],
  price: [{ required: true, message: "请输入价格", trigger: "blur" }],
  discount: [{ required: true, message: "请输入折扣", trigger: "blur" }],
  expired: [{ required: true, message: "请选择过期时间", trigger: "blur" }],
  "items.num": [{ required: true, message: "请选输入数量", trigger: "blur" }],
  "items.code": [{ required: true, message: "请选输入编码", trigger: "blur" }],
});

const page = ref(1);
const total = ref(0);
const pageSize = ref(10);
const tableData = ref([]);
const searchInfo = ref({});
const showTimeBo = ref(false);
const completeOptions = ref([
  { label: "seizeASeat", value: 0 },
  { label: "goldCoins", value: 1 },
  { label: "diamonds", value: 2 },
  { label: "pigCoins1", value: 3 },
  { label: "pigCoins2", value: 4 },
  { label: "pigDiamonds1", value: 5 },
  { label: "pigDiamonds2", value: 6 },
]);
const onReset = () => {
  searchInfo.value = {};
};
// 搜索

const onSubmit = () => {
  page.value = 1;
  pageSize.value = 10;
  getTableData();
};
const closeTime = (val) => {
  showTimeBo.value = val;
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

const handleCurrentChange = (val) => {
  page.value = val;
  getTableData();
};

// 查询
const getTableData = async () => {
  const table = await mallProductGetList({
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
      if (item.price != null && item.price.length > 0) {
        item.price = handleChange(item.price, index, "v1", true);
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
  } else if (params === "v1") {
    if (number >= 1000000000) {
      if (params2) {
        return number / 1000000000 + "B";
      } else {
        return (form.value.price = number / 1000000000 + "B");
      }
    } else if (number >= 1000000) {
      if (params2) {
        return number / 1000000 + "M";
      } else {
        return (form.value.price = number / 1000000 + "M");
      }
    } else if (number >= 1000) {
      if (params2) {
        return number / 1000 + "K";
      } else {
        return (form.value.price = number / 1000 + "K");
      }
    } else {
      if (params2) {
        return number.toString();
      } else {
        return (form.value.price = number.toString());
      }
    }
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
  myUserInfo.price = myUserInfo.price + "";
  if (myUserInfo.price.indexOf("B") !== -1) {
    const newStr = myUserInfo.price.replace("B", "");
    myUserInfo.price = Number(newStr) * 1000000000;
  } else if (myUserInfo.price.indexOf("M") !== -1) {
    const newStr = myUserInfo.price.replace("M", "");
    myUserInfo.price = Number(newStr) * 1000000;
  } else if (myUserInfo.price.indexOf("K") !== -1) {
    const newStr = myUserInfo.price.replace("K", "");
    myUserInfo.price = Number(newStr) * 1000;
  } else {
    myUserInfo.price = Number(myUserInfo.price);
  }
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
const handleDateChange = () => {
  if (form.value.expired) {
    const isoDate = dayjs(form.value.expired).format("YYYY-MM-DDTHH:mm:ssZ");
    form.value.expired = isoDate;
  }
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
      if (form.value.price != null && form.value.price.length) {
        form.value.price = form.value.price + "";
        if (form.value.price.indexOf("B") !== -1) {
          const newStr = form.value.price.replace("B", "");
          form.value.price = Number(newStr) * 1000000000;
        } else if (form.value.price.indexOf("M") !== -1) {
          const newStr = form.value.price.replace("M", "");
          form.value.price = Number(newStr) * 1000000;
        } else if (form.value.price.indexOf("K") !== -1) {
          const newStr = form.value.price.replace("K", "");
          form.value.price = Number(newStr) * 1000;
        } else {
          form.value.price = Number(form.value.price);
        }
      }
      if (value2.value) {
        form.value.expired = value2.value;
      }

      if (showTimeBo.value) {
        return ElMessage.warning(
          t("tableColumn.placeholder") + t("tableColumn.expired")
        );
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
.spanCla {
  display: inline-block;
  margin-right: 20px;
}
.span3 {
  font-weight: 700;
}
</style>
