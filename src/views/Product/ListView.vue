<script setup>
import { reactive, computed } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
import CommonTable from '@/components/Common/CommonTable.vue';
import CommonModal from '@/components/Common/CommonModal.vue';
import router from '/router';
// header 参数
const headerProps = {
    title: '製品一覧',
    urls: [
        {
            text: 'ホーム',
            isUrl: true,
            url: '/'
        },
        {
            text: ' / 製品管理',
            isUrl: false,
            url: ''
        },
        {
            text: ' / 製品一覧',
            isUrl: false,
            url: ''
        }
    ]
}
</script>
<template>
    <div>
        <MainViewHeader v-bind="headerProps"></MainViewHeader>
        <CommonTable></CommonTable>
    </div>
</template>
<style lang="sass" scoped>
</style>