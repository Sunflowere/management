<template>
  <div>
    <div style="margin: 10px 0;">
      <el-input style="width: 200px;" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="name"></el-input>
      <el-input style="width: 200px;" placeholder="请输入型号" suffix-icon="el-icon-view" v-model="model"></el-input>
      <el-input style="width: 200px;" placeholder="请输入所属部门id" suffix-icon="el-icon-loading" v-model="did"></el-input>
      <el-input style="width: 200px;" placeholder="请输入状态" suffix-icon="el-icon-loading" v-model="status"></el-input>
      <el-button class="ml-5" type="primary" @click="load">搜索</el-button>
      <el-button type="warning" @click="reset">重置</el-button>
    </div>
    <div style="margin: 10px 0;">
      <el-button type="primary" @click="handleAdd">新增 <i class="el-icon-circle-plus-outline"></i></el-button>
      <el-popconfirm class="ml-5" confirm-button-text='确认' cancel-button-text='我再想想' icon="el-icon-info" icon-color="red"
        title="您确定删除吗？" @confirm="delBatch">
        <el-button slot="reference" type="danger">批量删除 <i class="el-icon-remove-outline"></i></el-button>
      </el-popconfirm>
    </div>
    <el-table :data="tableData" border stripe :header-cell-class-name="headerBg"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="name" label="名称" width="140"></el-table-column>
      <el-table-column prop="model" label="型号" width="120"></el-table-column>
      <el-table-column prop="did" label="所属部门" width="160"></el-table-column>
      <el-table-column prop="status" label="状态" width="200"></el-table-column>
      <el-table-column prop="errorCount" label="异常次数" width="100"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleEdit(scope.row)">编辑<i class="el-icon-edit"></i></el-button>

          <el-popconfirm class="ml-5" confirm-button-text='确认' cancel-button-text='我再想想' icon="el-icon-info"
            icon-color="red" title="您确定删除吗？" @confirm="del(scope.row.id)">
            <el-button slot="reference" type="danger">删除<i class="el-icon-remove-outline"></i></el-button>
          </el-popconfirm>

        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 10px 0;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
        :page-sizes="[5, 10, 15, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

    <el-dialog title="设备信息" :visible.sync="dialogFormVisible" width="25%">
      <el-form :model="form" label-width="80px" size="small">
        <el-form-item label="设备名">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="状态">
          <el-select clearable v-model="form.role" placeholder="请选择角色">
            <el-option v-for="item in roles" :key="item.name" :label="item.name" :value="item.flag"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="型号">
          <el-input v-model="form.model" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属部门">
          <el-input v-model="form.did" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-input v-model="form.status" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否用电">
          <el-input v-model="form.isEdevice" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否用水">
          <el-input v-model="form.isWdevice" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否用气">
          <el-input v-model="form.isGdevice" autocomplete="off"></el-input>
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
  name: 'Device',
  data() {
    return {
      form: {},
      tableData: [],
      multipleSelection: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      name: '',
      model: '',
      did: '',
      status: '',
      headerBg: 'headerBg',
      dialogFormVisible: false
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      //请求分页查询数据
      this.request.get("/device/page", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          name: this.name,
          model: this.model,
          did: this.did,
          status: this.status
        }
      }).then(res => {
        console.log(res)
        this.tableData = res.records
        this.total = res.total
      })
    },
    reset() {
      this.name = ''
      this.model = ''
      this.did = ''
      this.status = ''
      this.load()
    },
    handleAdd() {
      this.dialogFormVisible = true
      this.form = {}
    },
    handleEdit(row) {
      this.form = row
      this.dialogFormVisible = true
    },
    del(id) {
      this.request.delete("/device/" + id).then(res => {
        if (res) {
          this.$message.success("删除成功");
          this.load();
        } else {
          this.$message.error("删除错误");
        }
      })
    },
    delBatch() {
      let ids = this.multipleSelection.map(v => v.id)
      if (ids.length === 0) {
        this.$message.error("没有数据可以删除")
      } else {
        this.request.post("/device/delete/batch", ids).then(res => {
          if (res) {
            this.$message.success("批量删除成功")
            this.load()
          } else {
            this.$message.error("批量删除失败")
          }
        })
      }
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    handleSizeChange(pageSize) {
      console.log(`每页 ${pageSize} 条`);
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum) {
      console.log(`当前页: ${pageNum}`);
      this.pageNum = pageNum
      this.load()
    },
    save() {
      this.request.post("/device/addDevice", this.form).then(res => {
        if (res.code === '200') {
          this.$message.success("保存成功")
          this.dialogFormVisible = false
          this.load()
        } else {
          this.$message.error("保存失败")
        }
      })
    }
  }
}
</script>

<style>
.headerBg {
  background-color: rgb(232, 228, 228) !important;
}
</style>