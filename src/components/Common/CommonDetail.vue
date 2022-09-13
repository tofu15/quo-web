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
        <q-btn v-if="props.action.includes('return')" @click="$emit('return')" color="grey"
               label="戻る"/>
        <q-btn v-if="props.action.includes('edit')" @click="$emit('edit', $route.params.id)" color="primary"
               label="編集"/>
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
    margin-bottom: 20px
    > button:last-of-type
        margin-left: 10px

div.partCon
    padding: 20px 0
    border-radius: 10px
    box-shadow: rgba(0, 0, 0, 0.16) 0px 8px 24px 0px
    background-color: #fff

    &:not(:last-child)
        margin-bottom: 20px

    h3
        padding: 0 30px 20px
        margin-bottom: 20px
        border-bottom: 1px solid rgb(239, 239, 245)

    > div.fieldCon
        padding: 0 30px
        display: flex
        flex-wrap: wrap

        > p
            min-width: 50%
</style>
