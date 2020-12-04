var treeObj, allNodes
define([], function () {
	// 目录树初始化设置
	var zTreeSetting = {
		check: {
			enable: true,
			chkStyle: "checkbox" //显示 checkbox 选择框，默认checkbox可选择值radio
		},
		callback: {
			onCheck: zTreeOnCheck,
			onClick: zTreeOnClick
		},
		// 是否可编辑节点
		edit: {
			enable: false,
			drag: {
				isCopy: false,
				isMove: true
			}
		},
		// 是否显示节点之间的连线
		view: {
			showLine: false
		}
	}
	// 初始化目录树
	function initZTree() {
		if (treeData.flag) {
			console.time("加载目录树用时")
			treeObj = $.fn.zTree.init($("#regionZTree"), zTreeSetting, [treeData.data])
			console.timeEnd("加载目录树用时")
			allNodes = treeObj.getNodes()
			// 勾选所有节点
			treeObj.checkAllNodes(true)
		} else {
			// 循环获取treeData直到有值
			setTimeout(() => {
				initZTree()
			}, 300)
		}
	}
	// 节点选中事件
	function zTreeOnCheck(event, treeId, treeNode) {
		console.log(treeNode)
		var selIdsArr = []
		let selNodes = treeObj.getCheckedNodes()
		// 将叶子节点的id存在一个数组中
		selNodes.filter(i => {
			if (!i.children) {
				selIdsArr.push(`${lastRevisionId}:${i.id}`)
			}
		})
		try {
			// 先隐藏所有构件
			bimSurfer.hideAll()
			bimSurfer.setVisibility({
				ids: selIdsArr,
				visible: true
			})
		} catch (e) {}
	}
	// 根据节点数据的属性搜索，获取条件完全匹配的节点数据 JSON 对象集合
	function getNodesByParamFuzzy(val) {
		// 模糊匹配查询
		let searchList = treeObj.getNodesByParamFuzzy("name", val, null)
		return searchList
	}
	// 通过ID查找zTree节点
	function getNodeByID(id) {
		return treeObj.getNodesByParam("id", id, null)
	}
	// 目录树选择节点并移到可视区域事件
	function selTreeNode(nodes) {
		treeObj.selectNode(nodes, false, false)
	}
	// 点击树事件
	function zTreeOnClick(event, treeId, treeNode) {
		// 只处理叶子节点
		if (!treeNode.children) {
			let curItem = [`${lastRevisionId}:${treeNode.id}`]
			try {
				bimSurfer.viewFit({
					ids: curItem,
					animate: true // 设置是否有动画效果
				})
				bimSurfer.setSelection({
					ids: curItem,
					clear: true,
					selected: true
				})
			} catch (e) {}
		}
	}
	// 获取当前选择节点并返回bimsurfer节点
	function getBimSelectedNodes() {
		let selIdsArr =[]
		let selNodes = treeObj.getCheckedNodes()
		selNodes.filter(i => {
			if (!i.children) {
				selIdsArr.push(`${lastRevisionId}:${i.id}`)
			}
		})
		return selIdsArr
	}
	return {
		initZTree,
		getNodesByParamFuzzy,
		selTreeNode,
		getNodeByID,
		getBimSelectedNodes
	}
})
