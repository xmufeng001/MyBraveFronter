
/**
 * Module dependencies.
 */

var express = require('express')
    , config = require('./app-conf')
    , routes = require('./routes/routes')
     , http = require('http')
    , path = require('path')
    , _ = require('underscore')
    , fs = require('fs')
    , log4js = require('log4js')
    , expressValidator = require('express-validator')
    , app = express()
    , _onExpressError = {
        errorFormatter: function(param, msg, value) {
            var namespace = param.split('.')
                , root    = namespace.shift()
                , formParam = root;

            while(namespace.length) {
                formParam += '[' + namespace.shift() + ']';
            }
            return {
                param : formParam,
                msg   : msg,
                value : value
            };
        }
    };
//log config
log4js.configure({
    appenders: [
        { type: 'console' },
        { type: 'file', filename: 'logs/log.log',maxLogSize: 1024,category: 'cheese' }
    ],
    replaceConsole: true
});
log4js.setGlobalLogLevel(config.logger_level);
var logger = log4js.getLogger(config.logger_output);

//fs
//自动登陆
//app.use(function (req, res, next) {
//    var url = req.originalUrl;
//    if (url != "/login" && !req.session.user) {
//        return res.redirect("/login");
//    }
//    next();
//});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon('public/img/favicon.png'));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(expressValidator(_onExpressError));
app.use(express.cookieParser());
app.use(express.cookieSession({secret:"feifei@secret@qwe123"}));
app.use(app.router);
//app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('dev' == app.get('env')) {
    app.use(express.errorHandler());
}

//routes
routes(app);

http.createServer(app).listen(app.get('port'), function(){
    logger.info('Express server listening on port ' + app.get('port'));
});
