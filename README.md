#dragBar

##use
```javascript
  $('#id').dragBar(options)
```
##param

* disabled:false,             -------disabled the drag
* animate:false,              -------open the animation
* orientation:'horizontal',   -------horizontal or vertical
* range:false,                -------range drag 
* min:0,                      -------min value
* max:100,                    ------max value
* step:1,                     ------drag step
* value:0,                    ------dragbar start value
* values:[0,100],             ------dragbar start range(when range is true)
* start:function(drag,value,range){} ------drag start callback(param:'drag'-the drag button;'value'-current value;'range'-current range value)
* stop:function(drag,value,range){} ------drag stop callback
* sliding:function(drag,value,range){} ------draging callback
* change:function(drag,value,range){} ------when stop value does not equal start value callback
* duration:400 ------animation duration
