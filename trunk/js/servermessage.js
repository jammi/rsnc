
ReloadApp=HApplication.extend({constructor:function(_4R,_6r,_2x){this.base();this._2x=_2x;var _4P=helmi.Window.getInnerWidth();var _4O=helmi.Window.getInnerHeight();var _5o=parseInt(_4P/2,10);var _5n=parseInt(_4O/2,10);this._2u=new HView(new HRect(0,0,_4P,_4O),this);this._2u.setStyle('opacity','0.75');this._2u.setStyle('background-color','#666');var _3p=400;var _6u=300;var _1K=_5o-200;var _1L=_5n-150;if(_1K<10){_1K=10;}
if(_1L<10){_1L=10;}
var _4Y=new HRect(_1K,_1L,_1K+_3p,_1L+_6u);this._4Z=new HWindowControl(_4Y,this._2u,{label:_4R,minSize:[_3p,_6u],maxSize:[_3p,_6u],enabled:false});var _1J=this._4Z.windowView;_1J.setStyle('opacity','1.0');var _1h=new HView(new HRect(10,10,350,32),_1J);_1h.setStyle('font-family','Trebuchet MS, Arial, sans-serif');_1h.setStyle('font-size','18px');_1h.setStyle('font-weight','bold');_1h.setStyle('color','#000');_1h.setHTML(_4R);var _1g=new HView(new HRect(10,48,350,230),_1J);_1g.setStyle('font-family','Trebuchet MS, Arial, sans-serif');_1g.setStyle('font-size','13px');_1g.setStyle('overflow','auto');_1g.setStyle('color','#000');_1g.setHTML(_6r);var _6K=new HClickButton(new HRect(10,236,370,258),_1J,{label:'Reload',action:this._54});},_54:function(){location.href=reloadApp._2x;}});