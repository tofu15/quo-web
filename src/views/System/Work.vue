<script setup>
import { reactive, computed } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
import CommonModal from '@/components/Common/CommonModal.vue';
import router from '/router';
// header 参数
const headerProps = {
    title: '業務設定',
    urls: [
        {
            text: 'ホーム',
            isUrl: true,
            url: '/'
        },
        {
            text: ' / システム設定',
            isUrl: false,
            url: ''
        },
        {
            text: ' / 業務設定',
            isUrl: false,
            url: ''
        }
    ]
}

// modal 参数
const modalProps = {
    title: "確認",
    text: "この画面から離れます。入力中のデータは保存されません。<br>よろしいですか？",
    type: 2
}
// modal 绑定
const modalData = reactive({
    show: false,
    url: ''
})

function modalEvent(result) {
    if (result) {
        router.push(modalData.url)
    } else {
        modalData.show = false
    }
}

onBeforeRouteLeave((to, from) => {
    if (form.amountcheck === workData.amountcheck && form.expiry === workData.expiry) {
        return true
    } else {
        if (modalData.show) {
            return true
        } else {
            modalData.show = true
            modalData.url = to.path
            return false
        }
    }
})

// 表单数据绑定
const workData = {
    amountcheck: 10000,
    expiry: 180
}

const form = reactive({
    amountcheck: workData.amountcheck,
    expiry: workData.expiry
})

const amountcheckErr = computed(() => {
    if (form.amountcheck === "") {
        return true
    } else if (!Number.isInteger(form.amountcheck)) {
        return true
    } else if (form.amountcheck <= 0) {
        return true
    } else {
        return false
    }
})
const expiryErr = computed(() => {
    if (form.expiry === "") {
        return true
    } else if (!Number.isInteger(form.expiry)) {
        return true
    } else if (form.expiry <= 0) {
        return true
    } else {
        return false
    }
})

</script>
<template>
    <div>
        <CommonModal v-if="modalData.show" v-bind="modalProps" @modalEvent="modalEvent">
        </CommonModal>
        <MainViewHeader v-bind="headerProps"></MainViewHeader>
        <form>
            <label>承認金額（円）</label>
            <input :aria-invalid="form.amountcheck == workData.amountcheck ? '' : amountcheckErr"
                v-model="form.amountcheck" type="number" min="1">
            <small v-if="amountcheckErr">有効な数値ではなりません。</small>
            <label>見積有効期限（日）</label>
            <input :aria-invalid="form.expiry == workData.expiry ? '' : expiryErr" v-model="form.expiry" type="number"
                min="1">
            <small v-if="expiryErr">有効な数値ではなりません。</small>
            <button @click="form.amountcheck = workData.amountcheck; form.expiry = workData.expiry" class="secondary"
                type="button">リセット</button>
            <button
                :disabled="(form.expiry == workData.expiry && form.amountcheck == workData.amountcheck) ? true : (amountcheckErr || expiryErr)"
                type="button">保存</button>
        </form>
    </div>
</template>
<style lang="sass" scoped>
form
    max-width: 800px
    margin: 50px auto 0
    padding: 40px 50px
    border-radius: 15px
    box-shadow: rgba(0, 0, 0, 0.16) 0px 8px 24px 0px
    background-color: #fff
    label
        font-weight: 500
        .redText
            color: red
    small
            font-weight: 500
            color: red
</style>