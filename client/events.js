Template.S3.events({
  'change input[type=file]': function (e,helper) {
    var context = this || {};
    if(helper.data && _.has(helper.data,"callback")){
      var callback = helper.data.callback;
      var id = helper.data.id;
      var pid = e.target.dataset.postingId;
      var dzid = e.target.dataset.dzid;
      if(dzid){
        loadingSession = getLoading();
        loadingSession[dzid] = true;
        setLoading(loadingSession);
      }

    } else {
      console.log("S3 Error: Helper Block needs a callback function to run");
      return
    }

    var files = e.currentTarget.files;
    _.each(files,function(file){
      var reader = new FileReader;
      var fileData = {
        name:file.name,
        size:file.size,
        type:file.type
      };

      reader.onload = function () {
        fileData.data = new Uint8Array(reader.result);
        Meteor.call("S3upload",fileData,context,callback,id,pid,function (error, result) { 
            console.log(dzid);
            loadingSession = getLoading();
            loadingSession[dzid] = false;
            setLoading(loadingSession);
            setImage(result); 
          } );
      };

      reader.readAsArrayBuffer(file);

    });
  }
});