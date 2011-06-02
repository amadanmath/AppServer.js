var child_process = require('child_process');
var url = require('url');
var querystring = require('querystring');

var App = function(name, url, path, args, headers, textparam) {
  this.name = name;
  this.url = url;
  this.path = path;
  this.args = args || [];
  this.headers = headers || {};
  this.textparam = textparam || 'text';
  this.todo = [];
  if (!this.headers['Content-Type']) {
    this.headers['Content-Type'] = 'text/plain';
  }
  this.start();
};

App.prototype = {
  start: function() {
    var that = this;
    this.child = child_process.spawn(this.path, this.args);

    this.child.stdout.on('data', function(data) {
      data = data.toString();
      var pos = data.indexOf('\004');
      if (pos != -1) {
        data = data.substr(0, pos - 1);
      }
      that.result += data + '\n';
      if (pos != -1) {
        that.current_res.writeHead(200, that.headers);
        that.current_res.end(that.result);
        that.current_res = null;
        that.process();
      }
    });

    this.child.on('exit', function(code) {
      console.info('Application ' + this.name + ' exited with code ' + code + '. Restarting');
      this.start();
    });
  },

  process: function() {
    if (this.current_res) return;

    var next = this.todo.shift();
    if (next) {
      this.current_text = next[0];
      this.current_res = next[1];
      this.result = '';
      this.child.stdin.write(this.current_text + '\004\n');
    }
  }
};

var handlePOST = function(req, callback) {
  var content = '';

  if (req.method == 'POST') {
    req.addListener('data', function(chunk) {
      content += chunk;
    });

    req.addListener('end', function() {
      callback(querystring.parse(content));
    });
  };
};

var AppServer = function() {
  this.apps = {};
};

AppServer.prototype = {
  serve: function(req, res) {
    var parsedUrl = url.parse(req.url);
    var path = parsedUrl.pathname;
    var app = this.apps[path];
    if (!app) {
      return false;
    }

    // var paramsGET = querystring.parse(parsedUrl.query);
    handlePOST(req, function(paramsPOST) {
      var text = paramsPOST[app.textparam] || '';
      app.todo.push([text, res]);
      app.process();
    });
    return true;
  },
  add: function(name, url, path, args, headers, textparam) {
    var app = new App(name, url, path, args, headers, textparam);
    this.apps[url] = app;
  }
};


exports.AppServer = AppServer;
