// 专门处理城市相关的接口
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://127.0.0.1:27017/';


// 获取所有城市 localhost:3000/api/city/list
router.get('/list', function(req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
    if (err) {
      console.log('链接数据库失败', err);
      res.json({
        code: 1,
        msg: '网络异常, 请稍候重试'
      })
    } else {
      var db = client.db('maizuo');
      db.collection('cities').find().toArray(function(err, result) {
        if (err) {
          console.log(err);
          res.json({
            code: 1,
            msg: '错误'
          })
        } else {
          // 查询成功
          res.json({
            code: 0,
            msg: 'OK',
            data: {
              data: result
            }
          })
        }
        client.close();
      })
    }
  })

});

// 搜索城市 localhost:3000/api/city/search
router.get('/search', function (req, res) {
  var name = req.query.name;
  console.log(name);
  var filter = new RegExp(name);
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
    if (err) {
      console.log('链接数据库失败', err);
      res.json({
        code: 1,
        msg: '网络异常, 请稍候重试'
      })
    } else {
      var db = client.db('maizuo');
      db.collection('cities').find({$or: [
        {
          name: filter
        },
        {
          pinyin: filter
        }
      ]}).toArray(function(err, result) {
      if (err) {
        console.log(err);
        res.json({
          code: 1,
          msg: '错误'
        })
      } else if (result.length <= 0 ) {
        res.json({
          code: -1,
          msg: '当前无数据'
        })
      }else {
        // 查询成功
        res.json({
          code: 0,
          msg: 'OK',
          data: {
            data: result
          }
        })
      }
      client.close();
      })
    }
  })
});

module.exports = router;
