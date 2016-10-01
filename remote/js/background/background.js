/*
EMAIL SCHEMA
{
  emailId: 'akshay@getstrike.co',
  isLoggedIn: true,
  settings: {
    // denotes if the user has asked never to show any signup window
    noSignupWindow: false
  },
  integrations: [
    {
      partnerId: 'strike',
      plan: 'basic',
      status: 'active',
      addons: [
        {
          name: 'snooze',
          data: // addon specific data
          isActive: true
        }
      ]
    }
  ],
  deviceId: 'xxxx-xxxx-xxxx-xxxx',
  apiKey: 'xxxxxxxx999xxxx999xxxx'
}

USER SCHEMA
{
  name: {
    firstName: 'Akshay',
    lastName: 'Katyal'
  },
  gender: string,
  birthday: string,
  profilePictureUrl: 'https:/xxxxxx.xxx/xxx.xxx',
  location: {
    city: 'Bangalore',
    state: 'Karanataka',
    country: 'India'
  }
}

*** INTEGRATION DATA FORMATS ***

 SALESFORCE
{
  members: [],
  taskStatus: [],
  taskPriority: [],
  addonEmail: 'app@getstrike.co'
}

*/
var COLLECTIONS = ['email', 'user'];

// initialize Forerunner DB
var fdb = new ForerunnerDB();
var db = fdb.db('strike');

// reload all collections
for (var i = 0; i < COLLECTIONS.length; i++) {
  db.collection(COLLECTIONS[i]).load(function (err) {
    if (err) {
      console.log('Error occured while loading a collection: ' + err);
    }
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.method == 'getDeviceId') {
    var collection = db.collection('user');
    users = collection.find({});
    var user;
    if (users.length > 0) {
      user = users[0];
    }
    if (user.deviceId) {
      console.log('User deviceId', user.deviceId)
      sendResponse({
        success: true,
        deviceId: user.deviceId
      });
      return true;
    } else {
      sendResponse({
        success: false
      });
      return false;
    }
  } else if (request.method == 'getLoginStatus') {
    /*
    {
      emailId: 'akshay@getstrike.co'
    }
    */
    if (request.emailId) {
      var collection = db.collection('email');
      var emailData = collection.findOne({
        emailId: request.emailId
      });
      if (typeof emailData != 'undefined' && emailData && emailData.isLoggedIn) {
        sendResponse({
          status: true,
          data: emailData
        });
        return true;
      } else {
        sendResponse({
          status: false
        });
        return false;
      }
    } else {
      sendResponse({
        status: false
      });
      return false;
    }

  } else if (request.method == 'storeData') {
    /*
    {
      doc: Object,
      collection: string
    }
    */
    var collection = db.collection(request.collection);
    if (!request.doc._id) {
      request.doc._id = uuid.v4().split('-').join('')
    }
    collection.insert(request.doc);

    // Persist the collection
    collection.save(function (err) {
      if (err) {
        console.log(err);
      }
      sendResponse({
        success: true
      });
      return true;
    });
  } else if (request.method == 'getData') {
    /*
    {
      collection: string,
      query: object
    }
    */
    var collection = db.collection(request.collection);
    var res = collection.findOne(request.query);
    if (res) {
      sendResponse({
        success: true,
        data: res
      })
    } else {
      sendResponse({
        success: false
      });
    }
    return true;
  } else if (request.method == 'updateData') {
    /*
    {
      collection: string,
      query: object,
      doc: object,
      overwrite: bool (optional)
    }
    */
    var collection = db.collection(request.collection);
    if (typeof request.overwrite != 'undefined' && request.overwrite) {
      var update = collection.update(request.query, {
        $overwrite: request.doc
      });
    } else {
      var update = collection.update(request.query, request.doc);
    }
    collection.save(function (err) {
      if (err) {
        console.log(err);
      }
      sendResponse({
        success: true
      });
      return true;
    });
  } else if (request.method == 'apiRequest') {
    var API_URL = 'https://v2.getstrike.co', API_METHOD = 'GET', API_ENDPOINT = '/', API_TOKEN = null, API_DATA = {};

    if (request.apiUrl) {
      API_URL = request.apiUrl;
    }
    if (request.endpoint) {
      API_ENDPOINT = request.endpoint;
    }
    if (request.authToken) {
      API_TOKEN = request.authToken;
    }
    API_URI = API_URL + API_ENDPOINT;
    if (request.queryParameter) {
      API_URI = API_URI + '?' + request.queryParameter;
    }
    if (request.apiMethod) {
      API_METHOD = request.apiMethod;
    }
    if (request.data) {
      API_DATA = JSON.stringify(request.data);
    }


    var xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
      sendResponse({
        success: true,
        responseText: xhttp.responseText,
        status: xhttp.status
      });
    };
    xhttp.onerror = function() {
      sendResponse({
        success: false
      });
    };
    xhttp.open(API_METHOD, API_URI, true);
    if (API_TOKEN) {
      xhttp.setRequestHeader('Authorization', 'Bearer ' + API_TOKEN);
    }
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(API_DATA);
    return true;
  } else {
    sendResponse({});
    return true;
  }
  return true;
});



chrome.runtime.onInstalled.addListener(function(details){
  if (details.reason == 'install') {
    // generate unique device id
    var deviceId = uuid.v4();

    var collection = db.collection('user');
    collection.insert({
      deviceId: deviceId
    });




    //code for setting up FCM Sender ID needs change.
    function registerWithFCM(registrationId) {
      if (chrome.runtime.lastError) {
        // When the registration fails, handle the error and retry the
        // registration later.
        return;
      }
          console.log(registrationId);
    }
    chrome.storage.local.get("registered", function(result) {
      // If already registered, bail out.
      if (result["registered"]) {
        return;
      }
      // Up to 100 senders are allowed.
      var senderIds = ["800684444034"];
      chrome.gcm.register(senderIds, registerWithFCM);
    });


    chrome.gcm.onMessage.addListener(function(message) {
      console.log(message);
      var notif = new Notification(message.data.message, {
        body: "to be replaced with the data from the server",
        icon: chrome.extension.getURL('public/img/strike48.png')
      });
    });

    //end of FCM



    collection.save(function (err) {
      if (err) {
        console.log(err);
      }
      // Open/Refresh gmail tab
      chrome.tabs.query({
        url: '*://mail.google.com/*'
      }, function (tabs) {
        if (tabs.length > 0) {
          chrome.tabs.reload(tabs[0].id, function () {
            chrome.tabs.update(tabs[0].id, {selected: true});
          });
        } else {
          // open tab
          chrome.tabs.create({
            url: 'https://mail.google.com',
            active: true
          });
        }
      });
    });

  }
});
