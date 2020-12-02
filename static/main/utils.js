define(function () {
	// 执行漫游路径
	function execAction(actionArr, index) {
		bimSurfer.resetByConf(actionArr[index].conf, { camera: true })
		index++
		if (index !== actionArr.length) {
			setTimeout(() => {
				execAction(actionArr, index)
			}, actionArr[index - 1].conf.camera.duration * 1000)
		}
	}
	function cusEleUI(type, message, duration) {
		Vue.prototype.$message({
			type,
			message,
			duration: duration || 1500,
			center: true
		})
	}
	return {
		execAction,
		cusEleUI
	}
})
