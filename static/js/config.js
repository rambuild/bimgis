var projectName = 'b'; // address地址下的BIMserver服务中必须有test1项目，而且还要有模型
var address = "http://localhost:6666"; // 这三个是在安装BIMserver时配置的地址、账户和密码
// var address = "http://106.55.157.112:8050";
var account = "276822603@qq.com";
var password = "qwer1236";
var token, poid, lastRevisionId; // 这三个是在模型加载时需要用到的
var metadata; // 这是右侧元数据