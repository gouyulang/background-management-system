<template>
    <div>
        <Card></Card>
        <Sale></Sale>
        <Observe></Observe>
    </div>
</template>

<script>
import Card from './Card/index';
import Sale from './Sale/index';
import Observe from './Observe/index';
export default {
    name: 'Dashboard',
    components:{
        Card,
        Sale,
        Observe
    },
    mounted(){
        // 派发action
        this.$store.dispatch('getData');
    }

};
</script>

<style lang="scss" scoped>
</style>