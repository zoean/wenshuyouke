<template>
  <div style="padding:30px;">
    <h2>私海</h2>
    <el-alert :closable="false" type="success">
      <router-view />
    </el-alert>
  </div>
</template>
