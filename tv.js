var fs = require('fs');
var request = require('request');

var SReg = /[Ss](\d+)/;
var EReg = /[Ee](\d+)/;
var extReg = /(\..{3})\b/;

var fileArr = [];
var path = 'D:\\TV Shows\\Friends\\SEASON 3'; // path of the tv show folder
var id = '1668';	// themoviedb show id

fs.readdir(path, function (err, files) {
    if (!err){
        console.log(files);
        fileArr = files;
        for (var i = 0; i < fileArr.length; i++) {
            var extension = extReg.exec(fileArr[i]);
            if (extension){
                extension = extension[1];
            }
            if (fileArr[i].search(extension) != -1){
                var season = SReg.exec(fileArr[i]);
                var episode = EReg.exec(fileArr[i]);
                if (season && episode){
                    season = season[1];
                    episode = episode[1];
                    (function (oldname, season, episode, id, extension){
                        request({
                          method: 'GET',
                          url: 'http://api.themoviedb.org/3/tv/'+id+'/season/'+season+'/episode/'+episode+'?api_key=68ab7f92986673908521e2af900d2786',
                          headers: {
                            'Accept': 'application/json'
                          }}, function (error, response, body) {
                            if (error) {
                                return null;
                            }
                            else {
                                body = JSON.parse(body);
                                if(body.season_number < 10){
                                    body.season_number = "0"+body.season_number;
                                }
                                if(body.episode_number < 10){
                                    body.episode_number = "0"+body.episode_number;
                                }
                                var rename = "S"+body.season_number+"E"+body.episode_number+" - "+body.name;
                                console.log(rename);
                                rename = rename.replace(/[\/\\<>:\*\?\|"]/g, '');
                                fs.rename(path+"\\"+oldname, path+"\\"+rename+extension);

                            }
                        });
                    })(fileArr[i], season, episode, id, extension);                
                }  
            }
        }
    }
    else{
        console.log(err);
    }
});



