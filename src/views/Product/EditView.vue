<script setup>
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
import { reactive, onBeforeMount, computed, watch } from 'vue';
import { useRoute, onBeforeRouteLeave } from 'vue-router'
import CommonModal from '@/components/Common/CommonModal.vue';
import router from '../../../router';
const route = useRoute()

// 获取产品信息 和 系列类型信息
onBeforeMount(async () => {
    // 获取数据
    const id = route.params.id
    const productJson = await (await fetch('/api/product/' + id)).json()
    const productData = productJson.data
    const typeJson = await (await fetch('/api/product-type-list')).json()
    const typeData = typeJson.data
    const seriesJson = await (await fetch('/api/product-series-list')).json()
    const seriesData = seriesJson.data

    // types 赋值
    typeData.forEach(e => {
        types.push(e)
    });
    // series 赋值
    seriesData.forEach(e => {
        series.push(e)
    })

    // product 赋值
    Object.assign(initialProduct, productData)
    Object.assign(product, productData)
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
    return series.filter(s => String(s.tid) == product.tid)
})
// 观察 tid 变化时 重置 psid
watch(() => product.tid, (tid, oldtid) => {
    if (oldtid != 0) {
        product.psid = null
    }
})
// 能否做了任何编辑修改
const isAnyEdit = computed(() => {
    if (initialProduct.pname == product.pname && initialProduct.price == product.price && initialProduct.tid == product.tid && initialProduct.psid == product.psid && initialProduct.connection == product.connection && initialProduct.pinterface == product.pinterface && initialProduct.bass == product.bass && initialProduct.waterproof == product.waterproof && initialProduct.mic == product.mic && initialProduct.packageInfo == product.packageInfo) {
        return false
    } else {
        return true
    }
})
// 是否能够保存
const isSaveAble = computed(() => {
    if (!isAnyEdit.value) {
        return false
    } else if (product.pname.length == 0 || product.price.length == 0 || product.price <= 0 || product.tid == null || product.psid == null || product.connection.length == 0 || product.pinterface.length == 0 || product.waterproof.length == 0 || product.packageInfo.length == 0) {
        return false
    } else {
        return true
    }
})

// modal 参数
const modalProps = reactive({
    title: "確認",
    text: "この画面から離れます。入力中のデータは保存されません。<br>よろしいですか？",
    type: 2
})
// modal 绑定
const modalData = reactive({
    show: false,
    url: '',
    auth: false
})

onBeforeRouteLeave((to, from) => {
    if (!isAnyEdit.value || modalData.show || modalData.auth) {
        return true
    } else {
        modalData.show = true
        modalData.url = to.path
        return false
    }
})

function modalEvent(result) {
    if (result) {
        router.push(modalData.url)
    } else {
        modalData.show = false
    }

}

// 上传数据
// post 上传数据
async function postData() {
    const data = {
        pname: product.pname,
        price: product.price,
        tid: product.tid,
        psid: product.psid,
        connection: product.connection,
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
            router.push({ name: 'product-list' })
        }
    }
}
</script>
            
<template>
    <div>
        <CommonModal v-if="modalData.show" v-bind="modalProps" @modalEvent="modalEvent">
        </CommonModal>
        <MainViewHeader v-bind="headerProps"></MainViewHeader>
        <div class="btnCon">
            <button @click="$router.push({ name: 'product-list' })" class="secondary">戻る</button>
            <button @click="postData" :disabled="!isSaveAble">保存</button>
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
                    <option v-for="t in types" :value="t.tid">{{ t.tname }}</option>
                </select>
            </div>
            <div>
                <label>シリーズ</label>
                <select v-model.trim="product.psid">
                    <option v-for="s in seriesOfType" :value="s.psid">{{ s.psname }}</option>
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
div.btnCon
    >button
        width: auto
        display: inline-block
        &:last-of-type
            margin-left: 10px
div.formCon
    display: flex
    flex-wrap: wrap
    padding: 50px
    border-radius: 10px
    box-shadow: rgba(0, 0, 0, 0.16) 0px 8px 24px 0px
    background-color: #fff
    >div
        padding-right: 30px
        min-width: 50%
        >label
            &:first-child
                font-weight: 500
            &:last-child
                margin-bottom: 16px
small
    color: red
</style>
