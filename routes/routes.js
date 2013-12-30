/*
 * routes.
 */
var _ = require('underscore') // 使用underscore库
    , config = require('../app-conf')
    , index= require('./index')
    ,user = require('./user');

module.exports = function(app){

    app.all('/', index.index);
    app.all('/users', user.list);


    /**
     * 跳转404页面
     */
    app.use(function (req, res) {
        res.status(404).sendfile('public/404.html');
    });
};
