// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  //
  // const replaceText = (selector, text) => {
  //   const element = document.getElementById(selector)
  //   if (element) element.innerText = text
  // }
  //
  // for (const type of ['chrome', 'node', 'electron']) {
  //   replaceText(`${type}-version`, process.versions[type])
  // }

  const {ipcRenderer} = require('electron');
  const fs = require('fs');

  const _readTxtFromFile = (path,callback) => {
    fs.readFile(path,'utf-8',function(err,data){
      if(err){
        console.error(err);
      }
      else{
        callback(data);
      }
    });
}

  let $selectDirectoryBtn = $('#projectDirectory button'),
       $directoryInput = $('#projectDirectory input');
  $directoryInput.val(__dirname);
  $selectDirectoryBtn.click(function () {
    ipcRenderer.send('open-directory-dialog','openDirectory',$directoryInput.val());
    ipcRenderer.on('selectedItem',function (e,path) {
      if(path){
        $directoryInput.val(path);
        let fileName = 'profile.js';
        let files = fs.readdirSync(path);
        if(files.indexOf(fileName) > -1){ //判断文件夹下是否包含指定文件
          let fullPath = path + '/' + fileName;
          _readTxtFromFile(fullPath,function (txt) {
            $('.result').html(txt);
            let newTxt = txt;
            //写入
            fs.writeFile(fullPath,newTxt,function(err){
              if (err) {
                throw err;
              }
              alert('写入成功！');
            })
          });
        }else {
          alert("您选择的文件夹内不包含"+fileName+'文件，请重新选择！');
        }
      }
    });
  });



})
