<script setup>

const props = defineProps({
    data: Array,
    action: Array
})
// 声明触发的事件
const emit = defineEmits(['return', 'edit']);
</script>
    
<template>
    <div class="actionCon">
        <button v-if="props.action.includes('return')" class="secondary">戻る</button>
        <button v-if="props.action.includes('edit')">編集</button>
    </div>
    <div class="partCon" v-for="part in props.data">
        <h3>{{ part.name }}</h3>
        <div class="fieldCon">
            <p v-for="field in part.data">{{ field.name + '：' + field.data }}</p>
        </div>
    </div>
</template>
    
<style lang="sass" scoped>
div.actionCon
    >button
        width: auto
        display: inline-block
        &:last-of-type
            margin-left: 10px

div.partCon
    padding: 20px 0
    border-radius: 10px
    box-shadow: rgba(0, 0, 0, 0.16) 0px 8px 24px 0px
    background-color: #fff
    &:not(:last-child)
        margin-bottom: 20px
    h3
        padding: 0 20px
        padding-bottom: 20px
        margin-bottom: 20px
        border-bottom: 1px solid rgb(239, 239, 245)
    >div.fieldCon
        padding: 0 20px
        display: flex
        flex-wrap: wrap
        >p
            min-width: 50%
</style>
