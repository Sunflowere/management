<template>
  <el-container style="min-height: 100vh;">
    <el-aside :width="sideWidth + 'px'"
      style="background-color: rgb(238, 241, 246); box-shadow: 2px 0px 6px rgb(0, 21, 31, 40%);">
      <el-menu :default-openeds="['1', '3']" style="min-height: 100%; overflow: hidden;" background-color="rgb(48,65,86)"
        text-color="#fff" active-text-color="#00FF00" :collapse-transition="false" :collapse="isCollapse">
        <div style="height: 60px; line-height: 60px; text-align: center;">
          <img src="../assets/logo.png" alt="logo" style="width: 20px; position: relative; top: 5px; margin-right: 5px;">
          <b style="color: blanchedalmond;" v-show="logoTextShow">后台管理系统</b>
        </div>
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-message"></i>
            <span slot="title">导航一</span>
          </template>
          <el-menu-item-group title="分组2">
            <el-menu-item index="1-3">选项3</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="1-4">
            <template slot="title">选项4</template>
            <el-menu-item index="1-4-1">选项4-1</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title"><i class="el-icon-menu"></i>
            <span slot="title">导航二</span>
          </template>
          <el-submenu index="2-4">
            <template slot="title">选项4</template>
            <el-menu-item index="2-4-1">选项4-1</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title"><i class="el-icon-setting"></i>
            <span slot="title">导航三</span>
          </template>
          <el-submenu index="3-4">
            <template slot="title">选项4</template>
            <el-menu-item index="3-4-1">选项4-1</el-menu-item>
          </el-submenu>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="font-size: 12px; border-bottom: 1px solid #ccc; line-height: 60px; display: flex;">
        <div style="flex: 1; font-size: 20px;">
          <span :class="collapseBtnClass" style="cursor: pointer" @click="collapse"></span>
        </div>
        <el-dropdown style="width: 70px; cursor: pointer;">
          <span>王小虎</span><i class="el-icon-arrow-down" style="margin-left: 5px;"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>个人信息</el-dropdown-item>
            <el-dropdown-item>退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

      </el-header>

      <el-main>
        <div>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div style="margin: 10px 0;">
          <el-input style="width: 200px;" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="username"></el-input>
          <el-input style="width: 200px;" placeholder="请输入邮箱" suffix-icon="el-icon-message"></el-input>
          <el-input style="width: 200px;" placeholder="请输入地址" suffix-icon="el-icon-position" v-model="address"></el-input>
          <el-button class="ml-5" type="primary" @click="load">搜索</el-button>
        </div>
        <div style="margin: 10px 0;">
          <el-button type="primary">新增 <i class="el-icon-circle-plus-outline"></i></el-button>
          <el-button type="danger">批量删除 <i class="el-icon-remove-outline"></i></el-button>
          <el-button type="primary">导入 <i class="el-icon-bottom"></i></el-button>
          <el-button type="primary">导出 <i class="el-icon-top"></i></el-button>
        </div>
        <el-table :data="tableData" border stripe :header-cell-class-name="headerBg">
          <el-table-column prop="id" label="ID" width="50"></el-table-column>
          <el-table-column prop="username" label="姓名" width="120"></el-table-column>
          <el-table-column prop="nickname" label="昵称" width="120"></el-table-column>
          <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
          <el-table-column prop="phone" label="电话" width="150"></el-table-column>
          <el-table-column prop="address" label="地址" width="220"></el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <el-button type="primary">编辑<i class="el-icon-edit"></i></el-button>
              <el-button type="danger">删除<i class="el-icon-remove-outline"></i></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="padding: 10px 0;">
          <el-pagination 
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum" 
          :page-sizes="[5, 10, 15, 20]" 
          :page-size="pageSize" 
          layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

// @ is an alias to /src

export default {
  name: 'HomeView',
  data() {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      username: '',
      address: '',
      collapseBtnClass: 'el-icon-s-fold',
      isCollapse: false,
      sideWidth: 200,
      logoTextShow: true,
      headerBg: 'headerBg'
    }
  },
  created() {
    this.load()
  },
  methods: {
    collapse() {
      this.isCollapse = !this.isCollapse
      this.logoTextShow = !this.logoTextShow
      if (this.isCollapse) {
        this.sideWidth = 64
        this.collapseBtnClass = 'el-icon-s-unfold'

      } else {
        this.sideWidth = 200
        this.collapseBtnClass = 'el-icon-s-fold'

      }
    },
    load() {
    //请求分页查询数据
    fetch("http://localhost:9090/user/page?pageNum="+this.pageNum+"&pageSize="+this.pageSize+"&username="+this.username + "&address=" + this.address).then(res => res.json()).then(res => {
      console.log(res)
      this.tableData = res.pageData
      this.total = res.totalNum
    })
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
    }


  }
}
</script>

<style>
.headerBg {
  background-color: rgb(232, 228, 228) !important;
}
</style>