
/**
 * 获得地球
 */
var viewer = new Cesium.Viewer('cesiumContainer',{
    // baseLayerPicker:false,
    timeline:false,//时间控件不显示
    homeButton:true,
    // fullscreenButton:false,
    // infoBox:false,
    sceneModePicker:false,//模式选择按钮关闭
    // navigationInstructionsInitiallyVisible:false,
    navigationHelpButton:false,//关闭帮助按钮
    shouldAnimate:true,//使图动起来
    animation:false//动画控件不显示
});



//展示经纬度
function showLangLat(){
    // 经纬度实时显示
    var longitude_show=document.getElementById('longitude_show');
    var latitude_show=document.getElementById('latitude_show');
    var altitude_show=document.getElementById('altitude_show');
    var canvas=viewer.scene.canvas;
    //具体事件的实现
    var ellipsoid=viewer.scene.globe.ellipsoid;
    var handler = new Cesium.ScreenSpaceEventHandler(canvas);
    handler.setInputAction(function(movement){
        //捕获椭球体，将笛卡尔二维平面坐标转为椭球体的笛卡尔三维坐标，返回球体表面的点
            var cartesian=viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
            if(cartesian){
                //将笛卡尔三维坐标转为地图坐标（弧度）
                var cartographic=viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
                //将地图坐标（弧度）转为十进制的度数
                var lat_String=Cesium.Math.toDegrees(cartographic.latitude).toFixed(4);
                var log_String=Cesium.Math.toDegrees(cartographic.longitude).toFixed(4);
                var alti_String=(viewer.camera.positionCartographic.height/1000).toFixed(2);
                longitude_show.innerHTML=log_String;
                latitude_show.innerHTML=lat_String;
                altitude_show.innerHTML=alti_String;
            }
    },Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}

/**
 * 获得立方体
 * @param {*} longitude 经度
 * @param {*} latitude 纬度
 * @param {*} height 高度
 * @param {*} color 颜色
 */
function getCube(longitude,latitude,height,color){
    var redBox = viewer.entities.add({
    name : 'Red box with black outline',
    position: Cesium.Cartesian3.fromDegrees(longitude,latitude,height),
    box : {
        dimensions : new Cesium.Cartesian3(400000.0, 300000.0, 100000.0),
        material : color,
        outline : true,
        outlineColor : Cesium.Color.BLACK
    }
    });

    //转移视角
    // viewer.zoomTo(viewer.entities);
}

/**
 * 得到飞行的飞机
 */
function flyAirplane(data){
    viewer.scene.globe.enableLighting = false;
    // 起始时间
    let start = Cesium.JulianDate.fromDate(new Date());
    // 结束时间
    let stop = Cesium.JulianDate.addSeconds(start, 10, new Cesium.JulianDate());
    
    // 设置始时钟始时间
    // viewer.clock.startTime = start.clone();
    // 设置时钟当前时间
    // viewer.clock.currentTime = start.clone();
    // 设置始终停止时间
    // viewer.clock.stopTime  = stop.clone();
    // 时间速率，数字越大时间过的越快
    // viewer.clock.multiplier = 40;
    // 时间轴
    // viewer.timeline.zoomTo(start,stop);
    // 循环执行,即为2，到达终止时间，重新从起点时间开始
    // viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;

    // view.camera.flyTo({
    //     destination:Cesium.Cartesian3.fromDegrees(116.405419,32.073514,10000000)
    // })
    for(let j=0; j<data.length; j++){
        let property = computeFlight(start,data[j]);
        //console.log(property)
        // 添加模型
        let planeModel = viewer.entities.add({
            // 和时间轴关联
            availability : new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
                start : start,
                stop : stop
            })]),
            position: property,
            // 根据所提供的速度计算模型的朝向
            orientation: new Cesium.VelocityOrientationProperty(property),
            // 模型数据
            model: {
                uri: './Cesium_Air.glb',
                minimumPixelSize:100
            }
        });
    }
}


/**
 * 立体物体飞行 
 */
function flyObject(data){
  viewer.scene.globe.enableLighting = false;
  // 起始时间
  let start = Cesium.JulianDate.fromDate(new Date());
  // 结束时间
  let stop = Cesium.JulianDate.addSeconds(start, 10, new Cesium.JulianDate());
  
  // 设置始时钟始时间
  // viewer.clock.startTime = start.clone();
  // 设置时钟当前时间
  // viewer.clock.currentTime = start.clone();
  // 设置始终停止时间
  // viewer.clock.stopTime  = stop.clone();
  // 时间速率，数字越大时间过的越快
  // viewer.clock.multiplier = 40;
  // 时间轴
  // viewer.timeline.zoomTo(start,stop);
  // 循环执行,即为2，到达终止时间，重新从起点时间开始
  // viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;

  // view.camera.flyTo({
  //     destination:Cesium.Cartesian3.fromDegrees(116.405419,32.073514,10000000)
  // })
  for(let j=0; j<data.length; j++){
      let property = computeFlight(start,data[j]);
      //console.log(property)
      // 添加模型
      let planeModel = viewer.entities.add({
          // 和时间轴关联
          availability : new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
              start : start,
              stop : stop
          })]),
          position: property,
          // 根据所提供的速度计算模型的朝向
          orientation: new Cesium.VelocityOrientationProperty(property),
          // 模型数据
          polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray([
              //顺时针画多边形
              113.0,
              31.0,
              115.0,
              31.0,
              114,
              33.0
            ]),
            material: './img/timg2.jpg',//贴图
            extrudedHeight: 500000.0
          },
      });
  }
}

/**
 * 计算飞机飞行
 * @param source 数据坐标
 * @returns {SampledPositionProperty|*}
 */
function computeFlight(start,source) {
    // 取样位置 相当于一个集合
    let property = new Cesium.SampledPositionProperty();
    for(let i=0; i<source.length; i++){
        let time = Cesium.JulianDate.addSeconds(start, source[i].time, new Cesium.JulianDate);
        let position = Cesium.Cartesian3.fromDegrees(source[i].longitude, source[i].dimension, source[i].height);
        // 添加位置，和时间对应
        property.addSample(time, position);
    }
    return property;
}


function setCamera(){
    var initialPosition = new Cesium.Cartesian3.fromDegrees(-73.998114468289017509, 40.674512895646692812, 2631.082799425431);
    var initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(7.1077496389876024807, -31.987223091598949054, 0.025883251314954971306);
    var homeCameraView = {
        destination : initialPosition,
        orientation : {
            heading : initialOrientation.heading,
            pitch : initialOrientation.pitch,
            roll : initialOrientation.roll
        }
    };
    // Set the initial view
    viewer.scene.camera.setView(homeCameraView);

    // Add some camera flight animation options
    homeCameraView.duration = 2.0;
    homeCameraView.maximumHeight = 2000;
    homeCameraView.pitchAdjustHeight = 2000;
    homeCameraView.endTransform = Cesium.Matrix4.IDENTITY;
    // Override the default home button
    viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (e) {
        e.cancel = true;
        viewer.scene.camera.flyTo(homeCameraView);
    });

    // Set up clock and timeline.
    viewer.clock.shouldAnimate = true; // make the animation play when the viewer starts
    viewer.clock.startTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:00:00Z");
    viewer.clock.stopTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:20:00Z");
    viewer.clock.currentTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:00:00Z");
    viewer.clock.multiplier = 2; // sets a speedup
    viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER; // tick computation mode
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // loop at the end
    viewer.timeline.zoomTo(viewer.clock.startTime, viewer.clock.stopTime); // set visible range
}

//获得多边形
function getPolygon(){
    var redPolygon = viewer.entities.add({
        name: "Red polygon on surface",
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray([
            //顺时针画多边形
            113.0,
            31.0,
            115.0,
            31.0,
            114,
            33.0
          ]),
          material: './img/timg2.jpg',//贴图
          extrudedHeight: 500000.0
        },
      });
      
      var greenPolygon = viewer.entities.add({
        name: "Green extruded polygon",
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray([
            -108.0,
            42.0,
            -100.0,
            42.0,
            -104.0,
            40.0,
          ]),
          extrudedHeight: 500000.0,
          material: Cesium.Color.GREEN,
          closeTop: false,
          closeBottom: false,
        },
      });
      
      var orangePolygon = viewer.entities.add({
        name: "Orange polygon with per-position heights and outline",
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights([
            -108.0,
            25.0,
            100000,
            -100.0,
            25.0,
            100000,
            -100.0,
            30.0,
            100000,
            -108.0,
            30.0,
            300000,
          ]),
          extrudedHeight: 0,
          perPositionHeight: true,
          material: Cesium.Color.ORANGE.withAlpha(0.5),
          outline: true,
          outlineColor: Cesium.Color.BLACK,
        },
      });
      
      var bluePolygon = viewer.entities.add({
        name: "Blue polygon with holes",
        polygon: {
          hierarchy: {
            positions: Cesium.Cartesian3.fromDegreesArray([
              -99.0,
              30.0,
              -85.0,
              30.0,
              -85.0,
              40.0,
              -99.0,
              40.0,
            ]),
            holes: [
              {
                positions: Cesium.Cartesian3.fromDegreesArray([
                  -97.0,
                  31.0,
                  -97.0,
                  39.0,
                  -87.0,
                  39.0,
                  -87.0,
                  31.0,
                ]),
                holes: [
                  {
                    positions: Cesium.Cartesian3.fromDegreesArray([
                      -95.0,
                      33.0,
                      -89.0,
                      33.0,
                      -89.0,
                      37.0,
                      -95.0,
                      37.0,
                    ]),
                    holes: [
                      {
                        positions: Cesium.Cartesian3.fromDegreesArray([
                          -93.0,
                          34.0,
                          -91.0,
                          34.0,
                          -91.0,
                          36.0,
                          -93.0,
                          36.0,
                        ]),
                      },
                    ],
                  },
                ],
              },
            ],
          },
          material: Cesium.Color.BLUE.withAlpha(0.5),
          height: 0,
          outline: true, // height is required for outline to display
        },
      });
      
      var cyanPolygon = viewer.entities.add({
        name: "Cyan vertical polygon with per-position heights and outline",
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights([
            -90.0,
            41.0,
            0.0,
            -85.0,
            41.0,
            500000.0,
            -80.0,
            41.0,
            0.0,
          ]),
          perPositionHeight: true,
          material: Cesium.Color.CYAN.withAlpha(0.5),
          outline: true,
          outlineColor: Cesium.Color.BLACK,
        },
      });
      
      var purplePolygonUsingRhumbLines = viewer.entities.add({
        name: "Purple polygon using rhumb lines with outline",
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray([
            -120.0,
            45.0,
            -80.0,
            45.0,
            -80.0,
            55.0,
            -120.0,
            55.0,
          ]),
          extrudedHeight: 50000,
          material: Cesium.Color.PURPLE,
          outline: true,
          outlineColor: Cesium.Color.MAGENTA,
          arcType: Cesium.ArcType.RHUMB,
        },
      });
      
      viewer.zoomTo(viewer.entities); 
}

function getPolyline(){
    var redLine = viewer.entities.add({
        name: "Red line on terrain",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray([-75, 35, -125, 35]),
          width: 5,
          material: Cesium.Color.RED,
          clampToGround: true,
        },
      });
      
      var greenRhumbLine = viewer.entities.add({
        name: "Green rhumb line",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray([-75, 35, -125, 35]),
          width: 5,
          arcType: Cesium.ArcType.RHUMB,
          material: Cesium.Color.GREEN,
        },
      });
      
      var glowingLine = viewer.entities.add({
        name: "Glowing blue line on the surface",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray([-75, 37, -125, 37]),
          width: 10,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 10,
            taperPower: 0.1,
            color: Cesium.Color.CORNFLOWERBLUE,
          }),
        },
      });
      
      var orangeOutlined = viewer.entities.add({
        name:
          "Orange line with black outline at height and following the surface",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([
            -75,
            39,
            0,
            -125,
            10,
            2500000,
            -170,
            1,
            0
          ]),
          width: 5,
          material: new Cesium.PolylineOutlineMaterialProperty({
            color: Cesium.Color.ORANGE,
            outlineWidth: 2,
            outlineColor: Cesium.Color.BLACK,
          }),
        },
      });
      
      var purpleArrow = viewer.entities.add({
        name: "Purple straight arrow at height",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([
            -75,
            43,
            500000,
            -125,
            43,
            500000,
          ]),
          width: 10,
          arcType: Cesium.ArcType.NONE,
          material: new Cesium.PolylineArrowMaterialProperty(
            Cesium.Color.PURPLE
          ),
        },
      });
      
      var dashedLine = viewer.entities.add({
        name: "Blue dashed line",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([
            -75,
            45,
            500000,
            -125,
            45,
            1000000,
          ]),
          width: 4,
          material: new Cesium.PolylineDashMaterialProperty({
            color: Cesium.Color.CYAN,
          }),
        },
      });
      
      viewer.zoomTo(viewer.entities);
}

function getPic(longitude,latitude,x,y,color){
    var entity = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
        ellipse : {
        semiMinorAxis : x,
        semiMajorAxis : y,
        material : color
    }
    });
}

/**
 * 设置标签
 */
function addLabel(longitude,latitude,textArea) {
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(longitude,latitude),
    label: {
      text: textArea,
      font: "24px Helvetica",
      fillColor: Cesium.Color.RED,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 3,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    },
  });
}

/**
 * 流动纹理线
 * @param {} color 
 * @param {*} duration 
 * @param {*} d 
 */
//添加材料
function PolylineTrailLinkMaterialProperty(color, duration,d) {
  this._definitionChanged = new Cesium.Event();
  this._color = undefined;
  this._colorSubscription = undefined;
  this.color = color;
  this.duration = duration || 3000;
  this._time = (new Date()).getTime();
  this._d=d;
  this.isTranslucent = function () {
      return true;
  }
}

//纹理配置
function wenli(){

  Object.defineProperties(PolylineTrailLinkMaterialProperty.prototype, {
    isConstant: {
       get: function () {
            return false;
       }
   },
   definitionChanged: {
       get: function () {
           return this._definitionChanged;
       }
   },
   color: Cesium.createPropertyDescriptor('color')
 });
 PolylineTrailLinkMaterialProperty.prototype.getType = function (time) {
   return 'PolylineTrailLink';
 }
 PolylineTrailLinkMaterialProperty.prototype.getValue = function (time, result) {
   if (!Cesium.defined(result)) {
       result = {};
   }
   result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
   result.image = Cesium.Material.PolylineTrailLinkImage;
   result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration*this._d;
   return result;
 }
 PolylineTrailLinkMaterialProperty.prototype.equals = function (other) {
   return this === other ||
       (other instanceof PolylineTrailLinkMaterialProperty &&
           Property.equals(this._color, other._color))
 }
 
 Cesium.PolylineTrailLinkMaterialProperty = PolylineTrailLinkMaterialProperty;
 Cesium.Material.PolylineTrailLinkType = 'PolylineTrailLink';
 // Cesium.Material.PolylineTrailLinkImage = "https://upload-images.jianshu.io/upload_images/6957972-c5f879cd86b79dfd.png?imageMogr2/auto-orient/strip|imageView2/2/w/512";
 Cesium.Material.PolylineTrailLinkImage = "./img/timg.jpg";
 Cesium.Material.PolylineTrailLinkSource = " czm_material czm_getMaterial(czm_materialInput materialInput)\n\
                                                         {\n\
                                                             czm_material material = czm_getDefaultMaterial(materialInput);\n\
                                                             vec2 st = materialInput.st;\n\
                                                             vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n\
                                                             material.alpha = colorImage.a * color.a;\n\
                                                             material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
                                                             return material;\n\
                                                         }";
 
 Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailLinkType, {
   fabric: {
         type: Cesium.Material.PolylineTrailLinkType,
         uniforms: {
             color: new Cesium.Color(0.0, 0.0, 1.0, 0.5),
             image: Cesium.Material.PolylineTrailLinkImage,
             time: -20
         },
         source: Cesium.Material.PolylineTrailLinkSource
     },
     translucent: function (material) {
         return true;
     }
 });
}

//得到流动多边形
function getFlowPolygon(){
  let item = viewer.entities.add({
    name: 'PolylineTrail',
      polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights([
              50, 30, 250000,
              60 , 30, 250000,
              60 , 32, 250000,
              50, 32, 250000,
          ]),
          width: 15,
          material: new Cesium.PolylineTrailLinkMaterialProperty(Cesium.Color.WHITE, 3000,1)
      }
    });
}

//得到流动线
function getFlowPolyline(data){
  let entity = viewer.entities.add({
    name: "PolylineTrail",
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights(data),
      width: 10,
      material: new Cesium.PolylineTrailLinkMaterialProperty(Cesium.Color.RED, 3000,1)
    }
  });
}

//得到流动线
function getFlowPolyline2(data){
  let aa = viewer.entities.add({
    name: "PolylineTradil2",
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights(data),
      width: 10,
      material: new Cesium.PolylineTrailLinkMaterialProperty(Cesium.Color.RED, 300,2)
    }
  });
}

//添加图片
function addBillboard() {
  var e = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(105,32),
    billboard: {
      image: "./img/timg.jpg",
      width: 50,
      height: 40,
      // sizeInMeters: true
    },
  });
}

//导弹轨迹
function missleTrace(startLongitude,startLatitude,endLongitude,endLatitude){
  var startTime = Cesium.JulianDate.now();
  var _endLongitude = startLongitude
  var _endLatitude = startLatitude
  var isConstant = false;
  var redLine = viewer.entities.add({
    polyline: {
      positions: new Cesium.CallbackProperty(function (time, result) {
        if(_endLongitude < endLongitude){
          _endLongitude =  startLongitude + 10*Cesium.JulianDate.secondsDifference(time, startTime);
        }
        if(_endLatitude < endLatitude){
          _endLatitude =  startLatitude + 10*Cesium.JulianDate.secondsDifference(time, startTime);
        }
        return Cesium.Cartesian3.fromDegreesArrayHeights(
          [startLongitude, startLatitude,0,_endLongitude/2, _endLatitude/2,1000000,_endLongitude, _endLatitude,0],
          Cesium.Ellipsoid.WGS84,
          result
        );
      }, isConstant),
      width: 5,
      material: Cesium.Color.RED,
    },
  });
}