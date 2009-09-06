/**
  * Riassence Core -- http://rsence.org/
  *
  * Copyright (C) 2009 Juha-Jarmo Heinonen <jjh@riassence.com>
  *
  * This file is part of Riassence Core.
  *
  * Riassence Core is free software: you can redistribute it and/or modify
  * it under the terms of the GNU General Public License as published by
  * the Free Software Foundation, either version 3 of the License, or
  * (at your option) any later version.
  *
  * Riassence Core is distributed in the hope that it will be useful,
  * but WITHOUT ANY WARRANTY; without even the implied warranty of
  * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  * GNU General Public License for more details.
  *
  * You should have received a copy of the GNU General Public License
  * along with this program.  If not, see <http://www.gnu.org/licenses/>.
  *
  **/

COMM.Session = HClass.extend({
  ses_key: '',
  req_num: 0,
  newKey: function(_sesKey){
    var _this = this,
        _shaKey = _this.sha.hexSHA1(_sesKey+_this.sha_key);
    _this.req_num++;
    _this.ses_key = _this.req_num+':.o.:'+_shaKey;
    _this.sha_key = _shaKey;
  },
  constructor: function(){
    var _this = this;
    _this.sha = SHAClass.nu(8);
    _this.sha_key = _this.sha.hexSHA1(((new Date().getTime())*Math.random()*1000).toString());
    _this.ses_key = '0:.o.:'+_this.sha_key;
  }
}).nu();

COMM.Transporter = HApplication.extend({
  constructor: function(){
    var _this = this;
    this.serverLostMessage = 'Server Connection Lost. Retrying.';
    _this.label = 'Transporter';
    _this.url = '/hello';
    _this.busy = false;
    _this.stop = true;
    _this._serverInterruptElemId = false;
    _this._clientEvalError = false;
    _this._busyFlushTimeout = false;
    _this.base(1);
  },
  onIdle: function(){
    if(!this.busy){
      this.sync();
    }
  },
  poll: function(_pri){
    HSystem.reniceApp(this.appId,_pri);
  },
  getClientEvalError: function(){
    var _this = COMM.Transporter;
    if(_this._clientEvalError){
      return '&err_msg='+_this._clientEvalError;
    }
    return '';
  },
  success: function(resp){
    var _this = resp._this,
        _responseArray = eval(resp.X.responseText),
        i = 1,
        _responseArrayLen = _responseArray.length,
        _sesKey = _responseArray[0];
    if(_sesKey==''){
      console.log('Invalid session, error message should follow...');
    }
    COMM.Session.newKey(_sesKey);
    for(;i<_responseArrayLen;i++){
      try {
        eval(_responseArray[i]);
      }
      catch(e) {
        _this._clientEvalError = e+" - "+e.description;
      }
    }
    if(_this._serverInterruptElemId){
      ELEM.del(_this._serverInterruptElemId);
      _this._serverInterruptElemId = false;
    };
    _this._busyFlushTimeout = setTimeout('COMM.Transporter.flushBusy();',50);
  },
  flushBusy: function(){
    var _this = this;
    _this.busy = false;
    if(HVM.tosync.length!==0){
      _this.sync();
    }
  },
  failMessage: function(_title,_message){
    this.stop = true;
    jsLoader.load('controls');
    jsLoader.load('servermessage');
    ReloadApp.nu(_title,_message);
  },
  failure: function(_resp){
    var _this = _resp._this;
    // server didn't respond, likely network issue.. retry.
    if(_resp.X.status===0){
      console.log(_this.serverLostMessage);
      if(HSystem.appPriorities[_this.appId]<10){
        HSystem.reniceApp(_this.appId,10);
      }
      if(!_this._serverInterruptElemId){
        _this._serverInterruptElemId = ELEM.make(0);
        ELEM.setCSS(_this._serverInterruptElemId,'position:absolute;z-index:1000;padding-left:8px;left:0px;top:0px;height:28px;width:100%;background-color:#600;color:#fff;font-family:Arial,sans-serif;font-size:20px;');
        ELEM.setStyle(_this._serverInterruptElemId,'opacity',0.85);
        ELEM.setHTML(_this._serverInterruptElemId,_this.serverLostMessage);
      }
      else {
        ELEM.get(_this._serverInterruptElemId).innerHTML += '.';
      }
      _this.busy = false;
    }
    else {
      _this.failMessage('Transporter Error','Transporter was unable to complete the synchronization request.');
    }
  },
  sync: function(){
    if(this.stop){
      return;
    }
    if(this.busy){
      return;
    }
    this.busy = true;
    var _this = this,
        _valuesXML = HVM.toXML(),
        _sesKey = 'ses_key='+COMM.Session.ses_key,
        _errorMessage = _this.getClientEvalError();
    COMM.request(
      _this.url, {
        _this: _this,
        onSuccess: _this.success,
        onFailure: _this.failure,
        method: 'POST',
        async: true,
        body: [_sesKey,_errorMessage,_valuesXML].join('')
      }
    );
  }
}).nu();
LOAD('COMM.Transporter.stop=false;COMM.Transporter.sync();');
