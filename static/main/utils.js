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
	function cusMessage(type, message, duration) {
		Vue.prototype.$message({
			type,
			message,
			duration: duration || 1500,
			center: true
		})
	}
	// 下载JSON到本地方法
	function load2Local(fileName, data) {
		const blob = new Blob([data], { type: "text/plain" })
		//const blob = new Blob([data], {type: 'audio/wav'})
		const a = document.createElement("a")
		a.href = URL.createObjectURL(blob)
		a.download = fileName // 保存的文件名
		a.click()
		URL.revokeObjectURL(a.href)
		a.remove()
	}
	function waitToken(token) {
		return new Promise((resolve, reject) => {
			if (token) {
				resolve()
			} else {
				setTimeout(() => {
					waitToken(token)
				}, 500)
			}
		})
	}
	return {
		execAction,
		cusMessage,
		load2Local,
		waitToken
	}
})
