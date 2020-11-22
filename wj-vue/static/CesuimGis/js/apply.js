//展示经纬度
showLangLat()

//得到立方体
getCube(110.0, 27.0, 0,Cesium.Color.RED.withAlpha(1))
getCube(111.0, 27.0, 300000.0,'./img/timg2.jpg')

//设置相机
// setCamera()

//放置多边形
getPolygon()

//设置图片
getPic(170,1,1000000,1000000,Cesium.Color.RED.withAlpha(0.4))
getPic(158,12,300000,100000,Cesium.Color.RED.withAlpha(0.5))

//设置线
getPolyline()

//设置标签
addLabel(170,1,"敌军基地")

//纹理
wenli()

//得到流动多边形
getFlowPolygon()

//轨迹数据
var data = [75,39,0,
            125,10,2500000,
            170,1,0]

            var data3 = [20,11,0,
                145,10,2500000,
                160,1,0]

var data2 = [];
data2[0] = [{longitude:75, dimension:39, height:0, time:0},{longitude:125, dimension:10, height:2500000, time:5},{longitude:170, dimension:1, height:0, time:10}];

//得到流动线
getFlowPolyline(data)

//纹理
// wenli()
//得到流动线
// getFlowPolyline2(data3)

//飞机飞行
flyAirplane(data2)

flyObject(data2)

//添加图片
addBillboard()

//导弹轨迹
missleTrace(1,1,100,100)