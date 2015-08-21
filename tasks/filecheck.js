/*
 * filecheck
 * https://github.com/homker/fileCheck
 *
 * Copyright (c) 2015 homker
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  var crypto = require('crypto'),
         path    = require('path');

         var formate = {
         	json: function(hashes, banner){
         		return banner + JSON.stringify(hashes);
         	}
         };

  grunt.registerMultiTask('filecheck', 'a plugin use to check the file all be add in svn , make a file to describle all the file in files', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      format: 'json',
      banner: '',
      hash: 'md5'
    });

    options.formatter = options.formatter||formate;

    var basedir = null;
    if(options.basedir){
    	basedir = path.resolve(options.basedir);
    }

    // Iterate over all specified file groups.
    var self = this;
    this.files.forEach(function(f) {
      // Concat specified files.
      var error = false;
      var  hashes = {};

      f.src.forEach(function(fileName){
      	if(grunt.file.exists(fileName)){
      		if(!grunt.file.isDir(fileName)){
      			var src = grunt.file.read(fileName, {
      				encoding:  null
      			});
      			var fn = typeof options.hash === 'function' ? options.hash : function(src){
      				return crypto.createHash(options.hash).update(src).digest('hex');
      			}
      			var hash = fn.call(self, src).slice(0,options.length);
      			var key = fileName;
      			if(basedir){
      				key = path.relative(basedir,fileName);
      			}
      			hashes[key] = hash;
      		}
      	}else{
      		grunt.log.wran('Source file "'+fileName+'" not found');
      		error = true;

      	}
      });

     if(typeof options.complete === 'function'){
     	hashes = options.complete.call(self, hashes);
     }    
      
     if(f.dest && hashes){
     	grunt.file.write(f.dest, options.formate.call(self,hashes,options.banner));
     }else{
     	grunt.verbose.writeln('fail ,can not write the file');
     }

     if(error){
     	grunt.log.wran('some file write in "'+f.dest+'",with warnings');
     }else{
     	grunt.log.ok();
     }
    });
  });

};
