   /*拖动条
    *   
    *
    *   param object
    *   options = {
    *       disabled:false,                //禁用,默认false
    *       animate:false,                 //是否启用动画效果,默认false
    *       orientation:'horizontal',      //水平or垂直,默认'horizontal'
    *       range:false,                   //true表示范围拖动,默认false
    *       min:0,                         //起点表示的数值,默认0
    *       max:100,                       //终点表示的数值,默认100
    *       step:20,                       //间隔值,默认1
    *       value:0,                       //单点拖动时的初始值,默认0
    *       values:[0,100],                //范围拖动时的初始值,默认[0,100]
    *       start:function(drag,value,range){},  //拖动开始回调,回调函数自带2~3个参数:'drag'-当前拖动的button,'value'-当前拖动button的value值,'range'-拖动条当前范围值
    *       stop:function(drag,value,range){},   //拖动结束回调
    *       sliding:function(drag,value,range){},//拖动值变化回调
    *       change:function(drag,range){}, //结束拖动后的值与开始拖动前的值不一致时回调
    *       duration:400
    *   }
    */
$(function(){
	var sae_dragBar = function(options){
		if(this.length == 0){return this}
		$.extend(this,{
			'disabled':false,
			'animate':false,
			'orientation':'horizontal',
			'range':false,
			'min':0,
			'max':100,
			'step':1,
			'value':0,
			'values':[0,100],
			'start':function(drag,value,range){},
			'stop':function(drag,value,range){},
			'sliding':function(drag,value,range){},
			'change':function(drag,value,range){},
			'create':function(drag,range){},
			'duration':400
		},options);

		/*sort values_arr*/
		function sortNumber(a,b){
			return a - b
		}
		this.values.sort(sortNumber);
		
		if(!this.range){this._cValue1 = this.value>this.max?this.max:this.value<this.min?this.min:this.value; this._cValue2 = this.min;}
		else{this._cValue1 = this.values[0]<this.min?this.min:this.values[0];this._cValue2 = this.values[1]>this.max?this.max:this.values[1];}
		this.per = Number.prototype.toFixed.call(this.step/(this.max-this.min)*100,2);
		this.len = Number.prototype.toFixed.call((this.max-this.min)/this.step,2)-1;
		
		/*public API*/
		this.getRange = function(){
			if(this.range){
				return [this._cValue1,this._cValue2]
			}else{
				return [this._cValue2,this._cValue1]
			}
		}
		this.disable = function(){
			$('body').off('mouseup.slide').off('mousemove.slide');
			$(this).off('mousedown.slide');
			return this
		}
		this.enable = function(){
			$('body').off('mouseup.slide').off('mousemove.slide');
			$(this).off('mousedown.slide');
			this.sae_dragBar_fn._addListen.call(this,this._modal);
			return this
		}

		/*init*/
		this.sae_dragBar_fn.init.call(this);
		return this
	}
	$.fn.extend({sae_dragBar:sae_dragBar});
	$.fn.extend({sae_dragBar_fn:{
		init:function(){
			this._modal = this.sae_dragBar_fn._createDrag.call(this);
			if(!this.disabled){this.sae_dragBar_fn._addListen.call(this,this._modal);}
		},
		_createDrag:function(){
			var _this = this,slide_modal = '',_tmp,l0,l1,_bar,_drag;
			if(this.orientation == 'horizontal'){
				this.addClass('slide-horizontal');
			}else if(this.orientation == 'vertical'){
				this.addClass('slide-vertical');
			}
			this.addClass('slide-cont');
			if(!this.range){
				slide_modal = $('<div class="slide-bar"></div><a class="slide-drag"><span class="slide-drag-info"></span></a>');
				_bar = slide_modal.filter('.slide-bar');
				_drag = slide_modal.filter('.slide-drag');
				l0 = this.sae_dragBar_fn._getA(this.per,(this._cValue1-this.min)/(this.max-this.min)*100)*this.per;
				if(this.orientation == 'horizontal'){
					_drag.css('left',l0 + '%');
					_bar.css('width',l0 + '%');
				}else if(this.orientation == 'vertical'){
					_drag.css('top',l0 + '%');
					_bar.css('height',l0 + '%');
				}
			}else{
				slide_modal = $('<a class="slide-drag"><span class="slide-drag-info"></span></a><div class="slide-bar"></div><a class="slide-drag"><span class="slide-drag-info"></span></a>');
				_drag = slide_modal.filter('.slide-drag');
				_bar = slide_modal.filter('.slide-bar');
				l0 = this.sae_dragBar_fn._getA(this.per,(this._cValue1-this.min)/(this.max-this.min)*100)*this.per;
				l1 = this.sae_dragBar_fn._getA(this.per,(this._cValue2-this.min)/(this.max-this.min)*100)*this.per;
				if(this.orientation == 'horizontal'){
					_drag.eq(0).css('left',l0 + '%');
					_drag.eq(1).css('left',l1 + '%');
					_bar.css({
						'width': (l1 - l0) +'%',
						'left' : l0 + '%'
					});
				}else if(this.orientation == 'vertical'){
					_drag.eq(0).css('top',l0 + '%');
					_drag.eq(1).css('top',l1 + '%');
					_bar.css({
						'height': (l1 - l0) +'%',
						'top' : l0 + '%'
					});
				}
			}
			
			this.append(slide_modal);
			_drag.each(function(i){
				var $this = $(this),info = $this.find('.slide-drag-info');
				$this.data('_index',i+1);
				$this._value = _this['_cValue'+(i+1)];
				info.text($this._value).css('left',($this.innerWidth()-info.innerWidth())/2);
			});
			
			/*create drag callback*/
			this.create(_drag,this.getRange());
			return slide_modal
		},
		_addListen:function(modal){
			var body = $('body'),
				cont = this,
				per = this.per,
				len = this.len,
				_value1,_value2;

			/*save old value*/
			_value1 = this._cValue1;
			_value2 = this._cValue2;

			/*drag*/
			cont.off('mousedown.slide').on('mousedown.slide',function(event){
				event.stopPropagation();
				var _drag = $(this),c_left,c_top,nearest_drag = {item:null},
					cX = event.clientX,cY = event.clientY,
					drag = cont.find('.slide-drag'),
					bar = cont.find('.slide-bar');

				/*release*/
				body.off('mouseup.slide').on('mouseup.slide',function(){
					body.off('mousemove.slide');
					drag.css('cursor','default');
					/*stop drag callback*/
					cont.stop(_drag,_drag.value,cont.getRange());
					/*change value callback*/
					if(_value1 != cont._cValue1 || _value2 != cont._cValue2){
						_value1 = _value1 != cont._cValue1 ? cont._cValue1 : _value1;
						_value2 = _value2 != cont._cValue2 ? cont._cValue2 : _value2;
						cont.change(_drag,_drag.value,cont.getRange());
					}
					body.off('mouseup.slide');
				});

				body.off('mousemove.slide').on('mousemove.slide',moving);
				function moving(event,type){
					event.preventDefault();
					/*get mouse position*/
					cX = event.clientX ? event.clientX : cX;
					cY = event.clientY ? event.clientY : cY;
					var ted,_left_,_top_,_tmp,
						i = _drag.data('_index'),
						info = _drag.find('.slide-drag-info'),
						dw = _drag.innerWidth(),
						_left = (cX - cont.offset().left-parseInt(_drag.css('width'))/2)/parseInt(cont.css('width'))*100,
						_top = (document.body.scrollTop + cY - cont.offset().top - parseInt(_drag.css('height'))/2)/parseInt(cont.css('height'))*100,
                        options = {duration:cont.duration,queue:true};

					/*horizontal*/
					if(cont.orientation == 'horizontal' && _left >= 0 && _left <= 100){
						/*get nearest equants*/
						ted = cont.sae_dragBar_fn._getA(per,_left);
						_left = ted*per;
						/*save old value*/
						_tmp = cont['_cValue'+i];
                        /*stop the old animations*/
                        bar.stop(true);
                        _drag.stop(true);
						if(cont.range){
							/*current_drag can not cross the other one*/
							var d1 = drag.eq(0).position(),d2 = drag.eq(1).position(),cw = cont.width();
							switch(i){
								case 1 :
									_left_ = d2.left/cw*100;
									if(_left > _left_){_left = _left_;}else{cont['_cValue'+i] = _drag.value = cont.min+ted*cont.step;}
									/*change bar width and left*/
									if(type && cont.animate){
										bar.animate({
											'width':(d2.left-_left*cw/100)/cw*100+'%',
											'left' : _left+'%'
										},options);
									}else{
										bar.css({
											'width':(d2.left-_left*cw/100)/cw*100+'%',
											'left' : _left+'%'
										});
									}
									break;
								case 2 :
									_left_ = d1.left/cw*100;
									if(_left < _left_){_left = _left_;}else{cont['_cValue'+i] = _drag.value = cont.min+ted*cont.step;}
									if(type && cont.animate){
										bar.animate({
											'width':(_left*cw/100-d1.left)/cw*100+'%',
											'left' : d1.left/cw*100+'%'
										},options);
									}else{
										bar.css({
											'width':(_left*cw/100-d1.left)/cw*100+'%',
											'left' : d1.left/cw*100+'%'
										});
									}
									break;
							}
						}else{
							if(type && cont.animate){
								bar.animate({'width':_left + '%'},options);
							}else{
								bar.css('width',_left + '%');
							}
							_drag.value = cont._cValue1 = cont.min+ted*cont.step;
						}
						if(type && cont.animate){
							_drag.animate({'left' : _left + '%'},options);
						}else{
							_drag.css('left' , _left + '%');
						}
						/*draging callback*/
						if(_tmp != cont['_cValue'+i]){
							cont.sliding(_drag,_drag.value,cont.getRange());
							info.css('left',(dw-info.innerWidth())/2);
						}
					/*vertical*/
					}else if(cont.orientation == 'vertical' && _top >= 0 && _top <= 100){
						ted = cont.sae_dragBar_fn._getA(per,_top);
						_top = ted*per;
						/*memory old value*/
						_tmp = cont['_cValue'+i];
						if(cont.range){
							//cont['_cValue'+i] = (cont.min+ted*cont.step);

							var d1 = drag.eq(0).position(),d2 = drag.eq(1).position(),ch = cont.height();
							switch(i){
								case 1 : 
									_top_ = d2.top/ch*100;
									if(_top > _top_){_top = _top_;}else{cont['_cValue'+i] = _drag.value = cont.min+ted*cont.step;}
									if(type && cont.animate){
										bar.animate({
											'height':(d2.top-_top*ch/100)/ch*100+'%',
											'top' : _top + '%'
										},options);
									}else{
										bar.css({
											'height':(d2.top-_top*ch/100)/ch*100+'%',
											'top' : _top + '%'
										});
									}
									break;
								case 2 : 
									_top_ = d1.top/ch*100;
									if(_top < _top_){_top = _top_;}else{cont['_cValue'+i] = _drag.value = cont.min+ted*cont.step;}
									if(type && cont.animate){
										bar.animate({
											'height':(_top*ch/100-d1.top)/ch*100+'%',
											'top' : d1.top/ch*100+'%'
										},options);
									}else{
										bar.css({
											'height':(_top*ch/100-d1.top)/ch*100+'%',
											'top' : d1.top/ch*100+'%'
										});
									}
									break;
							}
						}else{
							if(type && cont.animate){
								bar.animate({'height':_top + '%'},options);
							}else{
								bar.css('height',_top + '%');
							}
							_drag.value = cont._cValue1 = cont.min+ted*cont.step;
						}
						if(type && cont.animate){
							_drag.animate({'top' : _top + '%'},options);
						}else{
							_drag.css('top' ,_top + '%');
						}
						if(_tmp != cont['_cValue'+i]){
							cont.sliding(_drag,_drag.value,cont.getRange());
							info.css('left',(dw-info.innerWidth())/2);
						}
					}

				}

				/*judge nearest drag*/
				c_left = event.clientX - cont.offset().left,
				c_top = document.body.scrollTop + event.clientY - cont.offset().top;
				if(cont.orientation == 'horizontal'){
					nearest_drag.l=cont.width();
					drag.each(function(){
						var le = Math.abs($(this).position().left - c_left);
						le <= nearest_drag.l && (nearest_drag.item = this,nearest_drag.l = le)
					});
					_drag = $(nearest_drag.item);
				}else if(cont.orientation == 'vertical'){
					nearest_drag.l=cont.height();
					drag.each(function(){
						var tp = Math.abs($(this).position().top - c_top);
						tp <= nearest_drag.l && (nearest_drag.item = this,nearest_drag.l = tp)
					});
					_drag = $(nearest_drag.item);
				}
				/*init value*/
				_drag.value = cont['_cValue'+_drag.data('_index')];

				/*start drag callback*/
				cont.start(_drag,_drag.value,cont.getRange());
				/*trigger*/
				moving(event,'click');

				_drag.css('cursor','move');
			});
		},
		/*获取最近间隔点*/
		_getA:function(per,c){
			var _max,min,i=0;
			do{
				_min = i*per;
				_max = (++i)*per;
			}while(_min > c || _max <c)
			return (_max - c) >= (c - _min) ? i-1 : i
		}
	}});
});
