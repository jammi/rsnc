
HButton=HControl.extend({componentName:'button',constructor:function(_1,_f,_2){if(this.isinherited){this.base(_1,_f,_2);}
else{this.isinherited=true;this.base(_1,_f,_2);this.isinherited=false;}
if(!this.isinherited){this.draw();}},refresh:function(){if(this.drawn){this.base();if(this.markupElemIds.label){ELEM.setHTML(this.markupElemIds.label,this.label);}}},draw:function(){var _04=this.drawn;this.base();if(!_04){this.drawMarkup();}
this.refresh();}});HCheckbox=HButton.extend({componentName:'checkbox',constructor:function(_1,_f,_2){this.base(_1,_f,_2);this.setClickable(true);},click:function(){this.setValue(!this.value);},setValue:function(_6A){this.base(_6A);if(this.drawn&&this.markupElemIds.control){if(_6A){this.toggleCSSClass(this.markupElemIds.control,'checked',true);this.toggleCSSClass(this.markupElemIds.control,'unchecked',false);}
else{this.toggleCSSClass(this.markupElemIds.control,'checked',false);this.toggleCSSClass(this.markupElemIds.control,'unchecked',true);}}}});HCheckBox=HCheckbox;HRadioButton=(HCheckbox.extend(HValueMatrixComponentExtension)).extend({componentName:'radiobutton'});HRadiobutton=HRadioButton;HStringView=HControl.extend({componentName:"stringview",componentBehaviour:['view','control','text'],draw:function(){var _04=this.drawn;this.base();if(!_04){this.drawMarkup();}},refresh:function(){if(this.drawn){this.base();if(this.markupElemIds.value){ELEM.setHTML(this.markupElemIds.value,this.value);ELEM.setAttr(this.markupElemIds.value,'title',this.label);}}}});HTextControl=HControl.extend({componentName:"textcontrol",constructor:function(_1,_w,_2){if(this.isinherited){this.base(_1,_w,_2);}
else{this.isinherited=true;this.base(_1,_w,_2);this.isinherited=false;}
this.type='[HTextControl]';this.preserveTheme=true;if(!this.isinherited){this.draw();}
this.setTextEnter(true);},draw:function(){if(!this.drawn){this.base();this.drawMarkup();}else{this.refresh();}},setEnabled:function(_8){this.base(_8);if(this['markupElemIds']===undefined){return;}
if(this.markupElemIds.value){ELEM.setAttr(this.markupElemIds.value,'disabled',!this.enabled);}},refreshValue:function(){if(this.markupElemIds){if(this.markupElemIds.value){ELEM.get(this.markupElemIds.value).value=this.value;}}},textEnter:function(){if(this['markupElemIds']===undefined){return;}
var _6A=ELEM.get(this.markupElemIds.value).value;if(_6A!=this.value){this.setValue(_6A);}}});HTextArea=HTextControl.extend({componentName:"textarea"});HSlider=HControl.extend({packageName:"sliders",componentName:"slider",constructor:function(_1,_w,_2){if(!_2){_2={};}
_2.events={mouseDown:false,mouseUp:false,draggable:true,keyDown:true,keyUp:true,mouseWheel:true};var _r=Base.extend({minValue:0,maxValue:1});_r=_r.extend(_2);_2=new _r();if(this.isinherited){this.base(_1,_w,_2);}
else{this.isinherited=true;this.base(_1,_w,_2);this.isinherited=false;}
this.type='[HSlider]';this.refreshOnValueChange=false;this._3V='sliderknob';this._0d=false;if(!this.isinherited){this.draw();}},setValue:function(_6A){if(_6A<this.minValue){_6A=this.minValue;}
if(_6A>this.maxValue){_6A=this.maxValue;}
this.base(_6A);if(this._2S){this.drawKnobPos();}},draw:function(){if(!this.drawn){this.drawRect();this.drawMarkup();this._5C();}
this.refresh();},startDrag:function(_7,_b){var _5=ELEM.get(this.elemId);var _4i=helmi.Element.getPageLocation(_5,true);this._5M=_4i[0];this._5N=_4i[1];this.doDrag(_7,_b);},endDrag:function(_7,_b){this.doDrag(_7,_b);},doDrag:function(_7,_b){_7-=this._5M;_b-=this._5N;_7b=this._0d?_b:_7;_6A=this._5S(_7b);this.setValue(_6A);},keyDown:function(_z){if((_z==Event.KEY_LEFT&&!this._0d)||(_z==Event.KEY_UP&&this._0d)){this._1A=true;this._2b(-0.05);}
else if((_z==Event.KEY_RIGHT&&!this._0d)||(_z==Event.KEY_DOWN&&this._0d)){this._1A=true;this._2b(0.05);}
else if(_z==Event.KEY_HOME){this.setValue(this.minValue);}
else if(_z==Event.KEY_END){this.setValue(this.maxValue);}
else if(_z==Event.KEY_PAGEUP){this._1A=true;this._2b(-0.25);}
else if(_z==Event.KEY_PAGEDOWN){this._1A=true;this._2b(0.25);}},keyUp:function(_z){this._1A=false;},mouseWheel:function(_M){var _1b;if(_M>0){_1b=-0.05;}
else{_1b=0.05;}
_6A=(this.maxValue-this.minValue)*_1b;this.setValue(this.value+_6A);},_2b:function(_1b,_16){if(!_16){_16=300;}
else if(_16==300){_16=50;}
if(this._1A&&this.active){_6A=(this.maxValue-this.minValue)*_1b;this.setValue(this.value+_6A);var _k=this;if(this._2T){window.clearTimeout(this._2T);this._2T=null;}
this._2T=window.setTimeout(function(){_k._2b(_1b,_16);},_16);}},_5C:function(){this._2S=this.bindDomElement(this._3V+this.elemId);this.drawKnobPos();},_3g:function(){var _6=ELEM.get(this._2S);if(this._0d){_4m=this.rect.height-parseInt(_6.offsetHeight,10);}else{_4m=this.rect.width-parseInt(_6.offsetWidth,10);}
_2R=_4m*((this.value-this.minValue)/(this.maxValue-this.minValue));_39=parseInt(_2R,10)+'px';return _39;},_5S:function(_48){_0x=this._0d?(_48):(_48);if(_0x<0){_0x=0;}
if(this._0d){if(_0x>this.rect.height){_0x=this.rect.height;}
return this.minValue+((_0x/this.rect.height)*(this.maxValue-this.minValue));}else{if(_0x>this.rect.width){_0x=this.rect.width;}
return this.minValue+((_0x/this.rect.width)*(this.maxValue-this.minValue));}},drawKnobPos:function(){_7y=this._0d?'top':'left';_37=this._3g();ELEM.setStyle(this._2S,_7y,_37);}});HVSlider=HSlider.extend({packageName:"sliders",componentName:"vslider",constructor:function(_1,_w,_2){if(this.isinherited){this.base(_1,_w,_2);}
else{this.isinherited=true;this.base(_1,_w,_2);this.isinherited=false;}
this.type='[HVSlider]';this._3V='vsliderknob';this._0d=true;if(!this.isinherited){this.draw();}}});HProgressBar=HControl.extend({componentName:"progressbar",constructor:function(_1,_w,_2){if(this.isinherited){this.base(_1,_w,_2);}
else{this.isinherited=true;this.base(_1,_w,_2);this.isinherited=false;}
if(!_2){_2={};}
var _r=Base.extend({value:0,minValue:0,maxValue:100});_r=_r.extend(_2);_2=new _r();this.value=_2.value;this.minValue=_2.minValue;this.maxValue=_2.maxValue;this.visibleWidth=this.rect.width-2;this.type='[HProgressBar]';this._36='progressmark';if(!this.isinherited){this.draw();}
this.progressFrameHeight=20;this.progressFrames=10;this.currProgressFrame=0;},setProgressFrameHeight:function(_U){this.progressFrameHeight=_U;},setProgressFrameNum:function(_2f){this.progressFrames=_2f;},setValue:function(_6A){this.base(_6A);this.drawProgress();},onIdle:function(){if(this.progressbarElemId){this.currProgressFrame++;if(this.currProgressFrame>=this.progressFrames){this.currProgressFrame=0;}
var _U=this.currProgressFrame*this.progressFrameHeight;ELEM.setStyle(this.progressbarElemId,'background-position','0px -'+_U+'px');}},draw:function(){if(!this.drawn){this.drawRect();this.drawMarkup();this._2Q();}},_2Q:function(){this.progressbarElemId=this.bindDomElement(this._36+this.elemId);this.drawProgress();},_3g:function(){var _2R=this.visibleWidth*((this.value-this.minValue)/(this.maxValue-this.minValue));var _39=parseInt(Math.round(_2R),10)+'px';return _39;},drawProgress:function(){if(this.progressbarElemId){var _37=this._3g();ELEM.setStyle(this.progressbarElemId,'width',_37);}}});HProgressIndicator=HControl.extend({packageName:"progress",componentName:"progressindicator",constructor:function(_1,_w,_2){if(this.isinherited){this.base(_1,_w,_2);}
else{this.isinherited=true;this.base(_1,_w,_2);this.isinherited=false;}
if(!_2){_2={};}
var _r=Base.extend({value:0,interval:20});_r=_r.extend(_2);_2=new _r();this.type='[HProgressIndicator]';this._36='progressmark';this.interval=_2.interval;this.value=_2.value;this._0T=null;if(!this.isinherited){this.draw();}},setValue:function(_6A){if(this._35){if(_6A==true&&!this._0T){var temp=this;this._0T=setInterval(function(){temp.drawProgress();},temp.interval);}
else{clearInterval(this._0T);this._0T=null;}}},die:function(){this.base();if(this._0T){clearInterval(this._0T);}},draw:function(){if(!this.drawn){this.drawRect();this.drawMarkup();this._2Q();}},_2Q:function(){this._35=this.bindDomElement(this._36+this.elemId);this.drawProgress();},drawProgress:function(){this.progressPosition++;if(this.progressPosition>this.positionLimit-1){this.progressPosition=0;}
if(this._35){ELEM.setStyle(this._35,'background-position','0px -'+
(this.progressPosition*this.rect.height)+'px');}}});HImageView=HControl.extend({constructor:function(_1,_w,_2){if(!_2){_2={};}
var _r=HClass.extend({scaleToFit:true});_2=new(_r.extend(_2))();if(this.isinherited){this.base(_1,_w,_2);}
else{this.isinherited=true;this.base(_1,_w,_2);this.isinherited=false;}
if(!this.value){this.value=this.getThemeGfxPath()+"/blank.gif";}
this.type='[HImageView]';if(!this.isinherited){this.draw();}},_43:function(_2g){this.elemId=ELEM.make(_2g,'img');ELEM.setAttr(this.elemId,'src',this.value);ELEM.setAttr(this.elemId,'alt',this.label);},_44:function(_2g){this.elemId=ELEM.make(_2g,'div');ELEM.setStyle(this.elemId,'background-image','url('+this.value+')');ELEM.setStyle(this.elemId,'background-position','0px 0px');ELEM.setStyle(this.elemId,'background-repeat','no-repeat');},_42:function(_2g){if(this.options.scaleToFit){this._43(_2g);}
else{this._44(_2g);}},setValue:function(_6A){this.base(_6A);ELEM.setAttr(this.elemId,'src',_6A);},setLabel:function(_T){this.base(_T);ELEM.setAttr(this.elemId,'alt',_T);},scaleToFit:function(){if(!this.options.scaleToFit){ELEM.del(this.elemId);this._43(this._2M());this.options.scaleToFit=true;}},scaleToOriginal:function(){if(this.options.scaleToFit){ELEM.del(this.elemId);this._44(this._2M());this.options.scaleToFit=false;}}});HSplitView=HControl.extend({componentName:"splitview",constructor:function(_1,_w,_2){_2=new(Base.extend({vertical:false}).extend(_2));if(this.isinherited){this.base(_1,_w,_2);}
else{this.isinherited=true;this.base(_1,_w,_2);this.isinherited=false;}
this.type='[HSplitView]';this.preserveTheme=true;this.vertical=this.options.vertical;this.dividerWidth=6;this.splitviews=[];this.dividers=[];this.setDraggable(true);if(!this.isinherited){this.draw();}},startDrag:function(_7,_b,_C){if(!_C){return;}
_7-=this.pageX();_b-=this.pageY();var _p=this.dividers.indexOfObject(_C);this._4v=new HPoint(_7,_b);this._5U=new HPoint(_7,_b);this._1Y=this._4v.subtract(_C.rect.leftTop);this._06=this.splitviews[_p];this._J=this.splitviews[_p+1];this._C=_C;if(this.vertical==false){this._26=this._06.rect.top;this._27=this._J.rect.bottom-this.dividerWidth;}else{this._26=this._06.rect.left;this._27=this._J.rect.right-this.dividerWidth;}},doDrag:function(_7,_b,_C){if(!_C){return;}
_7-=this.pageX();_b-=this.pageY();if(this.vertical==false){var _08=_b-this._1Y.y;if(_08<this._26||_08>this._27){return;}
this._06.rect.setHeight(_08);this._06.rect.updateSecondaryValues();this._06.setStyle('height',this._06.rect.height+'px',true);this._C.rect.setTop(_08);this._C.rect.updateSecondaryValues();this._C.setStyle('top',this._C.rect.top+'px',true);this._J.rect.setTop(_08+this.dividerWidth);this._J.rect.updateSecondaryValues();this._J.setStyle('top',this._J.rect.top+'px',true);this._J.setStyle('height',this._J.rect.height+'px',true);}else{var _08=_7-this._1Y.x;if(_08<this._26||_08>this._27){return;}
this._06.rect.setRight(_08);this._06.rect.updateSecondaryValues();this._06.setStyle('width',this._06.rect.width+'px',true);this._C.rect.setLeft(_08);this._C.rect.updateSecondaryValues();this._C.setStyle('left',this._C.rect.left+'px',true);this._J.rect.setLeft(_08+this.dividerWidth);this._J.rect.updateSecondaryValues();this._J.setStyle('left',this._J.rect.left+'px',true);this._J.setStyle('width',this._J.rect.width+'px',true);}},endDrag:function(_7,_b,_C){this.doDrag(_7,_b);delete this._4v;delete this._5U;delete this._1Y;delete this._06;delete this._J;delete this._C;delete this._26;delete this._27;},addSplitViewItem:function(_0v,_p){if(_p!==undefined){this.splitviews.splice(_p,0,_0v);}else{this.splitviews.push(_0v);}},removeSplitViewItem:function(_0v){if(typeof _0v=="object"){var _p=this.splitviews.indexOfObject(_0v);if(_p!=-1){this.splitviews.splice(_p,1);_0v.die();this.dividers.splice(_p,1);this.dividers[_p].die();}}},setVertical:function(_8){this.vertical=_8;this.options.vertical=_8;},adjustViews:function(){var _0i=this.splitviews.length;var _2d;var _13;var _2i;var _17;if(this.vertical==false){_2d=this.rect.height-this.dividerWidth*(_0i-1);_13=0;for(var i=0;i<_0i;i++){_13+=this.splitviews[i].rect.height;}
_2i=_2d/_13;_17=0;for(var i=0;i<_0i;i++){var _h=this.splitviews[i];var _11=_h.rect.height*_2i;if(i==_0i-1){_11=Math.floor(_11);}else{_11=Math.ceil(_11);}
_h.rect.offsetTo(0,_17);_h.rect.setSize(this.rect.width,_11);_h.draw();_17+=_11+this.dividerWidth;}}else{_2d=this.rect.width-this.dividerWidth*(_0i-1);_13=0;for(var i=0;i<_0i;i++){_13+=this.splitviews[i].rect.width;}
_2i=_2d/_13;_17=0;for(var i=0;i<_0i;i++){var _h=this.splitviews[i];var _12=_h.rect.width*_2i;if(i==_0i-1){_12=Math.floor(_12);}else{_12=Math.ceil(_12);}
_h.rect.offsetTo(_17,0);_h.rect.setSize(_12,this.rect.height);_h.draw();_17+=_12+this.dividerWidth;}}
this.draw();},draw:function(){if(!this.drawn){this.drawRect();this.drawMarkup();this.drawn=true;}
this.refresh();},refresh:function(){this.base();if(this.drawn){var _0i=this.splitviews.length;var _N;for(var i=0;i<(_0i-1);i++){_N=new HRect(this.splitviews[i].rect);if(!this.vertical){_N.offsetTo(_N.left,_N.bottom);_N.setHeight(this.dividerWidth);}else{_N.offsetTo(_N.right,_N.top);_N.setWidth(this.dividerWidth);}
if(!this.dividers[i]){this.dividers[i]=new HDivider(_N,this);}else{var _h=this.dividers[i];_h.rect.offsetTo(_N.left,_N.top);_h.rect.setSize(_N.width,_N.height);_h.draw();}}}}});HStepper=HButton.extend({componentName:"stepper",constructor:function(_1,_w,_2){if(!_2){_2={};}
_2.events={mouseDown:true,keyDown:true,mouseWheel:true};var _r=Base.extend({minValue:0,value:0,interval:500});_r=_r.extend(_2);_2=new _r();if(this.isinherited){this.base(_1,_w,_2);}
else{this.isinherited=true;this.base(_1,_w,_2);this.isinherited=false;}
this.interval=_2.interval;this.type='[HStepper]';this._7v="stepperlabel";this.border=((_1.bottom-_1.top)/2+_1.top);if(!this.isinherited){this.draw();}},stepUp:function(_6A){_6A--;_6A=(_6A<this.minValue)?this.maxValue:_6A;this.setValue(_6A);},stepDown:function(_6A){_6A++;_6A=(_6A>this.maxValue)?this.minValue:_6A;this.setValue(_6A);},mouseDown:function(_7,_b,_S){this.setMouseUp(true);var temp=this;if(_b<this.border){this.stepUp(this.value);this.counter=setInterval(function(){temp.stepUp(temp.value);},this.interval);}else{this.stepDown(this.value);this.counter=setInterval(function(){temp.stepDown(temp.value);},this.interval);}},mouseUp:function(_7,_b,_S){clearInterval(this.counter);},blur:function(){clearInterval(this.counter);},keyDown:function(_z){this.setKeyUp(true);var temp=this;if(_z==Event.KEY_UP){this.stepUp(this.value);this.counter=setInterval(function(){temp.stepUp(temp.value);},this.interval);}
else if(_z==Event.KEY_DOWN){this.stepDown(this.value);this.counter=setInterval(function(){temp.stepUp(temp.value);},this.interval);}},keyUp:function(_z){clearInterval(this.counter);},mouseWheel:function(_M){if(_M>0){this.stepUp(this.value);}
else{this.stepDown(this.value);}}});HPasswordControl=HTextControl.extend({componentName:"passwordcontrol"});HDivider=HControl.extend({componentName:"divider",constructor:function(_1,_w,_2){if(this.isinherited){this.base(_1,_w,_2);}
else{this.isinherited=true;this.base(_1,_w,_2);this.isinherited=false;}
this.type='[HDivider]';this.preserveTheme=true;this.setDraggable(true);if(!this.isinherited){this.draw();}},startDrag:function(_7,_b){this.parent.startDrag(_7,_b,this);},doDrag:function(_7,_b){this.parent.doDrag(_7,_b,this);},endDrag:function(_7,_b){this.parent.endDrag(_7,_b,this);},draw:function(){if(!this.drawn){this.drawRect();this.drawMarkup();this.drawn=true;}
this.refresh();}});HValidatorView=HControl.extend({constructor:function(_1,_f,_2){if(_2!==undefined){if(_2.valueField!==undefined){_1.offsetBy(_2.valueField.rect.right,_2.valueField.rect.top);}}
if(this.isinherited){this.base(_1,_f,_2);}
else{this.isinherited=true;this.base(_1,_f,_2);this.isinherited=false;}
this.type='[HValidatorView]';if(!this.isinherited){this.draw();}},setValue:function(_8){if(null===_8||undefined===_8){_8=false;}
this.base(_8);},refresh:function(){this.base();this._6o();},_6o:function(){var _7=0,_b=0;this.setStyle('background-image',"url('"+this.getThemeGfxFile('validator.png')+"')");this.setStyle('background-repeat','no-repeat');if(this.enabled==false){_b=-21;}
if(this.value==true){_7=-21;_4I='';}else{_4I=this.value;}
ELEM.setAttr(this.elemId,'title',_4I);this.setStyle('background-position',_7+'px '+_b+'px');}});HWindow=HDynControl.extend({componentName:'window',constructor:function(_1,_7a,_2){if(_7a.componentBehaviour[0]!='app'){console.log("Himle.ComponentParentError","HWindow parent must be an HApplication instance!");}
if(!_2){_2={};}
var _r=HClass.extend({minSize:[96,54],maxSize:[16000,9000],resizeW:2,resizeE:2,resizeN:2,resizeS:2,resizeNW:[2,2],resizeNE:[2,2],resizeSW:[2,2],resizeSE:[16,16],noResize:false});_2=new(_r.extend(_2))();if(_2.noResize){_2.minSize=[_1.width,_1.height];_2.maxSize=[_1.width,_1.height];_2.resizeW=0;resizeE=0;resizeN=0;resizeS=0;resizeNW=[0,0];resizeNE=[0,0];resizeSW=[0,0];resizeSE=[0,0];}
this.base(_1,_7a,_2);this.windowView=this;HSystem.windowFocus(this);},gainedActiveStatus:function(){HSystem.windowFocus(this);},windowFocus:function(){this.toggleCSSClass(this.elemId,'inactive',false);this.setStyle('cursor','move');},windowBlur:function(){this.toggleCSSClass(this.elemId,'inactive',true);this.setStyle('cursor','default');},refresh:function(){if(this.drawn){this.base();if(this.markupElemIds.label){ELEM.setHTML(this.markupElemIds.label,this.label);}}}});HTabView=HView.extend({tabIndex:0,flexRight:true,flexRightOffset:0,flexBottom:true,flexBottomOffset:0,draw:function(){var _04=this.drawn;this.base();if(!_04){var i=0,_3c=[['overflow','auto']];for(i;i<_3c.length;i++){this.setStyle(_3c[i][0],_3c[i][1]);}
this.hide();}}});HTab=HControl.extend({componentName:"tab",componentBehaviour:['view','control','tab'],refreshOnValueChange:false,refreshOnLabelChange:false,constructor:function(_1,_f,_2){this.tabInit();if(this.isinherited){this.base(_1,_f,_2);}
else{this.isinherited=true;this.base(_1,_f,_2);this.isinherited=false;}
this.type='[HTab]';this.setMouseDown(true);if(!this.isinherited){this.draw();}},setValue:function(_6A){this.base(_6A);if(typeof _6A=='number'){var _p=parseInt(_6A,10);if(_p<this.tabs.length){if(_p!=this.selectIdx){this.selectTab(_p);}}}},stringWidth:function(_18,_9){var _1w='<span style="'+this.fontStyle+'">'+_18+'</span>',_q=this.base(_1w,null,_9);return _q;},tabInit:function(){this.tabs=[];this.tabLabels=[];this.tabLabelBounds=[];this.tabLabelStrings=[];this.rightmostPx=0;this.selectIdx=-1;this.tabLabelHeight=20;this.tabLabelLeftEdge=4;this.tabLabelRightEdge=4;this.fontStyle='font-family:Arial,sans-serif;font-size:13px;';this.tabLabelHTMLPrefix1='<div class="edge-left"></div><div class="tablabel" style="width:';this.tabLabelHTMLPrefix2='px">';this.tabLabelHTMLSuffix='</div><div class="edge-right"></div>';this.tabLabelParentElem='label';this.tabLabelElementTagName='div';this.tabLabelAlign='left';this.tabTriggerLink=false;this.tabLabelNoHTMLPrefix=false;},setLabel:function(_T){this.label=_T;},selectTab:function(_o){if(_o instanceof HTabView){_o=_o.tabIndex;}
if(this.selectIdx!=-1){var _4C=this.tabLabels[this.selectIdx],_6i=this.tabs[this.selectIdx];ELEM.removeClassName(_4C,'item-fg');ELEM.addClassName(_4C,'item-bg');HSystem.views[_6i].hide();}
if(_o!=-1){var _Z=this.tabLabels[_o],_3d=this.tabs[_o];ELEM.removeClassName(_Z,'item-bg');ELEM.addClassName(_Z,'item-fg');HSystem.views[_3d].show();}
this.selectIdx=_o;this.setValue(_o);},addTab:function(_2j,_6K){var _o=this.tabs.length,_4B='',_5F=this.stringWidth(_2j,0),_2U=_5F+this.tabLabelLeftEdge+this.tabLabelRightEdge,_1a=new HTabView(new HRect(0,this.tabLabelHeight,this.rect.width,this.rect.height),this),_o=this.tabs.length,_Z=ELEM.make(this.markupElemIds[this.tabLabelParentElem],this.tabLabelElementTagName);if(this.tabLabelNoHTMLPrefix){_4B=_2j;}
else{_4B=this.tabLabelHTMLPrefix1+_5F+this.tabLabelHTMLPrefix2+_2j+this.tabLabelHTMLSuffix;}
_1a.hide();ELEM.addClassName(_Z,'item-bg');ELEM.setStyle(_Z,'width',_2U+'px');ELEM.setStyle(_Z,this.tabLabelAlign,this.rightmostPx+'px');ELEM.setHTML(_Z,_4B);this.tabLabelStrings.push(_2j);if(this.tabTriggerLink&&this.tabLabelElementTagName=='a'){ELEM.setAttr(_Z,'href','javascript:HSystem.views['+this.viewId+'].selectTab('+_o+');');}
else if(this.tabTriggerLink){ELEM.setAttr(_Z,'mouseup','HSystem.views['+this.viewId+'].selectTab('+_o+');');}
else{this.tabLabelBounds.push([this.rightmostPx,this.rightmostPx+_2U]);}
this.rightmostPx+=_2U;if(this.tabLabelAlign=='right'){ELEM.setStyle(this.markupElemIds[this.tabLabelParentElem],'width',this.rightmostPx+'px');}
this.tabs.push(_1a.viewId);this.tabLabels.push(_Z);_1a.tabIndex=_o;if(_6K){this.selectTab(_o);}
return _1a;},mouseDown:function(_7,_b){if(this.tabTriggerLink){this.setMouseDown(false);return;}
_7-=this.pageX();_b-=this.pageY();if(_b<=this.tabLabelHeight){if(this.tabLabelAlign=='right'){_7=this.rect.width-_7;}
if(_7<=this.rightmostPx){var i=0,_3W;for(i;i<this.tabLabelBounds.length;i++){_3W=this.tabLabelBounds[i];if(_7<_3W[1]&&_7>=_3W[0]){this.selectTab(i);return;}}}}},removeTab:function(_o){var _63=this.selectIdx,_3d=this.tabs[_o],_Z=this.tabViews[_o];this.tabs.splice(_o,1);this.tabLabels.splice(_o,1);this.tabLabelBounds.splice(_o,1);this.tabLabelStrings.splice(_o,1);if(_o==_63){this.selectIdx=-1;if(_o==0&&this.tabs.length==0){this.selectTab(-1);}
else if(_o==(this.tabs.length-1)){this.selectTab(_o-1);}
else{this.selectTab(_o);}}
else if(_o<_63){this.selectIdx--;}
ELEM.del(_Z);HSystem.views[_3d].die();},draw:function(){var _04=this.drawn;this.base();if(!_04){this.drawMarkup();}
this.refresh();}});