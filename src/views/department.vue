<template>
    <div>
      <div style="margin: 10px 0;">
        <el-input style="width: 200px;" size="medium" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="name"></el-input>
        <el-input style="width: 200px; padding-left: 10px;" size="medium" placeholder="请输入地址" suffix-icon="el-icon-place" v-model="address"></el-input>
        <el-button class="ml-5" size="medium" type="primary" @click="load">搜索</el-button>
        <el-button type="warning" size="medium" @click="reset">重置</el-button>
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
        <el-table-column prop="id" label="ID" width="40"></el-table-column>
        <el-table-column prop="name" label="名称" width="200"></el-table-column>
        <el-table-column prop="address" label="地址" width="650"></el-table-column>
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
  
      <el-dialog title="部门信息" :visible.sync="dialogFormVisible" width="25%">
        <el-form :model="form" label-width="80px" size="small">
          <el-form-item label="部门名称">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="部门地址">
            <el-input v-model="form.address" autocomplete="off"></el-input>
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
    name: 'Department',
    data() {
      return {
        form: {},
        tableData: [],
        multipleSelection: [],
        total: 0,
        pageNum: 1,
        pageSize: 10,
        name: '',
        address: '',
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
        this.request.get("/department/page", {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            name: this.name,
            address: this.address
          }
        }).then(res => {
          console.log(res)
          this.tableData = res.records
          this.total = res.total
        })
      },
      reset() {
        this.name = ''
        this.address = ''
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
        this.request.delete("/department/" + id).then(res => {
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
          this.request.post("/department/delete/batch", ids).then(res => {
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
        this.request.post("/department/addDepartment", this.form).then(res => {
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