<script setup>
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
import {reactive, onBeforeMount, computed, watch} from 'vue';
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
    fetch('/api/product-' + id).then((response) => {
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
const initialProduct = new Object
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

// types 数组
const types = reactive([])
// series 数组
const series = reactive([])
const seriesOfType = computed(() => {
    return series.filter(s => s.tid === product.tid)
})
// 观察 tid 变化时 重置 psid
watch(() => product.tid, (tid, oldtid) => {
    if (oldtid != 0) {
        product.psid = null
    }
})
// 能否做了任何编辑修改
const isAnyEdit = computed(() => {
    if (initialProduct.pname == product.pname && initialProduct.price == product.price && initialProduct.tid == product.tid && initialProduct.psid == product.psid && initialProduct.connection == product.connection && initialProduct.pinterface == product.pinterface && initialProduct.bass == product.bass && initialProduct.waterproof == product.waterproof && initialProduct.mic == product.mic && initialProduct.packageInfo == product.packageInfo && initialProduct.noise == product.noise) {
        return false
    } else {
        return true
    }
})
// 是否能够保存
const isSaveAble = computed(() => {
    if (!isAnyEdit.value) {
        return false
    } else if (product.pname.length == 0 || product.price.length == 0 || product.price <= 0 || product.tid == null || product.psid == null || product.connection.length == 0 || product.pinterface.length == 0 || product.waterproof.length == 0 || product.packageInfo.length == 0 || product.noise.length == 0) {
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

onBeforeRouteLeave((to, from) => {
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
async function postData() {
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
    let response = await fetch('/api/product/' + route.params.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    if (response.ok) {
        let json = await response.json();
        if (json.success) {
            modalData.auth = true
            router.push({name: 'product-list'})
        }
    }
}
</script>

<template>
    <div>
        <MainViewHeader v-bind="headerProps"></MainViewHeader>
        <div class="actionCon">
            <q-btn @click="$router.push({ name: 'product-list' })" color="grey" label="戻る"/>
            <!--            <q-btn @click="postData" :disable="!isSaveAble" color="primary" label="保存"/>-->
        </div>
        <div class="formCon">
            <q-form @submit="postData">
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
                </div>
                <div>
                    <q-btn label="リセット" type="reset" color="grey"/>
                    <q-btn label="保存" type="submit" color="primary" class="q-ml-sm"/>
                </div>
            </q-form>
        </div>
        <div class="formCon">
            <div>
                <label>製品ID</label>
                <input v-model.trim="product.pid" type="text" disabled>
            </div>
            <div>
                <label>名称</label>
                <input :aria-invalid="product.pname.length == 0 ? true : ''" v-model.trim="product.pname" type="text">
                <small v-if="product.pname.length == 0">入力必須です。</small>
            </div>
            <div>
                <label>単価（円）</label>
                <input :aria-invalid="product.price.length == 0 || product.price <= 0 ? true : ''"
                       v-model.trim="product.price" type="number">
                <small v-if="product.price.length == 0">入力必須です。</small>
                <small v-if="product.price.length != 0 && product.price <= 0">正しくありません。</small>
            </div>
            <div>
                <label>在庫数</label>
                <input v-model.trim="product.stock" type="number" disabled>
            </div>
            <div>
                <label>タイプ</label>
                <select v-model.trim="product.tid">
                    <option v-for="t in types" :value="t.value">{{ t.label }}</option>
                </select>
            </div>
            <div>
                <label>シリーズ</label>
                <select v-model.trim="product.psid">
                    <option v-for="s in seriesOfType" :value="s.value">{{ s.label }}</option>
                </select>
            </div>
            <div>
                <label>接続性</label>
                <input :aria-invalid="product.connection.length == 0 ? true : ''" v-model.trim="product.connection"
                       type="text">
                <small v-if="product.connection.length == 0">入力必須です。</small>
            </div>
            <div>
                <label>インターフェイス</label>
                <input :aria-invalid="product.pinterface.length == 0 ? true : ''" v-model.trim="product.pinterface"
                       type="text">
                <small v-if="product.pinterface.length == 0">入力必須です。</small>
            </div>
            <div>
                <label>重低音</label>
                <label><input v-model.trim="product.bass" value="あり" name="bass" type="radio">あり</label>
                <label><input v-model.trim="product.bass" value="なし" name="bass" type="radio">なし</label>
            </div>
            <div>
                <label>マイク通話</label>
                <label><input v-model.trim="product.mic" value="あり" name="mic" type="radio">あり</label>
                <label><input v-model.trim="product.mic" value="なし" name="mic" type="radio">なし</label>
            </div>
            <div>
                <label>ノイキャン</label>
                <label><input v-model.trim="product.noise" value="あり" name="noise" type="radio">あり</label>
                <label><input v-model.trim="product.noise" value="なし" name="noise" type="radio">なし</label>
            </div>
            <div>
                <label>防水</label>
                <input :aria-invalid="product.waterproof.length == 0 ? true : ''" v-model.trim="product.waterproof"
                       type="text">
                <small v-if="product.waterproof.length == 0">入力必須です。</small>
            </div>
            <div>
                <label>付属</label>
                <textarea :aria-invalid="product.packageInfo.length == 0 ? true : ''" v-model.trim="product.packageInfo"
                          maxlength="50" cols="20" rows="5"></textarea>
                <small v-if="product.packageInfo.length == 0">入力必須です。</small>
            </div>
        </div>
    </div>
</template>

<style lang="sass" scoped>
div.actionCon
    margin-bottom: 20px

    > button:last-of-type
        margin-left: 10px

div.formCon
    //display: flex
    //flex-wrap: wrap
    padding: 50px
    border-radius: 10px
    box-shadow: rgba(0, 0, 0, 0.16) 0 8px 24px 0
    background-color: #fff

    div.row
        > *
            padding-right: 20px
            margin-bottom: 10px

//> div
//    padding-right: 30px
//    min-width: 50%
//
//    > label
//        &:first-child
//            font-weight: 500
//
//        &:last-child
//            margin-bottom: 16px
</style>
