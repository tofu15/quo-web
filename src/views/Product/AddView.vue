<script setup lang="ts">
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
import {computed, onBeforeMount, reactive, ref, watch} from 'vue';
import {onBeforeRouteLeave} from 'vue-router'
import {useQuasar} from 'quasar'
import router from '@/router';
import {Get, Post} from "@/script/api";

const $q = useQuasar()
const emit = defineEmits(['loaded'])

// 定义接口
interface Type {
    label: string
    value: number
}

interface Se {
    label: string
    value: number
    tid: number
}

interface Product {
    pname: string
    tid: null | number
    psid: null | number
    price: null | "" | number
    connection: string
    noise: "あり" | "なし" | ""
    bass: "あり" | "なし" | ""
    waterproof: string
    mic: "あり" | "なし" | ""
    packageInfo: string
    pinterface: string
}

// 获取产品信息 和 系列类型信息
onBeforeMount(async () => {
    // 获取类型信息
    await Get('/api/product-type-list-add').then((rsp) => {
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
    }).catch((error) => console.error(error))

    // 获取系列信息
    await Get('/api/product-series-list-add').then((rsp) => {
        if (rsp instanceof Error) {
            throw rsp
        } else if (!rsp.success) {
            throw new Error(rsp.message)
        } else {
            return rsp.data as { psname: string, psid: number, tid: number }[]
        }
    }).then((data) => {
        data.forEach(e => {
            series.push({
                label: e.psname,
                value: Number(e.psid),
                tid: Number(e.tid)
            })
        })
    }).catch((error) => console.error(error))
    emit('loaded')
})
// header 参数
const headerProps = {
    title: '新規製品',
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
            text: '新規製品',
            isUrl: false,
            url: ''
        }
    ]
}
// product 对象 绑定表单
const product: Product = reactive({
    pname: "",
    tid: null,
    psid: null,
    price: "",
    connection: "",
    noise: "",
    bass: "",
    waterproof: "",
    mic: "",
    packageInfo: "",
    pinterface: ""
})
// 空 product 对象
const initialProduct: Product = {
    pname: "",
    tid: null,
    psid: null,
    price: "",
    connection: "",
    noise: "",
    bass: "",
    waterproof: "",
    mic: "",
    packageInfo: "",
    pinterface: ""
}
// isLoading
const isLoading = ref(false)

// types 数组
const types: Type[] = reactive([])
// series 数组
const series: Se[] = reactive([])
const seriesOfType = computed(() => {
    return series.filter(s => s.tid === product.tid)
})
// 观察 tid 变化时 重置 psid
watch(() => product.tid, (tid, oldtid) => {
    if (oldtid !== null) {
        product.psid = null
    }
})
// 能否做了任何编辑修改
const isAnyEdit = computed(() => {
    if (product.pname.length === 0 && product.price === "" && product.tid === null && product.psid === null && product.connection.length === 0 && product.pinterface.length === 0 && product.bass.length === 0 && product.waterproof.length === 0 && product.mic.length === 0 && product.packageInfo.length === 0 && product.noise.length === 0) {
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
        pname: product.pname,
        price: product.price,
        psid: product.psid,
        connection: product.connection,
        noise: product.noise,
        pinterface: product.pinterface,
        bass: product.bass,
        mic: product.mic,
        waterproof: product.waterproof,
        packageInfo: product.packageInfo
    }
    isLoading.value = true
    Post('/api/product', data).then((rsp) => {
        if (rsp instanceof Error) {
            throw rsp
        } else if (!rsp.success) {
            throw new Error(rsp.message)
        } else {
            isLoading.value = false
            modalData.auth = true
            router.push({name: 'product-list'})
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
        <!--        <div class="btnCon">-->
        <!--            <button @click="postData" :disabled="!isSaveAble">保存</button>-->
        <!--        </div>-->
        <div class="formCon">
            <q-form greedy @reset="Object.assign(product, initialProduct)" @submit="postData">
                <div class="row">
                    <q-input :rules="[val => !!val || '入力必須です。']" v-model.trim="product.pname" label="名称"
                             class="col-sm-12 col-md-6" outlined/>
                    <q-input :rules="[val => !!val || '入力必須です。', val => val > 0 || '正しくありません。']"
                             v-model.trim="product.price" label="単価（円）" class="col-sm-12 col-md-6" outlined
                             type="number"/>
                    <q-select :rules="[val => !!val || '入力必須です。']" v-model="product.tid" :options="types"
                              label="タイプ" class="col-sm-12 col-md-6" outlined emit-value map-options/>
                    <q-select :rules="[val => !!val || '入力必須です。']" v-model="product.psid" :options="seriesOfType"
                              label="シリーズ" class="col-sm-12 col-md-6" outlined emit-value map-options/>
                    <q-input :rules="[val => !!val || '入力必須です。', val => val.length <=10 || '10文字まで。']"
                             v-model.trim="product.connection" label="接続性"
                             class="col-sm-12 col-md-6" outlined/>
                    <q-input :rules="[val => !!val || '入力必須です。', val => val.length <=50 || '50文字まで。']"
                             v-model.trim="product.pinterface" label="インターフェイス"
                             class="col-sm-12 col-md-6" outlined/>
                    <q-input :rules="[val => !!val || '入力必須です。', val => val.length <=5 || '5文字まで。']"
                             v-model.trim="product.waterproof" label="防水"
                             class="col-sm-12 col-md-6" outlined/>
                    <q-field class="col-sm-12 col-md-6" label="重低音" stack-label borderless
                             :rules="[() => !!product.bass || '入力必須です。']">
                        <template v-slot:control>
                            <q-radio size="30px" dense v-model="product.bass" val="あり" label="あり"/>
                            <q-radio size="30px" dense v-model="product.bass" val="なし" label="なし"/>
                        </template>
                    </q-field>
                    <q-field class="col-sm-12 col-md-6" label="マイク通話" stack-label borderless
                             :rules="[() => !!product.mic || '入力必須です。']">
                        <template v-slot:control>
                            <q-radio size="30px" dense v-model="product.mic" val="あり" label="あり"/>
                            <q-radio size="30px" dense v-model="product.mic" val="なし" label="なし"/>
                        </template>
                    </q-field>
                    <q-field class="col-sm-12 col-md-6" label="ノイキャン" stack-label borderless
                             :rules="[() => !!product.noise || '入力必須です。']">
                        <template v-slot:control>
                            <q-radio size="30px" dense v-model="product.noise" val="あり" label="あり"/>
                            <q-radio size="30px" dense v-model="product.noise" val="なし" label="なし"/>
                        </template>
                    </q-field>
                    <q-input
                        :rules="[val => !!val || '入力必須です。', val => val.length <=50 || '50文字まで。']"
                        label="付属"
                        class="col-sm-12 col-md-6"
                        v-model="product.packageInfo"
                        no-error-icon
                        counter
                        autogrow
                        outlined
                        type="textarea"
                    />
                </div>
                <div>
                    <q-btn label="リセット" type="reset" color="secondary"/>
                    <q-btn :loading="isLoading" label="保存" type="submit" color="primary"
                           class="q-ml-sm"/>
                </div>
            </q-form>
        </div>
    </div>
</template>

<style lang="sass" scoped>
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
