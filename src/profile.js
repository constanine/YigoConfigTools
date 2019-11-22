/** 实际上, 这个 js 文件是执行过程的一部分, 所以可以做很多事情 */
require (["app/_tools"], function(_tools) {
    var javaVer = java.lang.System.getProperty("java.version")+"";
    if (javaVer < "1.7"){
        _tools.pause("当前 Java 版本 ("+javaVer+") 小于 1.7, 无法运行 CMS 系统.", -80);
    }
});

/** 通常(如果完全按照 Yigo-redist 目录结构部署)不需要特别设置 */
profile.PROFILE_NAME     = "estore";      //Profile 的名称, 默认等于 PROFILE 目录的名称
// profile.PRODUCT_REPO     = ...;      //存放多个 product 的目录, 默认为 products
// profile.YIGOAPP_REPO     = ...;      //存放多个 Yigo 运行环境(Web app)的目录, 默认为 yigo-farm

/** 在实际使用中按照系统部署要求修改 */
// profile.JAVA_OPTS        = ...;      //Java运行参数选项, 默认值 -server -Xmx1024m -XX:MaxNewSize=256m -XX:MaxPermSize=256m -Djava.awt.headless=true
profile.TOMCAT_PORT_HTTP = 8089;     //Tomcat http 端口, 默认 8080
// profile.TOMCAT_PORT_HTTPS= 8443;     //Tomcat https 端口, 默认 8443

/** 通常在 profile.js 中设置就可以了, 一般不同开发/实施人员会使用相同的设置 */
//指定具体使用 PRODUCT_REPO 下面的哪个 product; 可以使用基于 PRODUCT_REPO 的相对路径
profile.PRODUCT      = "${PRODUCT_REPO}/../../product";
//指定具体使用 YIGOAPP_REPO 下面的哪个 yigo 环境; 可以使用基于 YIGOAPP_REPO 的相对路径
profile.YIGOAPP      = "base/1.6";

//配置文件列表, 第一项为主配置, 使用 ";" 分隔; 可以使用基于 PROFILE 的相对路径
profile.CONFIG_LIST  = '${PRODUCT}/configs/config-estore;${PRODUCT_REPO}/configs/tmpl-myscm/config-lib';

/** 部署扩展设置 */
//始终注册 yigo-configer 插件, 这样就可以强制使用系统默认的 map-contexteventinvoker-config.xml 等配置文件
profile.registerPlugin("${PRODUCT_REPO}/solutions/yigo-configer", {});
//引用 timer 服务
profile.registerPlugin("${PRODUCT_REPO}/solutions/timer-service");


//使用 CMS 2.0
profile.registerPlugin("${PRODUCT_REPO}/cms2-yigo1.6/cms2", {
	DefaultCmsBootConfigurer: {
		siteFolders: ["cms-site"],
		developMode: os.getProp("DEVELOP_MODE", false)
    }
});

//使用 cms2-yigo1.6-adapter
profile.registerPlugin("${PRODUCT_REPO}/cms2-yigo1.6/cms2-yigo1.6-adapter", {});

//使用 Yigo CMS Official Toolkit 01

//引入 cms 扩展代码
profile.registerPlugin("${PRODUCT}/modules/estore-cms-ext");

//FIXME: 解决 Yigo Java 自动编译无法处理资源文件的问题
profile.registerClasspath("${PRODUCT}/configs/config-estore/Module/SCM/Java/Source");

//使用 Yigo-farm 改变/Yigo路径为/workspace
profile.registerPlugin("${PRODUCT_REPO}/yigo-farm",{
	ctxPath:"/workspace"
});


//使用 Yigo CMS Official Toolkit 01
profile.registerPlugin("${PRODUCT_REPO}/cms2-yigo1.6/cms2-official-toolkit/ycot01",{
	BMap_WebAppKey: "xfdGyU7xKWnx8qVNRw4zXtA0",
	BMap_ServerAppKey: "tuakQsSbjuegC1NsPws4vKuz",
});

//集成支付宝
profile.registerPlugin("${PRODUCT}/modules/integration-alipay2.0", {
	appId: "2017080808093877",
	privateKey:"MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCHi1kb1iccFyD6lq7BoCORS0ozc1sRPdTSode1RlhMHY2wrKRZYx76of71xWH6okFim/V6p8MYD4Z+wm8EiPYD8+N/uN9YAC+UlZVzvE62v8ajlzum27i1yl4w4kEQknss3b9s+xQ/owKIBL1o6fTK+YDfnB8sXS4I3cfNqbRFB9XxiqjFTNbYoLuT9Yb1e5AP33tTHAvNR9FmjkkojtsJ9E3G5PeqwFgF7dqGJPr7DuSxgCn5+5d63Idfx0rXPAhE/2apCvlnDBrrQkNxDQAGEfH9pF/1Ga0FRoaAhMHQQB5gaHSNMoOpnrdUhqbdf2vQ/pouL7rnZxcj2sRJ3PRlAgMBAAECggEAPdTLaW9fl+jVGnrybVFn6De4OZA90reqBgveIstcLByvLhETR9N3pk2PyP2pnHO38AvFB5bP4IH0kI6Rpjf0QglXlkP3XmV3TwiNjKYyIhuJucabZ5qDwCn4ncQYej7YAbeGQ2il7AGoffPrk5hmGtGGgHrvnYVEIrdJFgB8Q6CKDdp1zi+dahFsCPwFJGkj7Edibgd29dCgH16WutQVG9GbSCIyQgxsygxAjQPSPMRNq1eWozM3n+x0EVsEusU1rSJtug/73OBZ/qeqpdAuFxVGs1XAYx7iKwKZPulyS3YjMkABY+Ka/8UN5LTKiaCcQScrCMj14DqnikbWjyFKYQKBgQDjqtfw518vxsjuoCaSozFzIPgpyww/r0w1qBff0sV3ERJAA9we2p24kuEs6KuCac3aR9eP1PoltedDl8Rn8NMhyCeN5e5uayTRW2pWC1Rv6285MayXHJdPOEcSv6/tys1O9jnw1JTblokr+2e42XS32H9dbr1bd/fr+y4L5C8tMwKBgQCYaZi5TMpGDayXOXoGeKqh6/+C8fPxIfWqinqbQzKukvW43szipCq3XtT2SYT8bs8Y8ErwpDOzx8zhs73rRsdLlGhdsLQXg0zR9k+63OTaBr2YLvyd0VKS4BHX5LRYzw1vgXIY0kVLtesF9Jos2P6HBFGlbC4V648pePm2OPJoBwKBgGpMDyzManX9Iz2/CqN2jJULdLLWue5WI4f95r+7QjU4hEPdSX4iZneSJI56R/HJArMCzhO6xdyrlMHLb4l0OK/SKx2mmG93mSYiv4BTI+Zpj3Gtzr5zO/Zh+VU4qKSnBrryXdUi/CmWnI8rf58f8M4RyE3QcZruZZQJn9MvhBNfAoGAVGe2Yng6VM1h1WXJRCgzJvURTa080T9jU4zZFX8DZFaSqk0I3kLYPTDRc4uHkFy1aDQ67EWjNF7kAeKOvOs3l42atrgTJCpcsrJbuTp3qp6tBMiQsb2ooxpgB1Xq4nvYDvZ6/3ADXEhk3al2cHvDiXZE2P2uEAmiAO+0KswiwqUCgYBvL9lThJBF/jktxRZsYK04bxlrFbWwecmPerJL2LOrsPlp77w71/5vXwYqSXoD+nc9U9KrWxZ/Kes3XjJ8isf/LmyDiqvLDUy1KTpOZIGJZrybzvP/H5rPKUsb9m7BMIEaIIPgtaF8EiuM1y+akuxsDlTP6QLr0vTJ3yap21o3UQ==",
	aliPayPublicKey:"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0OL7TidowWi65l7AGrv0+tLMcjo2PflB6BrITG2FanByvKt1O2QA5pBLn0qIv9tD5V0kDPMOQhs9dBysFP8uI6U5d8mLPNqa20pj1FCRppGhcBvPuq3Nd4tRLE3lblrPqelOaQd4SmJ6jD/Fq5vQCtbXWrd+aCQYWEgJW68Hv1sazVIaYrb5fuxH8XS/v/LguMKY+hs3UGkMGScxpUxaNPhoxNTQ7ZZlSvPGbxPICETOHYIovHchZMiQE48ar+WKtFuzh16iFJrTwFTw5QJist0OZpQpKU1+Csh72203B9IbW19oXkt2yia0aM+eeP7b+uacf0GQvuX4CbCEBM27OQIDAQAB",
	returnUrl:"http://www.nxsx365.com/alipay/directpay/return.action",
	notifyUrl:"http://www.nxsx365.com/alipay/directpay/notify.action"
});

//集成微信支付
profile.registerPlugin("${PRODUCT}/modules/integration-weixinpay2.0", {	
	create_ip:"42.63.14.245",	
	needCert:true,
	app:{
		certPath:"${PRODUCT}/modules/web-app/apiclient_cert.p12",
		certPasswd:"1510829061",
		key: "Freshmall365163comfreshmall36516",
		appId: "wx87eac48c8be8c5ee",
		mch_Id:"1510829061",
		notifyUrl:"http://www.nxsx365.com/pay/weixin/notify.action"
	},
	jsapi:{
		certPath:"${PRODUCT}/modules/jsapi/apiclient_cert.p12",
		certPasswd:"1509980531",
		key:"Freshmall365163comfreshmall36516",
		appId:"wxa7f39591799446d6",
		mch_Id:"1509980531",
		notifyUrl:"http://www.nxsx365.com/pay/weixin/notifyJSAPI.action",
	}	
});

//集成银联接口
//通过如下语句构造连接到服务器的 SSH 隧道:
//ssh -v -nNT -R 20297:localhost:80 vmware@dev.bokesoft.com -p 20298 -o ControlPath=/tmp/ssh_host_remote_reverse_tunnel
profile.registerPlugin("${PRODUCT}/modules/integration-chinaums", {
	netpay_paymentSite: "http://payment-test.chinapay.com",
	netpay_callbackSite: "http://dev.bokesoft.com:20297",
	netpay_merId: "808080052990248",
	netpay_UPOP_merId: "808080052990252",
	acp_merId: "777290058110097",
	acp_paymentSite: "https://101.231.204.80:5000/gateway/api/frontTransReq.do",
	acp_callbackSite: "http://app.carceo.com:7001/Yigo",
	acp_signCert_pwd: "000000",
	acp_signCert_type: "PKCS12",
	eas_easSite: "http://210.22.91.77:8004",
	eas_easChannelSite: "http://210.22.91.77:8404/channel/Business/EasMerchant/",
	eas_callbackSite: "http://dev.bokesoft.com:20298",
	eas_merId: "10001000003608",
	eas_Ver: "100",
	eas_ChannelId: "101",
	eas_sftp_ip: "210.22.91.77",
	eas_sftp_username: os.getProp("EAS_SFTP_PWD", "eas_test"),
	eas_sftp_pwd: os.getProp("EAS_SFTP_PWD", "eas_test"),
	eas_sftp_port: "222",
	eas_sftp_path: "USER_PIC"
});

//使用 SearchSOA
profile.registerPlugin("${PRODUCT_REPO}/yigo-searchsoa-elasticsearch", {
	globalNode: false,
	defaultOperator: "OR",
	chineseAnalysis: {ik: true}
});


//使用 nginx plugin
profile.registerPlugin("${PRODUCT_REPO}/../infrastructure/nginx", {
	confFile: "modules/nginx-web/conf/nginx.conf",
	solution: "modules/nginx-web",
	vars: {
		HTTP_PORT: os.getProp("NGINX_HTTP_PORT", "8001"),
	}
});

//使用 yigoCAD plugin
profile.registerPlugin("${PRODUCT_REPO}/YigoCAD", {
	jpdaPort: 9999,
	devClasspath: [
	       	    "${PRODUCT_REPO}/cms/sdk/dist/*",
	    	    "${PRODUCT_REPO}/cms/sdk/spring-libs/*",
	    	    "${PRODUCT_REPO}/cms/sdk/utils-libs/*"
	]
});


/** 环境变量-平台主网站的地址 */
env.ESTORE_MAIN_SITE=os.getProp("ESTORE_MAIN_SITE", "http://www.nxsx365.com");

/** 通常会被启动脚本(bat 或者 sh)文件中的环境变量覆盖 */
profile.JDBC_URL="jdbc:mysql://localhost:3306/estore?useUnicode=true&characterEncoding=UTF-8";
profile.DB_USERNAME="root";
profile.DB_PASSWORD="123456";

/** 调试设置 */
profile.JAVA_OPTS = "-server -Xmx800m -XX:MaxNewSize=128m -XX:MaxPermSize=128m -Djava.awt.headless=true";
profile.JAVA_OPTS += " -Xdebug -Xnoagent -Xrunjdwp:transport=dt_socket,address=27777,server=y,suspend=n"

//引入IM
//profile.registerPlugin("${PRODUCT_REPO}/../services/bokesoft.com/messager/server");
/** 环境变量-IM服务器的地址(用于服务端连接) */
//env.IM_SERVER_ADDR=os.getProp("IM_SERVER_ADDR", "http://localhost:7778/boke-messager");

//测试设置环境变量
var ENV_STR = os.getProp("ENV_STR", "STR");
env.ENV_STR = ENV_STR;

//#商户端加签解密用，与cmbcTest.cer配对
var MERCHANTPRIVATEKEY = os.getProp("MERCHANTPRIVATEKEY",os.normalizePath("../product/modules/certificate/dianshang.sm2"));
env.MERCHANTPRIVATEKEY = MERCHANTPRIVATEKEY;
//#银行端（商户自测加解密用该秘钥加密）加密验签用，与cmbcTest.sm2配对
var MERCHANTPUBLICKEY = os.getProp("MERCHANTPUBLICKEY",os.normalizePath("../product/modules/certificate/dianshang.cer"));
env.MERCHANTPUBLICKEY = MERCHANTPUBLICKEY;
//#cmbc
//#银行端加签解密用
var BANKPRIVATEKEY = os.getProp("BANKPRIVATEKEY",os.normalizePath("../product/modules/certificate/cmbc.sm2"));
env.BANKPRIVATEKEY = BANKPRIVATEKEY;
//#商户端（商户联调加密使用该秘钥）加密验签用
var BANKPUBLICKEY = os.getProp("BANKPUBLICKEY",os.normalizePath("../product/modules/certificate/cmbc.cer"));
env.BANKPUBLICKEY = BANKPUBLICKEY;


//引入 xssprotect
//profile.registerJavaOpts("-Djavax.xml.parsers.DocumentBuilderFactory=com.sun.org.apache.xerces.internal.jaxp.DocumentBuilderFactoryImpl");
//profile.registerClasspath("${PRODUCT}/modules/xssprotected/dist/jars/*.jar");
//profile.registerClasspath("${PRODUCT}/modules/xssprotected/dist/libs/*.jar");