// pages/indexJY/indexJY.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists:[],//父级数据
    sonList:[],//子级数据
    nowData:[],//当前点击下的子数据
    fatherId:'',
    sonId:'',
  },
  jumpPlan:function(e){//跳转设计页
    // var dataList = JSON.stringify(e.currentTarget.dataset.index);
    wx.navigateTo({
      url: '../designJY/designJY'
    })
    wx.setStorageSync('storage', e.currentTarget.dataset.index)
  },
  pushPlan:function(e){//求情子级分类
    var sonID = e.currentTarget.id;
    var fatherId = this.data.fatherId;
    wx.request({
      method: 'POST',
      url: 'https://wxyx.sanhedao.com.cn/app/ewei_shopv2_api.php?i=1&r=ztdiy.getgoodsbytype&comefrom=wxapp',
      data: {
        pcate: fatherId,
        ccate: sonID
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"//跨域请求
      },
      success: (res) => {
        if(res.data.error==0){
          this.setData({
            sonList: res.data.list
          })
          var id = e.currentTarget.id
          var list = this.data.nowData
          var lists=this.data.lists
            for (let i = 0, len = lists.length; i < len; ++i) {
                lists[i].xiaji.forEach((item)=>{
                  if (item.id == id){
                    item.open=!item.open;
                  }else{
                    item.open=false;
                  }
                })
              }
              this.setData({
                lists
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
        wx.showToast({
          title: err,
          icon: 'none',
          duration: 2000
        });
      }
    });


    // wx.navigateTo({
    //   url: '../designJY/designJY?fatherId=' + fatherId + '&sonID=' + sonID
    // })
  },
  /**
44    * 收缩核心代码
45    */
  kindToggle(e) {
    var noneData = e.currentTarget.dataset.nonodata;
    if (!noneData.xiaji.length){
      wx.showToast({
        title: '暂无数据',
        icon: 'none',
        duration: 2000
      });
    }else{
      this.setData({
        fatherId: e.currentTarget.id,
        nowData: e.currentTarget.dataset.shuju
      })
      const id = e.currentTarget.id
      const list = this.data.lists
      for (let i = 0, len = list.length; i < len; ++i) {
        if (list[i].id == id) {
          list[i].open = !list[i].open
        } else {
          list[i].open = false
        }
      }
      /**
    * key和value名称一样时，可以省略
    * 
    * list:list=>list
    */
      this.setData({
        lists: list
      })

    }
    
  },
  initData:function(){
    wx.request({
      method: 'POST',
      url: 'https://wxyx.sanhedao.com.cn/app/ewei_shopv2_api.php?i=1&r=ztdiy.gettype&comefrom=wxapp',
      data: '',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"//跨域请求
      },
      success: (res) => {
        var data = res.data.list;
        data.forEach((item,index)=>{
          item.open=false;
          item.xiaji.forEach((items,index)=>{
            if(items){
              items.open=false;
            }
          })
          return data;
          
        })
        this.setData({
          lists: data
        })
      },
      fail: (err) => {
        console.log(err);
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData();
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