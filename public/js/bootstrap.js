InboxSDK.load('1.0', 'sdk_finalYear_82ec7c06c1').then(function(sdk){
  console.log("loading the sdk");

  // the SDK has been loaded, now do something with it!
  sdk.Compose.registerComposeViewHandler(function(composeView){

    // a compose view has come into existence, do something with it!
    composeView.addButton({
      title: "Send a tracked Email",
      iconUrl: 'https://example.com/foo.png',
      onClick: function(event) {
        event.composeView.insertTextIntoBodyAtCursor('');
      },
    });

  });

});
