<script setup>
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
import { reactive, onBeforeMount, computed, watch } from 'vue';
import { onBeforeRouteLeave } from 'vue-router'
import CommonModal from '@/components/Common/CommonModal.vue';
import router from '../../../router';

const headerProps = {
    title: '新規製品一括インポート',
    urls: [
        {
            text: 'ホーム',
            isUrl: true,
            url: '/home'
        },
        {
            text: ' / 製品管理 / ',
            isUrl: false,
            url: ''
        },
        {
            text: '新規製品一括インポート',
            isUrl: false,
            url: ''
        }
    ]
}
</script>

<template>
    <div>
        <MainViewHeader v-bind="headerProps"></MainViewHeader>
    </div>
</template>

<style lang="sass" scoped></style>