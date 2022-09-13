<script setup>
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
import {ref, reactive, onBeforeMount, computed, watch} from 'vue';
import {useRoute, onBeforeRouteLeave} from 'vue-router'
import {useQuasar} from 'quasar'
import router from '../../../router';

const route = useRoute()
const $q = useQuasar()

// 页面加载前获取信息
onBeforeMount(() => {
    // 取得ID
    const id = route.params.id

    // 获取类型信息
    fetch('/api/product-type-list-edit').then((response) => {
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
        data.forEach(e => {
            types.push({
                label: e.tname,
                value: Number(e.tid)
            })
        })
    }).catch((error) => console.error(error))

    // 获取系列信息
    fetch('/api/product-series-list-edit').then((response) => {
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
        data.forEach(e => {
            series.push({
                label: e.psname,
                value: Number(e.psid),
                tid: Number(e.tid)
            })
        })
    }).catch((error) => console.error(error))

    // 获取产品信息
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
        Object.assign(initialProduct, data)
        Object.assign(product, data)
    }).catch((error) => console.error(error))
})
// header 参数
const headerProps = {
    title: '製品情報編集',
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
            text: ' / 製品情報編集',
            isUrl: false,
            url: ''
        }
    ]
}
// 原始 product 对象
const initialProduct = {}
// product 对象 绑定表单
const product = reactive({
    pid: 0,
    pname: "",
    tid: 0,
    tname: "",
    psid: 0,
    psname: "",
    price: 0,
    stock: 0,
    connection: "",
    noise: "",
    bass: "",
    waterproof: "",
    mic: "",
    packageInfo: "",
    pinterface: ""
})
// isLoading
const isLoading = ref(false)

// types 数组
const types = reactive([])
// series 数组
const series = reactive([])
const seriesOfType = computed(() => {
    return series.filter(s => s.tid === product.tid)
})
// 观察 tid 变化时 重置 psid
watch(() => product.tid, (tid, oldtid) => {
    if (oldtid !== 0) {
        product.psid = null
    }
})
// 能否做了任何编辑修改
const isAnyEdit = computed(() => {
    if (initialProduct.pname === product.pname && initialProduct.price === product.price && initialProduct.tid === product.tid && initialProduct.psid === product.psid && initialProduct.connection === product.connection && initialProduct.pinterface === product.pinterface && initialProduct.bass === product.bass && initialProduct.waterproof === product.waterproof && initialProduct.mic === product.mic && initialProduct.packageInfo === product.packageInfo && initialProduct.noise === product.noise) {
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

// 上传数据
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
    fetch('/api/product/' + route.params.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then((response) => {
        if (!response.ok) {
            throw new Error("HTTP status " + response.status);
        }
        return response.json()
    }).then((json) => {
        if (json.success) {
            modalData.auth = true
            router.push({name: 'product-list'})
        } else {
            throw new Error(json.message);
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
            <q-btn @click="$router.push({ name: 'product-list' })" color="grey" label="戻る"/>
        </div>
        <div class="formCon">
            <q-form greedy @reset="Object.assign(product, initialProduct)" @submit="postData">
                <div class="row">
                    <q-input v-model.trim="product.pid" label="製品ID" class="col-sm-12 col-md-6" readonly outlined/>
                    <q-input :rules="[val => !!val || '入力必須です。']" v-model.trim="product.pname" label="名称"
                             class="col-sm-12 col-md-6" outlined/>
                    <q-input :rules="[val => !!val || '入力必須です。', val => val > 0 || '正しくありません。']"
                             v-model.trim="product.price" label="単価（円）" class="col-sm-12 col-md-6" outlined
                             type="number"/>
                    <q-input v-model.trim="product.stock" label="在庫数" class="col-sm-12 col-md-6" outlined
                             type="number" readonly/>
                    <q-select :rules="[val => !!val || '入力必須です。']" v-model="product.tid" :options="types"
                              label="タイプ" class="col-sm-12 col-md-6" outlined emit-value map-options/>
                    <q-select :rules="[val => !!val || '入力必須です。']" v-model="product.psid" :options="seriesOfType"
                              label="シリーズ" class="col-sm-12 col-md-6" outlined emit-value map-options/>
                    <q-input :rules="[val => !!val || '入力必須です。']" v-model.trim="product.connection" label="接続性"
                             class="col-sm-12 col-md-6" outlined/>
                    <q-input :rules="[val => !!val || '入力必須です。']" v-model.trim="product.pinterface" label="インターフェイス"
                             class="col-sm-12 col-md-6" outlined/>
                    <q-input :rules="[val => !!val || '入力必須です。']" v-model.trim="product.waterproof" label="防水"
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
