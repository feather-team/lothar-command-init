'use strict';

exports.name = 'init';
exports.usage = '<path>'
exports.desc = 'auto create your project';

var Path = require('path');

exports.register = function(commander){
	commander
		.action(function(){
			var args = Array.prototype.slice.call(arguments);
			var path = args.shift();

			if(typeof path != 'string'){
				feather.log.on.error('project dir is required!\n');
				return;
			}

			var root = process.cwd() + '/' + path + '/';

		    if(feather.util.exists(root)){
		    	feather.log.on.error(path + ' already exists!\n');
		    	return;
		    }

		    var i = 0, config = {};
		    var DEFAULT_PROPERTY = [
		    	{
					name: 'project.name',
					desc: 'project\'s name:',
					_default: Path.basename(Path.dirname(root))
				},
				{
					name: 'project.modulename',
					desc: 'project\'s module name:',
					_default: Path.basename(root)
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
					    var templateDir = __dirname + '/template/';
					    var conf = feather.util.read(templateDir + 'conf.js');

					    for(var i in config){
					    	conf = conf.replace('${' + i + '}', config[i]);
					    }

					    var vendorDir = __dirname + '/vendor';

					    feather.util.find(vendorDir).forEach(function(file){
					    	var release = root + file.substr(vendorDir.length);
					    	release = release.replace(/\.html$/, '.' + config['template.suffix']);
					    	feather.util.copy(file, release);
					    });

					    //feather.util.copy(__dirname + '/vendor', root);
					    feather.util.write(root + '/conf/conf.js', conf);		    	

						rl.close();
						feather.log.on.notice(path + ' created success!\n');
						process.exit();
					}else{
						configStep();
					}
				});
			})();
		    
		    return;
		    
		});
};