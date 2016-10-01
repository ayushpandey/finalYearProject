/*! 2016-08-25 */(function(){var async={};function noop(){}function identity(v){return v}function toBool(v){return!!v}function notId(v){return!v}var previous_async;var root=typeof self==="object"&&self.self===self&&self||typeof global==="object"&&global.global===global&&global||this;if(root!=null){previous_async=root.async}async.noConflict=function(){root.async=previous_async;return async};function only_once(fn){return function(){if(fn===null)throw new Error("Callback was already called.");fn.apply(this,arguments);fn=null}}function _once(fn){return function(){if(fn===null)return;fn.apply(this,arguments);fn=null}}var _toString=Object.prototype.toString;var _isArray=Array.isArray||function(obj){return _toString.call(obj)==="[object Array]"};var _isObject=function(obj){var type=typeof obj;return type==="function"||type==="object"&&!!obj};function _isArrayLike(arr){return _isArray(arr)||typeof arr.length==="number"&&arr.length>=0&&arr.length%1===0}function _arrayEach(arr,iterator){var index=-1,length=arr.length;while(++index<length){iterator(arr[index],index,arr)}}function _map(arr,iterator){var index=-1,length=arr.length,result=Array(length);while(++index<length){result[index]=iterator(arr[index],index,arr)}return result}function _range(count){return _map(Array(count),function(v,i){return i})}function _reduce(arr,iterator,memo){_arrayEach(arr,function(x,i,a){memo=iterator(memo,x,i,a)});return memo}function _forEachOf(object,iterator){_arrayEach(_keys(object),function(key){iterator(object[key],key)})}function _indexOf(arr,item){for(var i=0;i<arr.length;i++){if(arr[i]===item)return i}return-1}var _keys=Object.keys||function(obj){var keys=[];for(var k in obj){if(obj.hasOwnProperty(k)){keys.push(k)}}return keys};function _keyIterator(coll){var i=-1;var len;var keys;if(_isArrayLike(coll)){len=coll.length;return function next(){i++;return i<len?i:null}}else{keys=_keys(coll);len=keys.length;return function next(){i++;return i<len?keys[i]:null}}}function _restParam(func,startIndex){startIndex=startIndex==null?func.length-1:+startIndex;return function(){var length=Math.max(arguments.length-startIndex,0);var rest=Array(length);for(var index=0;index<length;index++){rest[index]=arguments[index+startIndex]}switch(startIndex){case 0:return func.call(this,rest);case 1:return func.call(this,arguments[0],rest)}}}function _withoutIndex(iterator){return function(value,index,callback){return iterator(value,callback)}}var _setImmediate=typeof setImmediate==="function"&&setImmediate;var _delay=_setImmediate?function(fn){_setImmediate(fn)}:function(fn){setTimeout(fn,0)};if(typeof process==="object"&&typeof process.nextTick==="function"){async.nextTick=process.nextTick}else{async.nextTick=_delay}async.setImmediate=_setImmediate?_delay:async.nextTick;async.forEach=async.each=function(arr,iterator,callback){return async.eachOf(arr,_withoutIndex(iterator),callback)};async.forEachSeries=async.eachSeries=function(arr,iterator,callback){return async.eachOfSeries(arr,_withoutIndex(iterator),callback)};async.forEachLimit=async.eachLimit=function(arr,limit,iterator,callback){return _eachOfLimit(limit)(arr,_withoutIndex(iterator),callback)};async.forEachOf=async.eachOf=function(object,iterator,callback){callback=_once(callback||noop);object=object||[];var iter=_keyIterator(object);var key,completed=0;while((key=iter())!=null){completed+=1;iterator(object[key],key,only_once(done))}if(completed===0)callback(null);function done(err){completed--;if(err){callback(err)}else if(key===null&&completed<=0){callback(null)}}};async.forEachOfSeries=async.eachOfSeries=function(obj,iterator,callback){callback=_once(callback||noop);obj=obj||[];var nextKey=_keyIterator(obj);var key=nextKey();function iterate(){var sync=true;if(key===null){return callback(null)}iterator(obj[key],key,only_once(function(err){if(err){callback(err)}else{key=nextKey();if(key===null){return callback(null)}else{if(sync){async.setImmediate(iterate)}else{iterate()}}}}));sync=false}iterate()};async.forEachOfLimit=async.eachOfLimit=function(obj,limit,iterator,callback){_eachOfLimit(limit)(obj,iterator,callback)};function _eachOfLimit(limit){return function(obj,iterator,callback){callback=_once(callback||noop);obj=obj||[];var nextKey=_keyIterator(obj);if(limit<=0){return callback(null)}var done=false;var running=0;var errored=false;(function replenish(){if(done&&running<=0){return callback(null)}while(running<limit&&!errored){var key=nextKey();if(key===null){done=true;if(running<=0){callback(null)}return}running+=1;iterator(obj[key],key,only_once(function(err){running-=1;if(err){callback(err);errored=true}else{replenish()}}))}})()}}function doParallel(fn){return function(obj,iterator,callback){return fn(async.eachOf,obj,iterator,callback)}}function doParallelLimit(fn){return function(obj,limit,iterator,callback){return fn(_eachOfLimit(limit),obj,iterator,callback)}}function doSeries(fn){return function(obj,iterator,callback){return fn(async.eachOfSeries,obj,iterator,callback)}}function _asyncMap(eachfn,arr,iterator,callback){callback=_once(callback||noop);arr=arr||[];var results=_isArrayLike(arr)?[]:{};eachfn(arr,function(value,index,callback){iterator(value,function(err,v){results[index]=v;callback(err)})},function(err){callback(err,results)})}async.map=doParallel(_asyncMap);async.mapSeries=doSeries(_asyncMap);async.mapLimit=doParallelLimit(_asyncMap);async.inject=async.foldl=async.reduce=function(arr,memo,iterator,callback){async.eachOfSeries(arr,function(x,i,callback){iterator(memo,x,function(err,v){memo=v;callback(err)})},function(err){callback(err,memo)})};async.foldr=async.reduceRight=function(arr,memo,iterator,callback){var reversed=_map(arr,identity).reverse();async.reduce(reversed,memo,iterator,callback)};async.transform=function(arr,memo,iterator,callback){if(arguments.length===3){callback=iterator;iterator=memo;memo=_isArray(arr)?[]:{}}async.eachOf(arr,function(v,k,cb){iterator(memo,v,k,cb)},function(err){callback(err,memo)})};function _filter(eachfn,arr,iterator,callback){var results=[];eachfn(arr,function(x,index,callback){iterator(x,function(v){if(v){results.push({index:index,value:x})}callback()})},function(){callback(_map(results.sort(function(a,b){return a.index-b.index}),function(x){return x.value}))})}async.select=async.filter=doParallel(_filter);async.selectLimit=async.filterLimit=doParallelLimit(_filter);async.selectSeries=async.filterSeries=doSeries(_filter);function _reject(eachfn,arr,iterator,callback){_filter(eachfn,arr,function(value,cb){iterator(value,function(v){cb(!v)})},callback)}async.reject=doParallel(_reject);async.rejectLimit=doParallelLimit(_reject);async.rejectSeries=doSeries(_reject);function _createTester(eachfn,check,getResult){return function(arr,limit,iterator,cb){function done(){if(cb)cb(getResult(false,void 0))}function iteratee(x,_,callback){if(!cb)return callback();iterator(x,function(v){if(cb&&check(v)){cb(getResult(true,x));cb=iterator=false}callback()})}if(arguments.length>3){eachfn(arr,limit,iteratee,done)}else{cb=iterator;iterator=limit;eachfn(arr,iteratee,done)}}}async.any=async.some=_createTester(async.eachOf,toBool,identity);async.someLimit=_createTester(async.eachOfLimit,toBool,identity);async.all=async.every=_createTester(async.eachOf,notId,notId);async.everyLimit=_createTester(async.eachOfLimit,notId,notId);function _findGetResult(v,x){return x}async.detect=_createTester(async.eachOf,identity,_findGetResult);async.detectSeries=_createTester(async.eachOfSeries,identity,_findGetResult);async.detectLimit=_createTester(async.eachOfLimit,identity,_findGetResult);async.sortBy=function(arr,iterator,callback){async.map(arr,function(x,callback){iterator(x,function(err,criteria){if(err){callback(err)}else{callback(null,{value:x,criteria:criteria})}})},function(err,results){if(err){return callback(err)}else{callback(null,_map(results.sort(comparator),function(x){return x.value}))}});function comparator(left,right){var a=left.criteria,b=right.criteria;return a<b?-1:a>b?1:0}};async.auto=function(tasks,concurrency,callback){if(!callback){callback=concurrency;concurrency=null}callback=_once(callback||noop);var keys=_keys(tasks);var remainingTasks=keys.length;if(!remainingTasks){return callback(null)}if(!concurrency){concurrency=remainingTasks}var results={};var runningTasks=0;var listeners=[];function addListener(fn){listeners.unshift(fn)}function removeListener(fn){var idx=_indexOf(listeners,fn);if(idx>=0)listeners.splice(idx,1)}function taskComplete(){remainingTasks--;_arrayEach(listeners.slice(0),function(fn){fn()})}addListener(function(){if(!remainingTasks){callback(null,results)}});_arrayEach(keys,function(k){var task=_isArray(tasks[k])?tasks[k]:[tasks[k]];var taskCallback=_restParam(function(err,args){runningTasks--;if(args.length<=1){args=args[0]}if(err){var safeResults={};_forEachOf(results,function(val,rkey){safeResults[rkey]=val});safeResults[k]=args;callback(err,safeResults)}else{results[k]=args;async.setImmediate(taskComplete)}});var requires=task.slice(0,task.length-1);var len=requires.length;var dep;while(len--){if(!(dep=tasks[requires[len]])){throw new Error("Has inexistant dependency")}if(_isArray(dep)&&_indexOf(dep,k)>=0){throw new Error("Has cyclic dependencies")}}function ready(){return runningTasks<concurrency&&_reduce(requires,function(a,x){return a&&results.hasOwnProperty(x)},true)&&!results.hasOwnProperty(k)}if(ready()){runningTasks++;task[task.length-1](taskCallback,results)}else{addListener(listener)}function listener(){if(ready()){runningTasks++;removeListener(listener);task[task.length-1](taskCallback,results)}}})};async.retry=function(times,task,callback){var DEFAULT_TIMES=5;var DEFAULT_INTERVAL=0;var attempts=[];var opts={times:DEFAULT_TIMES,interval:DEFAULT_INTERVAL};function parseTimes(acc,t){if(typeof t==="number"){acc.times=parseInt(t,10)||DEFAULT_TIMES}else if(typeof t==="object"){acc.times=parseInt(t.times,10)||DEFAULT_TIMES;acc.interval=parseInt(t.interval,10)||DEFAULT_INTERVAL}else{throw new Error("Unsupported argument type for 'times': "+typeof t)}}var length=arguments.length;if(length<1||length>3){throw new Error("Invalid arguments - must be either (task), (task, callback), (times, task) or (times, task, callback)")}else if(length<=2&&typeof times==="function"){callback=task;task=times}if(typeof times!=="function"){parseTimes(opts,times)}opts.callback=callback;opts.task=task;function wrappedTask(wrappedCallback,wrappedResults){function retryAttempt(task,finalAttempt){return function(seriesCallback){task(function(err,result){seriesCallback(!err||finalAttempt,{err:err,result:result})},wrappedResults)}}function retryInterval(interval){return function(seriesCallback){setTimeout(function(){seriesCallback(null)},interval)}}while(opts.times){var finalAttempt=!(opts.times-=1);attempts.push(retryAttempt(opts.task,finalAttempt));if(!finalAttempt&&opts.interval>0){attempts.push(retryInterval(opts.interval))}}async.series(attempts,function(done,data){data=data[data.length-1];(wrappedCallback||opts.callback)(data.err,data.result)})}return opts.callback?wrappedTask():wrappedTask};async.waterfall=function(tasks,callback){callback=_once(callback||noop);if(!_isArray(tasks)){var err=new Error("First argument to waterfall must be an array of functions");return callback(err)}if(!tasks.length){return callback()}function wrapIterator(iterator){return _restParam(function(err,args){if(err){callback.apply(null,[err].concat(args))}else{var next=iterator.next();if(next){args.push(wrapIterator(next))}else{args.push(callback)}ensureAsync(iterator).apply(null,args)}})}wrapIterator(async.iterator(tasks))()};function _parallel(eachfn,tasks,callback){callback=callback||noop;var results=_isArrayLike(tasks)?[]:{};eachfn(tasks,function(task,key,callback){task(_restParam(function(err,args){if(args.length<=1){args=args[0]}results[key]=args;callback(err)}))},function(err){callback(err,results)})}async.parallel=function(tasks,callback){_parallel(async.eachOf,tasks,callback)};async.parallelLimit=function(tasks,limit,callback){_parallel(_eachOfLimit(limit),tasks,callback)};async.series=function(tasks,callback){_parallel(async.eachOfSeries,tasks,callback)};async.iterator=function(tasks){function makeCallback(index){function fn(){if(tasks.length){tasks[index].apply(null,arguments)}return fn.next()}fn.next=function(){return index<tasks.length-1?makeCallback(index+1):null};return fn}return makeCallback(0)};async.apply=_restParam(function(fn,args){return _restParam(function(callArgs){return fn.apply(null,args.concat(callArgs))})});function _concat(eachfn,arr,fn,callback){var result=[];eachfn(arr,function(x,index,cb){fn(x,function(err,y){result=result.concat(y||[]);cb(err)})},function(err){callback(err,result)})}async.concat=doParallel(_concat);async.concatSeries=doSeries(_concat);async.whilst=function(test,iterator,callback){callback=callback||noop;if(test()){var next=_restParam(function(err,args){if(err){callback(err)}else if(test.apply(this,args)){iterator(next)}else{callback(null)}});iterator(next)}else{callback(null)}};async.doWhilst=function(iterator,test,callback){var calls=0;return async.whilst(function(){return++calls<=1||test.apply(this,arguments)},iterator,callback)};async.until=function(test,iterator,callback){return async.whilst(function(){return!test.apply(this,arguments)},iterator,callback)};async.doUntil=function(iterator,test,callback){return async.doWhilst(iterator,function(){return!test.apply(this,arguments)},callback)};async.during=function(test,iterator,callback){callback=callback||noop;var next=_restParam(function(err,args){if(err){callback(err)}else{args.push(check);test.apply(this,args)}});var check=function(err,truth){if(err){callback(err)}else if(truth){iterator(next)}else{callback(null)}};test(check)};async.doDuring=function(iterator,test,callback){var calls=0;async.during(function(next){if(calls++<1){next(null,true)}else{test.apply(this,arguments)}},iterator,callback)};function _queue(worker,concurrency,payload){if(concurrency==null){concurrency=1}else if(concurrency===0){throw new Error("Concurrency must not be zero")}function _insert(q,data,pos,callback){if(callback!=null&&typeof callback!=="function"){throw new Error("task callback must be a function")}q.started=true;if(!_isArray(data)){data=[data]}if(data.length===0&&q.idle()){return async.setImmediate(function(){q.drain()})}_arrayEach(data,function(task){var item={data:task,callback:callback||noop};if(pos){q.tasks.unshift(item)}else{q.tasks.push(item)}if(q.tasks.length===q.concurrency){q.saturated()}});async.setImmediate(q.process)}function _next(q,tasks){return function(){workers-=1;var removed=false;var args=arguments;_arrayEach(tasks,function(task){_arrayEach(workersList,function(worker,index){if(worker===task&&!removed){workersList.splice(index,1);removed=true}});task.callback.apply(task,args)});if(q.tasks.length+workers===0){q.drain()}q.process()}}var workers=0;var workersList=[];var q={tasks:[],concurrency:concurrency,payload:payload,saturated:noop,empty:noop,drain:noop,started:false,paused:false,push:function(data,callback){_insert(q,data,false,callback)},kill:function(){q.drain=noop;q.tasks=[]},unshift:function(data,callback){_insert(q,data,true,callback)},process:function(){if(!q.paused&&workers<q.concurrency&&q.tasks.length){while(workers<q.concurrency&&q.tasks.length){var tasks=q.payload?q.tasks.splice(0,q.payload):q.tasks.splice(0,q.tasks.length);var data=_map(tasks,function(task){return task.data});if(q.tasks.length===0){q.empty()}workers+=1;workersList.push(tasks[0]);var cb=only_once(_next(q,tasks));worker(data,cb)}}},length:function(){return q.tasks.length},running:function(){return workers},workersList:function(){return workersList},idle:function(){return q.tasks.length+workers===0},pause:function(){q.paused=true},resume:function(){if(q.paused===false){return}q.paused=false;var resumeCount=Math.min(q.concurrency,q.tasks.length);for(var w=1;w<=resumeCount;w++){async.setImmediate(q.process)}}};return q}async.queue=function(worker,concurrency){var q=_queue(function(items,cb){worker(items[0],cb)},concurrency,1);return q};async.priorityQueue=function(worker,concurrency){function _compareTasks(a,b){return a.priority-b.priority}function _binarySearch(sequence,item,compare){var beg=-1,end=sequence.length-1;while(beg<end){var mid=beg+(end-beg+1>>>1);if(compare(item,sequence[mid])>=0){beg=mid}else{end=mid-1}}return beg}function _insert(q,data,priority,callback){if(callback!=null&&typeof callback!=="function"){throw new Error("task callback must be a function")}q.started=true;if(!_isArray(data)){data=[data]}if(data.length===0){return async.setImmediate(function(){q.drain()})}_arrayEach(data,function(task){var item={data:task,priority:priority,callback:typeof callback==="function"?callback:noop};q.tasks.splice(_binarySearch(q.tasks,item,_compareTasks)+1,0,item);if(q.tasks.length===q.concurrency){q.saturated()}async.setImmediate(q.process)})}var q=async.queue(worker,concurrency);q.push=function(data,priority,callback){_insert(q,data,priority,callback)};delete q.unshift;return q};async.cargo=function(worker,payload){return _queue(worker,1,payload)};function _console_fn(name){return _restParam(function(fn,args){fn.apply(null,args.concat([_restParam(function(err,args){if(typeof console==="object"){if(err){if(console.error){console.error(err)}}else if(console[name]){_arrayEach(args,function(x){console[name](x)})}}})]))})}async.log=_console_fn("log");async.dir=_console_fn("dir");async.memoize=function(fn,hasher){var memo={};var queues={};hasher=hasher||identity;var memoized=_restParam(function memoized(args){var callback=args.pop();var key=hasher.apply(null,args);if(key in memo){async.setImmediate(function(){callback.apply(null,memo[key])})}else if(key in queues){queues[key].push(callback)}else{queues[key]=[callback];fn.apply(null,args.concat([_restParam(function(args){memo[key]=args;var q=queues[key];delete queues[key];for(var i=0,l=q.length;i<l;i++){q[i].apply(null,args)}})]))}});memoized.memo=memo;memoized.unmemoized=fn;return memoized};async.unmemoize=function(fn){return function(){return(fn.unmemoized||fn).apply(null,arguments)}};function _times(mapper){return function(count,iterator,callback){mapper(_range(count),iterator,callback)}}async.times=_times(async.map);async.timesSeries=_times(async.mapSeries);async.timesLimit=function(count,limit,iterator,callback){return async.mapLimit(_range(count),limit,iterator,callback)};async.seq=function(){var fns=arguments;return _restParam(function(args){var that=this;var callback=args[args.length-1];if(typeof callback=="function"){args.pop()}else{callback=noop}async.reduce(fns,args,function(newargs,fn,cb){fn.apply(that,newargs.concat([_restParam(function(err,nextargs){cb(err,nextargs)})]))},function(err,results){callback.apply(that,[err].concat(results))})})};async.compose=function(){return async.seq.apply(null,Array.prototype.reverse.call(arguments))};function _applyEach(eachfn){return _restParam(function(fns,args){var go=_restParam(function(args){var that=this;var callback=args.pop();return eachfn(fns,function(fn,_,cb){fn.apply(that,args.concat([cb]))},callback)});if(args.length){return go.apply(this,args)}else{return go}})}async.applyEach=_applyEach(async.eachOf);async.applyEachSeries=_applyEach(async.eachOfSeries);async.forever=function(fn,callback){var done=only_once(callback||noop);var task=ensureAsync(fn);function next(err){if(err){return done(err)}task(next)}next()};function ensureAsync(fn){return _restParam(function(args){var callback=args.pop();args.push(function(){var innerArgs=arguments;if(sync){async.setImmediate(function(){callback.apply(null,innerArgs)})}else{callback.apply(null,innerArgs)}});var sync=true;fn.apply(this,args);sync=false})}async.ensureAsync=ensureAsync;async.constant=_restParam(function(values){var args=[null].concat(values);return function(callback){return callback.apply(this,args)}});async.wrapSync=async.asyncify=function asyncify(func){return _restParam(function(args){var callback=args.pop();var result;try{result=func.apply(this,args)}catch(e){return callback(e)}if(_isObject(result)&&typeof result.then==="function"){result.then(function(value){callback(null,value)})["catch"](function(err){callback(err.message?err:new Error(err))})}else{callback(null,result)}})};if(typeof module==="object"&&module.exports){module.exports=async}else if(typeof define==="function"&&define.amd){define([],function(){return async})}else{root.async=async}})();
 var StrikeConfig = {
  LOGIN_DOMAIN: 'https://app.getstrike.co',
  GOOGLE_LOGIN_URL: 'https://app.getstrike.co/auth/google'
}
 var SignupController = (function () {

  var signupModal, googleLoginPopup;

  var _addSignupEvents = function (hasOtherAccount, emailId, libs, callback) {
    // add listener for closing the modal
    $('div.strike-container#signin .strike-modal-close').on('click', function () {
      $('div.strike-container#signin').remove();
    });
    // add event for signup button
    $('div.strike-container#signin div#signin-prompt-button').on('click', function () {
      bootstrapSignin(hasOtherAccount, emailId, libs, function (err, code, emailData) {
        //console.log(err, code, emailData);
        if (err) {
          // display the error message
          $('div.strike-container').load(chrome.extension.getURL('public/html/signinErrorModal.html'), function () {
            _addSignupEvents(hasOtherAccount, emailId, libs, callback);
          });
        } else {
          $('div.strike-container').load(chrome.extension.getURL('public/html/signinSuccessModal.html'), function () {
            // add listener for closing the modal
            $('div.strike-container#signin .strike-modal-close').on('click', function () {
              window.location.reload();
            });
            $('div.strike-container#signin #skip-videos').on('click', function () {
              window.location.reload();
            });
          });
        }
      });
    });
  };


  var showSignupWindow = function (hasOtherAccount, emailId, libs, callback) {

    var elem = document.createElement('div');
    elem.innerHTML = '<div class="strike-container" id="signin"></div>';
    //console.log(chrome.extension.getURL('public/html/signinModal.html'));

    $(elem).appendTo('body');
    $('div.strike-container#signin').load(chrome.extension.getURL('public/html/signinModal.html'), function () {

      $('div.strike-container #signin-modal span#emailid').text(emailId);

      $('div.strike-container #signin-modal img#signin-logo').attr('src', chrome.extension.getURL('public/img/strike.png'));
      chrome.runtime.sendMessage({
        method: 'getData',
        collection: 'email',
        query: {
          emailId: libs.sdk.User.getEmailAddress()
        }
      }, function (res) {
        if (res.success) {
          console.log('Data Found ' + JSON.stringify(res.data));

        } else {
          userData = {};
          userData.emailId = libs.sdk.User.getEmailAddress();
          userData.isLoggedIn = false;
          userData.settings = {
            noSignupWindow: false
          };
          chrome.runtime.sendMessage({
            method: 'storeData',
            doc: userData,
            collection: 'email'
          }, function (res) {
            if (res.success) {
              console.log('Data Written' + JSON.stringify(res) );
            } else {
              console.log('Error');
            }
          });
        }
      });
      $('div.strike-container #signin-prompt-dismiss-forever').on('click', function () {
        $('div.strike-container').remove();
        removeEmail(libs.sdk.User.getEmailAddress());
      });

      _addSignupEvents(hasOtherAccount, emailId, libs, callback);

    });
  };
  var removeEmail = function (emailId) {
    // console.log(emailId);
    emailData = {};
    emailData.isLoggedIn = false;
    emailData.settings = {
      noSignupWindow: true
    };
    chrome.runtime.sendMessage({
      method: 'updateData',
      query: {
        emailId: emailId
      },
      doc: emailData,
      collection: 'email',
      overwrite: false
    }, function (res) {
      if (res) {
        console.log('Data Overwritten' + JSON.stringify(res));
      } else {
        console.log('Not OverWritten')
      }
    });
  }

  var bootstrapSignin = function (hasOtherAccount, emailId, libs, callback) {
    //console.log('bootstrapSignin');
    // get the device id
    chrome.runtime.sendMessage({
      method: 'getDeviceId'
    }, function (res) {
      //console.log(res);
      if (res.success && res.deviceId) {
        deviceId = res.deviceId;
        googleLoginPopup = window.open(StrikeConfig.GOOGLE_LOGIN_URL + '?email=' + emailId + '&deviceType=chrome&deviceId=' + deviceId, 'gmailLogin', "width=380px, height=480px");
      } else {
        // Display error message
        return callback('Error showing signup window. Please try again', 'nonFatal')
      }
    });

    var _signupMessageReceiver = function (e) {
      if (e.origin == StrikeConfig.LOGIN_DOMAIN) {
        if (e.data) {
          if (e.data.user) {
            window.removeEventListener('message', _signupMessageReceiver);
            var userData = JSON.parse(e.data.user);

            // save the relevant data
            async.waterfall([
              function getDeviceId(cb) {
                chrome.runtime.sendMessage({
                  method: 'getDeviceId'
                }, function (res) {
                  if (res.success && res.deviceId) {
                    console.log('Device Id', res.deviceId)
                    return cb(null, null, deviceId);
                  } else {
                    return cb('Error logging in with Google. Please try again', 'nonFatal');
                  }
                });
              },
              function saveUser(code, deviceId, cb) {
                var user = {};
                user.deviceId = deviceId;
                if (userData.device && userData.device.length > 0) {
                  for (var i = 0; i < userData.device.length; i++) {
                    if (userData.device[i].deviceId == user.deviceId && userData.device[i].deviceType == 'chrome') {
                      user.apiKey = userData.device[i].apiKey;
                      break;
                    }
                  }

                  if (user.apiKey) {
                    // add all other data
                    user.name = userData.name[0];
                    user.location = userData.location[0];
                    user.profilePictureUrl = userData.profilePicture[0].url;
                    user.gender = userData.gender;
                    user.birthday = userData.birthday;
                    user.gender = userData.gender;
                    delete user.apiKey;
                    // save the user
                    chrome.runtime.sendMessage({
                      method: 'updateData',
                      doc: user,
                      collection: 'user',
                      query: {
                        deviceId: user.deviceId
                      }
                    }, function (res) {
                      console.log('User', user)
                      if (res.success) {
                        return cb(null, null, user);
                      } else {
                        return cb('Error logging in with Google. Please try again', 'nonFatal');
                      }
                    });
                  } else {
                    return cb('Error logging in with Google. Please try again', 'nonFatal');
                  }
                } else {
                  return cb('Error logging in with Google. Please try again', 'nonFatal');
                }
              },
              function saveEmailData(code, user, cb) {
                var emailData = {};
                emailData.emailId = libs.sdk.User.getEmailAddress();
                emailData.isLoggedIn = true;
                emailData.settings = {
                  noSignupWindow: false
                };
                emailData.deviceId = user.deviceId;
                if (userData.device && userData.device.length > 0) {
                  for (var i=0; i< userData.device.length; i++) {
                    if (userData.device[i].deviceId == emailData.deviceId && userData.device[i].deviceType == 'chrome') {
                      emailData.apiKey = userData.device[i].apiKey;
                    }
                  }
                }
                var socialEmailIds = {};
                if (userData.social && userData.social.length > 0) {
                  for (var i = 0; i < userData.social.length; i++) {
                    if (userData.social[i].emailId) {
                      socialEmailIds[userData.social[i].socialType] = userData.social[i].emailId
                    }
                  }
                }
                emailData.integrations = [];
                // save the integrations data
                if (userData.integrations && userData.integrations.length > 0) {
                  for (var i = 0; i < userData.integrations.length; i++) {
                    if (userData.integrations[i].emailId == emailData.emailId) {
                      var integration = {
                        partnerId: userData.integrations[i].partnerId,
                        plan: userData.integrations[i].plan.name,
                        isActive: userData.integrations[i].isActive,
                        status: userData.integrations[i].status
                      };
                      var addons = [];
                      for (var j=0; j<userData.integrations[i].addons.length; j++) {
                        addons = addons.concat({
                          name: userData.integrations[i].addons[j].name,
                          data: userData.integrations[i].addons[j].data,
                          isActive: userData.integrations[i].addons[j].status == 'active' || userData.integrations[i].addons[j].status == 'trial' ? true : false,
                          addonEmail: socialEmailIds[userData.integrations[i].addons[j].name]
                        });
                      }
                      integration.addons = addons;
                      emailData.integrations = emailData.integrations.concat(integration);
                    }
                  }
                }


                chrome.runtime.sendMessage({
                  method: 'updateData',
                  doc: emailData,
                  collection: 'email',
                  query: {
                    emailId: emailData.emailId
                  }
                }, function (res) {
                  if (res.success) {
                    return cb(null, null, emailData);
                  } else {
                    return cb('Error logging in with Google. Please try again', 'nonFatal');
                  }
                });
              }
            ], function (err, code, emailData) {
              //console.log(err, code, emailData)
              callback(err, code, emailData);
            });

          } else {
            return callback('Error. Please try again', 'nonFatal')
          }
        } else {
          return callback('Error. Please try again', 'nonFatal')
        }
      }
    };

    window.addEventListener('message', _signupMessageReceiver);
  }


  return {
    showSignupWindow: showSignupWindow,
    bootstrapSignin: bootstrapSignin
  }
})();
 Promise.all([
  InboxSDK.load('1', 'sdk_Strike_f9ae58aa35', {
    appName: 'Strike',
    appIconUrl: chrome.extension.getURL('public/img/strike.png')
  })
]).then(function (results) {
  var sdk = results[0];

  // Initialize libraries
  _opbeat('config', {
    orgId: 'a58d59d650cf42dd9fcdfdf453b10b67',
    appId: '40b0744c3c'
  });

  // Create Event Emmiters
  var eventEmmiter = new EventEmitter();



  var libs = {
    sdk: sdk,
    eventEmmiter: eventEmmiter
  };
  var emailData;
  var plugins = {};

  window.strike = {};




  var _checkPluginSubscription = function (emailData, plugin, partnerId) {
    if (emailData.integrations && emailData.integrations.length > 0) {
      integrations = emailData.integrations;
      for (var i=0; i<integrations.length; i++) {
        if (integrations[i].partnerId == partnerId && integrations[i].isActive && integrations[i].addons && integrations[i].addons.length > 0) {
          for (var j = 0; j < integrations[i].addons.length; j++) {
            if (integrations[i].addons[j].name == plugin && integrations[i].addons[j].isActive) {
              if (integrations[i].addons[j].addonEmail) {
                return integrations[i].addons[j].addonEmail;
              } else {
                return emailData.emailId;
              }
            }
          }
        }
      }
      return false;
    } else {
      return false;
    }
  }

  // login modal
  async.waterfall([
    function getLoginStatus(cb) {
      chrome.runtime.sendMessage({
        method: 'getLoginStatus',
        emailId: sdk.User.getEmailAddress()
      }, function (res) {
        if (res.status) {
          emailData = res.data;
          return cb(null, null, emailData);
        } else {
          return cb('err', 'login', emailData);
        }
      });
    },
    function initializePlugins(code, emailData, cb) {
      window.strike.activatedPlugins = window.strike.activatedPlugins || [];
      window.strike.people = [];

      // initialize plugins
      var emailTrackingSubscription = _checkPluginSubscription(emailData, 'emailtracking', 'strike');
      if (emailTrackingSubscription) {
        plugins.emailtracking = new EmailTrackingPlugin({
          libs: libs,
          addonEmail: emailTrackingSubscription,
          emailData: emailData
        });
        window.strike.activatedPlugins= window.strike.activatedPlugins.concat('EmailTracking');
      }
      

      var subscriptionEmail = _checkPluginSubscription(emailData, 'salesforce', 'strike');
      if (subscriptionEmail) {
        plugins.salesforce = new SalesforcePlugin({
          libs: libs,
          addonEmail: subscriptionEmail,
          emailData: emailData
        });

        window.strike.activatedPlugins = window.strike.activatedPlugins.concat('salesforce');
      }

      for (var key in plugins) {
        plugin = plugins[key];
        if (typeof plugin.backgroundFetch == 'function') {
          plugin.backgroundFetch.call(plugin);
        }
      }
      return cb(null, null, emailData);
    }
  ], function (err, code, user) {
    if (err) {
      switch (code) {
        case 'login':
          async.waterfall([
            function checkIfSignupWindowShouldBeShwon(cb) {
              chrome.runtime.sendMessage({
                method: 'getData',
                collection: 'email',
                query: {
                  emailId: sdk.User.getEmailAddress()
                }
              }, function (res) {
                if (res.data && res.data.settings && res.data.settings.noSignupWindow) {
                  return cb('User has disabled this email id');
                } else {
                  return cb(null);
                }
              });
            },
            function login(cb) {
              SignupController.showSignupWindow(false, sdk.User.getEmailAddress(), libs, cb);
            }
          ], function (err, code, user) {
            if (err) {
              switch (code) {
                case 'login':
                  // Display the error screen
                  sdk.ButterBar.showMessage({
                    text: 'An error occured while logging in. Please try again.'
                  });
                  break;
              }
            }
          });
          break;
      }
    } else {
      // everything is fine, the user can make their emails 100X smarter now!
    }
  });



  // sidebar elements
  sdk.Conversations.registerThreadViewHandler(function (threadView) {

    // for (var i = 0; i < recipients.length; i++) {
    //   flag = 0;
    //   for (var j = 0; j < window.strike.people.length; j++) {
    //     if (recipients[i].emailAddress == window.strike.people[j].emailAddress) {
    //       flag = 1;
    //       break;
    //     }
    //   }
    //   if (!flag) {
    //     window.strike.people = window.strike.people.concat(recipients[i]);
    //     // prefetch the data
    //     UserController.fetchProfile(libs, recipients[i], function (err, code, profileData, contact) {
    //     });
    //   }
    // }

    async.waterfall([
      function getLoginStatus(cb) {
        chrome.runtime.sendMessage({
          method: 'getLoginStatus',
          emailId: sdk.User.getEmailAddress()
        }, function (res) {
          if (res.status) {
            return cb(null, null);
          } else {
            return cb('Login to see social profiles right in you sidebar', 'login')
          }
        });
      },
      function didplayPeopleProfileHolder(code, cb) {
        var messages = threadView.getMessageViews();
        var profileToShow = messages[0].getSender();
        if (profileToShow.emailAddress == sdk.User.getEmailAddress()) {
          var receipients = messages[0].getRecipients();
          for (var i=0; i<receipients.length; i++) {
            if (receipients[i] != sdk.User.getEmailAddress()) {
              profileToShow = receipients[i];
              break;
            }
          }
        }

        var profileHtml = document.createElement('div');
        profileHtml.innerHTML = '<div class="strike-container" id="people-profile"></div>';

        // add sidebar content
        var profileView = threadView.addSidebarContentPanel({
          el: profileHtml,
          title: 'Strike',
          iconUrl: chrome.extension.getURL('public/img/strike.png'),
          orderHint: 1
        });

        // load the profile html
        $('div.strike-container#people-profile').load(chrome.extension.getURL('public/html/sidebarProfile.html'), function () {
          UserController.displayProfile(libs, profileView, profileToShow);
          return cb(null, null, profileView);
        });
      },
      function addEventsForHover(code, profileView, cb) {
        threadView.on('contactHover', function (e) {
          // reload the profile html
          $('div.strike-container#people-profile').load(chrome.extension.getURL('public/html/sidebarProfile.html'), function () {
            UserController.displayProfile(libs, profileView, e.contact);
          });
        });
        return cb(null, null);
      },
      function populatePeopleIntoWindowObj(cb) {
        window.strike.people = [];
        // get email ids in the thread
        // We are not using inboxsdk's methods here because it doesn't return any data if the message is collapsed
        var messageDivs = $('div.AO table tr td.Bu .nH.if .nH.aHU .nH.hx .nH[role="list"] div[role="listitem"] span[email]');

        messageDivs.each(function (index, elem) {
          var person = {
            emailAddress: $(elem).attr('email'),
            name: $(elem).attr('name')
          }

          // Prefetch the profile
          UserController.fetchProfile(libs, person, function (err, code, profileData, contact) {
          });

          if (person.name != 'me') {
            if (window.strike.people.length == 0) {
              window.strike.people.push(person)
            } else {
              var flag = 0;
              for (var i = 0; i < window.strike.people.length; i++) {
                if (window.strike.people[i].emailAddress == person.emailAddress) {
                  flag = 1;
                  break;
                }
              }
              if (!flag) {
                window.strike.people.push(person);
              }
            }
          }

        });
      }
    ], function (err, code) {
      if (err) {
        switch (code) {
          case 'login':
            if (!$('div.strike-container .strike-modal-fullscreen').length) {
              // display the login sidebar
              var profileHtml = document.createElement('div');
              profileHtml.innerHTML = '<div class="strike-container" id="people-profile"></div>';

              // add sidebar content
              var profileView = threadView.addSidebarContentPanel({
                el: profileHtml,
                title: 'Strike',
                iconUrl: chrome.extension.getURL('public/img/strike.png'),
                orderHint: 1
              });

              // load the profile html
              $('div.strike-container#people-profile').load(chrome.extension.getURL('public/html/sidebarProfileSignin.html'), function () {
                $('div.strike-container#people-profile #sidebar-signin #signin-logo').attr('src', chrome.extension.getURL('public/img/strike.png'));
                $('div.strike-container#people-profile #sidebar-signin div#signin-prompt-button').on('click', function () {
                  SignupController.bootstrapSignin(false, sdk.User.getEmailAddress(), libs, function (err, code, emailData) {
                    if (err) {
                      // display the error message
                      sdk.ButterBar.showMessage({
                        text: 'An error occured while logging in. Please try again.'
                      });
                    } else {
                      // start displaying the profile
                      var messages = threadView.getMessageViews();
                      var profileToShow = messages[0].getSender();
                      if (profileToShow.emailAddress == sdk.User.getEmailAddress()) {
                        var receipients = messages[0].getRecipients();
                        for (var i=0; i<receipients.length; i++) {
                          if (receipients[i] != sdk.User.getEmailAddress()) {
                            profileToShow = receipients[i];
                            break;
                          }
                        }
                      }

                      // load the profile html
                      $('div.strike-container#people-profile').load(chrome.extension.getURL('public/html/sidebarProfile.html'), function () {
                        UserController.displayProfile(libs, profileView, profileToShow);
                      });
                    }
                  });
                });
              });
              break;
            }
        }
      } else {
        // the user logged in
      }
    });
  });


  // compose window handler
  sdk.Compose.registerComposeViewHandler(function (composeView) {
    async.waterfall([
      function getLoginStatus(cb) {
        chrome.runtime.sendMessage({
          method: 'getLoginStatus',
          emailId: sdk.User.getEmailAddress()
        }, function (res) {
          if (res.status) {
            return cb(null, null);
          } else {
            return cb('Login to access strike compose window functionalities', 'login')
          }
        });
      },
      function addContactEvents(code, cb) {
        var profileToShow;
        var reciepients = composeView.getToRecipients();
        var reciepientsCc = composeView.getCcRecipients();
        var reciepientsBcc = composeView.getBccRecipients();
        for (var i=0; i<reciepients.length; i++) {
          if (reciepients[i].emailAddress != sdk.User.getEmailAddress) {
            profileToShow = reciepients[i];
            UserController.displayProfile(libs, null, profileToShow);
            break;
          }
        }
        if (!profileToShow) {
          for (var i=0; i<reciepientsCc.length; i++) {
            if (reciepientsCc[i].emailAddress != sdk.User.getEmailAddress) {
              profileToShow = reciepientsCc[i];
              UserController.displayProfile(libs, null, profileToShow);
              break;
            }
          }
        }
        if (!profileToShow) {
          for (var i=0; i<reciepientsBcc.length; i++) {
            if (reciepientsBcc[i].emailAddress != sdk.User.getEmailAddress) {
              profileToShow = reciepientsBcc[i];
              UserController.displayProfile(libs, null, profileToShow);
              break;
            }
          }
        }

        // add events for receipients change
        composeView.on('recipientsChanged', function (e) {
          if (e.to.added && e.to.added.length > 0) {
            UserController.displayProfile(libs, null, e.to.added[0]);
          } else if (e.cc.added && e.cc.added.length > 0) {
            UserController.displayProfile(libs, null, e.cc.added[0]);
          } else if (e.bcc.added && e.bcc.added.length > 0) {
            UserController.displayProfile(libs, null, e.bcc.added[0]);
          }
        });

        $('span[email]').hover(function (e) {
          var that = this;
          UserController.displayProfile(libs, null, {
            emailAddress: $(that).attr('email')
          });
        });

        return cb(null, null);
      }
    ], function (err, code) {
      if (err) {
        switch (code) {
          case 'login':
            break;
        }
      } else {
        // the user logged in
        // load compose view elements for plugins
        for (var key in plugins) {
          plugin = plugins[key];
          if (typeof plugin.ui.loadComposeViewElements == 'function') {
            plugin.ui.loadComposeViewElements.call(plugin, composeView);
          }
        }
      }
    });
  });


  var snoozeToolbarButton;

  // Toolbars

  var _addSnoozeCreateInDropdown = function (dropdown, snoozeHTML, threadId, type, isRowElem) {
    console.trace(385, type);
    type = type || 'create';
    $('.strike-container#snooze').html(snoozeHTML);
    var snoozeFn;
    switch (type) {
      case 'create':
        snoozeFn = Rebump.snooze.create.bind(null);
        break;
      case 'update':
        snoozeFn = Rebump.snooze.update.bind(null);
        break;
      default:
        snoozeFn = Rebump.snooze.create.bind(null);
        break;
    }

    $('.strike-container#snooze .snooze-suggestions ul li').on('click', function (evt) {
      switch ($(evt.target).attr('id')) {
        case '1-hour':
          var date = new Date();
          date.setHours(date.getHours() + 1);
          var timestamp = Math.floor(date/1000);
          snoozeFn(libs, timestamp, threadId, function (err) {
            dropdown.close();
            if (err) {
              sdk.ButterBar.showError({
                text: 'An error occured while snoozing the email. Please try again.'
              });
            } else {
              var selectedDatetime = new Date(timestamp*1000).toString();
              var selectedDate = selectedDatetime.split(' ').slice(0, 4).join(' ');
              var selectedTime = selectedDatetime.split(' ')[4].split(':').slice(0,2).join(':');
              // return to the thread list page
              window.location.href = window.location.href.split('#inbox')[0] + '#inbox';
              // get the time
              sdk.ButterBar.showMessage({
                text: 'Message archived and scheduled to return on ' + selectedDate + ' at ' + selectedTime
              });
              if (isRowElem) {
                $('tr[data-inboxsdk-threadid="' + threadId + '"]').remove();
              }
            }
          });
          break;
        case '3-hours':
          var date = new Date();
          date.setHours(date.getHours() + 3);
          var timestamp = Math.floor(date/1000);
          snoozeFn(libs, timestamp, threadId, function (err) {
            dropdown.close();
            if (err) {
              sdk.ButterBar.showError({
                text: 'An error occured while snoozing the email. Please try again.'
              });
            } else {
              var selectedDatetime = new Date(timestamp*1000).toString();
              var selectedDate = selectedDatetime.split(' ').slice(0, 4).join(' ');
              var selectedTime = selectedDatetime.split(' ')[4].split(':').slice(0,2).join(':');
              // return to the thread list page
              window.location.href = window.location.href.split('#inbox')[0] + '#inbox';
              // get the time
              sdk.ButterBar.showMessage({
                text: 'Message archived and scheduled to return on ' + selectedDate + ' at ' + selectedTime
              })
              if (isRowElem) {
                $('tr[data-inboxsdk-threadid="' + threadId + '"]').remove();
              }
            }
          });
          break;
        case 'tomorrow-morning':
          var date = new Date();
          date.setDate(date.getDate() + 1);
          date.setHours(9);
          date.setMinutes(0);
          date.setSeconds(0);
          var timestamp = Math.floor(date/1000);
          snoozeFn(libs, timestamp, threadId, function (err) {
            dropdown.close();
            if (err) {
              sdk.ButterBar.showError({
                text: 'An error occured while snoozing the email. Please try again.'
              });
            } else {
              var selectedDatetime = new Date(timestamp*1000).toString();
              var selectedDate = selectedDatetime.split(' ').slice(0, 4).join(' ');
              var selectedTime = selectedDatetime.split(' ')[4].split(':').slice(0,2).join(':');
              // return to the thread list page
              window.location.href = window.location.href.split('#inbox')[0] + '#inbox';
              // get the time
              sdk.ButterBar.showMessage({
                text: 'Message archived and scheduled to return on ' + selectedDate + ' at ' + selectedTime
              });
              if (isRowElem) {
                $('tr[data-inboxsdk-threadid="' + threadId + '"]').remove();
              }
            }
          });
          break;
        case 'tomorrow-afternoon':
          var date = new Date();
          date.setDate(date.getDate() + 1);
          date.setHours(12);
          date.setMinutes(0);
          date.setSeconds(0);
          var timestamp = Math.floor(date/1000);
          snoozeFn(libs, timestamp, threadId, function (err) {
            dropdown.close();
            if (err) {
              sdk.ButterBar.showError({
                text: 'An error occured while snoozing the email. Please try again.'
              });
            } else {
              var selectedDatetime = new Date(timestamp*1000).toString();
              var selectedDate = selectedDatetime.split(' ').slice(0, 4).join(' ');
              var selectedTime = selectedDatetime.split(' ')[4].split(':').slice(0,2).join(':');
              // return to the thread list page
              window.location.href = window.location.href.split('#inbox')[0] + '#inbox';
              // get the time
              sdk.ButterBar.showMessage({
                text: 'Message archived and scheduled to return on ' + selectedDate + ' at ' + selectedTime
              })
              if (isRowElem) {
                $('tr[data-inboxsdk-threadid="' + threadId + '"]').remove();
              }
            }
          });
          break;
        case '1-week':
          var date = new Date();
          date.setDate(date.getDate() + 7);
          var timestamp = Math.floor(date/1000);
          snoozeFn(libs, timestamp, threadId, function (err) {
            dropdown.close();
            if (err) {
              sdk.ButterBar.showError({
                text: 'An error occured while snoozing the email. Please try again.'
              });
            } else {
              var selectedDatetime = new Date(timestamp*1000).toString();
              var selectedDate = selectedDatetime.split(' ').slice(0, 4).join(' ');
              var selectedTime = selectedDatetime.split(' ')[4].split(':').slice(0,2).join(':');
              // return to the thread list page
              window.location.href = window.location.href.split('#inbox')[0] + '#inbox';
              // get the time
              sdk.ButterBar.showMessage({
                text: 'Message archived and scheduled to return on ' + selectedDate + ' at ' + selectedTime
              })
              if (isRowElem) {
                $('tr[data-inboxsdk-threadid="' + threadId + '"]').remove();
              }
            }
          });
          break;
      }
    });

    $('.strike-container#snooze .datepicker').datetimepicker({
      format:'d.m.Y H:i',
      inline:true,
      lang:'en',
      minDate: 0,
      onSelectDate: function (datetime, $i) {
        var selectedDatetime = datetime.toString();
        var selectedDate = selectedDatetime.split(' ').slice(0, 4).join(' ');
        var selectedTime = selectedDatetime.split(' ')[4].split(':').slice(0,2).join(':');
        $('.strike-container#snooze #dates .snooze-date .selected .selected-date').text(selectedDate + ' at ' + selectedTime);
        $('.strike-container#snooze #dates .snooze-date .selected .selected-date').attr('data-timestamp', Math.floor(datetime/1000));
        $('.strike-container#snooze #dates .snooze-date').removeClass('hidden');
      },
      onSelectTime: function (datetime, $i) {
        var selectedDatetime = datetime.toString();
        var selectedDate = selectedDatetime.split(' ').slice(0, 4).join(' ');
        var selectedTime = selectedDatetime.split(' ')[4].split(':').slice(0,2).join(':');

        $('.strike-container#snooze #dates .snooze-date .selected .selected-date').text(selectedDate + ' at ' + selectedTime);
        $('.strike-container#snooze #dates .snooze-date .selected .selected-date').attr('data-timestamp', Math.floor(datetime/1000));
        $('.strike-container#snooze #dates .snooze-date').removeClass('hidden');
      }
    });

    $('#dates .snooze-date #snooze-prompt-button').on('click', function () {
      var timestamp = $('.strike-container#snooze #dates .snooze-date .selected .selected-date').attr('data-timestamp');

      dropdown.close();
      snoozeFn(libs, timestamp, threadId, function (err) {
        if (err) {
          sdk.ButterBar.showError({
            text: 'An error occured while snoozing the email. Please try again.'
          });
        } else {
          var selectedDatetime = new Date(timestamp*1000).toString();
          var selectedDate = selectedDatetime.split(' ').slice(0, 4).join(' ');
          var selectedTime = selectedDatetime.split(' ')[4].split(':').slice(0,2).join(':');
          // return to the thread list page
          window.location.href = window.location.href.split('#inbox')[0] + '#inbox';
          // get the time
          sdk.ButterBar.showMessage({
            text: 'Message archived and scheduled to return on ' + selectedDate + ' at ' + selectedTime
          })
          if (isRowElem) {
            $('tr[data-inboxsdk-threadid="' + threadId + '"]').remove();
          }
        }
      });
    });

  }

  var _addSnoozeUpdateInDropdown = function (dropdown, snoozeUpdateHTML, snoozeHTML, threadId, snooze, isRowElem) {
    $('.strike-container#snooze').html(snoozeUpdateHTML);

    var date = (new Date(snooze.date.activation*1000)).toString();
    var selectedDate = date.split(' ').slice(0, 4).join(' ');
    var selectedTime = date.split(' ')[4].split(':').slice(0,2).join(':');
    $('.strike-container#snooze .existing-snooze .description #date').text(selectedDate);
    $('.strike-container#snooze .existing-snooze .description #time').text(selectedTime);

    $('.strike-container#snooze .existing-snooze .buttons #snooze-edit-prompt-button').on('click', function (evt) {
      _addSnoozeCreateInDropdown(dropdown, snoozeHTML, threadId, 'update', isRowElem);
    });

    $('.strike-container#snooze .existing-snooze .buttons #snooze-delete-prompt-button').on('click', function (evt) {
      Rebump.snooze.del(libs, threadId, function (err) {
        if (err) {
          sdk.ButterBar.showError({
            text: 'An error occured while unscheduling. Please try again.'
          });
        } else {
          dropdown.close();
          sdk.ButterBar.showMessage({
            text: 'Message returned to inbox and unscheduled.'
          });
        }
      });
    });
  };

  // Toolbar button for a thread View
  chrome.runtime.sendMessage({
    method: 'getData',
    collection: 'email',
    query: {
      emailId: sdk.User.getEmailAddress()
    }
  }, function (res) {
    if (res.success && res.data.isLoggedIn) {

      window.strike.people = [];

      // Register Toolbar buttons for all plugins
      for (var key in plugins) {
        plugin = plugins[key];
        if (typeof plugin.ui.registerToolbarButtonForThreadView == 'function') {
          plugin.ui.registerToolbarButtonForThreadView.call(plugin);
        }
      }

      var snoozeHTML, snoozeUpdateHTML;
      $.get(chrome.extension.getURL('public/html/snoozeDropdown.html'), function (html) {
        snoozeHTML = html;
      });
      $.get(chrome.extension.getURL('public/html/snoozeUpdateDropdown.html'), function (html) {
        snoozeUpdateHTML = html;
      });

      sdk.Toolbars.registerToolbarButtonForThreadView({
        title: 'Snooze email',
        iconUrl: chrome.extension.getURL('public/img/snooze.png'),
        hasDropdown: true,
        section: 'METADATA_STATE',
        onClick: function (event) {
          var threadId = event.threadView.getThreadID();
          event.dropdown.el.innerHTML = '<div class="strike-container" id="snooze"></div>';

          async.waterfall([
            function getLoginStatus(cb) {
              chrome.runtime.sendMessage({
                method: 'getLoginStatus',
                emailId: sdk.User.getEmailAddress()
              }, function (res) {
                if (res.status) {
                  emailData = res.data;
                  return cb(null, null);
                } else {
                  return cb('err', 'login')
                }
              });
            },
            function getLoggedInUser(code, cb) {
              chrome.runtime.sendMessage({
                method: 'getData',
                collection: 'user',
                query: {}
              }, function (res) {
                if (res && res.success && res.data) {
                  return cb(null, null, res.data);
                } else {
                  return cb('err', 'login');
                }
              });
            },
            function getExistingSnooze(code, user, cb) {
              Rebump.snooze.get(libs, threadId, function (err, snoozeData) {
                if (err) {
                  return cb(null);
                } else if (snoozeData && Object.keys(snoozeData).length > 0) {
                  if (Object.keys(snoozeData).length > 0 && snoozeData.date.activation) {
                    return cb('Email already snoozed', 'existing', snoozeData);
                  } else {
                    return cb(null);
                  }
                } else {
                  return cb(null);
                }
              });
            }
          ], function (err, code, snoozeData) {
            if (err) {
              switch (code) {
                case 'login':
                   // make the user login
                   event.dropdown.close();
                   SignupController.showSignupWindow(false, sdk.User.getEmailAddress(), libs, function (err) {
                     sdk.ButterBar.showMessage({
                       text: 'An error occured while logging in. Please try again.'
                     });
                   });
                  break;
                case 'existing':
                  _addSnoozeUpdateInDropdown(event.dropdown, snoozeUpdateHTML, snoozeHTML, threadId, snoozeData);
                  default:

              }
            } else {
              _addSnoozeCreateInDropdown(event.dropdown, snoozeHTML, threadId, 'create');
            }
          });
        }
      });
    } else {
      console.log('Not Logged In');
    }
  })


  // Toolbar Button for every row in the thread list
  chrome.runtime.sendMessage({
    method: 'getData',
    collection: 'email',
    query: {
      emailId: sdk.User.getEmailAddress()
    }
  }, function (res) {
    if (res.success && res.data.isLoggedIn) {
      sdk.Lists.registerThreadRowViewHandler(function (threadRowView) {

        // Load ThreadRowView elements for plugins
        for (var key in plugins) {
          plugin = plugins[key];
          if (typeof plugin.ui.loadThreadRowViewElements == 'function') {
            plugin.ui.loadThreadRowViewElements.call(plugin, threadRowView);
          }
        }

        var snoozeHTML, snoozeUpdateHTML;
        $.get(chrome.extension.getURL('public/html/snoozeDropdown.html'), function (html) {
          snoozeHTML = html;
        });
        $.get(chrome.extension.getURL('public/html/snoozeUpdateDropdown.html'), function (html) {
          snoozeUpdateHTML = html;
        });
        threadRowView.addButton({
          title: 'Snooze email',
          iconUrl: chrome.extension.getURL('public/img/snooze-gray.png'),
          hasDropdown: true,
          onClick: function (event) {
            var threadId = threadRowView.getThreadID();
            event.dropdown.el.innerHTML = '<div class="strike-container" id="snooze"></div>';

            async.waterfall([
              function getLoginStatus(cb) {
                chrome.runtime.sendMessage({
                  method: 'getLoginStatus',
                  emailId: sdk.User.getEmailAddress()
                }, function (res) {
                  if (res.status) {
                    emailData = res.data;
                    return cb(null, null);
                  } else {
                    return cb('err', 'login');
                  }
                });
              },
              function getLoggedInUser(code, cb) {
                chrome.runtime.sendMessage({
                  method: 'getData',
                  collection: 'user',
                  query: {}
                }, function (res) {
                  if (res && res.success && res.data) {
                    return cb(null, null, res.data);
                  } else {
                    return cb('err', 'login');
                  }
                });
              },
              function getExistingSnooze(code, user, cb) {
                Rebump.snooze.get(libs, threadId, function (err, snoozeData) {
                  if (err) {
                    return cb(null);
                  } else if (snoozeData && Object.keys(snoozeData).length > 0) {
                    if (Object.keys(snoozeData).length > 0 && snoozeData.date.activation) {
                      return cb('Email already snoozed', 'existing', snoozeData);
                    } else {
                      return cb(null);
                    }
                  } else {
                    return cb(null);
                  }
                });
              }
            ], function (err, code, snoozeData) {
              if (err) {
                switch (code) {
                  case 'login':
                     // make the user login
                     event.dropdown.close();
                     SignupController.showSignupWindow(false, sdk.User.getEmailAddress(), libs, function (err) {
                       sdk.ButterBar.showMessage({
                         text: 'An error occured while logging in. Please try again.'
                       });
                     });
                    break;
                  case 'existing':
                    _addSnoozeUpdateInDropdown(event.dropdown, snoozeUpdateHTML, snoozeHTML, threadId, snoozeData, true);
                    default:

                }
              } else {
                _addSnoozeCreateInDropdown(event.dropdown, snoozeHTML, threadId, 'create', true);
              }
            });
          }
        });
      });

    } else {
      console.log ('Not LoggedIn');
    }
  });


  // Message view and attachment icon buttons
  chrome.runtime.sendMessage({
    method: 'getData',
    collection: 'email',
    query: {
      emailId: sdk.User.getEmailAddress()
    }
  }, function (res) {
    if (res.success && res.data.isLoggedIn) {
      var messageElemSelector = ''

      sdk.Conversations.registerMessageViewHandlerAll(function (messageView) {
        for (var key in plugins) {
          plugin = plugins[key];
          if (typeof plugin.ui.loadMessageViewElements == 'function') {
            plugin.ui.loadMessageViewElements.call(plugin, messageView, messageElemSelector);
          }

          if (typeof plugin.ui.loadAttachmentIcon == 'function') {
            plugin.ui.loadAttachmentIcon.call(plugin, messageView);
          }
        }
      });
    } else {
      console.log('Not Logged in');
    }
  });

  sdk.Router.handleAllRoutes(function (routeView) {
    window.strike.people = [];
  });

  // Reload plugins in sidebar when profile updates
  eventEmmiter.on('profileLoaded', function (data) {
    // check login status
    async.waterfall([
      function getLoginStatus(cb) {
        chrome.runtime.sendMessage({
          method: 'getLoginStatus',
          emailId: sdk.User.getEmailAddress()
        }, function (res) {
          if (res.status) {
            return cb(null, null);
          } else {
            return cb('Login to access strike', 'login')
          }
        });
      },
      function loadPluginElements(code, cb) {
        for (var key in plugins) {
          plugin = plugins[key];
          if (typeof plugin.ui.loadSidebarElements == 'function') {
            plugin.ui.loadSidebarElements.call(plugin, data.profile, data.emailId, data.name, data.company, data.sidebarId);
          }
        }
        return cb(null);
      }
    ], function (err, code) {
      if (err) {
        switch (code) {
          case 'login':
            break;
        }
      } else {
        // the user logged in
      }
    });
  });
});
 var UserController = (function () {
  var displayProfile = function (libs, profileView, contact, forceReload) {
    console.log('displayProfile', contact.emailAddress);
    var self = this;
    //generate a random sidebar id so that plugins get loaded only once
    var sidebarId =  Math.floor(Math.random()*(100000 - 22 + 1)) + 22;

    $('.strike-container#people-profile').attr('data-sidebarId', sidebarId);
    if (contact.emailAddress != $('.profile .person').attr('data-emailid') || forceReload) {
      $('.profile .person #profile-loader').removeClass('hidden');
      $('.profile .person').attr('data-emailid', contact.emailAddress);

      // reset the data in the sidebar
      $('.profile .person .profile-pic').attr('src', chrome.extension.getURL('public/img/person-nopic.png'));

      if (contact.name) {
        $('.profile .person .name').text(contact.name);
      } else {
        $('.profile .person .name').text('');
      }
      $('.profile .person .name').removeClass('hidden');
      $('.profile .person .employment').addClass('hidden');
      $('.profile .person .employment').text('');
      $('.profile .person .bio').addClass('hidden');
      $('.profile .person .bio').text('');
      $('.profile .person .location').addClass('hidden');
      $('.profile .person .location').text('');
      $('.profile .person .social .linkedin').addClass('hidden');
      $('.profile .person .social .facebook').addClass('hidden');
      $('.profile .person .social .twitter').addClass('hidden');
      $('.profile .person .social .angellist').addClass('hidden');
      $('.profile .person .social .github').addClass('hidden');
      $('.profile .person .social .website').addClass('hidden');
      $('.profile .person .social').addClass('hidden');

      $('.profile .company').addClass('hidden');
      $('.profile .company .profile-pic').attr('src', chrome.extension.getURL('public/img/company-nopic.png'));
      $('.profile .company .employment').addClass('hidden');
      $('.profile .company .employment').text('');
      $('.profile .company .bio').addClass('hidden');
      $('.profile .company .bio').text('');
      $('.profile .company .location').addClass('hidden');
      $('.profile .company .location').text('');
      $('.profile .company .social .linkedin').addClass('hidden');
      $('.profile .company .social .facebook').addClass('hidden');
      $('.profile .company .social .twitter').addClass('hidden');
      $('.profile .company .social .angellist').addClass('hidden');
      $('.profile .company .social .github').addClass('hidden');
      $('.profile .company .social').addClass('hidden');
      $('.profile .company .name').addClass('hidden');
      $('.profile .company .name').html('<a class="url hidden"></a>');
      $('.profile .company .company-details').empty();

      // Remove separator from the profile widget
      $('#people-profile .person').css('padding-bottom', '0px');
      $('#people-profile .person').css('border-bottom', 'none');

      // get profile from the api
      self.fetchProfile(libs, contact, function (err, code, profileData, contact) {
        $('.profile .person #profile-loader').addClass('hidden');
        if (!err && Object.keys(profileData).length >= 0) {
          var hasPersonalProfile = false;
          for (var data in profileData) {
            if (data != 'company') {
              hasPersonalProfile = true;
              break;
            }
          }
          if (hasPersonalProfile) {
            // populate profile html
            var name = '';
            if (profileData.name && profileData.name.length > 0) {
              if (profileData.name[0].firstName) {
                name += profileData.name[0].firstName;
                if (profileData.name[0].lastName) {
                  name += ' ' + profileData.name[0].lastName;
                }
              } else if (profileData.name[0].lastName) {
                name += profileData.name[0].lastName;
              }
            }

            var organization = '';
            var employment = '';
            if (profileData.employment && profileData.employment.length > 0) {
              for (var i=0 ;i<profileData.employment.length; i++) {
                if (profileData.employment[i].employmentType == 'employment' && profileData.employment[i].isCurrent) {
                  if (profileData.employment[i].title) {
                    employment = profileData.employment[i].title;
                    organization = profileData.employment[i].organization;
                    empFlag = 1;
                    break;
                  }
                }
              }
              if (!empFlag) {
                for (var i=0 ;i<profileData.employment.length; i++) {
                  if (profileData.employment[i].employmentType == 'education' && profileData.employment[i].isCurrent) {
                    if (profileData.employment[i].title) {
                      employment = profileData.employment[i].title;
                      organization = profileData.employment[i].organization;
                      empFlag = 1;
                      break;
                    }
                  }
                }
              }
              if (!empFlag) {
                for (var i=0 ;i<profileData.employment.length; i++) {
                  if (profileData.employment[i].employmentType == 'employment') {
                    if (profileData.employment[i].title) {
                      employment = profileData.employment[i].title;
                      organization = profileData.employment[i].organization;
                      empFlag = 1;
                      break;
                    }
                  }
                }
              }
            }
            var empFlag = 0;
            var bio = '';
            if (profileData.bio) {
              bio = profileData.bio;
            }
            var location = '';
            if (profileData.location && profileData.location.length > 0) {
              if (profileData.location[0].city) {
                location += profileData.location[0].city;
                if (profileData.location[0].country) {
                  location += ', ' + profileData.location[0].country;
                }
              } else if (profileData.location[0].country) {
                location += profileData.location[0].country;
              } else if (profileData.location[0].state) {
                location += profileData.location[0].state;
              }
            }
            var social = {};
            if (profileData.social && profileData.social.length > 0) {
              for (var i=0; i<profileData.social.length; i++) {
                social[profileData.social[i].socialType] = profileData.social[i].url;
              }
            }
            if (profileData.website) {
              social.website = profileData.website;
            }
            var profilePic;
            if (profileData.profilePicture && profileData.profilePicture.length > 0) {
              profilePic = profileData.profilePicture[0].url;
            }

          }
          var company = {};
          if (organization) {
            company.name = organization;
          }
          if (profileData.company) {
            company.type = profileData.company.companyType;
            company.social = {};
            if (profileData.company.social && profileData.company.social.length > 0) {
              for (var i=0; i<profileData.company.social.length; i++) {
                company.social[profileData.company.social[i].socialType] = profileData.company.social[i].url;
              }
            }
            company.location = '';
            if (profileData.company.location && profileData.company.location.length > 0) {
              if (profileData.company.location[0].city) {
                company.location += profileData.company.location[0].city;
                if (profileData.company.location[0].country) {
                  company.location += ', ' + profileData.company.location[0].country;
                }
              } else if (profileData.company.location[0].country) {
                company.location += profileData.company.location[0].country;
              } else if (profileData.company.location[0].state) {
                company.location += profileData.company.location[0].state;
              }
            }
            if (profileData.company.logoUrl) {
              company.profilePic = profileData.company.logoUrl;
            } else {
              if (profileData.company.social && profileData.company.social.length > 0) {
                for (var i=0; i<profileData.company.social.length; i++) {
                  if (profileData.company.social[i].socialType == 'twitter') {
                    company.profilePic = profileData.company.social[i].profilePictureUrl;
                  }
                }
              }
            }
            company.name = '';
            if (profileData.company.name) {
              if (profileData.company.name.displayName) {
                company.name = profileData.company.name.displayName;
              } else if (profileData.company.name.legalName) {
                company.name = profileData.company.name.legalName;
              }
            }
            if (profileData.company.url) {
              company.social.website = profileData.company.url;
            }
            if (profileData.company.description) {
              company.bio = profileData.company.description;
            }
            if (profileData.company.metrics) {
              if (profileData.company.metrics.amountRaised) {
                company.amountRaised = profileData.company.metrics.amountRaised;
              }
              if (profileData.company.metrics.alexaRank) {
                if (profileData.company.metrics.alexaRank.global) {
                  company.alexaRank = profileData.company.metrics.alexaRank.global;
                }
              }
              if (profileData.company.metrics.noOfEmployees) {
                company.noOfEmployees = profileData.company.metrics.noOfEmployees;
              }
              if (profileData.company.metrics.marketCap) {
                company.marketCap = profileData.company.metrics.marketCap;
              }
            }
          }
          if (profilePic) {
            $('.profile .person .profile-pic').attr('src', profilePic);
            $('.profile .person .profile-pic').removeClass('hidden');
          }
          if (name) {
            $('.profile .person .name').text(name);
            $('.profile .person .name').removeClass('hidden');
          }
          if (employment) {
            $('.profile .person .employment').text(employment);
            $('.profile .person .employment').removeClass('hidden');
          }
          if (bio) {
            $('.profile .person .bio').text(bio);
            $('.profile .person .bio').removeClass('hidden');
          }
          if (location) {
            $('.profile .person .location').text(location);
            $('.profile .person .location').removeClass('hidden');
          }
          if (social && Object.keys(social).length > 0) {
            $('.profile .person .social').removeClass('hidden');
            for (var type in social) {
              $('.profile .person .social .' + type).attr('href', social[type]);
              $('.profile .person .social .' + type).removeClass('hidden');
            }
          }

          if (company && Object.keys(company).length > 0 && company.name) {
            $('#people-profile .company').removeClass('hidden');

            // Add separator to the profile widget
            $('#people-profile .person').css('padding-bottom', '10px');
            $('#people-profile .person').css('border-bottom', '1px solid #D8D8D8');

            // populate company data
            if (company.profilePic) {
              $('.profile .company .profile-pic').attr('src', company.profilePic);
              $('.profile .company .profile-pic').removeClass('hidden');
            }
            if (company.name) {
              $('.profile .company .name a').text(company.name);
              $('.profile .company .name a').removeClass('hidden');
              $('.profile .company .name').removeClass('hidden');
            }
            if (company.social && company.social.website) {
              if (company.social.website.split(':').length > 1) {
                // the url already contains http:// or https://
              } else {
                company.social.website = 'http://' + company.social.website;
              }
              $('.profile .company .name a').attr('href', company.social.website);
            }
            if (company.bio) {
              $('.profile .company .bio').text(company.bio);
              $('.profile .company .bio').removeClass('hidden');
            }
            if (company.location) {
              $('.profile .company .location').text(company.location);
              $('.profile .company .location').removeClass('hidden');
            }
            if (company.social && Object.keys(company.social).length > 0) {
              $('.profile .company .social').removeClass('hidden');
              for (var type in company.social) {
                $('.profile .company .social .' + type).attr('href', company.social[type]);
                $('.profile .company .social .' + type).removeClass('hidden');
              }
            }
            if (company.type) {
              $('.profile .company .company-details').append('<div class="detail"><span class="key">Company Type</span><span class="value">' + company.type + '</span><div class="clear"></div></div>');
            }
            if (company.amountRaised) {
              company.amountRaised = company.amountRaised + '';
              if (company.amountRaised.length > 9) {
                company.amountRaised = parseInt(company.amountRaised)/1000000000 + 'B';
              } else if (company.amountRaised.length > 6) {
                company.amountRaised = parseInt(company.amountRaised)/1000000 + 'M';
              } else if (company.amountRaised.length > 3) {
                company.amountRaised = parseInt(company.amountRaised)/1000 + 'K';
              }
              if (company.amountRaised[0] == '0') {
                company.amountRaised = company.amountRaised.substr(1);
              }
              $('.profile .company .company-details').append('<div class="detail"><span class="key">Amount Raised</span><span class="value">$' + company.amountRaised + '</span><div class="clear"></div></div>');
            }
            if (company.marketCap) {
              company.marketCap = company.marketCap + '';
              if (company.marketCap.length > 9) {
                company.marketCap = parseInt(company.marketCap)/1000000000 + 'B';
              } else if (company.amountRaised.length > 6) {
                company.marketCap = parseInt(company.marketCap)/1000000 + 'M';
              } else if (company.amountRaised.length > 3) {
                company.marketCap = parseInt(company.marketCap)/1000 + 'K';
              }
              if (company.marketCap[0] == '0') {
                company.marketCap = company.marketCap.substr(1);
              }
              $('.profile .company .company-details').append('<div class="detail"><span class="key">Market Cap</span><span class="value">$' + company.marketCap + '</span><div class="clear"></div></div>');
            }
            if (company.noOfEmployees) {
              // Divide the number into UI suitable format
              company.noOfEmployees = company.noOfEmployees + '';
              company.noOfEmployees = company.noOfEmployees.split('').reverse().join('').match(/.{1,3}/g).reverse().join(',');
              if (company.noOfEmployees[0] == '0') {
                company.noOfEmployees = company.noOfEmployees.substr(1);
              }
              $('.profile .company .company-details').append('<div class="detail"><span class="key">Employees</span><span class="value">' + company.noOfEmployees + '+</span><div class="clear"></div></div>');
            }
            if (company.alexaRank) {
              // Divide the number into UI suitable format
              company.alexaRank = company.alexaRank + '';
              company.alexaRank = company.alexaRank.split('').reverse().join('').match(/.{1,3}/g).reverse().join(',');
              if (company.alexaRank == '0') {
                company.alexaRank = company.alexaRank.substr(1);
              }
              $('.profile .company .company-details').append('<div class="detail"><span class="key">Alexa Rank</span><span class="value">' + company.alexaRank + '</span><div class="clear"></div></div>');
            }
          }

          // Fire profileLoaded event
          libs.eventEmmiter.emitEvent('profileLoaded', [{
            profile: {
              name: name,
              organization: organization,
              employment: employment,
              bio: bio,
              location: location,
              social: social,
              profilePic: profilePic
            },
            emailId: contact.emailAddress,
            name: contact.name,
            company: company,
            sidebarId: sidebarId
          }]);
        }
      });
    }
  };

  var fetchProfile = function (libs, contact, callback) {
    var self = this;
    // check for cached user data;
    window.strike.profiles = window.strike.profiles || [];
    if (window.strike.profiles.length > 0) {
      for (var i = 0; i < window.strike.profiles.length; i++) {
        for (var j = 0; j < window.strike.profiles[i].email.length; j++) {
          if (window.strike.profiles[i].email[j].emailId == contact.emailAddress) {
            return callback(null, null, window.strike.profiles[i], contact);
          }
        }
      }
    }

    async.waterfall([
      function getLoggedInUser(cb) {
        chrome.runtime.sendMessage({
          method: 'getData',
          collection: 'email',
          query: {
            emailId: libs.sdk.User.getEmailAddress()
          }
        }, function (res) {
          if (res && res.success && res.data) {
            return cb(null, null, res.data);
          } else {
            return cb('An error occured while getting the email id data', 'fatal');
          }
        });
      },
      function getProfileFromApi(code, user, cb) {
        chrome.runtime.sendMessage({
          method: 'apiRequest',
          endpoint: '/users/' + encodeURIComponent(contact.emailAddress),
          queryParameter: 'type=email&deviceId=' + user.deviceId + '&apiToken=' + user.apiKey,
          apiMethod: 'GET'
        }, function (res) {
          if (res.success && res.responseText) {
            if ((res.status >= 200 && res.status < 300) || res.status == 304) {
              var profileData = JSON.parse(res.responseText).data;
              if (!profileData.email) {
                profileData.email = [{
                  'emailId': contact.emailAddress
                }];
              } else {
                profileData.email.unshift({
                  'emailId': contact.emailAddress
                });
              }
              if (contact.name && contact.name != 'me') {
                if (!profileData.name) {
                  profileData.name = [];
                }
                var name = contact.name.split(' ');
                profileDataName = {};
                profileDataName.lastName = name[name.length-1];
                name.splice(name.length - 1);
                profileDataName.firstName = name.join(' ');
                profileData.name.unshift(profileDataName);
              }

              // cache the user data
              window.strike.profiles = window.strike.profiles.concat(profileData);
              return cb(null, null, profileData);
            } else {
              return cb('Failed to fetch user data from API. Unexpected response code: ' + res.status, 'nonFatal');
            }
          } else {
            return cb('Failed to fetch user data from API', 'nonFatal');
          }
        });
      }
    ], function (err, code, profileData) {
      return callback(err, code, profileData, contact);
    });
  }

  return {
    displayProfile: displayProfile,
    fetchProfile: fetchProfile
  }
})();
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
 
var Rebump = (function () {
  var Snooze = (function () {
    var create = function (libs, timestamp, threadId, callback) {
      //console.log(timestamp, threadId);
      async.waterfall([
        function getLoggedInUser(cb) {
          chrome.runtime.sendMessage({
            method: 'getData',
            collection: 'email',
            query: {
              emailId: libs.sdk.User.getEmailAddress()
            }
          }, function (res) {
            if (res && res.success && res.data) {
              return cb(null, null, res.data);
            } else {
              return cb('An error occured while getting the email id data.', 'fatal');
            }
          });
        },
        function sendSnoozeRequest(code, user, cb) {
          chrome.runtime.sendMessage({
            method: 'apiRequest',
            endpoint: '/snooze/rebump/emails/',
            queryParameter: 'userEmail=' + libs.sdk.User.getEmailAddress() + '&deviceId=' + user.deviceId,
            apiMethod: 'POST',
            authToken: user.apiKey,
            data: {
              emailId: libs.sdk.User.getEmailAddress(),
              date: {
                creation: Math.floor(new Date()/1000),
                activation: timestamp
              },
              snoozeType: 'email',
              threadId: threadId
            }
          }, function (res) {
            if (res.success && res.responseText) {
              if (res.status >= 200 && res.status < 300 || status == 304) {
                return cb(null, null, JSON.parse(res.responseText).data);
              } else {
                return cb('Failed to snooze email. Unexpected response code: ' + res.status, 'nonFatal');
              }
            } else {
              return cb('Failed to snooze email', 'nonFatal');
            }
          });
        }
      ], function (err, code, snoozeData) {
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      });
    };

    var update = function (libs, timestamp, threadId, callback) {
      //console.log(timestamp, threadId);
      async.waterfall([
        function getLoggedInUser(cb) {
          chrome.runtime.sendMessage({
            method: 'getData',
            collection: 'email',
            query: {}
          }, function (res) {
            emailId: libs.sdk.User.getEmailAddress()
            if (res && res.success && res.data) {
              return cb(null, null, res.data);
            } else {
              return cb('An error occured while getting the email id data.', 'fatal');
            }
          });
        },
        function sendSnoozeRequest(code, user, cb) {
          chrome.runtime.sendMessage({
            method: 'apiRequest',
            endpoint: '/snooze/rebump/emails/',
            queryParameter: 'userEmail=' + libs.sdk.User.getEmailAddress() + '&deviceId=' + user.deviceId,
            apiMethod: 'PUT',
            authToken: user.apiKey,
            data: {
              emailId: libs.sdk.User.getEmailAddress(),
              date: {
                creation: Math.floor(new Date()/1000),
                activation: timestamp
              },
              snoozeType: 'email',
              threadId: threadId
            }
          }, function (res) {
            if (res.success && res.responseText) {
              if (res.status >= 200 && res.status < 300 || status == 304) {
                return cb(null, null, JSON.parse(res.responseText).data);
              } else {
                return cb('Failed to snooze email. Unexpected response code: ' + res.status, 'nonFatal');
              }
            } else {
              return cb('Failed to snooze email', 'nonFatal');
            }
          });
        }
      ], function (err, code, snoozeData) {
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      });
    }

    var get = function (libs, threadId, callback)  {
      async.waterfall([
        function getLoggedInUser(cb) {
          chrome.runtime.sendMessage({
            method: 'getData',
            collection: 'email',
            query: {
              emailId: libs.sdk.User.getEmailAddress()
            }
          }, function (res) {
            if (res && res.success && res.data) {
              return cb(null, null, res.data);
            } else {
              return cb('An error occured while getting the email id data.', 'fatal');
            }
          });
        },
        function sendSnoozeRequest(code, user, cb) {
          chrome.runtime.sendMessage({
            method: 'apiRequest',
            endpoint: '/snooze/rebump/emails/',
            queryParameter: 'userEmail=' + libs.sdk.User.getEmailAddress() + '&deviceId=' + user.deviceId + '&apiToken=' + user.apiKey + '&threadId=' + threadId,
            apiMethod: 'GET'
          }, function (res) {
            if (res.success && res.responseText) {
              //console.log(res.status);
              if (res.status >= 200 && res.status < 300 || status == 304) {
                //console.log(res);
                //console.log(JSON.parse(res.responseText));
                return cb(null, null, JSON.parse(res.responseText).data);
              } else {
                return cb('Failed to get snoozed email. Unexpected response code: ' + res.status, 'nonFatal');
              }
            } else {
              return cb('Failed to get snoozed email', 'nonFatal');
            }
          });
        }
      ], function (err, code, snoozeData) {
        if (err) {
          callback(err);
        } else {
          callback(null, snoozeData);
        }
      });

    }

    var del = function (libs, threadId, callback) {
      async.waterfall([
        function getLoggedInUser(cb) {
          chrome.runtime.sendMessage({
            method: 'getData',
            collection: 'email',
            query: {
              emailId: libs.sdk.User.getEmailAddress()
            }
          }, function (res) {
            if (res && res.success && res.data) {
              return cb(null, null, res.data);
            } else {
              return cb('An error occured while getting the email id data.', 'fatal');
            }
          });
        },
        function sendSnoozeRequest(code, user, cb) {
          chrome.runtime.sendMessage({
            method: 'apiRequest',
            endpoint: '/snooze/rebump/emails/',
            queryParameter: 'userEmail=' + libs.sdk.User.getEmailAddress() + '&deviceId=' + user.deviceId,
            apiMethod: 'DELETE',
            authToken: user.apiKey,
            data: {
              emailId: libs.sdk.User.getEmailAddress(),
              snoozeType: 'email',
              threadId: threadId
            }
          }, function (res) {
            if (res.success && res.responseText) {
              if (res.status >= 200 && res.status < 300 || status == 304) {
                return cb(null, null, JSON.parse(res.responseText).data);
              } else {
                return cb('Failed to snooze email. Unexpected response code: ' + res.status, 'nonFatal');
              }
            } else {
              return cb('Failed to snooze email', 'nonFatal');
            }
          });
        }
      ], function (err, code, snoozeData) {
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      });
    }

    return {
      create: create,
      update: update,
      get: get,
      del: del
    }
  })();

  return {
    snooze: Snooze
  }
})();
 var SalesforcePlugin = function (opts) {
  this.libs = opts.libs;
  this.name = 'salesforce';
  this.addonEmail = opts.addonEmail;
  this.endpointPrefix = '/salesforce/crm';
  this.emailData = opts.emailData;
};


SalesforcePlugin.prototype._request = function (method, endpoint, data, callback, params) {
  var self = this;
  var queryParams = 'userEmail=' + encodeURIComponent(self.libs.sdk.User.getEmailAddress()) + '&addonEmail=' + encodeURIComponent(self.addonEmail) + '&deviceId=' + encodeURIComponent(self.emailData.deviceId) + '&apiToken=' + encodeURIComponent(self.emailData.apiKey);
  if (params) {
    queryParams += '&' + params;
  }
  chrome.runtime.sendMessage({
    method: 'apiRequest',
    endpoint: self.endpointPrefix + endpoint,
    queryParameter: queryParams,
    apiMethod: method,
    data: data
  }, function (res) {
    if (res.success && res.responseText) {
      if ((res.status >= 200 && res.status <300) || res.status == 304) {
        resp = JSON.parse(res.responseText);
        return callback(null, resp)
      }
    }
    return callback(JSON.stringify(res));
  });
};

SalesforcePlugin.prototype.backgroundFetch = function (emailData) {
  var self = this;
  self._request('GET', '/team', null, function (err, res) {
    if (err) {
      throw new Error(err);
    } else {
      self.members = resp.data.members;
      self.taskStatus = resp.data.taskStatus;
      self.taskPriorities = resp.data.taskPriorities;
      self.leadStatus = resp.data.leadStatus;
      self.bccEmail = resp.data.bccEmail;
      self.opportunityStages = resp.data.opportunityStages;
      self.callSubjects = resp.data.callSubjects;
    }
  });
};

SalesforcePlugin.prototype.ui = {
  loadSidebarElements: function (profile, emailId, name, company, sidebarId) {
    var self = this;

    var sidebarSelector = '.strike-container#people-profile[data-sidebarId="' + sidebarId + '"]'

    if ($('.salesforce-container.sidebar').length == 0) {
      $(sidebarSelector + ' .profile .person').after('<div class="salesforce-container sidebar"></div>');
    }

    $(sidebarSelector + ' .salesforce-container').load(chrome.extension.getURL('public/html/plugins/salesforce/sidebar.html'), function () {

      async.parallel([
        function getEmailIdData(cb) {
          
          console.log(this);

          self._request('GET', '/contactandlead/' + encodeURIComponent(emailId), null, function (err, res) {
            if (err) {
              return cb(null, {});
            }
            return cb(null, res.data[0]);
          });
        },
        function getTasks(cb) {
          self._request('GET', '/tasks/' + encodeURIComponent(emailId), null, function (err, res) {
            if (err) {
              return cb(null, []);
            }
            return cb(null, res.data);
          });
        }
      ], function (err, data) {
        $(sidebarSelector + ' .salesforce-container .loading' ).delay(800).fadeOut(400, function () {
          $(sidebarSelector + ' .salesforce-container .loaded').fadeIn(400);
        });
        var emailData = data[0];
        var tasks = data[1];

        var tasksDiv = sidebarSelector + ' .salesforce-container .tasks';

        var opportunitiesDiv = sidebarSelector + ' .salesforce-container .opportunities';

        var detailsDiv = sidebarSelector + ' .salesforce-container .contact-lead .contact-lead-details';
        var contactActionsDiv = sidebarSelector + ' .salesforce-container .contact-lead .contact-actions';

        // Add task creation components
        $(tasksDiv + ' #create-task-form').load(chrome.extension.getURL('public/html/plugins/salesforce/addTask.html'), function () {
          self.ui.addCreateTaskForm.call(self, tasksDiv + ' #create-task-form', null, null, function (task) {
            $(tasksDiv + ' #create-task-form').slideUp('slow');

            var newTaskHTML = '<div class="task" data-id="' + task.id + '" style="display:none;"><div class="task-details">';

            if (task.priority) {
              newTaskHTML += '<span class="task-priorioty label label-default">' + task.priority + '</span>';
            }


            if (task.activityDate) {
              var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              // The date is epoch timestamp in this case
              var taskDate = new Date(task.activityDate);
              newTaskHTML += '<span class="task-date label label-warning">Due on ' + taskDate.getDate() + ' ' + monthNames[taskDate.getMonth()] + '</span>';

              // The date received here is epoch timestamp.
              // Convert it to the salesforce format to enable editing later
              var activityDate = task.activityDate;
              var dueDate = new Date(Math.floor(activityDate * 1000));
              var tDate = {
                month: ('0' + (dueDate.getMonth() + 1)).slice(-2),
                day: dueDate.getDate(),
                year: dueDate.getFullYear()
              };
              task.activityDate = tDate.year + '-' + tDate.month + '-' + tDate.day;
            }


            if (task.status) {
              newTaskHTML += '<span class="task-status label label-info">' + task.status + '</span>';
            }

            // close task details div
            newTaskHTML += '</div>';
            newTaskHTML += '<i class="fa fa-list"></i><span class="task-title">' + task.subject + '</span>';
            newTaskHTML += '</div>';


            window.strike = window.strike || {};
            window.strike.salesforce = window.strike.salesforce || {};
            window.strike.salesforce.tasks = window.strike.salesforce.tasks || [];

            window.strike.salesforce.tasks.push(task);

            // Add this task to the top of the list
            $(tasksDiv + ' .task-list').prepend(newTaskHTML);
            $(tasksDiv + ' .task-list .task[data-id=' + task.id + ']').slideDown('slow');

            $(tasksDiv + ' #salesforce-create-contact-task').removeClass('hidden');
          });

          $(tasksDiv + ' #salesforce-create-contact-task').on('click', function (evt) {
            $(tasksDiv + ' .title').removeClass('hidden');
            $(tasksDiv + ' .empty-tasks').addClass('hidden');

            $(tasksDiv + ' #salesforce-create-contact-task').addClass('hidden');
            $(tasksDiv + ' #create-task-form').slideDown('slow');
          });
        });

        if (emailData && !_.isEmpty(emailData)) {
          $(detailsDiv).removeClass('hidden');
          $(contactActionsDiv).removeClass('hidden');

          // Feed in email details
          var dataType = emailData.attributes.type.toLowerCase();

          var mailingDetails = {};

          if (dataType == 'contact') {
            $(detailsDiv + ' .contact-label').removeClass('hidden').attr('data-id', emailData.Id);

            mailingDetails = {
              street: emailData.MailingStreet,
              city: emailData.MailingCity,
              country: emailData.MailingCountry,
              postalCode: emailData.MailingPostalCode
            };
          } else {
            $(detailsDiv + ' .lead-label').removeClass('hidden').attr('data-id', emailData.Id);

            mailingDetails = {
              street: emailData.Street,
              city: emailData.City,
              country: emailData.Country,
              postalCode: emailData.PostalCode
            };

            if (emailData.Status) {
              $(detailsDiv + ' .lead-status').removeClass('hidden');
              $(detailsDiv + ' .lead-status #lead-status-val').text(emailData.Status);
            }
          }

          // Remove null and undefined values from mailingDetails obj
          mailingDetails = _.omitBy(mailingDetails, _.isNil);

          if (emailData.FirstName) {
            if (emailData.LastName) {
              $(detailsDiv + ' .contact-name').text(emailData.FirstName + ' ' + emailData.LastName).removeClass('hidden').attr('data-lastName', emailData.LastName).attr('data-firstName', emailData.FirstName);
            } else {
              $(detailsDiv + ' .contact-name').text(emailData.FirstName).removeClass('hidden').attr('data-firstName', emailData.FirstName);
            }
          } else if (emailData.LastName) {
            $(detailsDiv + ' .contact-name').text(emailData.LastName).removeClass('hidden').attr('data-lastName', emailData.LastName);
          }

          $(detailsDiv + ' .contact-name').removeClass('hidden');

          if (emailData.Phone) {
            $(detailsDiv + ' .contact-phone').removeClass('hidden');
            $(detailsDiv + ' .contact-phone #contact-phone-val').text(emailData.Phone);
          }

          if (emailData.Department) {
            $(detailsDiv + ' .contact-department').removeClass('hidden');
            $(detailsDiv + ' .contact-department #contact-department-val').text(emailData.Department);
          }

          if (emailData.Industry) {
            $(detailsDiv + ' .contact-industry').removeClass('hidden');
            $(detailsDiv + ' .contact-industry #contact-industry-val').text(emailData.Industry);
          }

          if (emailData.AnnualRevenue) {
            $(detailsDiv + ' .contact-annual-revenue').removeClass('hidden');
            $(detailsDiv + ' .contact-annual-revenue #contact-annual-revenue-val').text(emailData.AnnualRevenue);
          }
          if (!_.isEmpty(mailingDetails)) {
            $(detailsDiv + ' .contact-mailing-address').removeClass('hidden');
            if (mailingDetails.street) {
              $(detailsDiv + ' .contact-mailing-address #contact-mailing-street-val').text(mailingDetails.street);
              $(detailsDiv + ' .contact-mailing-address #contact-mailing-street-val').removeClass('hidden');
            }
            if (mailingDetails.city) {
              $(detailsDiv + ' .contact-mailing-address #contact-mailing-city-val').text(mailingDetails.city);
              $(detailsDiv + ' .contact-mailing-address #contact-mailing-city-val').removeClass('hidden');
            }
            if (mailingDetails.country) {
              $(detailsDiv + ' .contact-mailing-address #contact-mailing-country-val').text(mailingDetails.country);
              $(detailsDiv + ' .contact-mailing-address #contact-mailing-country-val').removeClass('hidden');
            }
            if (mailingDetails.postalCode) {
              $(detailsDiv + ' .contact-mailing-address #contact-mailing-postal-code-val').text(mailingDetails.postalCode);
              $(detailsDiv + ' .contact-mailing-address #contact-mailing-postal-code-val').removeClass('hidden');
            }
          }

          var company;
          if (emailData.Company) {
            company = emailData.Company;
          } else if (emailData.Account && emailData.Account.Name) {
            company = emailData.Account.Name;
          }

          if (company) {
            $(detailsDiv + ' .contact-employment').removeClass('hidden');

            if (emailData.Title) {
              $(detailsDiv + ' .contact-employment').html('<i class="fa fa-briefcase fa-lg"></i> ' + emailData.Title + ' at ' + company).attr('data-organization', company).attr('data-title', emailData.Title);
            } else {
              $(detailsDiv + ' .contact-employment').html('<i class="fa fa-briefcase fa-lg"></i> ' + company).attr('data-organization', company);
            }
          }

          if (emailData.Department || emailData.Industry || emailData.Phone || emailData.AnnualRevenue || !_.isEmpty(mailingDetails)) {
            $(detailsDiv + ' .contact-lead-details-more-action').removeClass('hidden');
          }

          // More details
          $(detailsDiv + ' .contact-lead-details-more-action').on('click', function () {

            if ($(detailsDiv + ' .contact-lead-details-more').css('display') == 'none') {

              $(detailsDiv + ' .contact-lead-details-more').slideDown('normal');

              $(detailsDiv + ' .contact-lead-details-more-action i').removeClass('fa-caret-down').addClass('fa-caret-up');
              $(detailsDiv + ' .contact-lead-details-more-action').attr('title', 'Less');
            } else {

              $(detailsDiv + ' .contact-lead-details-more').slideUp('normal');

              $(detailsDiv + ' .contact-lead-details-more-action i').removeClass('fa-caret-up').addClass('fa-caret-down');
              $(detailsDiv + ' .contact-lead-details-more-action').attr('title', 'More');
            }
          });

          // Preload a modal for editing contact
          if ($('.strike-container#edit-contact').length == 0) {
            var editContactHTML = document.createElement('div');
            editContactHTML.innerHTML = '<div class="strike-container" id="edit-contact"></div>';
            $('html').append(editContactHTML);
          }
          $('.strike-container#edit-contact').load(chrome.extension.getURL('public/html/plugins/salesforce/editContactModal.html'), function () {
            // Enable editing of contact
            $(detailsDiv + ' .salesforce-edit-contact').on('click', function () {
              $('.modal#salesforce-edit-contact').modal();
              self.ui.addEditContactForm.call(self, detailsDiv, profile, emailId, name, company, sidebarId);
            });
          });

          var account
          if (emailData.Account) {
            account = emailData.Account.Name || '';
          }

          // Opportunity Listing
          if (account) {
            // fetch opportunities
            self._getOpportunities.call(self, account, function (err, opportunities) {
              if (opportunities && opportunities.length > 0) {
                window.strike = window.strike || {};
                window.strike.salesforce = window.strike.salesforce || {};

                window.strike.salesforce.opportunities = opportunities;

                var title;
                if (opportunities.length == 1) {
                  title = '1 Active Opportunity';
                } else {
                  title = opportunities.length + ' Active Opportunities';
                }

                $(opportunitiesDiv).removeClass('hidden');
                $(opportunitiesDiv + ' .title').text(title);

                // populate opportunity list
                for (var i = 0; i < opportunities.length; i++) {
                  if (opportunities[i].Name) {
                    opportunityHTML = '<div class="opportunity" data-id="' + opportunities[i].Id + '"><div class="opportunity-details">';

                    if (opportunities[i].StageName) {
                      opportunityHTML += '<span class="opportunity-stage label label-default">' + opportunities[i].StageName + '</span>';
                    }

                    if (opportunities[i].CloseDate) {
                      var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                      var oppDate = new Date(opportunities[i].CloseDate);

                      opportunityHTML += '<span class="opportunity-close-date label label-warning">Close by ' + oppDate.getDate() + ' ' + monthNames[oppDate.getMonth()] + '</span>';
                    }

                    if (opportunities[i].Type) {
                      opportunityHTML += '<span class="opportunity-type label label-info">' + opportunities[i].Type + '</span>';
                    }

                    // close details div
                    opportunityHTML += '</div>';

                    opportunityHTML += '<i class="fa fa-bolt fa-lg" style="color: #689550;"></i><span class="opportunity-title">' + opportunities[i].Name + '</span>';

                    opportunityHTML += '</div>';

                    opportunityHTML += '<div style="display: none;" class="opportunity-actions" data-opportunityId="' + opportunities[i].Id + '"><span class="salesforce-edit-opportunity-button"><button type="button" class="btn btn-default btn-sm" data-opportunityId="' + opportunities[i].Id + '">Edit</button></span></div>';
                    $(opportunitiesDiv + ' .opportunity-list').append(opportunityHTML);
                  }
                }

                $(opportunitiesDiv + ' .opportunity-list .opportunity').on('click', function (evt) {
                  var oppId = $(this).attr('data-id');
                  $(opportunitiesDiv + ' .opportunity-list .opportunity-actions[data-opportunityId="' + oppId + '"]').slideToggle();
                });

                // Preload a modal for editing opportunity
                if ($('.strike-container#edit-opportunity').length == 0) {
                  var editOppHTML = document.createElement('div');
                  editOppHTML.innerHTML = '<div class="strike-container" id="edit-opportunity"></div>';
                  $('html').append(editOppHTML);
                }
                $('.strike-container#edit-opportunity').load(chrome.extension.getURL('public/html/plugins/salesforce/editOpportunityModal.html'), function () {
                  $(opportunitiesDiv + ' .opportunity-list .opportunity-actions .salesforce-edit-opportunity-button button').on('click', function () {
                    var oppId = $(this).attr('data-opportunityId');
                    $('.modal#salesforce-edit-opportunity').modal();
                    self.ui.addEditOpportunityForm.call(self, '.strike-container#edit-opportunity .modal#salesforce-edit-opportunity .edit-opportunity-form', oppId, profile, emailId, name, company, sidebarId);
                  });
                });

              }
            });
          }

          // Create Opportunity
          $(contactActionsDiv + ' #create-opportunity-form-container').load(chrome.extension.getURL('public/html/plugins/salesforce/addOpportunity.html'), function () {
            self.ui.addCreateOpportunityForm.call(self, contactActionsDiv + ' .create-opportunity-form', account, function (opportunity) {
              $(contactActionsDiv + ' #create-opportunity-form-container').slideUp('slow');
            });
          });
          $(contactActionsDiv + ' #salesforce-create-contact-opportunity').on('click', function (evt) {
            $(contactActionsDiv + ' #salesforce-create-contact-opportunity').addClass('hidden');
            $(contactActionsDiv + ' #create-opportunity-form-container').slideDown('slow');
          });

          // Log Call
          $(contactActionsDiv + ' #log-call-form-container').load(chrome.extension.getURL('public/html/plugins/salesforce/logCall.html'), function () {
            self.ui.addLogCallForm.call(self, contactActionsDiv + ' .log-call-form', function (call) {
              $(contactActionsDiv + ' #log-call-form-container').slideUp('slow');
              $(contactActionsDiv + ' #salesforce-log-call').removeClass('hidden');
            });
          });
          $(contactActionsDiv + ' #salesforce-log-call').on('click', function (evt) {
            $(contactActionsDiv + ' #salesforce-log-call').addClass('hidden');
            $(contactActionsDiv + ' #log-call-form-container').slideDown('slow');
          });

          // Tasks
          if (tasks && tasks.length > 0) {
            window.strike = window.strike || {};
            window.strike.salesforce = window.strike.salesforce || {};

            window.strike.salesforce.tasks = tasks;


            // populate task list
            for (var i = 0; i < tasks.length; i++) {
              if (tasks[i].subject) {

                taskHTML = '<div class="task" data-id="' + tasks[i].id + '"><div class="task-details">';

                if (tasks[i].priority) {
                  taskHTML += '<span class="task-priorioty label label-default">' + tasks[i].priority + '</span>';
                }

                if (tasks[i].status) {
                  taskHTML += '<span class="task-status label label-info">' + tasks[i].status + '</span>';
                }

                if (tasks[i].activityDate) {
                  var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                  var taskDate = new Date(tasks[i].activityDate);

                  taskHTML += '<span class="task-date label label-warning">Due on ' + taskDate.getDate() + ' ' + monthNames[taskDate.getMonth()] + '</span>';
                }
                // close task details div
                taskHTML += '</div>'

                taskHTML += '<i class="fa fa-list"></i><span class="task-title">' + tasks[i].subject + '</span>';

                taskHTML += '</div>';

                taskHTML += '<div style="display: none;" class="task-actions" data-taskId="' + tasks[i].id + '"><span class="salesforce-edit-task-button"><button type="button" class="btn btn-default btn-sm" data-taskId="' + tasks[i].id + '">Edit</button></span></div>';

                $(tasksDiv + ' .task-list').append(taskHTML);
              }
            }

            $(tasksDiv + ' .task-list .task').on('click', function (evt) {
              var taskId = $(this).attr('data-id');
              $(tasksDiv + ' .task-list .task-actions[data-taskId="' + taskId + '"]').slideToggle();
            });

            // Preload a modal for editing task
            if ($('.strike-container#edit-task').length == 0) {
              var editTaskHTML = document.createElement('div');
              editTaskHTML.innerHTML = '<div class="strike-container" id="edit-task"></div>';
              $('html').append(editTaskHTML);
            }
            $('.strike-container#edit-task').load(chrome.extension.getURL('public/html/plugins/salesforce/editTaskModal.html'), function () {
              $(tasksDiv + ' .task-list .task-actions .salesforce-edit-task-button button').on('click', function () {
                var taskId = $(this).attr('data-taskId');
                $('.modal#salesforce-edit-task').modal();
                self.ui.addEditTaskForm.call(self, '.strike-container#edit-task .modal#salesforce-edit-task .edit-task-form', taskId, profile, emailId, name, company, sidebarId);
              });
            });


          } else {
            // No active tasks for this contact/lead
            $(tasksDiv + ' .task-list .empty-tasks').removeClass('hidden');
            $(tasksDiv + ' #salesforce-create-contact-task button').text('Create Task');
          }

        } else {
          $(sidebarSelector + ' .salesforce-container .contact-lead .contact-lead-details').addClass('hidden');

          $(tasksDiv + ' .title').addClass('hidden');
          $(tasksDiv + ' .task-list .empty-tasks').removeClass('hidden');
          $(tasksDiv + ' #salesforce-create-contact-task button').text('Create Task');

          // Add Create Contact Button in the people sidebar
          $(sidebarSelector + ' .profile .person .salesforce-actions #salesforce-add-contact-button').removeClass('hidden');
          $(sidebarSelector + ' .profile .person .salesforce-actions').fadeIn(400);
          $(sidebarSelector + ' .profile .person .salesforce-actions .salesforce-create-contact-form ').load(chrome.extension.getURL('public/html/plugins/salesforce/createContact.html'), function () {
            optionHTML = '';
            // populate Lead Status list
            for (var i = 0; i < self.leadStatus.length; i++) {
              optionHTML += '<option value="' + self.leadStatus[i].ApiName + '">' + self.leadStatus[i].MasterLabel + '</option>';
            }
            $(sidebarSelector + ' .profile .person .salesforce-actions .salesforce-create-contact-form #create-contact .form-group select#lead-status').html(optionHTML);

            $(sidebarSelector + ' .profile .person .salesforce-actions #salesforce-add-contact-button button').on('click', function (evt) {

              $(sidebarSelector + ' .profile .person .salesforce-actions .salesforce-create-contact-form').removeClass('hidden');
              $(sidebarSelector + ' #create-contact').slideDown('slow');
              $(sidebarSelector + ' .profile .person .salesforce-actions #salesforce-add-contact-button button').addClass('hidden');

              $(sidebarSelector + ' .profile .person .salesforce-actions .salesforce-create-contact-form #create-contact select#type').on('change', function () {

                if ($(this).val() == 'lead') {
                  $(sidebarSelector + ' .profile .person .salesforce-actions .salesforce-create-contact-form #create-contact #form-group-lead-status').removeClass('hidden');
                  if ($(sidebarSelector + ' .profile .person .salesforce-actions .salesforce-create-contact-form #create-contact .more').css('display') != 'none') {
                    $(sidebarSelector + ' .profile .person .salesforce-actions .salesforce-create-contact-form #create-contact .more .more-lead').removeClass('hidden');
                    $(sidebarSelector + ' .profile .person .salesforce-actions .salesforce-create-contact-form #create-contact .more .more-contact').addClass('hidden');
                  }
                } else {
                  $(sidebarSelector + ' .profile .person .salesforce-actions .salesforce-create-contact-form #create-contact #form-group-lead-status').addClass('hidden');

                  if ($(sidebarSelector + ' .profile .person .salesforce-actions .salesforce-create-contact-form #create-contact .more').css('display') != 'none') {
                    $(sidebarSelector + ' .profile .person .salesforce-actions .salesforce-create-contact-form #create-contact .more .more-contact').removeClass('hidden');
                    $(sidebarSelector + ' .profile .person .salesforce-actions .salesforce-create-contact-form #create-contact .more .more-lead').addClass('hidden');
                  }
                }
              });

              $(sidebarSelector + ' .profile .person .salesforce-actions .salesforce-create-contact-form #create-contact .more-action').on('click', function () {

                if ($(sidebarSelector + ' .profile .person .salesforce-actions .salesforce-create-contact-form #create-contact .more').css('display') == 'none') {
                  $(sidebarSelector + ' .profile .person .salesforce-actions .salesforce-create-contact-form #create-contact .more').slideDown('normal');

                  $(sidebarSelector + ' .profile .person .salesforce-actions .salesforce-create-contact-form #create-contact .more-action i').removeClass('fa-caret-down').addClass('fa-caret-up');
                  $(sidebarSelector + ' .profile .person .salesforce-actions .salesforce-create-contact-form #create-contact .more-action').attr('title', 'Less');

                  if ($(sidebarSelector + ' .profile .person .salesforce-actions .salesforce-create-contact-form #create-contact select#type').val() == 'contact') {
                    $(sidebarSelector + ' .profile .person .salesforce-actions .salesforce-create-contact-form #create-contact .more .more-contact').removeClass('hidden');
                    $(sidebarSelector + ' .profile .person .salesforce-actions .salesforce-create-contact-form #create-contact .more .more-lead').addClass('hidden');
                  } else if ($(sidebarSelector + ' .profile .person .salesforce-actions .salesforce-create-contact-form #create-contact select#type').val() == 'lead') {
                    $(sidebarSelector + ' .profile .person .salesforce-actions .salesforce-create-contact-form #create-contact .more .more-contact').addClass('hidden');
                    $(sidebarSelector + ' .profile .person .salesforce-actions .salesforce-create-contact-form #create-contact .more .more-lead').removeClass('hidden');
                  }

                } else {
                  $(sidebarSelector + ' .profile .person .salesforce-actions .salesforce-create-contact-form #create-contact .more').slideUp('normal');

                  $(sidebarSelector + ' .profile .person .salesforce-actions .salesforce-create-contact-form #create-contact .more .more-contact').addClass('hidden');
                  $(sidebarSelector + ' .profile .person .salesforce-actions .salesforce-create-contact-form #create-contact .more .more-lead').addClass('hidden');


                  $(sidebarSelector + ' .profile .person .salesforce-actions .salesforce-create-contact-form #create-contact .more-action i').addClass('fa-caret-down').removeClass('fa-caret-up');
                  $(sidebarSelector + ' .profile .person .salesforce-actions .salesforce-create-contact-form #create-contact .more-action').attr('title', 'More');

                }

              });

            });

            $(sidebarSelector + ' .profile .person .salesforce-actions #salesforce-save-contact-button button').on('click', function (evt) {
              var baseJQSelector = sidebarSelector + ' .profile .person .salesforce-actions #create-contact .create-contact-form';

              $(this).button('loading');
              // Save the contact/lead
              loader = self.libs.sdk.ButterBar.showLoading();
              self.createContactAndLead(baseJQSelector, evt, function (err, shouldShowError) {
                loader.destroy();
                if (err) {
                  if (!shouldShowError) {
                    err = 'An error occued while saving to salesforce. Please try again'
                  }
                  self.libs.sdk.ButterBar.showError({
                    text: err
                  });
                  $(this).button('reset');
                } else {
                  self.libs.sdk.ButterBar.showMessage({
                    text: 'Successfuly saved to Salesforce'
                  });
                  $(sidebarSelector + ' .profile .person .salesforce-actions #salesforce-add-contact-button').addClass('hidden');
                  $(sidebarSelector + ' .profile .person .salesforce-actions #salesforce-save-contact-button').addClass('hidden');

                  $(sidebarSelector + ' .profile .person .salesforce-actions .salesforce-create-contact-form #create-contact').slideUp();
                  $(this).button('reset');

                  self.ui.loadSidebarElements.call(self, profile, emailId, name, company, sidebarId);
                }
              });
            });

            // Populate the people data from our profile data
            UserController.fetchProfile(self.libs, {
              name: name,
              emailAddress: emailId
            }, function (err, code, profile, contact) {

              name = contact.name;
              // Name
              if (!name) {
                if (profile.name && profile.name.length > 0) {
                  firstName = profile.name[0].firstName;
                  lastName = profile.name[0].lastName;
                }
              } else {
                if (name != 'me') {
                  nameParts = name.split(' ');
                  lastName = nameParts[nameParts.length - 1];
                  nameParts.splice(nameParts.length - 1);
                  firstName = nameParts.join(' ');
                } else {
                  if (profile.name && profile.name.length > 0) {
                    firstName = profile.name[0].firstName || '';
                    lastName = profile.name[0].lastName || '';
                  }
                }
              }

              $(sidebarSelector + ' .profile .person .salesforce-actions #create-contact .create-contact-form input#first-name').val(firstName);
              $(sidebarSelector + ' .profile .person .salesforce-actions #create-contact .create-contact-form input#last-name').val(lastName);

              $(sidebarSelector + ' .profile .person .salesforce-actions #create-contact .create-contact-form input#email').val(contact.emailAddress);

              var employment;
              if (profile.employment && profile.employment.length > 0) {
                for (var i = 0; i < profile.employment.length; i++) {
                  if (profile.employment[i].employmentType == 'employment' && profile.employment[i].isCurrent) {
                    employment = profile.employment[i];
                  }
                }
                if (!employment) {
                  for (var i = 0; i < profile.employment.length; i++) {
                    if (profile.employment[i].employmentType == 'employment') {
                      employment = profile.employment[i];
                    }
                  }
                }
              } else if (company && company.name && company.name.displayName) {
                employment = {
                  organization: company.name.displayName
                };
              }

              if (employment) {
                if (employment.organization) {
                  $(sidebarSelector + ' .profile .person .salesforce-actions #create-contact .create-contact-form input#company').val(employment.organization);
                }
                if (employment.title) {
                  $(sidebarSelector + ' .profile .person .salesforce-actions #create-contact .create-contact-form input#title').val(employment.title);
                }
              }

              if (profile.phone && profile.phone.length > 0 && profile.phone[0].number) {
                $(sidebarSelector + ' .profile .person .salesforce-actions #create-contact .create-contact-form input#phone').val(profile.phone[0].number);
              }

              if (company && company.category && company.category.industry) {
                $(sidebarSelector + ' .profile .person .salesforce-actions #create-contact .create-contact-form input#industry').val(company.category.industry);
              }
            });
          });
        }
      });
    });

  },

  loadAttachmentIcon: function (messageView) {
    var self = this;

    var _addSaveEmailIcon = function (messageView) {
      var addEmailImg = chrome.extension.getURL('public/img/plugins/salesforce-add-email-to-crm.png');
      var addEmailLoaderImg = chrome.extension.getURL('public/img/plugins/salesforce-add-email-to-crm-loader.gif');
      var addEmailCompleteImg = chrome.extension.getURL('public/img/plugins/salesforce-add-email-to-crm-complete.png');

      messageView.addAttachmentIcon({
        iconUrl: chrome.extension.getURL('public/img/plugins/salesforce-add-email-to-crm.png'),
        iconClass: 'salesforce-add-email-to-crm-attachment-icon',
        tooltip: 'Add this email to Salesforce',
        onClick: function (event) {
          $('.salesforce-add-email-to-crm-attachment-icon').css('background', 'url(' + addEmailLoaderImg + ') 0px 0px no-repeat');
          var loader = self.libs.sdk.ButterBar.showLoading();
          self.addEmail(messageView, function (err, shouldShowError) {
            loader.destroy();
            if (err) {
              $('.salesforce-add-email-to-crm-attachment-icon').css('background', 'url(' + addEmailImg + ') 0px 0px no-repeat');

              if (!shouldShowError) {
                err = 'An error occued while saving email to salesforce. Please try again'
              }
              self.libs.sdk.ButterBar.showError({
                text: err
              });
            } else {
              self.libs.sdk.ButterBar.showMessage({
                text: 'Email Successfuly saved to Salesforce'
              });
              $('.salesforce-add-email-to-crm-attachment-icon').css('background', 'url(' + addEmailCompleteImg + ') 0px 0px no-repeat');
            }
          });
        }
      });
    }

    if (messageView.isLoaded()) {
      _addSaveEmailIcon(messageView);
    } else {
      messageView.once('load', function (evt) {
        _addSaveEmailIcon(evt.messageView);
      });
    }
  },

  loadComposeViewElements: function (composeView) {
    var self = this;

    var logSalesforceCheckedImg = chrome.extension.getURL('public/img/plugins/salesforce-add-email-to-crm-checkbox-checked.png');
    var logSalesforceUncheckedImg = chrome.extension.getURL('public/img/plugins/salesforce-add-email-to-crm-checkbox-unchecked.png');

    var imageToDisp = logSalesforceUncheckedImg;

    var bccContacts = composeView.getBccRecipients();
    var bccEmails = [];
    for (var i = 0; i < bccContacts.length; i++) {
      bccEmails = bccEmails.concat(bccContacts[i].emailAddress);
    }
    if (bccEmails.indexOf(self.bccEmail) != -1) {
      // Replace with checked image
      imageToDisp = logSalesforceCheckedImg;
    }

    composeView.addButton({
      title: 'Log in Salesforce',
      iconUrl: imageToDisp,
      iconClass: 'strike-salesforce-compose-bcc',
      hasDropdown: false,
      type: 'MODIFIER',
      onClick: function (evt) {
        var composeView = evt.composeView;
        var bccContacts = composeView.getBccRecipients();
        var bccEmails = [];
        for (var i = 0; i < bccContacts.length; i++) {
          bccEmails = bccEmails.concat(bccContacts[i].emailAddress);
        }


        if (bccEmails.indexOf(self.bccEmail) != -1) {
          bccEmails = _.pull(bccEmails, self.bccEmail);
          // Replace with unchecked image
          $('img.inboxsdk__button_iconImg[src="' + logSalesforceCheckedImg + '"]').attr('src', logSalesforceUncheckedImg)
        } else {
          bccEmails.push(self.bccEmail);
          // replace with checked image
          $('img.inboxsdk__button_iconImg[src="' + logSalesforceUncheckedImg + '"]').attr('src', logSalesforceCheckedImg)
        }
        composeView.setBccRecipients(bccEmails);
      }
    });
  },

  addCreateTaskForm: function (parentSelector, threadSubject, dropdown, onCreate) {
    var self = this;
    // Task title
    $(parentSelector + ' #task-title').val(threadSubject);
    $(parentSelector + ' #task-title').focus();

    // Task Status
    var optionHTML = '';
    for (var i = 0; i < self.taskStatus.length; i++) {
      if (self.taskStatus[i].IsDefault) {
        optionHTML += '<option selected="selected" value="' + self.taskStatus[i].ApiName  + '">' + self.taskStatus[i].ApiName + '</option>';
      } else {
        optionHTML += '<option value="' + self.taskStatus[i].ApiName  + '">' + self.taskStatus[i].ApiName + '</option>';
      }
    }
    $(parentSelector + ' #task-status #task-status-items').html(optionHTML);

    // Task priority
    var optionHTML = '';
    for (var i = 0; i < self.taskPriorities.length; i++) {
      if (self.taskPriorities[i].IsDefault) {
        optionHTML += '<option selected="selected" value="' + self.taskPriorities[i].ApiName  + '">' + self.taskPriorities[i].ApiName + '</option>';
      } else {
        optionHTML += '<option value="' + self.taskPriorities[i].ApiName  + '">' + self.taskPriorities[i].ApiName + '</option>';
      }
    }
    $(parentSelector + ' #task-priority #task-priority-items').html(optionHTML);


    // Task assignee
    var optionHTML = '';
    for (var i = 0; i < self.members.length; i++) {
      var name = '';
      if (self.members[i].Email == self.addonEmail) {
        name += 'Me';
        optionHTML += '<option selected="selected" value="' + self.members[i].Email  + '" data-ownerId="' + self.members[i].Id + '">' + name + '</option>';
      } else {
        if (self.members[i].FirstName) {
          name += self.members[i].FirstName;
          if (self.members[i].LastName) {
            name += ' ' + self.members[i].LastName;
          }
        } else if (self.members[i].LastName) {
          name += self.members[i].LastName;
        } else {
          name += self.members[i].Email;
        }
        optionHTML += '<option value="' + self.members[i].Email  + '" data-ownerId="' + self.members[i].Id + '">' + name + '</option>';
      }
    }
    $(parentSelector + ' #task-assignee #task-assignee-items').html(optionHTML);


    // Task Due Date
    $(parentSelector + ' #task-date input#task-date-items')
    .datepicker({
      autoclose: true,
      format: 'yyyy-mm-dd',
      orientation: 'bottom right'
    })
    .on('changeDate', function(evt) {
      var date = $(parentSelector + ' #task-date input#task-date-items').datepicker('getFormattedDate');
      var activityDateTimeStamp = Math.floor(new Date(date)/1000);
      $(parentSelector + ' #task-date #task-date-items').attr('data-timestamp', activityDateTimeStamp);
    });

    // Task Contact/Lead
    var optionHTML = '';
    for (var i = 0; i < window.strike.people.length; i++) {
      if (window.strike.people[i].name) {
        if (window.strike.people[i].emailAddress != self.addonEmail) {
          optionHTML += '<option value="' + window.strike.people[i].emailAddress + '" data-name="' + window.strike.people[i].name + '">' + window.strike.people[i].name + '</option>';
        }
      } else {
        UserController.fetchProfile(self.libs, window.strike.people[i], function (err, code, profile, contact) {
          if (profile && profile.name && profile.name.length > 0) {
            var name = '';
            if (profile.name[0].firstName) {
              name += profile.name[0].firstName;
            }
            if (profile.name[0].lastName) {
              name += profile.name[0].lastName;
            }
            optionHTML += '<option value="' + contact.emailAddress + '" data-name="' + name + '">' + name + '</option>';
          } else {
            // No name found. We need to ask the user to enter the name
            optionHTML += '<option value="' + contact.emailAddress + '" data-name="' + contact.emailAddress + '">' + name + '</option>';
          }
        });
      }
    }
    $(parentSelector + ' #task-for #task-for-items').html(optionHTML);

    // Create Task button
    $(parentSelector + ' #add-task-submit').on('click', function (evt) {
      loader = self.libs.sdk.ButterBar.showLoading();
      $(parentSelector + ' #add-task-submit button').button('loading');
      self.createTask(parentSelector, evt, function (err, shouldShowError, task) {
        loader.destroy();
        if (err) {
          if (!shouldShowError) {
            err = 'An error occued while adding the task. Please try again'
          }
          self.libs.sdk.ButterBar.showError({
            text: err
          });
          $(parentSelector + ' #add-task-submit button').button('reset');
        } else {
          if (dropdown) {
            dropdown.close();
          }
          self.libs.sdk.ButterBar.showMessage({
            text: 'Task successfully added to Salesforce'
          });
          if (typeof onCreate == 'function') {
            onCreate(task)
          }
          $(parentSelector + ' #add-task-submit button').button('reset');
        }
      });
    });
  },

  addEditContactForm: function (detailsDiv, profile, emailId, name, company, sidebarId) {
    var self = this;

    var editContactDiv = '.modal#salesforce-edit-contact .modal-body form.edit-contact-form';

    optionHTML = '';
    // populate Lead Status list
    for (var i = 0; i < self.leadStatus.length; i++) {
      optionHTML += '<option value="' + self.leadStatus[i].ApiName + '">' + self.leadStatus[i].MasterLabel + '</option>';
    }
    $(editContactDiv + ' .form-group select#lead-status').html(optionHTML);

    $(editContactDiv + ' select#type').on('change', function () {
      if ($(this).val() == 'lead') {
        $(editContactDiv + ' #form-group-lead-status').removeClass('hidden');
        if ($(editContactDiv + ' .more').css('display') != 'none') {
          $(editContactDiv + ' .more .more-contact').addClass('hidden');
          $(editContactDiv + ' .more .more-lead').removeClass('hidden');
        }
      } else {
        $(editContactDiv + ' #form-group-lead-status').addClass('hidden');
        if ($(editContactDiv + ' .more').css('display') != 'none') {
        }
        $(editContactDiv + ' .more .more-contact').removeClass('hidden');
        $(editContactDiv + ' .more .more-lead').addClass('hidden');
      }
    });

    $(editContactDiv + ' .more-action').on('click', function () {
      $(editContactDiv + ' .more').slideDown('normal');

      if ($(editContactDiv + ' select#type').val() == 'contact') {
        $(editContactDiv + ' .more .more-contact').removeClass('hidden');
        $(editContactDiv + ' .more .more-lead').addClass('hidden');
      } else if ($(editContactDiv + ' select#type').val() == 'lead') {
        $(editContactDiv + ' .more .more-contact').addClass('hidden');
        $(editContactDiv + ' .more .more-lead').removeClass('hidden');
      }
      $(editContactDiv + ' .more-action').addClass('hidden');
    });


    if ($(detailsDiv + ' .contact-label').hasClass('hidden')) {
      var type = 'lead';
      var leadStatus = $(detailsDiv + ' .lead-status #lead-status-val').text();
      var contactLeadId = $(detailsDiv + ' .lead-label').attr('data-id');
    } else {
      var type = 'contact';
      var contactLeadId = $(detailsDiv + ' .contact-label').attr('data-id');
    }

    var firstName = ($(detailsDiv + ' .contact-name').attr('data-firstName') || '').trim();
    var lastName = ($(detailsDiv + ' .contact-name').attr('data-lastName') || '').trim();
    var phone = ($(detailsDiv + ' .contact-phone #contact-phone-val').text() || '').trim();
    var department = ($(detailsDiv + ' .contact-department #contact-department-val').text() || '').trim();
    var industry = ($(detailsDiv + ' .contact-industry #contact-industry-val').text() || '').trim();
    var annualRevenue = ($(detailsDiv + ' .contact-annual-revenue #contact-annual-revenue-val').text() || '').trim();
    var organization = ($(detailsDiv + ' .contact-employment').attr('data-organization') || '').trim();
    var title = ($(detailsDiv + ' .contact-employment').attr('data-title') || '').trim();
    var mailingStreet = ($(detailsDiv + ' .contact-mailing-address #contact-mailing-address-val #contact-mailing-street-val').text() || '').trim();
    var mailingCity = ($(detailsDiv + ' .contact-mailing-address #contact-mailing-address-val #contact-mailing-city-val').text() || '').trim();
    var mailingCountry = ($(detailsDiv + ' .contact-mailing-address #contact-mailing-address-val #contact-mailing-country-val').text() || '').trim();
    var mailingPostalCode = ($(detailsDiv + ' .contact-mailing-address #contact-mailing-address-val #contact-mailing-postal-code-val').text() || '').trim();

    $(editContactDiv + ' select#type').val(type);
    $(editContactDiv + ' select#type').trigger('change');
    if (type == 'lead') {
      // We cannot allow to create contact out of a lead because that makes no sense.
      $(editContactDiv + ' select#type').attr('disabled', 'true');
      $(editContactDiv + ' select#lead-status').val(leadStatus);
      $(editContactDiv + ' select#lead-status').trigger('change');
    }
    $(editContactDiv + ' #first-name').val(firstName);
    $(editContactDiv + ' #last-name').val(lastName);
    $(editContactDiv + ' #email').val(emailId);
    $(editContactDiv + ' #company').val(organization);
    $(editContactDiv + ' #title').val(title);
    $(editContactDiv + ' #phone').val(phone);
    $(editContactDiv + ' #department').val(department);
    $(editContactDiv + ' #industry').val(industry);
    $(editContactDiv + ' #annual-revenue').val(annualRevenue);
    $(editContactDiv + ' #mailing-street').val(mailingStreet);
    $(editContactDiv + ' #mailing-city').val(mailingCity);
    $(editContactDiv + ' #mailing-country').val(mailingCountry);
    $(editContactDiv + ' #mailing-postal-code').val(mailingPostalCode);

    if (industry || annualRevenue || department) {
      $(editContactDiv + ' .more-action').trigger('click');
    }

    $('#salesforce-edit-save-contact-button').on('click', function (evt) {
      $('#salesforce-edit-save-contact-button').button('loading');
      $('.modal#salesforce-edit-contact .modal-body .alert').slideUp();
      $('.modal#salesforce-edit-contact .modal-body span.message').text('');
      loader = self.libs.sdk.ButterBar.showLoading();
      self.createContactAndLead(editContactDiv, evt, function (err, shouldShowError) {
        loader.destroy();
        if (err) {
          if (!shouldShowError) {
            err = 'An error occued while saving to salesforce. Please try again'
          }
          self.libs.sdk.ButterBar.showError({
            text: err
          });
          $('.modal#salesforce-edit-contact .modal-body span.message').text(err);
          $('.modal#salesforce-edit-contact .modal-body .alert').slideDown();
          $('#salesforce-edit-save-contact-button').button('reset');
        } else {
          $('#salesforce-edit-save-contact-button').button('reset');
          $('.modal#salesforce-edit-contact').modal('hide');
          self.libs.sdk.ButterBar.showMessage({
            text: 'Successfuly saved to Salesforce'
          });
          UserController.displayProfile(self.libs, null, {
            emailAddress: emailId,
            name: name
          }, true);
        }
      }, contactLeadId);
    });
  },

  addEditTaskForm: function (parentSelector, taskId, profile, emailId, name, company, sidebarId) {
    var self = this;

    // Task Status
    var optionHTML = '';
    for (var i = 0; i < self.taskStatus.length; i++) {
      if (self.taskStatus[i].IsDefault) {
        optionHTML += '<option selected="selected" value="' + self.taskStatus[i].ApiName  + '">' + self.taskStatus[i].ApiName + '</option>';
      } else {
        optionHTML += '<option value="' + self.taskStatus[i].ApiName  + '">' + self.taskStatus[i].ApiName + '</option>';
      }
    }
    $(parentSelector + ' #task-status #task-status-items').html(optionHTML);

    // Task priority
    var optionHTML = '';
    for (var i = 0; i < self.taskPriorities.length; i++) {
      if (self.taskPriorities[i].IsDefault) {
        optionHTML += '<option selected="selected" value="' + self.taskPriorities[i].ApiName  + '">' + self.taskPriorities[i].ApiName + '</option>';
      } else {
        optionHTML += '<option value="' + self.taskPriorities[i].ApiName  + '">' + self.taskPriorities[i].ApiName + '</option>';
      }
    }
    $(parentSelector + ' #task-priority #task-priority-items').html(optionHTML);


    // Task assignee
    var optionHTML = '';
    for (var i = 0; i < self.members.length; i++) {
      var name = '';
      if (self.members[i].Email == self.addonEmail) {
        name += 'Me';
        optionHTML += '<option selected="selected" value="' + self.members[i].Email  + '" data-ownerId="' + self.members[i].Id + '">' + name + '</option>';
      } else {
        if (self.members[i].FirstName) {
          name += self.members[i].FirstName;
          if (self.members[i].LastName) {
            name += ' ' + self.members[i].LastName;
          }
        } else if (self.members[i].LastName) {
          name += self.members[i].LastName;
        } else {
          name += self.members[i].Email;
        }
        optionHTML += '<option value="' + self.members[i].Email  + '" data-ownerId="' + self.members[i].Id + '">' + name + '</option>';
      }
    }
    $(parentSelector + ' #task-assignee #task-assignee-items').html(optionHTML);


    // Task Contact/Lead
    var optionHTML = '';
    for (var i = 0; i < window.strike.people.length; i++) {
      if (window.strike.people[i].name) {
        if (window.strike.people[i].emailAddress != self.addonEmail) {
          optionHTML += '<option value="' + window.strike.people[i].emailAddress + '" data-name="' + window.strike.people[i].name + '">' + window.strike.people[i].name + '</option>';
        }
      } else {
        UserController.fetchProfile(self.libs, window.strike.people[i], function (err, code, profile, contact) {
          if (profile && profile.name && profile.name.length > 0) {
            var name = '';
            if (profile.name[0].firstName) {
              name += profile.name[0].firstName;
            }
            if (profile.name[0].lastName) {
              name += profile.name[0].lastName;
            }
            optionHTML += '<option value="' + contact.emailAddress + '" data-name="' + name + '">' + name + '</option>';
          } else {
            // No name found. We need to ask the user to enter the name
            optionHTML += '<option value="' + contact.emailAddress + '" data-name="' + contact.emailAddress + '">' + name + '</option>';
          }
        });
      }

      if (window.strike.people[i].emailAddress == emailId) {
        var contactForTask = window.strike.people[i];
      }
    }
    $(parentSelector + ' #task-for #task-for-items').html(optionHTML);

    // Add default values
    var task;
    for (var i = 0; i < window.strike.salesforce.tasks.length; i++) {
      if (window.strike.salesforce.tasks[i].id == taskId) {
        task = window.strike.salesforce.tasks[i];
        break;
      }
    }

    $(parentSelector + ' #task-title').val(task.subject);
    $(parentSelector + ' #task-status #task-status-items').val(task.status);
    $(parentSelector + ' #task-priority #task-priority-items').val(task.priority);

    $(parentSelector + ' #task-assignee #task-assignee-items').val(self.addonEmail);

    $(parentSelector + ' #task-date input#task-date-items')
    .datepicker({
      autoclose: true,
      format: 'yyyy-mm-dd'
    })
    .on('changeDate', function(evt) {
      var date = $(parentSelector + ' #task-date input#task-date-items').datepicker('getFormattedDate');
      var activityDateTimeStamp = Math.floor(new Date(date)/1000);
      $(parentSelector + ' #task-date #task-date-items').attr('data-timestamp', activityDateTimeStamp);
    });
    $(parentSelector + ' #task-date #task-date-items').attr('data-timestamp', Math.floor(new Date(task.activityDate)/1000));
    $(parentSelector + ' #task-date #task-date-items').datepicker('update', task.activityDate);

    $(parentSelector + ' #task-for #task-for-items').val(contactForTask.emailAddress);

    $('#salesforce-edit-task .modal-footer #salesforce-edit-save-task-button').on('click', function (evt) {
      var loader = self.libs.sdk.ButterBar.showLoading();
      $(this).button('loading');
      $('.modal#salesforce-edit-task .modal-body span.message').text('');
      $('.modal#salesforce-edit-task .modal-body .alert').slideUp();

      self.createTask.call(self, parentSelector, evt, function (err, shouldShowError, taskId) {
        loader.destroy();
        if (err) {
          if (!shouldShowError) {
            err = 'An error occued while saving task to salesforce. Please try again'
          }
          self.libs.sdk.ButterBar.showError({
            text: err
          });
          $('.modal#salesforce-edit-task .modal-body span.message').text(err);
          $('.modal#salesforce-edit-task .modal-body .alert').slideDown();

          $(parentSelector + ' #salesforce-edit-save-task-button').button('reset');
        } else {
          $(parentSelector + ' #salesforce-edit-save-task-button').button('reset');
          $('.modal#salesforce-edit-task').modal('hide');
          self.libs.sdk.ButterBar.showMessage({
            text: 'Successfuly saved to Salesforce'
          });
          UserController.displayProfile(self.libs, null, {
            emailAddress: emailId,
            name: name
          }, true);
        }
      }, taskId);
    });
  },

  addCreateOpportunityForm: function (parentSelector, account, onCreate) {
    var self = this;
    $(parentSelector + ' #opportunity-account-items').val(account);

    $(parentSelector + ' #opportunity-name').focus();

    if (!account) {
      $(parentSelector + ' #opportunity-account').removeClass('hidden');
    }

    // Opportunity Stages
    var optionHTML = '';
    for (var i = 0; i < self.opportunityStages.length; i++) {
      if (i == 0) {
        optionHTML += '<option selected="selected" value="' + self.opportunityStages[i].ApiName  + '" data-probability="' + self.opportunityStages[i].DefaultProbability + '">' + self.opportunityStages[i].ApiName + '</option>';
      } else {
        optionHTML += '<option value="' + self.opportunityStages[i].ApiName  + '" data-probability="' + self.opportunityStages[i].DefaultProbability + '">' + self.opportunityStages[i].ApiName + '</option>';
      }
    }
    $(parentSelector + ' #opportunity-stages #opportunity-stages-items').html(optionHTML);

    // Close date
    $(parentSelector + ' #opportunity-close-date input#opportunity-close-date-items')
    .datepicker({
      autoclose: true,
      format: 'yyyy-mm-dd',
      orientation: 'bottom right'
    })
    .on('changeDate', function(evt) {
      var date = $(parentSelector + ' #opportunity-close-date input#opportunity-close-date-items').datepicker('getFormattedDate');
      var activityDateTimeStamp = Math.floor(new Date(date)/1000);
      $(parentSelector + ' #opportunity-close-date #opportunity-close-date-items').attr('data-timestamp', activityDateTimeStamp);
    });

    var shouldPorbablityUpdate = true;
    var selectedStage = $(parentSelector + ' #opportunity-stages #opportunity-stages-items option:selected')[0];
    $(parentSelector + ' #opportunity-probability').val($(selectedStage).attr('data-probability'));
    $(parentSelector + ' #opportunity-stages #opportunity-stages-items').on('change', function () {
      if (shouldPorbablityUpdate) {
        var selectedStage = $(parentSelector + ' #opportunity-stages #opportunity-stages-items option:selected')[0];
        $(parentSelector + ' #opportunity-probability').val($(selectedStage).attr('data-probability'));
      }
    });
    $(parentSelector + ' #opportunity-probability').on('focus', function () {
      shouldPorbablityUpdate = false;
    });

    // Create Opportunity button
    $(parentSelector + ' #add-opportunity-submit').on('click', function (evt) {
      var loader = self.libs.sdk.ButterBar.showLoading();
      $(parentSelector + ' #add-opportunity-submit button').button('loading');
      self.createOpportunity(parentSelector, evt, function (err, shouldShowError, opportunity) {
        loader.destroy();
        if (err) {
          if (!shouldShowError) {
            err = 'An error occued while adding the opportunity. Please try again'
          }
          self.libs.sdk.ButterBar.showError({
            text: err
          });
          $(parentSelector + ' #add-opportunity-submit button').button('reset');
        } else {
          self.libs.sdk.ButterBar.showMessage({
            text: 'Opportunity successfully added to Salesforce'
          });
          if (typeof onCreate == 'function') {
            onCreate(opportunity);
          }
          $(parentSelector + ' #add-opportunity-submit button').button('reset');
        }
      });
    });
  },

  addEditOpportunityForm: function (parentSelector, oppId, profile, emailId, name, company, sidebarId) {
    var self = this;

    // Opportunity Stages
    var optionHTML = '';
    for (var i = 0; i < self.opportunityStages.length; i++) {
      if (i == 0) {
        optionHTML += '<option selected="selected" value="' + self.opportunityStages[i].ApiName  + '" data-probability="' + self.opportunityStages[i].DefaultProbability + '">' + self.opportunityStages[i].ApiName + '</option>';
      } else {
        optionHTML += '<option value="' + self.opportunityStages[i].ApiName  + '" data-probability="' + self.opportunityStages[i].DefaultProbability + '">' + self.opportunityStages[i].ApiName + '</option>';
      }
    }
    $(parentSelector + ' #opportunity-stages #opportunity-stages-items').html(optionHTML);

    // Add default values
    var opportunity;
    for (var i = 0; i < window.strike.salesforce.opportunities.length; i++) {
      if (window.strike.salesforce.opportunities[i].Id == oppId) {
        opportunity = window.strike.salesforce.opportunities[i];
        break;
      }
    }

    $(parentSelector + ' #opportunity-name').val(opportunity.Name);
    $(parentSelector + ' #opportunity-stages #opportunity-stages-items').val(opportunity.StageName);
    $(parentSelector + ' #opportunity-amount').val(opportunity.Amount);
    $(parentSelector + ' #opportunity-probability').val(opportunity.Probability);
    $(parentSelector + ' #opportunity-next-step').val(opportunity.NextStep);
    $(parentSelector + ' #opportunity-description').val(opportunity.Description);

    $(parentSelector + ' #opportunity-is-private').prop('checked', opportunity.isPrivate);
    $(parentSelector + ' #opportunity-account').val(opportunity.Account.Name);

    $(parentSelector + ' #opportunity-close-date input#opportunity-close-date-items')
    .datepicker({
      autoclose: true,
      format: 'yyyy-mm-dd'
    })
    .on('changeDate', function(evt) {
      var date = $(parentSelector + ' #opportunity-close-date input#opportunity-close-date-items').datepicker('getFormattedDate');
      var activityDateTimeStamp = Math.floor(new Date(date)/1000);
      $(parentSelector + ' #opportunity-close-date #opportunity-close-date-items').attr('data-timestamp', activityDateTimeStamp);
    });
    $(parentSelector + ' #opportunity-close-date #opportunity-close-date-items').attr('data-timestamp', Math.floor(new Date(opportunity.CloseDate)/1000));
    $(parentSelector + ' #opportunity-close-date #opportunity-close-date-items').datepicker('update', opportunity.CloseDate);

    $('#salesforce-edit-opportunity .modal-footer #salesforce-edit-save-opportunity-button').on('click', function (evt) {
      var loader = self.libs.sdk.ButterBar.showLoading();
      $(this).button('loading');
      $('.modal#salesforce-edit-opportunity .modal-body span.message').text('');
      $('.modal#salesforce-edit-opportunity .modal-body .alert').slideUp();

      self.createOpportunity.call(self, parentSelector, evt, function (err, shouldShowError, oppId) {
        loader.destroy();
        if (err) {
          if (!shouldShowError) {
            err = 'An error occued while saving to salesforce. Please try again'
          }
          self.libs.sdk.ButterBar.showError({
            text: err
          });
          $('.modal#salesforce-edit-opportunity .modal-body span.message').text(err);
          $('.modal#salesforce-edit-opportunity .modal-body .alert').slideDown();

          $('#salesforce-edit-opportunity .modal-footer #salesforce-edit-save-opportunity-button').button('reset');
        } else {
          $('#salesforce-edit-opportunity .modal-footer #salesforce-edit-save-opportunity-button').button('reset');
          $('.modal#salesforce-edit-opportunity').modal('hide');
          self.libs.sdk.ButterBar.showMessage({
            text: 'Successfuly saved to Salesforce'
          });
          UserController.displayProfile(self.libs, null, {
            emailAddress: emailId,
            name: name
          }, true);
        }
      }, oppId);
    });
  },

  addLogCallForm: function (parentSelector, onCreate) {
    var self = this;

    // Call Subject
    var optionHTML = '';
    for (var i = 0; i < self.callSubjects.length; i++) {
      if (self.callSubjects[i].default) {
        optionHTML += '<option selected="selected" value="' + self.callSubjects[i].fullName  + '">' + self.callSubjects[i].fullName + '</option>';
      } else {
        optionHTML += '<option value="' + self.callSubjects[i].fullName  + '">' + self.callSubjects[i].fullName + '</option>';
      }
    }
    $(parentSelector + ' #call-subject #call-subject-items').html(optionHTML);

    // Date
    $(parentSelector + ' #call-date input#call-date-items')
    .datepicker({
      autoclose: true,
      format: 'yyyy-mm-dd',
      orientation: 'bottom right'
    })
    .on('changeDate', function(evt) {
      var date = $(parentSelector + ' #call-date input#call-date-items').datepicker('getFormattedDate');
      var activityDateTimeStamp = Math.floor(new Date(date)/1000);
      $(parentSelector + ' #call-date #call-date-items').attr('data-timestamp', activityDateTimeStamp);
    });
    $(parentSelector + ' #call-date #call-date-items').datepicker('update', new Date());

    // Contact/Lead
    var optionHTML = '';
    for (var i = 0; i < window.strike.people.length; i++) {
      if (window.strike.people[i].name) {
        if (window.strike.people[i].emailAddress != self.addonEmail) {
          optionHTML += '<option value="' + window.strike.people[i].emailAddress + '" data-name="' + window.strike.people[i].name + '">' + window.strike.people[i].name + '</option>';
        }
      } else {
        UserController.fetchProfile(self.libs, window.strike.people[i], function (err, code, profile, contact) {
          if (profile && profile.name && profile.name.length > 0) {
            var name = '';
            if (profile.name[0].firstName) {
              name += profile.name[0].firstName;
            }
            if (profile.name[0].lastName) {
              name += profile.name[0].lastName;
            }
            optionHTML += '<option value="' + contact.emailAddress + '" data-name="' + name + '">' + name + '</option>';
          } else {
            // No name found. We need to ask the user to enter the name
            optionHTML += '<option value="' + contact.emailAddress + '" data-name="' + contact.emailAddress + '">' + name + '</option>';
          }
        });
      }
    }
    $(parentSelector + ' #call-for #call-for-items').html(optionHTML);

    // Log call button
    $(parentSelector + ' #log-call-submit').on('click', function (evt) {
      loader = self.libs.sdk.ButterBar.showLoading();
      $(parentSelector + ' #log-call-submit button').button('loading');
      self.logCall.call(self, parentSelector, evt, function (err, shouldShowError, resp) {
        loader.destroy();
        if (err) {
          if (!shouldShowError) {
            err = 'An error occued while logging the call. Please try again'
          }
          self.libs.sdk.ButterBar.showError({
            text: err
          });
          $(parentSelector + ' #log-call-submit button').button('reset');
        } else {
          self.libs.sdk.ButterBar.showMessage({
            text: 'Call logged successfully'
          });
          if (typeof onCreate == 'function') {
            onCreate(resp)
          }
          $(parentSelector + ' #log-call-submit button').button('reset');
        }
      });
    });
  }
};

SalesforcePlugin.prototype.createTask = function (parentSelector, evt, callback, taskId, markAsDone) {
  var self = this;

  var method = 'POST';
  var urlEndpoint = '/tasks';

  if (!markAsDone) {
    var taskObj = {
      status: $(parentSelector + ' #task-status #task-status-items').val(),
      subject: $(parentSelector + ' #task-title').val(),
      priority: $(parentSelector + ' #task-priority #task-priority-items').val(),
      person: {
        emailId: $(parentSelector + ' #task-for #task-for-items').val(),
        name: {}
      },
      activityDate: $(parentSelector + ' #task-date #task-date-items').datepicker('getFormattedDate'),
      ownerId: $(parentSelector + ' #task-assignee #task-assignee-items option[selected]').attr('data-ownerId')
    };
    var name = $(parentSelector + ' #task-for #task-for-items').find(':selected').attr('data-name').split(' ');
    taskObj.person.name.lastName = name[name.length-1];
    name.splice(name.length - 1);
    taskObj.person.name.firstName = name.join(' ')

    if (!taskObj.subject) {
      return callback('Please add a task title', true);
    }
    if (!taskObj.person.name) {
      return callback('Please add the name of the contact', true);
    }
  }


  if (taskId) {
    // It is an update request
    method = 'PUT';
    urlEndpoint = urlEndpoint + '/' + taskId;

    if (markAsDone) {
      taskObj = {
        isClosed: true
      };
    }
  }


  self._request(method, urlEndpoint, taskObj, function (err, resp) {
    if (err) {
      return callback(err, false);
    }
    taskObj.id = resp.data.id;
    return callback(null, null, taskObj);
  });

};

SalesforcePlugin.prototype.createContactAndLead = function (baseJQSelector, evt, callback, contactLeadId) {
    var self = this;

    var emailRegExp = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);


    var firstName = $(baseJQSelector + ' input#first-name').val().trim();
    var lastName = $(baseJQSelector + ' input#last-name').val().trim();
    var emailId = $(baseJQSelector + ' input#email').val().trim();
    var accountName = $(baseJQSelector + ' input#company').val().trim();
    var title = $(baseJQSelector + ' input#title').val().trim();
    var phone = $(baseJQSelector + ' input#phone').val().trim();
    var type = $(baseJQSelector + ' select#type').val().trim();
    var leadStatus = $(baseJQSelector + ' select#lead-status').val().trim();
    var department = $(baseJQSelector + ' input#department').val().trim();
    var industry = $(baseJQSelector + ' input#industry').val().trim();
    var annualRevenue = $(baseJQSelector + ' input#annual-revenue').val().trim();
    var mailingStreet = $(baseJQSelector + ' input#mailing-street').val().trim();
    var mailingCity = $(baseJQSelector + ' input#mailing-city').val().trim();
    var mailingCountry = $(baseJQSelector + ' input#mailing-country').val().trim();
    var mailingPostalCode = $(baseJQSelector + ' input#mailing-postal-code').val().trim();

    if (!emailId || !emailRegExp.test(emailId)) {
      return callback('Please enter a valid Email Id', true);
    }
    if (!lastName) {
      return callback('Last name is required', true);
    }
    if (type == 'lead' && !accountName) {
      return callback('Account name is required', true);
    }

    var objToSend = {
      company: accountName,
      person: {
        emailId: emailId,
        name: {
          firstName: firstName,
          lastName: lastName
        }
      },
      title: title,
      phone: phone,
      department: department
    };
    var urlEndpoint = '/contacts';

    if (type == 'lead') {
      objToSend.industry = industry;
      objToSend.annualRevenue = annualRevenue;
      objToSend.status = leadStatus;
      objToSend.leadSource = 'Email';

      objToSend.street = mailingStreet;
      objToSend.city = mailingCity;
      objToSend.country = mailingCountry;
      objToSend.zip = mailingPostalCode;

      var urlEndpoint = '/leads';
    } else {

      objToSend.mailingStreet = mailingStreet;
      objToSend.mailingCity = mailingCity;
      objToSend.mailingCountry = mailingCountry;
      objToSend.mailingPostalCode = mailingPostalCode;
    }
    var method = 'POST';
    if (contactLeadId) {
      // It is an update request

      // Now, if select#type is not hidden and it value is lead, that means that a contact was edited and converted to a lead, so, we need to send a POST request to /leads instead of PUT to /contacts/:contactLeadId
      if (type == 'lead' && $(baseJQSelector + ' select#type').is(':enabled')) {
        urlEndpoint = '/leads';
        method = 'POST';
      } else {
        method = 'PUT';
        urlEndpoint = urlEndpoint + '/' + contactLeadId;
      }
    }
    self._request(method, urlEndpoint, objToSend, function (err, resp) {
      if (err) {
        return callback(err, false);
      }
      return callback(null);
    });
}

SalesforcePlugin.prototype.addEmail = function (messageView, callback) {
  var self = this;

  var emailObj = {
    messageId: messageView.getMessageID(),
    subject: messageView.getThreadView().getSubject(),
    sender: {},
    recipient: {},
    activityDate: Math.floor(new Date()/1000)
  };

  var sender = messageView.getSender();
  var recipients = messageView.getRecipients();

  async.parallel([
    function getSenderData(cb) {
      UserController.fetchProfile(self.libs, sender, function (err, code, profile, contact) {
        if (err) {
          return cb(err);
        }

        emailObj.sender.emailId = contact.emailAddress;
        emailObj.sender.name = {};
        var name = contact.name;
        if (!name) {
          if (profile.name && profile.name.length > 0) {
            emailObj.sender.name.firstName = profile.name[0].firstName;
            emailObj.sender.name.lastName = profile.name[0].lastName;
          }
        } else {
          if (name != 'me') {
            var nameParts = name.split(' ');
            emailObj.sender.name.lastName = nameParts[nameParts.length - 1];
            nameParts.splice(nameParts.length - 1);
            if (nameParts.length > 0) {
              emailObj.sender.name.firstName = nameParts.join(' ');
            }
          } else {
            if (profile.name && profile.name.length > 0) {
              emailObj.sender.name.firstName = profile.name[0].firstName || '';
              emailObj.sender.name.lastName = profile.name[0].lastName || '';
            }
          }
        }
        return cb(null);
      });
    },
    function getReceipientData(cb) {
      UserController.fetchProfile(self.libs, recipients[0], function (err, code, profile, contact) {
        if (err) {
          return cb(err);
        }

        emailObj.recipient.emailId = contact.emailAddress;
        emailObj.recipient.name = {};
        var name = contact.name;
        if (!name) {
          if (profile.name && profile.name.length > 0) {
            emailObj.recipient.name.firstName = profile.name[0].firstName;
            emailObj.recipient.name.lastName = profile.name[0].lastName;
          }
        } else {
          if (name != 'me') {
            var nameParts = name.split(' ');
            emailObj.recipient.name.lastName = nameParts[nameParts.length - 1];
            nameParts.splice(nameParts.length - 1);
            if (nameParts.length > 0) {
              emailObj.recipient.name.firstName = nameParts.join(' ');
            }
          } else {
            if (profile.name && profile.name.length > 0) {
              emailObj.recipient.name.firstName = profile.name[0].firstName || '';
              emailObj.recipient.name.lastName = profile.name[0].lastName || '';
            }
          }
        }
        return cb(null);
      });
    }
  ], function (err) {
    if (err) {
      return callback(err, false);
    }
    self._request('POST', '/email', emailObj, function (err, resp) {
      if (err) {
        return callback(err, false);
      }
      return callback(null, null);
    })
  });
};

SalesforcePlugin.prototype.createOpportunity = function (parentSelector, evt, callback, opportunityId) {
  var self = this;

  var method = 'POST';
  var urlEndpoint = '/opportunities';

  var opportunityObj = {
    name: $(parentSelector + ' #opportunity-name').val(),
    closeDate: $(parentSelector + ' #opportunity-close-date #opportunity-close-date-items').datepicker('getFormattedDate'),
    stage: $(parentSelector + ' #opportunity-stages #opportunity-stages-items').val(),
    amount: $(parentSelector + ' #opportunity-amount').val(),
    probability: $(parentSelector + ' #opportunity-probability').val(),
    description: $(parentSelector + ' #opportunity-description').val(),
    nextStep: $(parentSelector + ' #opportunity-next-step').val(),
    account: $(parentSelector + ' #opportunity-account #opportunity-account-items').val()
  };
  opportunityObj.isPrivate = $(parentSelector + ' #opportunity-is-private:checked').length ? true : false;


  for (var i = 0; i < self.members.length; i++) {
    if (self.members[i].Email == self.addonEmail) {
      opportunityObj.ownerId = self.members[i].Id;
      break;
    }
  }
  if (!opportunityObj.name) {
    return callback('Please enter the opportunity name', true);
  }
  if (!opportunityObj.closeDate) {
    return callback('Please enter the opportunity close date', true);
  }
  if (!opportunityObj.stage) {
    return callback('Please enter the opportunity stage', true);
  }
  if (!opportunityObj.account) {
    return callback('Please enter the opportunity account', true);
  }
  if (!opportunityObj.ownerId) {
    return callback('Please specify the opportunity owner', true);
  }

  if (opportunityId) {
    method = 'PUT';
    urlEndpoint = urlEndpoint + '/' + opportunityId;
  }

  self._request(method, urlEndpoint, opportunityObj, function (err, resp) {
    if (err) {
      return callback(err, false);
    }
    opportunityObj.id = resp.data.id;
    return callback(null, null, opportunityObj);
  });
}

SalesforcePlugin.prototype._getOpportunities = function (account, callback) {
  var self = this;

  self._request('GET', '/opportunities/' + encodeURIComponent(account).toLowerCase(), null, function (err, res) {
    if (err) {
      return callback(null, []);
    }
    return callback(null, res.data);
  }, 'type=account');
}

SalesforcePlugin.prototype.logCall = function (parentSelector, evt, callback) {
  var self = this;
  var method = 'POST';
  var urlEndpoint = '/calls';

  var callObj = {
    subject: $(parentSelector + ' #call-subject #call-subject-items').val(),
    activityDate: $(parentSelector + ' #call-date #call-date-items').datepicker('getFormattedDate'),
    comments: $(parentSelector + ' #call-comments').val(),
    person: {
      emailId: $(parentSelector + ' #call-for #call-for-items').val(),
      name: {}
    }
  };

  var name = $(parentSelector + ' #call-for #call-for-items').find(':selected').attr('data-name').split(' ');
  callObj.person.name.lastName = name[name.length-1];
  name.splice(name.length - 1);
  callObj.person.name.firstName = name.join(' ')

  // get the owner id
  for (var i = 0; i < self.members.length; i++) {
    if (self.members[i].Email == self.addonEmail) {
      callObj.ownerId = self.members[i].Id;
      break;
    }
  }

  if (!callObj.subject) {
    return callback('Please select a call subject', true);
  }
  if (!callObj.activityDate) {
    return callback('Please add the call date', true);
  }
  if (!callObj.person.name || !callObj.person.name.lastName) {
    return callback('Please add the name of the contact', true);
  }
  if (!callObj.ownerId) {
    return callback('Please specify the owner of the call', true);
  }


  self._request(method, urlEndpoint, callObj, function (err, resp) {
    if (err) {
      return callback(err, false);
    }
    return callback(null, null, callObj);
  });
};

//# sourceMappingURL=bootstrap.js.map