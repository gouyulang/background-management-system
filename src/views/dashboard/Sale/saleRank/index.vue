<template>
    <div>
        <h3>门店销售额排名</h3>
        <ul>
            <li>
                <span class="index-1">1</span>
                <span>绝味鸭脖</span>
                <span class="number">423,456</span>
            </li>
            <li>
                <span class="index-2">2</span>
                <span>肯德基</span>
                <span class="number">383,416</span>
            </li>
            <li>
                <span class="index-3">3</span>
                <span>兰州拉面</span>
                <span class="number">243,006</span>
            </li>
            <li>
                <span class="right3">4</span>
                <span> 沙县小吃</span>
                <span class="number">223,783</span>
            </li>
            <li>
                <span class="right3"> 5</span>
                <span> 七星椒</span>
                <span class="number">193,796</span>
            </li>
            <li>
                <span class="right3"> 6</span>
                <span> 沃尔玛</span>
                <span class="number">143,562</span>
            </li>
            <li>
                <span class="right3"> 7</span>
                <span> 海底捞</span>
                <span class="number">123,456</span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'SaleRank',

};
</script>

<style scoped>
span {
    margin: 0px 10px;
}
ul {
    /* 去掉li前面的项目符号（小圆点） */
    list-style: none;
    widows: 100%;
    height: 300px;
    padding: 0px;
}
ul li {
    height: 8%;
    margin: 10px 0px;
}
.index-1 {
    float: left;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: rgb(254, 0, 0);
    color:white;
    text-align: center;
}
.index-2 {
    float: left;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: rgb(247, 69, 69);
    color:white;
    text-align: center;
}
.index-3 {
    float: left;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: rgb(253, 155, 155);
    color:white;
    text-align: center;
}
.right3 {
    padding-left: 5px;
}
.number {
    float: right;
}
</style>