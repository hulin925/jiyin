// pages/designJY/designJY.js


// var t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
//   return typeof t;
// } : function (t) {
//   return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
// }, e = getApp(), a = e.requirejs("core"), i = e.requirejs("foxui"), r = e.requirejs("biz/diyform"), s = e.requirejs("jquery"), d = e.requirejs("biz/selectdate");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[],
    shunxu:'',//title几
    storage:[],//储存数据
    typeList:[],//title类型
    isShow:false,
    addData:{},//添加数据
    zhx:{},
    orf:{},
    qdz:{},
    userInfo:{},
    priceData:{},//设计完成返回参数
    colors:'',//记录当前点击的是谁
    zcolors:5,
    zcolors1: 5,
    zcolors2: 5
  },
  buy(){//购买
    if (!this.data.priceData.price){
      wx.showToast({
        title: '请先按顺序选择，再点击完成设计',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if (!this.data.userInfo.openid){
      wx.navigateTo({
        url: '/pages/message/auth/index'
      })
      return;

    }
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    wx.request({
      method: 'GET',
      url: 'https://wxyx.sanhedao.com.cn/app/ewei_shopv2_api.php?i=1&r=order.create&id=' + this.data.storage.id + '&total=1&optionid=' + this.data.priceData.optionid + '&selectDate=undefined&comefrom=wxapp&openid=sns_wa_' + this.data.userInfo.openid + '&mid=&merchid=&authkey=&timestamp=' + timestamp,
      header: {
        "Content-Type": "application/json"//跨域请求
      },
      success: (res) => {
        if (res.data.error == 0) {
          var payData = res.data.goods[0].goods[0];
          wx.navigateTo({
            url: '/pages/order/create/index?id=' + payData.id + '&optionid=' + payData.optionid + '&total=' + payData.total +'&selectDate=undefined'
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          });
        }

      },
      fail: (err) => {
        console.log(err);
      }
    });



  },
  complete(){//完成设计
    if (!this.data.zhx.id){
      wx.showToast({
        title: '请点击' + this.data.typeList[0].title+'选择载体',
        icon: 'none',
        duration: 2000
      });
      return;
    } else if (!this.data.orf.id){
      wx.showToast({
        title: '请点击' + this.data.typeList[1].title + '选择载体',
        icon: 'none',
        duration: 2000
      });
      return;
    } else if (!this.data.qdz.id){
      wx.showToast({
        title: '请点击' + this.data.typeList[2].title + '选择载体',
        icon: 'none',
        duration: 2000
      });
      return;
    }
  var that=this;
    wx.request({
      method: 'POST',
      url: 'https://wxyx.sanhedao.com.cn/app/ewei_shopv2_api.php?i=1&r=ztdiy.savezt&comefrom=wxapp',
      data: {
        goodsid: this.data.storage.id,
        oneid: this.data.zhx.id,
        twoid: this.data.orf.id,
        threeid: this.data.qdz.id,
        uid: this.data.id,
        carrier_id: this.data.storage.id,
        carrier_name: this.data.storage.title,
        carrier_type: this.data.storage.type_cn,
        carrier_size: this.data.storage.size,
        qidongzi: this.data.qdz.title,
        orf: this.data.qdz.orf,
        zhkx: this.data.qdz.zhx,
        zlkbs: '',
        yhkx: '',
        carrier_describe: ''
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"//跨域请求
      },
      success: (res) => {
        if (res.data.error == 0) {
          var priceData = res.data.list;
          that.setData({
            priceData
          })
          console.log(res.data.list,7777)
          wx.showModal({
            title: '基因载体',
            content: '基因载体设计完成，请点击立即购买 ￥' + res.data.list.price,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
          // wx.showToast({
          //   title: '设计完成，请点击立即购买',
          //   icon: 'success',
          //   duration: 2000
          // }); 
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          });
        }

      },
      fail: (err) => {
        console.log(err);
      }
    });
  },
  addData:function(e){//添加数据
    console.log(e.currentTarget,33333)
    // this.setData({
    //   zcolors: e.currentTarget.id
    // })
    var addData = e.currentTarget.dataset.list;
    if (this.data.shunxu.shunxu==0){
      this.setData({
        zhx: addData,
        zcolors: e.currentTarget.id
      })
    } else if (this.data.shunxu.shunxu == 1){
      this.setData({
        orf: addData,
        zcolors1: e.currentTarget.id
      })
    } else if (this.data.shunxu.shunxu == 2){
      this.setData({
        qdz: addData,
        zcolors2: e.currentTarget.id
      })
    }
    this.setData({
      isShow: false
    })
  },  
  move:function(){//解决穿透滚动

  },
  closeT:function(){//隐藏弹出层
    this.setData({
      isShow:false
    })
  },
  detailJy:function(e){//点击获取弹出层详细数据
  console.log(e,88)
    console.log(this.data.typeList,66555)
  this.setData({
    colors: e.currentTarget.id
  })
    var shunxu = e.currentTarget.dataset.list;
    this.setData({
      shunxu
    })
    var id = e.currentTarget.dataset.list.id;
    wx.request({
      method: 'POST',
      url: 'https://wxyx.sanhedao.com.cn/app/ewei_shopv2_api.php?i=1&r=ztdiy.getguige&comefrom=wxapp',
      data: {
        specid: id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"//跨域请求
      },
      success: (res) => {
        if(res.data.error==0){
          var data=res.data.list;
          this.setData({
            dataList: data
          })
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          });
        }
        
      },
      fail: (err) => {
        console.log(err);
      }
    });

    this.setData({//显示弹出层
      isShow: true
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    wx.getStorage({
      key: 'userinfowxec0f58386eef88b0',
      success: function (res) {
        // success
        that.setData({
          userInfo: res.data.value
        })
      }
    })
    wx.getStorage({
      key: 'storage',
      success: function (res) {
        // success
        var dataList = res.data.gg;
        console.log(dataList,44447777)
        dataList.forEach((item,index)=>{
          item.shunxu=index;
        })
        that.setData({
          storage: res.data,
          typeList: dataList
        })
      }
    })
    
    wx.showToast({
      title: '请按顺序选择载体之后再点击设计完成',
      icon:'none',
      duration: 4000
    });
    // wx.showModal({
    //   title: '提示',
    //   content: '请按顺序选择载体之后再点击设计完成',
    //   success: function (res) {
    //     if (res.confirm) {
    //       console.log('弹框后点取消')
    //     } else {
    //       console.log('弹框后点取消')
    //     }
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})