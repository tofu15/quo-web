<script setup>
import CommonDetail from '@/components/Common/CommonDetail.vue';
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
import {useRoute} from 'vue-router'
import {reactive, onBeforeMount} from 'vue';

const route = useRoute()
// header 参数
const headerProps = {
    title: '製品詳細情報',
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
            text: '製品一覧',
            isUrl: true,
            url: '/product/list'
        },
        {
            text: ' / 製品詳細情報',
            isUrl: false,
            url: ''
        }
    ]
}

// 调用后端接口 获取信息 修改 detailProps
onBeforeMount(() => {
    const id = route.params.id
    fetch('/api/product/' + id).then((response) => {
        if (!response.ok) {
            throw new Error("HTTP status " + response.status);
        }
        return response.json()
    }).then((json) => {
        if (json.success) {
            return json.data
        } else {
            throw new Error(json.message);
        }
    }).then((data) => {
        // 基本情報
        detailProps.data[0].data.push({
            name: 'ID',
            data: data.pid
        })
        detailProps.data[0].data.push({
            name: '名称',
            data: data.pname
        })
        detailProps.data[0].data.push({
            name: 'タイプ',
            data: data.tname
        })
        detailProps.data[0].data.push({
            name: 'シリーズ',
            data: data.psname
        })
        detailProps.data[0].data.push({
            name: '単価（円）',
            data: data.price.toFixed(2)
        })
        detailProps.data[0].data.push({
            name: '在庫数',
            data: data.stock
        })
        // 詳細情報
        detailProps.data[1].data.push({
            name: '接続性',
            data: data.connection
        })
        detailProps.data[1].data.push({
            name: 'インターフェイス',
            data: data.pinterface
        })
        detailProps.data[1].data.push({
            name: 'ノイキャン',
            data: data.noise
        })
        detailProps.data[1].data.push({
            name: '重低音',
            data: data.bass
        })
        detailProps.data[1].data.push({
            name: '防水',
            data: data.waterproof
        })
        detailProps.data[1].data.push({
            name: 'マイク通話',
            data: data.mic
        })
        detailProps.data[1].data.push({
            name: '付属',
            data: data.packageInfo
        })
    }).catch((error) => console.error(error))
})
// 详细信息参数
const detailProps = reactive({
    data: [
        {
            name: '基本情報',
            data: []
        },
        {
            name: '詳細情報',
            data: []
        }
    ],
    action: [
        'return',
        'edit'
    ]
})
</script>

<template>
    <div>
        <MainViewHeader v-bind="headerProps"></MainViewHeader>
        <CommonDetail @return="$router.push({ name: 'product-list' })"
                      @edit="(id) => $router.push({ name: 'product-edit', params: { id: id } })" v-bind="detailProps">
        </CommonDetail>
    </div>
</template>

<style lang="sass" scoped>
</style>
