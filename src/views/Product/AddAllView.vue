<script setup>
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
import {reactive} from 'vue';
import {useQuasar} from 'quasar'
import router from '../../../router';

const $q = useQuasar()

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

const file = reactive({
    name: '',
    obj: new File([""], ""),
    isLoading: false
})

function fileChanged(event) {
    file.obj = event.target.files[0]
    file.name = file.obj.name
}

// modal 绑定
const modalData = reactive({
    url: '',
    auth: false
})

function template() {
    fetch('/api/products/template').then((response) => {
        if (!response.ok) {
            throw new Error("HTTP status " + response.status)
        }
        return response.blob()
    }).then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const fileLink = document.createElement('a');
        fileLink.href = url;
        fileLink.download = '製品一括インポートテンプレート.xlsx'
        document.body.appendChild(fileLink)
        fileLink.click()
        fileLink.remove()
    }).catch((error) => {
        $q.dialog({
            title: 'エラー',
            message: error.toString(),
            cancel: false,
            persistent: false
        })
    })
}

function confirm() {
    const formData = new FormData()
    formData.append('file', file.obj)

    $q.dialog({
        title: '確認',
        message: 'Excelファイルをアップロードし、製品を追加します。よろしいですか？',
        cancel: true,
        persistent: false
    }).onOk(() => {
        file.isLoading = true
        fetch('/api/products', {
            method: 'POST',
            body: formData
        }).then((response) => {
            if (!response.ok) {
                throw new Error("HTTP status " + response.status);
            }
            return response.json()
        }).then((json) => {
            if (json.success) {
                file.isLoading = false
                modalData.auth = true
                router.push('/system/user')
            } else {
                throw new Error(json.message);
            }
        }).catch((error) => {
            file.isLoading = false
            $q.dialog({
                title: 'エラー',
                message: error.toString(),
                cancel: false,
                persistent: false
            })
        })
    })
}
</script>

<template>
    <div>
        <MainViewHeader v-bind="headerProps"></MainViewHeader>
        <div class="con">
            <p>
                下記の雛形をご参照のうえ、インポート用に整形されたExcelファイルをご用意ください。
            </p>
            <div class="flex1">
                <q-btn @click="template" class="item" color="secondary" label="Excelファイル雛形のダウンロード"/>
            </div>
            <div class="flex2">
                <label class="item">
                    <input id="upload_file" style="display:none;" type="file" accept=".xlsx" @change="fileChanged">
                    <q-btn style="width: 100%" no-caps type="a" color="primary"
                           :label="file.name.length === 0 ? 'ファイルを選択' : file.name"/>
                </label>
                <q-btn @click="confirm" :disable="file.name.length === 0" class="item" color="grey"
                       label="インポート"/>
            </div>
        </div>
    </div>
</template>

<style lang="sass" scoped>
.con
    padding: 50px
    border-radius: 10px
    box-shadow: rgba(0, 0, 0, 0.16) 0 8px 24px 0
    background-color: #fff

.flex1
    display: flex
    flex-direction: row
    flex-wrap: wrap
    justify-content: start
    align-items: center
    align-content: center
    padding: 10px

.flex2
    display: flex
    flex-direction: row
    flex-wrap: wrap
    justify-content: start
    align-items: center
    align-content: stretch
    gap: 20px 50px
    padding: 10px


.item
    flex: 0 1 270px
    width: 270px
    max-width: 270px


div.file

    margin-bottom: 20px

    > button
        margin-right: 15px
//> .btnCon
//    display: flex
//    justify-content: space-between
//    align-content: center
//
//    > div
//        width: calc(50% - 20px)
//
//        > *:last-child
//            margin-bottom: 0
//
//            a
//                display: block
//                opacity: 1
//                pointer-events: auto
</style>