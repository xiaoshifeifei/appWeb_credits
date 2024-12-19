<template>
  <div>
    <div class="gva-table-box">
      <div class="setting">收集奖励设置</div>
      <el-form
        ref="userForm"
        label-width="110px"
        :rules="rules"
        :model="userInfo"
        :inline="true"
      >
        <el-row class="w-full">
          <el-col :span="6">
            <el-form-item label="总投注" prop="password">
              <el-input v-model="userInfo.password" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="奖励积分" prop="nickName">
              <el-input v-model="userInfo.nickName" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="总赢" prop="password">
              <el-input v-model="userInfo.password" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="奖励钻石" prop="nickName">
              <el-input v-model="userInfo.nickName" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="回合赢" prop="password">
              <el-input v-model="userInfo.password" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="奖励道具" prop="nickName">
              <el-input v-model="userInfo.nickName" />
            </el-form-item>
          </el-col>
        </el-row>

        <div class="dj">提示:10-20-30-40 可用" - "号连接，设置多个等级</div>
        <el-form-item label="下载领奖等级" prop="password">
          <el-input v-model="userInfo.password" style="width: 200%" />
        </el-form-item>
        <div class="setting">等级-收集限制设置</div>
        <el-row class="w-full">
          <el-col :span="24">
            <el-form-item label="游戏一" prop="password">
              <el-input-number
                :min="0"
                v-model="userInfo.password"
                label-suffix="级"
              />
              <span style="margin-left: 10px">级</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="游戏二" prop="password">
              <el-input-number :min="0" v-model="userInfo.password" />
              <span style="margin-left: 10px">级</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="游戏三" prop="password">
              <el-input-number :min="0" v-model="userInfo.password" />
              <span style="margin-left: 10px">级</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="w-full">
          <el-col :span="6">
            <el-form-item label="游戏四" prop="password">
              <el-input-number :min="0" v-model="userInfo.password" />
              <span style="margin-left: 10px">级</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="拼图" prop="nickName">
              <el-input-number :min="0" v-model="userInfo.password" />
              <span style="margin-left: 10px">星</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="w-full">
          <el-col :span="6">
            <el-form-item label="游戏五" prop="password">
              <el-input-number :min="0" v-model="userInfo.password" />
              <span style="margin-left: 10px">级</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="拼图" prop="nickName">
              <el-input-number :min="0" v-model="userInfo.password" />
              <span style="margin-left: 10px">星</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
      
<script setup>
import {
  getUserList,
  setUserAuthorities,
  register,
  deleteUser,
} from "@/api/user";

import { setUserInfo, resetPassword } from "@/api/user.js";
import { nextTick, ref, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n"; // added by mohamed hassan to support multilanguage
const { t } = useI18n(); // added by mohamed hassan to support multilanguage

defineOptions({
  name: "limitation",
});

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

const page = ref(1);
const total = ref(0);
const pageSize = ref(10);
const tableData = ref([]);
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
  });
  if (table.code === 0) {
    tableData.value = table.data.list;
    total.value = table.data.total;
    page.value = table.data.page;
    pageSize.value = table.data.pageSize;
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

const chooseImg = ref(null);
const openHeaderChange = () => {
  chooseImg.value.open();
};

const authOptions = ref([]);
const setOptions = (authData) => {
  authOptions.value = [];
  setAuthorityOptions(authData, authOptions.value);
};

const deleteUserFunc = async (row) => {
  ElMessageBox.confirm(t("general.deleteConfirm"), t("general.hint"), {
    confirmButtonText: t("general.confirm"),
    cancelButtonText: t("general.cancel"),
    type: "warning",
  }).then(async () => {
    const res = await deleteUser({ id: row.ID });
    if (res.code === 0) {
      ElMessage.success("删除成功");
      await getTableData();
    }
  });
};

// 弹窗相关
const userInfo = ref({
  userName: "",
  password: "",
  nickName: "",
  headerImg: "",
  authorityId: "",
  authorityIds: [],
  enable: 1,
});

const rules = ref({
  userName: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 5, message: "最低5位字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入用户密码", trigger: "blur" },
    { min: 6, message: "最低6位字符", trigger: "blur" },
  ],
  nickName: [{ required: true, message: "请输入用户昵称", trigger: "blur" }],
  phone: [
    {
      pattern: /^1([38][0-9]|4[014-9]|[59][0-35-9]|6[2567]|7[0-8])\d{8}$/,
      message: "请输入合法手机号",
      trigger: "blur",
    },
  ],
  email: [
    {
      pattern: /^([0-9A-Za-z\-_.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g,
      message: "请输入正确的邮箱",
      trigger: "blur",
    },
  ],
  authorityId: [{ required: true, message: "请选择用户角色", trigger: "blur" }],
});
const userForm = ref(null);
const enterAddUserDialog = async () => {
  userInfo.value.authorityId = userInfo.value.authorityIds[0];
  userForm.value.validate(async (valid) => {
    if (valid) {
      const req = {
        ...userInfo.value,
      };
      if (dialogFlag.value === "add") {
        const res = await register(req);
        if (res.code === 0) {
          ElMessage({ type: "success", message: "创建成功" });
          await getTableData();
          closeAddUserDialog();
        }
      }
      if (dialogFlag.value === "edit") {
        const res = await setUserInfo(req);
        if (res.code === 0) {
          ElMessage({ type: "success", message: t("user.userEditedNote") });
          await getTableData();
          closeAddUserDialog();
        }
      }
    }
  });
};

const addUserDialog = ref(false);
const closeAddUserDialog = () => {
  userForm.value.resetFields();
  userInfo.value.headerImg = "";
  userInfo.value.authorityIds = [];
  addUserDialog.value = false;
};

const dialogFlag = ref("add");

const addUser = () => {
  dialogFlag.value = "add";
  addUserDialog.value = true;
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

const openEdit = (row) => {
  dialogFlag.value = "edit";
  userInfo.value = JSON.parse(JSON.stringify(row));
  addUserDialog.value = true;
};

const switchEnable = async (row) => {
  userInfo.value = JSON.parse(JSON.stringify(row));
  await nextTick();
  const req = {
    ...userInfo.value,
  };
  const res = await setUserInfo(req);
  if (res.code === 0) {
    ElMessage({
      type: "success",
      message: `${
        myUserInfo.status === 0
          ? t("user.enabledSuccessfully")
          : t("user.disabledSuccessfully")
      }`,
    });
    await getTableData();
    userInfo.value.headerImg = "";
    userInfo.value.authorityIds = [];
  }
};
</script>
      
<style lang="scss">
.header-img-box {
  @apply w-52 h-52 border border-solid border-gray-300 rounded-xl flex justify-center items-center cursor-pointer;
}

.setting {
  padding: 20px 0;
  font-weight: 700;
  font-size: 18px;
}
.dj {
  font-size: 12px;
  font-weight: 400;
  color: #999;
  margin: 10px 0 5px;
  margin-left: 110px;
}
</style>
      