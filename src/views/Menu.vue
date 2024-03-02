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
      row-key="id"
      default-expand-all
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="name" label="名称" width="120"></el-table-column>
      <el-table-column prop="path" label="路径" width="200"></el-table-column>
      <el-table-column label="图标" width="120">
        <template slot-scope="scope">
          <i style="font-size: 23px;" :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="handleAdd(scope.row.id)"
            v-if="!scope.row.pid"
            >新增子菜单<i class="el-icon-plus"></i
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

    <el-dialog title="菜单信息" :visible.sync="dialogFormVisible" width="25%">
      <el-form :model="form" label-width="60px" size="small">
        <el-form-item label="名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="form.path" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标" >
          <el-select v-model="form.icon" clearable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.name"
              :label="item.name"
              :value="item.value"
            >
            <i :class="item.value"></i> {{ item.name }}
            </el-option>
          </el-select>
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
  </div>
</template>

<script>
export default {
  name: "Menu",
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
      options: []
    };
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      //请求分页查询数据
      this.request
        .get("/menu/search", {
          params: {
            name: this.name,
          },
        })
        .then((res) => {
          console.log(res);
          this.tableData = res.data;
        });
    },
    reset() {
      this.name = "";
      this.load();
    },
    handleAdd(pid) {
      this.dialogFormVisible = true;
      this.form = {};
      if (pid) {
        this.form.pid = pid;
      }
    },
    handleEdit(row) {
      this.form = row;
      this.dialogFormVisible = true;

      this.request.get("/menu/icons").then((res) => {
        this.options = res.data
      });
    },
    del(id) {
      this.request.delete("/menu/" + id).then((res) => {
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
        this.request.post("/menu/delete/batch", ids).then((res) => {
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
    save() {
      this.request.post("/menu/addMenu", this.form).then((res) => {
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
