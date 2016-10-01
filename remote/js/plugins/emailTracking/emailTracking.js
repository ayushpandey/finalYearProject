var EmailTrackingPlugin = function (opts) {
  this.libs = opts.libs;
  this.name = 'emailtracking';
  this.emailData = opts.emailData;
  this.endpointPrefix = '/emailtracking';
};


EmailTrackingPlugin.prototype._request = function(method, data, callback) {
  var self = this;
  var queryParams = 'deviceId=' + encodeURIComponent(self.emailData.deviceId) + '&userEmail=' + encodeURIComponent(self.libs.sdk.User.getEmailAddress()) + '&apiToken=' + encodeURIComponent(self.emailData.apiKey);
  chrome.runtime.sendMessage({
    method: 'apiRequest',
    endpoint: self.endpointPrefix,
    queryParameter: queryParams,
    apiMethod: method,
    data: data
    },function (res) {
      if (res.success && res.responseText) {
        if ((res.status >= 200 && res.status <300) || res.status == 304) {
          resp = JSON.parse(res.responseText);
          return callback(null, resp)
        }
      }
      return callback(JSON.stringify(res));
    });
  };

EmailTrackingPlugin.prototype.ui = {
  loadComposeViewElements: function (composeView) {
    var self = this;
    var to = [];
    var statusBarHTML;
    var data = {};
    var elem = document.createElement('div');
    elem.innerHTML = '<div id="error-container"></div>';
    $(elem).appendTo('body');
    $('div#error-container').load(chrome.extension.getURL('public/html/plugins/emailTracking/errorModal.html'));
    
    composeView.addButton({
      title: 'Send Tracked Email',
      onClick: function() {
        var sending = self.libs.sdk.ButterBar.showMessage({
          text:'Sending Your Message'
        });
        data.from = self.libs.sdk.User.getEmailAddress();
        data.to = composeView.getToRecipients();
        for (i in data.to) {
          to.push(data.to[i].emailAddress);
        }
        data.to = to;
        data.cc = composeView.getToRecipients();
        for (i in data.cc) {
          to.push(data.cc[i].emailAddress);
        }
        data.cc = to;     
        data.bcc = composeView.getToRecipients();
        for (i in data.bcc) {
          to.push(data.bcc[i].emailAddress);
        }
        data.bcc = to;    

        //Removing contents placed by grammarly
        var content = $('.gr-alert').contents();
        $('.gr-alert').replaceWith(content);

        if (data.to.length === 0 && data.cc.length === 0 && data.bcc.length === 0) {
          sending.destroy();
          console.log('inside null');
          $('#error-modal').modal('show');
        }
        else {
          if (composeView.isReply()) {
            var subject = composeView.getSubject();
            var html = composeView.getHTMLContent();
            data.subject = subject;
            data.html = html;
            data.timestamp = Date.now().toString();
            console.log(data.timestamp);
            self._request('POST', data, function(err,resp) {
              if (err){
                console.log(err);
                sending.destroy();
                self.libs.sdk.ButterBar.hideGmailMessage();
                self.libs.sdk.ButterBar.showMessage({
                  text:'There was a problem sending your message. Please Try again in some time.',
                  time:2000
                });
              }
              else {
                console.log(resp);
                sending.destroy();
                $('div.ip.adB>div.M9>div.aoI>table.aoP.HM>tbody>tr>td.I5>table.iN>tbody>tr>td.HE>div.aDg>div.aDj>div.aDh>table>tbody>tr.n1tfz>td.gU.az5>div.J-J5-Ji>div.J-J5-Ji>div.oh').trigger('click');
                self.libs.sdk.ButterBar.hideGmailMessage();
                self.libs.sdk.ButterBar.showMessage({
                  text:'Your message has been sent.',
                  time:5000
                });
                $.get(chrome.extension.getURL('public/html/plugins/emailTracking/threadRow.html'), function (threadRow) {
                  var user = self.libs.sdk.User.getAccountSwitcherContactList();
                  var recipients = data.to.toString();
                  console.log(recipients);
                  console.log(user[0]);
                  $(threadRow).insertBefore('td.Bu>div.nH.if>div.nH.aHU>div.nH.hx>div.nH>div.h7.ie.nH>div.Bk>div.G3.G2>div>div>div.gA.gt.acV');
                  $('div#email-tracking-threadRow>div.adn.ads>div.gs>div.ii.gt>div.message').replaceWith(html);
                  $('img#threadRow-nopic.ajn').attr("src", chrome.extension.getURL('public/img/profile-mask.png'));
                  $('div#email-tracking-threadRow>div.adn.ads>div.gs>div.iv.gt>table>tbody>tr.acZ>td.gF.gK>table.cf>tbody>tr>td>h3>span.go>span.emailID').replaceWith(user[0].emailAddress);
                  $('div#email-tracking-threadRow>div.adn.ads>div.gs>div.iv.gt>table>tbody>tr.acZ>td.gF.gK>table.cf>tbody>tr>td>h3>span.gD>div.emailName').replaceWith(user[0].name);
                  $('div#email-tracking-threadRow>div.adn.ads>div.gs>div.iv.gt>table>tbody>tr.acZ.xD>td>table>tbody>tr>td>div.ajw.iw>span.hb>span.g2>div.recipients').replaceWith(recipients);
                });
              }
            });
          }
          else {
            var subject = composeView.getSubject();
            var html = composeView.getHTMLContent();
            data.subject = subject;
            data.html = html;
            data.timestamp = Date.now();
            self._request('POST', data, function(err,resp) {
              if (err) {
                console.log(err);
                sending.destroy();
                self.libs.sdk.ButterBar.hideGmailMessage();
                self.libs.sdk.ButterBar.showMessage({
                  text:'There was a problem sending your message, It\'s now in the drafts.',
                  time:2000
                });
                composeView.close();
              }
              else {
                console.log(resp);
                sending.destroy();
                $('div.nH>div.aaZ>div.M9>div.aoI>table.aoP.aoC>tbody>tr>td.I5>table.iN>tbody>tr>td.HE>div.aDg>div.aDj>div.aDh>table>tbody>tr.n1tfz>td.gU.az5>div.J-J5-Ji>div.J-J5-Ji>div.oh').trigger('click');
                self.libs.sdk.ButterBar.hideGmailMessage();
                self.libs.sdk.ButterBar.showMessage({
                  text:'Your message has been sent.',
                  time:5000
                });
              }
            });
          }
        }
      } 
    });
    console.log("changing");
    $('table.IZ>tbody>tr.n1tfz>td.inboxsdk__compose_actionToolbar>div>div.T-I').attr('class','T-I J-J5-Ji ar7 L3 inboxsdk__button J-Z-I wG btn btn-default');
    $('table.IZ>tbody>tr.n1tfz>td.inboxsdk__compose_actionToolbar>div>div.T-I').css('backgound-color','red');
    $('table.IZ>tbody>tr.n1tfz>td.inboxsdk__compose_actionToolbar>div>div.T-I>div').append('<span style="color:#ffffff">Send Tracked</span>');
  
  }
};
