<script setup lang="ts">
import CommonDetail from '@/components/Common/CommonDetail.vue';
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
import {useRoute} from 'vue-router'
import {inject, onBeforeMount, reactive} from 'vue';
import {Get} from "@/script/api";
import type {UserPermission} from "@/script/interface"
import {DefaultUserPermission} from "@/script/interface"

const Permission = inject<UserPermission>('Permission', DefaultUserPermission)
const route = useRoute()
const emit = defineEmits(['loaded'])
// header 参数
const headerProps = {
    title: '顧客詳細情報',
    urls: [
        {
            text: 'ホーム',
            isUrl: true,
            url: '/home'
        },
        {
            text: ' / 顧客管理 / ',
            isUrl: false,
            url: ''
        },
        {
            text: '顧客一覧',
            isUrl: true,
            url: '/product/list'
        },
        {
            text: ' / 顧客詳細情報',
            isUrl: false,
            url: ''
        }
    ]
}

interface Cus {
    cid: number
    cname: string
    ctype: string
    address: string
    email: string
    zip: string
    tel: string
    fax: string
    contact: string
    ename: string
    csource: string
    ftime: string
}

interface DetailProps {
    data: Array<DetailPropsData>
    action: Array<String>
}

interface DetailPropsData {
    name: string
    data: Array<DetailPropsDataOfData>
}

interface DetailPropsDataOfData {
    name: string
    data: string | number
}

// 调用后端接口 获取信息 修改 detailProps
onBeforeMount(async () => {
    const id = route.params.id
    await Get('/api/customer/' + id).then((rsp) => {
        if (rsp instanceof Error) {
            throw rsp
        } else if (!rsp.success) {
            throw new Error(rsp.message)
        } else {
            return rsp.data as Cus
        }
    }).then((data) => {
        detailProps.data[0].data.push({
            name: '顧客ID',
            data: data.cid
        })
        detailProps.data[0].data.push({
            name: '顧客タイプ',
            data: data.ctype
        })
        detailProps.data[0].data.push({
            name: '会社名',
            data: data.cname
        })
        detailProps.data[0].data.push({
            name: 'アドレス',
            data: data.address
        })
        detailProps.data[0].data.push({
            name: '郵便番号',
            data: data.zip
        })
        detailProps.data[0].data.push({
            name: '担当者',
            data: data.contact
        })
        detailProps.data[0].data.push({
            name: 'メールアドレス',
            data: data.email
        })
        detailProps.data[0].data.push({
            name: 'ファックス',
            data: data.fax
        })
        detailProps.data[0].data.push({
            name: 'ソース',
            data: data.csource
        })
        detailProps.data[0].data.push({
            name: '作成者',
            data: data.ename
        })
        detailProps.data[0].data.push({
            name: 'フォロー日付',
            data: data.ftime
        })
    }).catch((error) => console.log(error))

    if (Permission.CustomerEdit) {
        detailProps.action.push('edit')
    }

    emit('loaded')
})
// 详细信息参数
const detailProps: DetailProps = reactive({
    data: [
        {
            name: '基本情報',
            data: []
        }
    ],
    action: [
        'return'
    ]
})
</script>

<template>
    <div>
        <MainViewHeader v-bind="headerProps"></MainViewHeader>
        <CommonDetail @return="$router.push({ name: 'customer-list' })"
                      @edit="(id) => $router.push({ name: 'customer-edit', params: { id: id } })" v-bind="detailProps">
        </CommonDetail>
    </div>
</template>

<style lang="sass" scoped>
</style>
