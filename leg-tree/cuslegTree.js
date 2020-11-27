var arrs = []
// var arrs = [1, 2, 3, 48, 5, 6, 7, 8, 9, 10]

/*
生成tree的位置 data为tree数据、arrs为选中的id可为空
arrs可填可不填 填写需为数组
data数据中的只有name、id、checked、open、ico、children
    其中open为是否展开	
*/


// 根据ids显示模型
$('#legTreeBox #showSelected').click(() => {
    let selectedArrs = leg.getCheckedNodes().map(i => {
        return `${lastRevisionId}:` + i
    })
    console.log(selectedArrs.length)
    bimSurfer.setVisibility({
        ids: selectedArrs,
        visible: true,
    })
})

// 根据ids隐藏模型
$('#legTreeBox #hideSelected').click(() => {
    let selectedArrs = leg.getCheckedNodes().map(i => {
        return `${lastRevisionId}:` + i
    })
    console.log(selectedArrs.length)
    bimSurfer.setVisibility({
        ids: selectedArrs,
        visible: false,
    })
})
$("#demo").on("click", () => {
    alert(leg.getCheckedNodes())//选中
    console.log(leg.getHalfSelected())//半选
    console.log(leg.getAll());//全选及半选
})
// setTimeout(() => {
//     leg.tree({
//         ele: ".legTree",//选者
//         data: treeData,//数据
//         arrs: arrs,//选中的id
//         cascade: true,//级联
//         //			onAsync:true//暂无此
//     });
//     console.log(treeData)
// }, 3000)


// leg.synTree({
//     ele: ".legTree1",
//     url: "./tree.json",
//     dataStyle: (res) => {//修改后台返回的数据格式
//         return res.list;
//     },
//     getData: (id, name) => {//返回的id和标题
//         console.log(id + "======" + name)
//     }
// });