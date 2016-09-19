'use strict';

exports.name = 'init';
exports.usage = '[module] <path>'
exports.desc = 'auto create your project';

var Path = require('path');

exports.register = function(commander){
	commander
		.action(function(){
			var args = Array.prototype.slice.call(arguments);
			var path = args[0];

			if(typeof path != 'string'){
				feather.log.on.error('project dir is required!\n');
				return;
			}

			var cwd = process.cwd();
			var root = cwd + '/' + path;

		    if(feather.util.exists(root)){
		    	feather.log.on.error(path + ' already exists!\n');
		    	return;
		    }

		    var i = 0, config = {};
		    var x = Path.basename(root).split('-');
		    var defaultName, defaultModule;

		    do{
		    	if(x.length > 1){
			    	defaultModule = x.pop();
			    	defaultName = x.pop();
			    	break;
			    }else if(path.indexOf('/') > -1){
			    	defaultName = Path.basename(Path.dirname(root));
			    	defaultModule = Path.basename(root);
			    	break;
			    }else{
			    	defaultName = Path.basename(root);
			    }

			    create(root + '/common', {
		    		'project.name': defaultName,
		    		'project.modulename': 'common',
		    		'template.suffix': 'html'
		    	});
		    	create(root + '/main', {
		    		'project.name': defaultName,
		    		'project.modulename': 'main',
		    		'template.suffix': 'html'
		    	});

			    feather.log.on.notice('project [' + path + '] created success!\n');	
				process.exit();
		    }while(0);

		    var DEFAULT_PROPERTY = [
		    	{
					name: 'project.name',
					desc: 'project\'s name:',
					_default: defaultName
				},
				{
					name: 'project.modulename',
					desc: 'project\'s module name:',
					_default: defaultModule
				},
				{
					name: 'template.suffix',
					desc: 'template\'s suffix:',
					_default: 'html'
				}
			];

			var readline = require('readline');
			var rl = readline.createInterface({
				input: process.stdin,
				output: process.stdout
			});

		    (function configStep(){
				var current = DEFAULT_PROPERTY.shift();

				rl.question(' ' + current.desc + (current._default ? ' (' + current._default + ') ' : ' '), function(answer){
					config[current.name] = answer || current._default || '';
					
					if(!DEFAULT_PROPERTY.length){
					    create(root, config);
						rl.close();
						feather.log.on.notice('module [' + path + '] created success!\n');	
						process.exit();
					}else{
						configStep();
					}
				});
			})();
		    
		    return;
		    
		});
};

function create(root, config){
	var templateDir = __dirname + '/template/';
    var conf = feather.util.read(templateDir + 'conf.js');

    for(var i in config){
    	conf = conf.replace('${' + i + '}', config[i]);
    }

    var vendorDir = __dirname + '/vendor';

    feather.util.find(vendorDir).forEach(function(file){
    	if(config.modulename != 'common' && file.indexOf('data/_global_.php') > -1){
    		return;
    	}

    	var release = root + file.substr(vendorDir.length);
    	release = release.replace(/\.html$/, '.' + config['template.suffix']);
    	feather.util.copy(file, release);
    });

    //feather.util.copy(__dirname + '/vendor', root);
    feather.util.write(root + '/conf/conf.js', conf);	    	
}