
HButton=HControl.extend({componentName:"button",constructor:function(_1,_7,_2){if(this.isinherited){this.base(_1,_7,_2);}
else{this.isinherited=true;this.base(_1,_7,_2);this.isinherited=false;}
this.type='[HButton]';this.preserveTheme=true;if(!this.isinherited){this.draw();}
this._1U=[this.rect.width,this.rect.height];},setLabelHeightDiff:function(_5G){this._42=_5G;return'';},setLabelWidthDiff:function(_5I){this._43=_5I;return'';},onIdle:function(){if(this.drawn){var _h=this.rect.width;var _p=this.rect.height;if((_h!=this._1U[0])||(_p!=this._1U[1])){this._1U[0]=_h;this._1U[1]=_p;if(this.markupElemIds.label){var _3V=parseInt(_p+this._42,10);prop_set(this.markupElemIds.label,'line-height',_3V+'px');if(is.ie6){var _6q=parseInt(_h+this._43,10);prop_set(this.markupElemIds.label,'height',_3V+'px');prop_set(this.markupElemIds.label,'width',_6q+'px');}}}}},draw:function(){if(!this.drawn){this.drawRect();this._42=0;this._43=0;this.drawMarkup();}
this.refresh();},refresh:function(){if(this.drawn){this.base();if(this.markupElemIds.label){elem_set(this.markupElemIds.label,this.label);}}}});HClickButton=HButton.extend({constructor:function(_1,_7,_2){if(this.isinherited){this.base(_1,_7,_2);}
else{this.isinherited=true;this.base(_1,_7,_2);this.isinherited=false;}
this.type='[HClickButton]';this.setMouseDown(true);this.setMouseUp(true);this._0Z=false;this._1p=false;if(!this.isinherited){this.draw();}},focus:function(){if(!this._0Z&&!this._1p){this._1p=true;this._0Z=false;}
this.base();},blur:function(){if(!this._0Z){this._1p=false;}
this.base();},mouseDown:function(x,y,_P){if(this._1p){this._0Z=true;}
this.base(x,y,_P);},mouseUp:function(x,y,_P){if(this._1p&&this._0Z){this._0Z=false;this.click(x,y,_P);}
this.base(x,y,_P);},click:function(x,y,_P){this.setValue(this.value+1);if(this.action){this.action();}}});HToggleButton=HClickButton.extend({constructor:function(_1,_7,_2){if(this.isinherited){this.base(_1,_7,_2);}
else{this.isinherited=true;this.base(_1,_7,_2);this.isinherited=false;}
this.type='[HToggleButton]';if(!this.isinherited){this.draw();}},click:function(x,y,_P){this.setValue(!this.value);},setValue:function(_5){if(null===_5||undefined===_5){_5=false;}
this.base(_5);},_6h:function(){if(this.markupElemIds.control){var _9=elem_get(this.markupElemIds.control);this.toggleCSSClass(_9,HToggleButton.cssOn,this.value);this.toggleCSSClass(_9,HToggleButton.cssOff,!this.value);}},refresh:function(){if(this.drawn){this.base();if(this.markupElemIds.label){elem_set(this.markupElemIds.label,this.label);}
if(this.markupElemIds.control){this._6h();}}}},{cssOn:"on",cssOff:"off"});HStringView=HControl.extend({componentName:"stringview",constructor:function(_1,_7,_2){if(this.isinherited){this.base(_1,_7,_2);}
else{this.isinherited=true;this.base(_1,_7,_2);this.isinherited=false;}
this.type='[HStringView]';this.preserveTheme=true;if(!this.isinherited){this.draw();}},draw:function(){if(!this.drawn){this.drawRect();this.drawMarkup();this.drawn=true;}
this.refresh();},refresh:function(){if(this.drawn){this.base();if(!this._0O){this._0O=this.bindDomElement("stringview"+this.elemId);}
if(this._0O){elem_set(this._0O,this.value);}}},stringElementId:function(){return this._0O;},optimizeWidth:function(){if(this._0O){var _6d=elem_get(this._0O).cloneNode(true);var _2i=elem_add(_6d);prop_set(_2i,"visibility","hidden",true);elem_append(0,_2i);var _h=this.stringWidth(this.value,null,_2i);if(!isNaN(_h)){var _4X=prop_get_extra_width(this._0O);this.resizeTo(_h+_4X,this.rect.height);}
elem_del(_2i);}}});HTextControl=HControl.extend({componentName:"textcontrol",constructor:function(_1,_7,_2){this._3d="textcontrol";if(this.isinherited){this.base(_1,_7,_2);}
else{this.isinherited=true;this.base(_1,_7,_2);this.isinherited=false;}
this.type='[HTextControl]';this.preserveTheme=true;if(!this.isinherited){this.draw();}},die:function(){if(this.drawn){var _Z=this._3d+this.elemId;Event.stopObserving(_Z,'mousedown',this._2f);Event.stopObserving(_Z,'mousemove',this._2f);Event.stopObserving(_Z,'focus',this._3n);Event.stopObserving(_Z,'blur',this._3D);}
this.base();},setEnabled:function(_5){this.base(_5);if(this._06){elem_get(this._06).disabled=(!this.enabled);}},draw:function(){if(!this.drawn){this.drawRect();this.drawMarkup();this._06=this.bindDomElement(this._3d+this.elemId);if(this._06){elem_get(this._06).setAttribute("autocomplete","off");this.setEnabled(this.enabled);}
this._63();this.drawn=true;}
this.refresh();},_63:function(){var _Z=this._3d+this.elemId;this._2f=function(_5h){HControl.stopPropagation(_5h);};Event.observe(_Z,'mousedown',this._2f,false);Event.observe(_Z,'mousemove',this._2f,false);var _r=this;this._3n=function(event){HEventManager.changeActiveControl(_r);};Event.observe(_Z,'focus',this._3n,false);this._3D=function(event){_r._6j();HEventManager.changeActiveControl(null);};Event.observe(_Z,'blur',this._3D,false);},refresh:function(){this.base();if(this._06){if(elem_get(this._06).value!=this.value){elem_get(this._06).value=this.value;}}},onIdle:function(){if(this.active){this._6j();}},_6j:function(){if(this.drawn){if(elem_get(this._06).value!=this.value){this.setValue(elem_get(this._06).value);}}},lostActiveStatus:function(_K){if(this._06){elem_get(this._06).blur();}}});HTextArea=HTextControl.extend({componentName:"textarea",constructor:function(_1,_7,_2){this.base(_1,_7,_2);}});HSlider=HControl.extend({packageName:"sliders",componentName:"slider",constructor:function(_1,_7,_2){if(!_2){_2={};}
_2.events={mouseDown:false,mouseUp:false,draggable:true,keyDown:true,keyUp:true,mouseWheel:true};var _z=Base.extend({minValue:0,maxValue:1});_z=_z.extend(_2);_2=new _z();if(this.isinherited){this.base(_1,_7,_2);}
else{this.isinherited=true;this.base(_1,_7,_2);this.isinherited=false;}
this.type='[HSlider]';this.refreshOnValueChange=false;this._41='sliderknob';this._0b=false;if(!this.isinherited){this.draw();}},setValue:function(_4){if(_4<this.minValue){_4=this.minValue;}
if(_4>this.maxValue){_4=this.maxValue;}
this.base(_4);if(this._2K){this.drawKnobPos();}},draw:function(){if(!this.drawn){this.drawRect();this.drawMarkup();this._5w();}
this.refresh();},startDrag:function(_8,_a){var _0=elem_get(this.elemId);var _4d=helmi.Element.getPageLocation(_0,true);this._5R=_4d[0];this._5S=_4d[1];this.doDrag(_8,_a);},endDrag:function(_8,_a){this.doDrag(_8,_a);},doDrag:function(_8,_a){_8-=this._5R;_a-=this._5S;_6J=this._0b?_a:_8;_4=this._5V(_6J);this.setValue(_4);},keyDown:function(_E){if((_E==Event.KEY_LEFT&&!this._0b)||(_E==Event.KEY_UP&&this._0b)){this._1w=true;this._27(-0.05);}
else if((_E==Event.KEY_RIGHT&&!this._0b)||(_E==Event.KEY_DOWN&&this._0b)){this._1w=true;this._27(0.05);}
else if(_E==Event.KEY_HOME){this.setValue(this.minValue);}
else if(_E==Event.KEY_END){this.setValue(this.maxValue);}
else if(_E==Event.KEY_PAGEUP){this._1w=true;this._27(-0.25);}
else if(_E==Event.KEY_PAGEDOWN){this._1w=true;this._27(0.25);}},keyUp:function(_E){this._1w=false;},mouseWheel:function(_T){var _1e;if(_T>0){_1e=-0.05;}
else{_1e=0.05;}
_4=(this.maxValue-this.minValue)*_1e;this.setValue(this.value+_4);},_27:function(_1e,_1a){if(!_1a){_1a=300;}
else if(_1a==300){_1a=50;}
if(this._1w&&this.active){_4=(this.maxValue-this.minValue)*_1e;this.setValue(this.value+_4);var _r=this;if(this._2L){window.clearTimeout(this._2L);this._2L=null;}
this._2L=window.setTimeout(function(){_r._27(_1e,_1a);},_1a);}},_5w:function(){this._2K=this.bindDomElement(this._41+this.elemId);this.drawKnobPos();},_3h:function(){var _9=elem_get(this._2K);if(this._0b){_4m=this.rect.height-parseInt(_9.offsetHeight,10);}else{_4m=this.rect.width-parseInt(_9.offsetWidth,10);}
_2J=_4m*((this.value-this.minValue)/(this.maxValue-this.minValue));_31=parseInt(_2J,10)+'px';return _31;},_5V:function(_47){_0w=this._0b?(_47):(_47);if(_0w<0){_0w=0;}
if(this._0b){if(_0w>this.rect.height){_0w=this.rect.height;}
return this.minValue+((_0w/this.rect.height)*(this.maxValue-this.minValue));}else{if(_0w>this.rect.width){_0w=this.rect.width;}
return this.minValue+((_0w/this.rect.width)*(this.maxValue-this.minValue));}},drawKnobPos:function(){_6R=this._0b?'top':'left';_2Z=this._3h();prop_set(this._2K,_6R,_2Z);}});HVSlider=HSlider.extend({packageName:"sliders",componentName:"vslider",constructor:function(_1,_7,_2){if(this.isinherited){this.base(_1,_7,_2);}
else{this.isinherited=true;this.base(_1,_7,_2);this.isinherited=false;}
this.type='[HVSlider]';this._41='vsliderknob';this._0b=true;if(!this.isinherited){this.draw();}}});HProgressBar=HControl.extend({componentName:"progressbar",constructor:function(_1,_7,_2){if(this.isinherited){this.base(_1,_7,_2);}
else{this.isinherited=true;this.base(_1,_7,_2);this.isinherited=false;}
if(!_2){_2={};}
var _z=Base.extend({value:0,minValue:0,maxValue:100});_z=_z.extend(_2);_2=new _z();this.value=_2.value;this.minValue=_2.minValue;this.maxValue=_2.maxValue;this.visibleWidth=this.rect.width-2;this.type='[HProgressBar]';this._2X='progressmark';if(!this.isinherited){this.draw();}
this.progressFrameHeight=20;this.progressFrames=10;this.currProgressFrame=0;},setProgressFrameHeight:function(_W){this.progressFrameHeight=_W;},setProgressFrameNum:function(_5K){this.progressFrames=_5K;},setValue:function(_4){this.base(_4);this.drawProgress();},onIdle:function(){if(this.progressbarElemId){this.currProgressFrame++;if(this.currProgressFrame>=this.progressFrames){this.currProgressFrame=0;}
var _W=this.currProgressFrame*this.progressFrameHeight;prop_set(this.progressbarElemId,'background-position','0px -'+_W+'px');}},draw:function(){if(!this.drawn){this.drawRect();this.drawMarkup();this._2G();}},_2G:function(){this.progressbarElemId=this.bindDomElement(this._2X+this.elemId);this.drawProgress();},_3h:function(){var _2J=this.visibleWidth*((this.value-this.minValue)/(this.maxValue-this.minValue));var _31=parseInt(Math.round(_2J),10)+'px';return _31;},drawProgress:function(){if(this.progressbarElemId){var _2Z=this._3h();prop_set(this.progressbarElemId,'width',_2Z);}}});HProgressIndicator=HControl.extend({packageName:"progress",componentName:"progressindicator",constructor:function(_1,_7,_2){if(this.isinherited){this.base(_1,_7,_2);}
else{this.isinherited=true;this.base(_1,_7,_2);this.isinherited=false;}
if(!_2){_2={};}
var _z=Base.extend({value:0,interval:20});_z=_z.extend(_2);_2=new _z();this.type='[HProgressIndicator]';this._2X='progressmark';this.interval=_2.interval;this.value=_2.value;this._10=null;if(!this.isinherited){this.draw();}},setValue:function(_4){if(this._2W){if(_4==true&&!this._10){var temp=this;this._10=setInterval(function(){temp.drawProgress();},temp.interval);}
else{clearInterval(this._10);this._10=null;}}},die:function(){this.base();if(this._10){clearInterval(this._10);}},draw:function(){if(!this.drawn){this.drawRect();this.drawMarkup();this._2G();}},_2G:function(){this._2W=this.bindDomElement(this._2X+this.elemId);this.drawProgress();},drawProgress:function(){this.progressPosition++;if(this.progressPosition>this.positionLimit-1){this.progressPosition=0;}
if(this._2W){prop_set(this._2W,'background-position','0px -'+
(this.progressPosition*this.rect.height)+'px');}}});HImageView=HControl.extend({componentName:"imageview",constructor:function(_1,_7,_2){if(this.isinherited){this.base(_1,_7,_2);}
else{this.isinherited=true;this.base(_1,_7,_2);this.isinherited=false;}
if(!this.value){this.value=this.getThemeGfxPath()+"blank.gif";}
this.type='[HImageView]';if(!this.isinherited){this.draw();}},draw:function(){if(!this.drawn){this.drawRect();this.drawMarkup();this.drawn=true;}
this.refresh();},refresh:function(){if(this.drawn){this.base();if(!this._0l){this._0l=this.bindDomElement(HImageView._4K+this.elemId);}
if(this._0l){elem_get(this._0l).src=this.value;}}},scaleToFit:function(){if(this._0l){prop_set(this._0l,'width',this.rect.width+'px');prop_set(this._0l,'height',this.rect.height+'px');}},scaleToOriginal:function(){if(this._0l){prop_set(this._0l,'width','auto');prop_set(this._0l,'height','auto');}}},{_4K:"imageview"});HSplitView=HControl.extend({componentName:"splitview",constructor:function(_1,_7,_2){_2=new(Base.extend({vertical:false}).extend(_2));if(this.isinherited){this.base(_1,_7,_2);}
else{this.isinherited=true;this.base(_1,_7,_2);this.isinherited=false;}
this.type='[HSplitView]';this.preserveTheme=true;this.vertical=this.options.vertical;this.dividerWidth=6;this.splitviews=[];this.dividers=[];this.setDraggable(true);if(!this.isinherited){this.draw();}},startDrag:function(_8,_a,_H){if(!_H){return;}
_8-=this.pageX();_a-=this.pageY();var _J=this.dividers.indexOfObject(_H);this._0x=new HPoint(_8,_a);this._29=new HPoint(_8,_a);this._A=this._0x.subtract(_H.rect.leftTop);this._07=this.splitviews[_J];this._L=this.splitviews[_J+1];this._H=_H;if(this.vertical==false){this._21=this._07.rect.top;this._22=this._L.rect.bottom-this.dividerWidth;}else{this._21=this._07.rect.left;this._22=this._L.rect.right-this.dividerWidth;}},doDrag:function(_8,_a,_H){if(!_H){return;}
_8-=this.pageX();_a-=this.pageY();if(this.vertical==false){var _k=_a-this._A.y;if(_k<this._21||_k>this._22){return;}
this._07.rect.setHeight(_k);this._07.rect.updateSecondaryValues();this._07.setStyle('height',this._07.rect.height+'px',true);this._H.rect.setTop(_k);this._H.rect.updateSecondaryValues();this._H.setStyle('top',this._H.rect.top+'px',true);this._L.rect.setTop(_k+this.dividerWidth);this._L.rect.updateSecondaryValues();this._L.setStyle('top',this._L.rect.top+'px',true);this._L.setStyle('height',this._L.rect.height+'px',true);}else{var _k=_8-this._A.x;if(_k<this._21||_k>this._22){return;}
this._07.rect.setRight(_k);this._07.rect.updateSecondaryValues();this._07.setStyle('width',this._07.rect.width+'px',true);this._H.rect.setLeft(_k);this._H.rect.updateSecondaryValues();this._H.setStyle('left',this._H.rect.left+'px',true);this._L.rect.setLeft(_k+this.dividerWidth);this._L.rect.updateSecondaryValues();this._L.setStyle('left',this._L.rect.left+'px',true);this._L.setStyle('width',this._L.rect.width+'px',true);}},endDrag:function(_8,_a,_H){this.doDrag(_8,_a);delete this._0x;delete this._29;delete this._A;delete this._07;delete this._L;delete this._H;delete this._21;delete this._22;},addSplitViewItem:function(_0v,_J){if(_J!==undefined){this.splitviews.splice(_J,0,_0v);}else{this.splitviews.push(_0v);}},removeSplitViewItem:function(_0v){if(typeof _0v=="object"){var _J=this.splitviews.indexOfObject(_0v);if(_J!=-1){this.splitviews.splice(_J,1);_0v.die();this.dividers.splice(_J,1);this.dividers[_J].die();}}},setVertical:function(_5){this.vertical=_5;this.options.vertical=_5;},adjustViews:function(){var _0j=this.splitviews.length;var _28;var _19;var _2d;var _1c;if(this.vertical==false){_28=this.rect.height-this.dividerWidth*(_0j-1);_19=0;for(var i=0;i<_0j;i++){_19+=this.splitviews[i].rect.height;}
_2d=_28/_19;_1c=0;for(var i=0;i<_0j;i++){var _Y=this.splitviews[i];var _17=_Y.rect.height*_2d;if(i==_0j-1){_17=Math.floor(_17);}else{_17=Math.ceil(_17);}
_Y.rect.offsetTo(0,_1c);_Y.rect.setSize(this.rect.width,_17);_Y.draw();_1c+=_17+this.dividerWidth;}}else{_28=this.rect.width-this.dividerWidth*(_0j-1);_19=0;for(var i=0;i<_0j;i++){_19+=this.splitviews[i].rect.width;}
_2d=_28/_19;_1c=0;for(var i=0;i<_0j;i++){var _Y=this.splitviews[i];var _18=_Y.rect.width*_2d;if(i==_0j-1){_18=Math.floor(_18);}else{_18=Math.ceil(_18);}
_Y.rect.offsetTo(_1c,0);_Y.rect.setSize(_18,this.rect.height);_Y.draw();_1c+=_18+this.dividerWidth;}}
this.draw();},draw:function(){if(!this.drawn){this.drawRect();this.drawMarkup();this.drawn=true;}
this.refresh();},refresh:function(){this.base();if(this.drawn){var _0j=this.splitviews.length;var _N;for(var i=0;i<(_0j-1);i++){_N=new HRect(this.splitviews[i].rect);if(!this.vertical){_N.offsetTo(_N.left,_N.bottom);_N.setHeight(this.dividerWidth);}else{_N.offsetTo(_N.right,_N.top);_N.setWidth(this.dividerWidth);}
if(!this.dividers[i]){this.dividers[i]=new HDivider(_N,this);}else{var _Y=this.dividers[i];_Y.rect.offsetTo(_N.left,_N.top);_Y.rect.setSize(_N.width,_N.height);_Y.draw();}}}}});HStepper=HButton.extend({componentName:"stepper",constructor:function(_1,_7,_2){if(!_2){_2={};}
_2.events={mouseDown:true,keyDown:true,mouseWheel:true};var _z=Base.extend({minValue:0,value:0,interval:500});_z=_z.extend(_2);_2=new _z();if(this.isinherited){this.base(_1,_7,_2);}
else{this.isinherited=true;this.base(_1,_7,_2);this.isinherited=false;}
this.interval=_2.interval;this.type='[HStepper]';this._6P="stepperlabel";this.border=((_1.bottom-_1.top)/2+_1.top);if(!this.isinherited){this.draw();}},stepUp:function(_4){_4--;_4=(_4<this.minValue)?this.maxValue:_4;this.setValue(_4);},stepDown:function(_4){_4++;_4=(_4>this.maxValue)?this.minValue:_4;this.setValue(_4);},mouseDown:function(_8,_a,_0H){this.setMouseUp(true);var temp=this;if(_a<this.border){this.stepUp(this.value);this.counter=setInterval(function(){temp.stepUp(temp.value);},this.interval);}else{this.stepDown(this.value);this.counter=setInterval(function(){temp.stepDown(temp.value);},this.interval);}},mouseUp:function(_8,_a,_0H){clearInterval(this.counter);},blur:function(){clearInterval(this.counter);},keyDown:function(_E){this.setKeyUp(true);var temp=this;if(_E==Event.KEY_UP){this.stepUp(this.value);this.counter=setInterval(function(){temp.stepUp(temp.value);},this.interval);}
else if(_E==Event.KEY_DOWN){this.stepDown(this.value);this.counter=setInterval(function(){temp.stepUp(temp.value);},this.interval);}},keyUp:function(_E){clearInterval(this.counter);},mouseWheel:function(_T){if(_T>0){this.stepUp(this.value);}
else{this.stepDown(this.value);}}});HRadiobutton=HToggleButton.extend({componentName:"radiobutton",constructor:function(_1,_7,_2){if(this.isinherited){this.base(_1,_7,_2);}
else{this.isinherited=true;this.base(_1,_7,_2);this.isinherited=false;}
this.type='[HRadiobutton]';if(!this.isinherited){this.draw();}},setValueMatrix:function(_4V){this.valueMatrix=_4V;this.valueMatrixIndex=this.valueMatrix.addValue(this.valueObj,this.value);},click:function(x,y,_P){this.base(x,y,_P);if(undefined!==this.valueMatrix&&this.valueMatrix instanceof HValueMatrix){this.valueMatrix.setValue(this.valueMatrixIndex);}}});HRadioButton=HRadiobutton;HPasswordControl=HTextControl.extend({componentName:"passwordcontrol",constructor:function(_1,_7,_2){this.base(_1,_7,_2);}});HDivider=HControl.extend({componentName:"divider",constructor:function(_1,_7,_2){if(this.isinherited){this.base(_1,_7,_2);}
else{this.isinherited=true;this.base(_1,_7,_2);this.isinherited=false;}
this.type='[HDivider]';this.preserveTheme=true;this.setDraggable(true);if(!this.isinherited){this.draw();}},startDrag:function(_8,_a){this.parent.startDrag(_8,_a,this);},doDrag:function(_8,_a){this.parent.doDrag(_8,_a,this);},endDrag:function(_8,_a){this.parent.endDrag(_8,_a,this);},draw:function(){if(!this.drawn){this.drawRect();this.drawMarkup();this.drawn=true;}
this.refresh();}});HCheckbox=HToggleButton.extend({componentName:"checkbox",constructor:function(_1,_7,_2){if(this.isinherited){this.base(_1,_7,_2);}
else{this.isinherited=true;this.base(_1,_7,_2);this.isinherited=false;}
this.type='[HCheckbox]';if(!this.isinherited){this.draw();}}});