<script setup>
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
import { reactive } from 'vue';
import { useQuasar } from 'quasar'
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
    obj: new File([""], "")
})

function fileChanged(event) {
    event.target.files[0]
    file.obj = event.target.files[0]
    file.name = file.obj.name
}

function confirm() {
    $q.dialog({
        title: '確認',
        message: 'Excelファイルをアップロードし、製品を追加します。よろしいですか？',
        cancel: true,
        persistent: false
    }).onOk(() => {
        // console.log('>>>> OK')
    }).onOk(() => {
        // console.log('>>>> second OK catcher')
    }).onCancel(() => {
        // console.log('>>>> Cancel')
    }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
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
            <div class="btnCon">
                <div>
                    <button class="outline secondary">Excelファイル雛形のダウンロード</button>
                    <label class="btn btn-info">
                        <input id="upload_file" style="display:none;" type="file" accept=".xlsx" @change="fileChanged">
                        <a role="button">{{ file.name.length == 0 ? 'ファイルを選択' : file.name }}</a>
                    </label>
                </div>
                <div>
                    <button :disabled="file.name.length == 0" class="secondary" @click="confirm">インポート</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="sass" scoped>
.con
    padding: 50px
    border-radius: 10px
    box-shadow: rgba(0, 0, 0, 0.16) 0px 8px 24px 0px
    background-color: #fff

    >.btnCon
        display: flex
        justify-content: space-between
        align-content: center
        >div
            width: calc(50% - 20px)
            >*:last-child
                margin-bottom: 0
                a
                    display: block
                    opacity: 1
                    pointer-events: auto
</style>