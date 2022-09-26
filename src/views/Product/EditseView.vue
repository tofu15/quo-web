<script setup lang="ts">
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
import {computed, onBeforeMount, reactive, ref} from 'vue';
import {onBeforeRouteLeave, useRoute} from 'vue-router'
import router from '../../router';
import {useQuasar} from 'quasar'
import {Get, Put} from "@/script/api";

const route = useRoute()
const emit = defineEmits(['loaded'])
const $q = useQuasar()

// 定义接口
interface Type {
    label: string
    value: number
}

interface Se {
    psid: null | number
    psname: string
    tid: null | number
    notes: string
}

// 获取产品信息 和 系列类型信息
onBeforeMount(async () => {
    // 获取数据
    const id = route.params.id
    // 获取类型信息
    await Get('/api/product-type-list-series-edit').then((rsp) => {
        if (rsp instanceof Error) {
            throw rsp
        } else if (!rsp.success) {
            throw new Error(rsp.message)
        } else {
            return rsp.data as { tname: string, tid: number }[]
        }
    }).then((data) => {
        data.forEach(e => {
            types.push({
                label: e.tname,
                value: Number(e.tid)
            })
        })
    }).catch((error) => console.log(error))

    // 获取系列信息
    await Get('/api/product-series/' + id).then((rsp) => {
        if (rsp instanceof Error) {
            throw rsp
        } else if (!rsp.success) {
            throw new Error(rsp.message)
        } else {
            return rsp.data as Se
        }
    }).then((data) => {
        Object.assign(initialSe, data)
        Object.assign(se, data)
    }).catch((error) => console.log(error))

    emit('loaded')
})
// header 参数
const headerProps = {
    title: 'シリーズ編集',
    urls: [
        {
            text: 'ホーム',
            isUrl: true,
            url: '/'
        },
        {
            text: ' / 製品管理 / ',
            isUrl: false,
            url: ''
        },
        {
            text: 'シリーズ一覧',
            isUrl: true,
            url: '/product/listse'
        },
        {
            text: ' / シリーズ編集',
            isUrl: false,
            url: ''
        }
    ]
}
// 原始 se 对象
const initialSe: Se = {
    psid: null,
    psname: "",
    tid: null,
    notes: ""
}
// se 对象 绑定表单
const se: Se = reactive({
    psid: null,
    psname: "",
    tid: null,
    notes: ""
})
// isLoading
const isLoading = ref(false)

// types 数组
const types: Type[] = reactive([])

// 是否做了任何编辑修改
const isAnyEdit = computed(() => {
    if (initialSe.psname === se.psname && initialSe.tid === se.tid && initialSe.notes === se.notes) {
        return false
    } else {
        return true
    }
})

// modal 绑定
const modalData = reactive({
    url: '',
    auth: false
})

onBeforeRouteLeave((to) => {
    if (!isAnyEdit.value || modalData.auth) {
        return true
    } else {
        modalData.url = to.path
        $q.dialog({
            title: '確認',
            message: 'この画面から離れます。入力中のデータは保存されません。よろしいですか？',
            cancel: true,
            persistent: false
        }).onOk(() => {
            modalData.auth = true
            router.push(modalData.url)
        })
        return false
    }
})

// post 上传数据
function postData() {
    const data = {
        psname: se.psname,
        tid: se.tid,
        notes: se.notes
    }
    isLoading.value = true
    Put('/api/product-series/' + route.params.id, data).then((rsp) => {
        if (rsp instanceof Error) {
            throw rsp
        } else if (!rsp.success) {
            throw new Error(rsp.message)
        } else {
            isLoading.value = false
            modalData.auth = true
            router.push({name: 'product-listse'})
        }
    }).catch((error) => {
        isLoading.value = false
        $q.dialog({
            title: 'エラー',
            message: error.toString(),
            cancel: false,
            persistent: false
        })
    })
}
</script>

<template>
    <div>
        <MainViewHeader v-bind="headerProps"></MainViewHeader>
        <div class="actionCon">
            <q-btn @click="$router.push({ name: 'product-listse' })" color="grey" label="戻る"/>
        </div>
        <div class="formCon">
            <q-form greedy @reset="Object.assign(se, initialSe)" @submit="postData">
                <div class="row">
                    <q-input v-model.trim="se.psid" label="シリーズ番号" class="col-sm-12 col-md-6" readonly outlined/>
                    <q-input :rules="[val => !!val || '入力必須です。']" v-model.trim="se.psname" label="シリーズ名"
                             class="col-sm-12 col-md-6" outlined/>
                    <q-select :rules="[val => !!val || '入力必須です。']" v-model="se.tid" :options="types"
                              label="タイプ" class="col-sm-12 col-md-6" outlined emit-value map-options/>
                    <q-input
                        :rules="[val => !!val || '入力必須です。', val => val.length <=10 || '10文字まで。']"
                        label="付属"
                        class="col-sm-12 col-md-6"
                        v-model="se.notes"
                        no-error-icon
                        counter
                        autogrow
                        outlined
                        type="textarea"
                    />
                </div>
                <div>
                    <q-btn label="リセット" type="reset" color="secondary"/>
                    <q-btn :loading="isLoading" label="保存" :disable="!isAnyEdit" type="submit" color="primary"
                           class="q-ml-sm"/>
                </div>
            </q-form>
        </div>
    </div>
</template>

<style lang="sass" scoped>
div.actionCon
    margin-bottom: 20px

    > button:not(:first-of-type):last-of-type
        margin-left: 10px

div.formCon
    padding: 50px
    border-radius: 10px
    box-shadow: rgba(0, 0, 0, 0.16) 0 8px 24px 0
    background-color: #fff

    div.row
        > *
            padding-right: 20px
            margin-bottom: 10px
</style>
