<template>
  <el-menu
    :default-openeds="['1', '3']"
    style="min-height: 100%; overflow: hidden"
    background-color="rgb(48,65,86)"
    text-color="#fff"
    active-text-color="#00FF00"
    :collapse-transition="false"
    :collapse="isCollapse"
    router
  >
    <div style="height: 60px; line-height: 60px; text-align: center">
      <img
        src="../../public/logo2.jpg"
        alt="logo"
        style="width: 30px; position: relative; top: 5px; margin-right: 5px"
      />
      <b style="color: blanchedalmond" v-show="logoTextShow"> 企业能耗管理</b>
    </div>
    <el-menu-item index="/">
      <template slot="title">
        <i class="el-icon-house"></i>
        <span slot="title">主页</span>
      </template>
    </el-menu-item>
    <el-submenu index="3">
      <template slot="title">
        <i class="el-icon-office-building"></i>
        <span slot="title">企业管理</span>
      </template>
      <el-menu-item index="/">
        <i class="el-icon-data-line"></i>
        <span slot="title">企业概览</span>
      </el-menu-item>
      <el-menu-item index="/analysis">
        <i class="el-icon-pie-chart"></i>
        <span slot="title">能耗分析</span>
      </el-menu-item>
      <el-menu-item index="/device">
        <i class="el-icon-mouse"></i>
        <span slot="title">设备管理</span>
      </el-menu-item>
      <el-menu-item index="/department">
        <i class="el-icon-school"></i>
        <span slot="title">部门管理</span>
      </el-menu-item>
      <el-menu-item index="/file">
        <i class="el-icon-warning-outline"></i>
        <span slot="title">能耗预警</span>
      </el-menu-item>
      <el-menu-item index="/file">
        <i class="el-icon-odometer"></i>
        <span slot="title">风险评估</span>
      </el-menu-item>
      <el-submenu index="4">       
        <span slot="title"><i class="el-icon-notebook-1"></i>数据报表</span>
        <el-menu-item index="/econsumption">
          <i class="el-icon-s-opportunity"></i>
          <span slot="title">用电数据</span>
        </el-menu-item>
        <el-menu-item index="/file">
          <i class="el-icon-goblet-square-full"></i>
          <span slot="title">用水数据</span>
        </el-menu-item>
        <el-menu-item index="/file">
          <i class="el-icon-partly-cloudy"></i>
          <span slot="title">用气数据</span>
        </el-menu-item>
      </el-submenu>
    </el-submenu>
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-s-platform"></i>
        <span slot="title">系统管理</span>
      </template>
      <el-menu-item index="/user">
        <i class="el-icon-user"></i>
        <span slot="title">用户管理</span>
      </el-menu-item>
      <el-menu-item index="/role">
        <i class="el-icon-s-custom"></i>
        <span slot="title">角色管理</span>
      </el-menu-item>
      <el-menu-item index="/menu">
        <i class="el-icon-menu"></i>
        <span slot="title">菜单管理</span>
      </el-menu-item>
      <el-menu-item index="/file">
        <i class="el-icon-document"></i>
        <span slot="title">文件管理</span>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: "Aside",
  props: {
    isCollapse: Boolean,
    logoTextShow: Boolean,
  },
  methods: {
    // handleSelect(index) {
    //   console.log(index)
    //   console.log(this.$router.options.routes)
    // }
  },
};
</script>

<style scoped></style>
