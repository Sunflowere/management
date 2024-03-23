<template>
  <div>
    <div style="margin: 10px 0">
      <el-input
        style="width: 200px"
        placeholder="请输入用水部门id"
        suffix-icon="el-icon-search"
        v-model="department_id"
      ></el-input>
      <el-input
        style="width: 200px"
        placeholder="请输入用水系统"
        suffix-icon="el-icon-mic"
        v-model="system_W"
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
      <el-upload
        action="http://localhost:9090/wconsumption/import"
        :show-file-list="false"
        accept="xlsx"
        :on-success="handleExcelImportSuccess"
        :on-error="handleExcelImportError"
        style="display: inline-block"
      >
        <el-button type="primary" class="ml-5"
          >导入 <i class="el-icon-bottom"></i
        ></el-button>
      </el-upload>
      <el-button type="primary" class="ml-5" @click="exp"
        >导出 <i class="el-icon-top"></i
      ></el-button>
    </div>
    <el-table
      :data="tableData"
      border
      stripe
      :header-cell-class-name="headerBg"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="id" label="ID" width="40"></el-table-column>
      <el-table-column
        prop="department_id"
        label="用水部门id"
        width="85"
      ></el-table-column>
      <el-table-column
        prop="system_W"
        label="用水系统"
        width="140"
      ></el-table-column>
      <el-table-column
        prop="calculation"
        label="计量(单位m³)"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="date_time"
        label="统计日期"
        width="150"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
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

    <el-dialog title="数据报表" :visible.sync="dialogFormVisible" width="25%">
      <el-form :model="form" label-width="100px" size="small">
        <el-form-item label="用水部门id">
          <el-input
            v-model="form.department_id"
            autocomplete="off"
            placeholder="必填项"
          ></el-input>
        </el-form-item>
        <el-form-item label="用水系统">
          <el-select clearable v-model="form.system_W" placeholder="请选择系统">
            <el-option
              v-for="item in system_Ws"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计量(m³)">
          <el-input
            v-model="form.calculation"
            autocomplete="off"
            placeholder="必填项"
          ></el-input>
        </el-form-item>
        <el-form-item label="统计日期">
          <el-input v-model="form.date_time" autocomplete="off"></el-input>
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
  name: "Ewconsumption",
  data() {
    return {
      form: {},
      tableData: [],
      multipleSelection: [],
      total: 0,
      pageNum: 1,
      pageSize: 20,
      department_id: "",
      system_W: "",
      system_Ws: [
        {
          value: "选项1",
          label: "生活用水",
        },
        {
          value: "选项2",
          label: "暖通空调系统补水",
        },
        {
          value: "选项3",
          label: "绿化用水",
        },
        {
          value: "选项4",
          label: "特殊区域用水",
        },
      ],
      headerBg: "headerBg",
      dialogFormVisible: false,
    };
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      //请求分页查询数据
      this.request
        .get("/wconsumption/page", {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            department_id: this.department_id,
            system_W: this.system_W,
          },
        })
        .then((res) => {
          console.log(res);
          this.tableData = res.records;
          this.total = res.total;
        });
    },
    reset() {
      this.department_id = "";
      this.system_W = "";
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
      this.request.delete("/wconsumption/" + id).then((res) => {
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
        this.request.post("/wconsumption/delete/batch", ids).then((res) => {
          if (res) {
            this.$message.success("批量删除成功");
            this.load();
          } else {
            this.$message.error("批量删除失败");
          }
        });
      }
    },
    exp() {
      window.open("http://localhost:9090/wconsumption/export");
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
      var tmp_form = JSON.stringify(this.form);
      if (
        tmp_form === "{}" ||
        this.form.department_id === "" ||
        this.form.department_id === null ||
        this.form.department_id === undefined ||
        this.form.calculation === "" ||
        this.form.calculation === null ||
        this.form.calculation === undefined
      ) {
        this.$message.error("保存失败，请检查数据必填项等数据");
      } else {
        this.request
          .post("/wconsumption/addWconsumption", this.form)
          .then((res) => {
            if (res.code === "200") {
              this.$message.success("保存成功");
              this.dialogFormVisible = false;
              this.load();
            } else {
              this.$message.error("保存失败");
            }
          });
      }
    },
  },
};
</script>

<style>
.headerBg {
  background-color: rgb(232, 228, 228) !important;
}
</style>
