// function load2Local(filename, text) {
// 	var pom = document.createElement("a")
// 	pom.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text))
// 	pom.setAttribute("download", filename)
// 	if (document.createEvent) {
// 		var event = document.createEvent("MouseEvents")
// 		event.initEvent("click", true, true)
// 		pom.dispatchEvent(event)
// 	} else {
// 		pom.click()
// 	}
// }

function load2Local(fileName,data) {
	const blob = new Blob([data], { type: "text/plain" })
	//const blob = new Blob([data], {type: 'audio/wav'})
	const a = document.createElement("a")
	a.href = URL.createObjectURL(blob)
	a.download = fileName // 保存的文件名
	a.click()
	URL.revokeObjectURL(a.href)
	a.remove()
}
