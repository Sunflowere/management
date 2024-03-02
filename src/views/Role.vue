<template>
  <div>
    <div style="margin: 10px 0">
      <el-input
        style="width: 200px"
        placeholder="请输入名称"
        suffix-icon="el-icon-search"
        v-model="name"
      ></el-input>
      <el-button class="ml-5" type="primary" @click="load">搜索</el-button>
      <el-button type="warning" @click="reset">重置</el-button>
    </div>
    <div style="margin: 10px 0">
      <el-button type="primary" @click="handleAdd"
        >新增 <i class="el-icon-circle-plus-outline"></i
      ></el-button>
      <el-popconfirm
        class="ml-5"
        confirm-button-text="确认"
        cancel-button-text="我再想想"
        icon="el-icon-info"
        icon-color="red"
        title="您确定删除吗？"
        @confirm="delBatch"
      >
        <el-button slot="reference" type="danger"
          >批量删除 <i class="el-icon-remove-outline"></i
        ></el-button>
      </el-popconfirm>
    </div>
    <el-table
      :data="tableData"
      border
      stripe
      :header-cell-class-name="headerBg"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="name" label="名称" width="140"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="info" @click="selectMenu(scope.row.id)"
            >分配菜单<i class="el-icon-menu"></i
          ></el-button>
          <el-button type="primary" @click="handleEdit(scope.row)"
            >编辑<i class="el-icon-edit"></i
          ></el-button>

          <el-popconfirm
            class="ml-5"
            confirm-button-text="确认"
            cancel-button-text="我再想想"
            icon="el-icon-info"
            icon-color="red"
            title="您确定删除吗？"
            @confirm="del(scope.row.id)"
          >
            <el-button slot="reference" type="danger"
              >删除<i class="el-icon-remove-outline"></i
            ></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 10px 0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>

    <el-dialog title="角色信息" :visible.sync="dialogFormVisible" width="25%">
      <el-form :model="form" label-width="60px" size="small">
        <el-form-item label="名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="菜单分配" :visible.sync="menuDialogVis" width="30%">
      <el-tree
        :data="menuData"
        show-checkbox
        node-key="id"
        ref="tree"
        :default-expanded-keys="expends"
        :default-checked-keys="checks"
        :props="Props"
      >
      </el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="menuDialogVis = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleMenu">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Role",
  data() {
    return {
      form: {},
      tableData: [],
      multipleSelection: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      name: "",
      headerBg: "headerBg",
      dialogFormVisible: false,
      menuDialogVis: false,
      defaultProps: {},
      menuData: [],
      Props: {
        label: "name",
      },
      expends: [],
      checks: [],
      roleId: 0,
    };
  },
  created() {
    this.load();
  },
  methods: {
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
    },
    load() {
      //请求分页查询数据
      this.request
        .get("/role/page", {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            name: this.name,
          },
        })
        .then((res) => {
          console.log(res);
          this.tableData = res.records;
          this.total = res.total;
        });
    },
    reset() {
      this.name = "";
      this.load();
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.form = {};
    },
    handleEdit(row) {
      this.form = row;
      this.dialogFormVisible = true;
    },
    del(id) {
      this.request.delete("/role/" + id).then((res) => {
        if (res) {
          this.$message.success("删除成功");
          this.load();
        } else {
          this.$message.error("删除错误");
        }
      });
    },
    delBatch() {
      let ids = this.multipleSelection.map((v) => v.id);
      if (ids.length === 0) {
        this.$message.error("没有数据可以删除");
      } else {
        this.request.post("/role/delete/batch", ids).then((res) => {
          if (res) {
            this.$message.success("批量删除成功");
            this.load();
          } else {
            this.$message.error("批量删除失败");
          }
        });
      }
    },

    handleExcelImportSuccess() {
      this.$message.success("导入成功");
      this.load();
    },
    handleExcelImportError() {
      this.$message.error("上传错误");
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    handleSizeChange(pageSize) {
      console.log(`每页 ${pageSize} 条`);
      this.pageSize = pageSize;
      this.load();
    },
    handleCurrentChange(pageNum) {
      console.log(`当前页: ${pageNum}`);
      this.pageNum = pageNum;
      this.load();
    },
    selectMenu(roleId) {
      this.roleId = roleId;
      this.request.get("/role/roleMenuIfo/" + roleId).then((res) => {
        if (res.code === "200") {
          this.checks = res.data;
        }
      });
      //  请求菜单数据
      this.request
        .get("/menu/search", {
          params: {
            name: "",
          },
        })
        .then((res) => {
          console.log(res);
          this.menuData = res.data;
          this.expends = res.data.map((v) => v.id);
        });
      this.menuDialogVis = true;
    },
    saveRoleMenu() {
      this.request
        .post("/role/roleMenu/" + this.roleId, this.$refs.tree.getCheckedKeys())
        .then((res) => {
          if (res.code === "200") {
            this.$message.success("分配成功");
            this.menuDialogVis = false;
          } else {
            this.$message.error("分配失败");
          }
        });
    },
    save() {
      this.request.post("/role/addRole", this.form).then((res) => {
        if (res.code == "200") {
          this.$message.success("保存成功");
          this.dialogFormVisible = false;
          this.load();
        } else {
          this.$message.error("保存失败，" + res.msg);
        }
      });
    },
  },
};
</script>

<style>
.headerBg {
  background-color: rgb(232, 228, 228) !important;
}
</style>
