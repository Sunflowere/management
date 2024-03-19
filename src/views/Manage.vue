<template>
  <el-container style="min-height: 100vh;">
    <el-aside :width="sideWidth + 'px'"
      style="background-color: rgb(238, 241, 246); box-shadow: 2px 0px 6px rgb(0, 21, 31, 40%);">
      <Aside :isCollapse="isCollapse" :logoTextShow="logoTextShow"></Aside>
    </el-aside>

    <el-container>
      <el-header style=" border-bottom: 1px solid #a19898;">
        <Header :collapseBtnClass="collapseBtnClass" @ListenChild="ListenedChild"></Header>
      </el-header>

      <el-main>
        <router-view></router-view>

      </el-main>
    </el-container>
  </el-container>
</template>

<script>

import Aside from '@/components/Aside.vue'
import Header from '@/components/Header.vue'

// @ is an alias to /src

export default {
  name: 'Home',
  data() {
    return {
      collapseBtnClass: 'el-icon-s-fold',
      isCollapse: false,
      sideWidth: 220,
      logoTextShow: true,
    }
  },
  components: {
    Aside,
    Header
  },
  methods: {
    ListenedChild(data) {
      console.log("子组件传递过来的值：" , data);
      if (data != null) {
        this.collapse()
      }
    },
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
  }
}
</script>

