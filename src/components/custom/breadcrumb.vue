<template>
    <!-- 1 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{level1}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{level2}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
    name: "my-bread",
    data() {
        return {};
    },

    //  props 值采用字符串数组
    //  props 中值的用法同data数据用法一样
    //  props 中数组的值，来源于使用本组件时传入的值
    //  props 中的数组也是该组件的属性<child-a :msg="abc">
    props: ["level1", "level2"]
};
</script>

<style>
</style>