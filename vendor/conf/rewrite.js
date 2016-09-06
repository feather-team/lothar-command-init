module.exports = {
    '^/(?:\\?main|$)': '/index.html', // xxx.com | xxx.com/ | xxx.com?main => index.html
    '^/ajax$': '/pagelet/ajax/ajax.html', //项目中的文件
    '^/ajax/callback': function(req, res){  //可以是一个函数
        res.send('hello, world!');
    }
};