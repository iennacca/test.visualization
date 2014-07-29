﻿/*!@license
 * Infragistics.Web.ClientUI Tile Manager 14.1.20141.1020
 *
 * Copyright (c) 2011-2014 Infragistics Inc.
 *
 * http://www.infragistics.com/
 *
 * Depends on:
 *  jquery-1.8.0.js
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	infragistics.templating.js
 *	infragistics.dataSource.js
 *	infragistics.util.js
 *  infragistics.ui.splitter.js
 *	infragistics.ui.layoutmanager.js
 *	infragistics.ui.tilemanager-en.js
 */
(function($){$.widget("ui.igTileManager",{css:{container:"ui-widget ui-igtilemanager ui-widget-content",leftPanel:"ui-igtilemanager-left",rightPanel:"ui-igtilemanager-right",header:"ui-widget-header ui-igtile-header",content:"ui-widget-content ui-igtile",innerContainer:"ui-igtile-inner-container",minimized:"ui-igtile-minimized",maximized:"ui-igtile-maximized",minimizeButton:"ig-button ig-tile-minimize-button",minimizeIcon:"ui-icon ig-tile-minimize-icon",hoverClass:"ui-state-hover",hidden:"ui-helper-hidden",overflowHidden:"ui-helper-overflow-hidden",overflowVisible:"ui-helper-overflow-visible",visibilityHidden:"ui-helper-visibility-hidden",splitterNoScroll:"ui-igsplitter-no-scroll"},options:{width:null,height:null,columnWidth:null,columnHeight:null,cols:null,rows:null,marginLeft:0,marginTop:0,rearrangeItems:true,items:null,dataSource:null,minimizedState:null,maximizedState:null,maximizedTileIndex:null,rightPanelCols:1,rightPanelTilesWidth:null,rightPanelTilesHeight:null,showRightPanelScroll:true,showSplitter:true,preventMaximizingSelector:"a, input",animationDuration:500,dataSourceUrl:null,responseDataKey:null,responseDataType:null,dataSourceType:null,requestType:"GET",responseContentType:null},events:{dataBinding:"dataBinding",dataBound:"dataBound",rendering:"rendering",rendered:"rendered",tileRendering:"tileRendering",tileRendered:"tileRendered",tileMaximizing:"tileMaximizing",tileMaximized:"tileMaximized",tileMinimizing:"tileMinimizing",tileMinimized:"tileMinimized"},_selectors:{tileSelector:"> .ui-igtile",minimizedSelector:"> .ui-igtile-minimized",minimizeBtnSelector:"> .ig-tile-minimize-button",minimizeIconSelector:"> .ig-tile-minimize-icon",maximizedSelector:"> .ui-igtile-maximized",leftPanelSelector:"> .ui-igtilemanager-left",rightPanelSelector:"> .ui-igtilemanager-right",splitbarSelector:"> .ui-igsplitter-splitbar-vertical",innerContainerSelector:"> .ui-igtile-inner-container"},_createWidget:function(options,element){$.Widget.prototype._createWidget.apply(this,arguments)},_create:function(){var opt=this.options;this._options={fromMarkup:false,animating:false,useMaximizedTileIndex:false,tiles:null,maximizedTile:null,leftPanel:null,rightPanel:null,rightPanelWidth:0,gridLayout:null,layoutManagerElement:null,elementHandlers:{},windowHandlers:{}};this.element.addClass(this.css.container);if(opt.width){this.element.css("width",opt.width)}if(opt.height){this.element.css("height",opt.height)}this.options.tileSelector=this.options.tileSelector||this._selectors.tileSelector;if(opt.dataSource!==null){this.dataBind()}else{this._options.fromMarkup=true;this._initFromMarkup()}this._attachEvents()},_setOption:function(option,value){if(this.options[option]===value){return}var self=this,_opt=this._options,animationDuration=this.options.animationDuration,glOption;$.Widget.prototype._setOption.apply(this,arguments);switch(option){case"dataSource":this.dataBind();break;case"dataSourceUrl":this.dataBind();break;case"width":this.options.animationDuration=0;if(!_opt.useMaximizedTileIndex){this.minimize()}this.element.width(this.options.width);this.reflow(true);this.options.animationDuration=animationDuration;break;case"height":this.options.animationDuration=0;if(!_opt.useMaximizedTileIndex){this.minimize()}this.element.height(this.options.height);this.reflow(true);this.options.animationDuration=animationDuration;break;case"columnWidth":case"columnHeight":case"cols":case"rows":case"marginLeft":case"marginTop":case"rearrangeItems":glOption={};glOption[option]=value;_opt.layoutManagerElement.igLayoutManager("option","gridLayout",glOption);_opt.gridLayout=this.layoutManager()._opt.gridLayout;break;case"items":if(value.length!==_opt.tiles.length){throw new Error($.ig.TileManager.locale.setOptionItemsLengthError)}_opt.layoutManagerElement.igLayoutManager("option","items",this.options.items);_opt.gridLayout=this.layoutManager()._opt.gridLayout;break;case"minimizedState":_opt.tiles.not(_opt.maximizedTile).each(function(){self._toMinimizedState($(this))});break;case"maximizedState":if(_opt.maximizedTile){this._toMaximizedState(_opt.maximizedTile)}break;case"maximizedTileIndex":this._toMinimizedState(_opt.maximizedTile);_opt.maximizedTile=_opt.tiles.filter("[data-index="+this.options.maximizedTileIndex+"]");this._toMaximizedState(_opt.maximizedTile);break;case"rightPanelCols":if(_opt.maximizedTile&&!_opt.useMaximizedTileIndex){this._setRightPanelSize();this._positionRightPanelTiles(_opt.tiles.not(_opt.maximizedTile),parseInt(_opt.maximizedTile.attr("data-index"),10),false,false,null)}break;case"rightPanelTilesWidth":if(_opt.maximizedTile&&!_opt.useMaximizedTileIndex){this._setRightPanelSize();this._positionRightPanelTiles(_opt.tiles.not(_opt.maximizedTile),parseInt(_opt.maximizedTile.attr("data-index"),10),false,true,null)}break;case"rightPanelTilesHeight":if(_opt.maximizedTile&&!_opt.useMaximizedTileIndex){this._setRightPanelSize();this._positionRightPanelTiles(_opt.tiles.not(_opt.maximizedTile),parseInt(_opt.maximizedTile.attr("data-index"),10),false,true,null)}break;case"showRightPanelScroll":if(!_opt.useMaximizedTileIndex){if(value){_opt.rightPanel.removeClass(this.css.overflowHidden)}else{_opt.rightPanel.addClass(this.css.overflowHidden)}if(_opt.maximizedTile){this._setRightPanelSize()}}break;case"showSplitter":if(this.options.showSplitter){this.element.find(this._selectors.splitbarSelector).removeClass(this.css.visibilityHidden)}else{this.element.find(this._selectors.splitbarSelector).addClass(this.css.visibilityHidden)}break;case"animationDuration":this.layoutManager().options.gridLayout.animationDuration=value;break;default:break}},_initFromMarkup:function(){var tiles;if(this.element.children(this.options.tileSelector).length>0){tiles=this.element.children(this.options.tileSelector);this.element.children().not(tiles).addClass(this.css.hidden)}else{tiles=this.element.children()}tiles.wrap("<div>");this._initLayoutManager(tiles)},_renderData:function(success,msg,data){var _opt=this._options;this._triggerDataBound(success,msg,data._data);if(success){if(_opt.layoutManagerElement){_opt.layoutManagerElement.igLayoutManager("destroy");if(!_opt.useMaximizedTileIndex){this.element.igSplitter("destroy")}this._resetInternalOptions()}this.element.empty();this._initLayoutManager(data._data)}else{throw new Error($.ig.TileManager.locale.renderDataError)}},_resetInternalOptions:function(){var _opt=this._options;_opt.gridLayout=null;_opt.layoutManagerElement=null;_opt.leftPanel=null;_opt.rightPanel=null;_opt.maximizedTile=null;_opt.tiles=null;_opt.animating=false},_initDataSource:function(){var opt=this.options,dataOpt;if(!opt.dataSource&&opt.dataSourceUrl){opt.dataSource=opt.dataSourceUrl}if(!(opt.dataSource instanceof $.ig.DataSource)){dataOpt={callback:this._renderData,callee:this,dataSource:opt.dataSource,requestType:opt.requestType,responseContentType:opt.responseContentType,responseDataType:opt.responseDataType,localSchemaTransform:false};if(opt.responseDataKey){dataOpt.responseDataKey=opt.responseDataKey}if(opt.dataSourceType){dataOpt.dataSourceType=opt.dataSourceType}opt.dataSource=new $.ig.DataSource(dataOpt)}},_tileRendered:function(event,ui){var _opt=this._options,tile=ui.item,renderMaximizedState=_opt.useMaximizedTileIndex&&this.options.maximizedTileIndex===ui.index,innerContainer;if(_opt.fromMarkup){innerContainer=tile.children();if(!_opt.useMaximizedTileIndex){innerContainer.prepend(this._renderMinimizeButton())}if(renderMaximizedState){if(this.options.maximizedState){innerContainer.children().not(this.options.maximizedState).addClass(this.css.hidden)}}else if(this.options.minimizedState){innerContainer.children().not(this.options.minimizedState).addClass(this.css.hidden)}}else{innerContainer=$("<div/>").appendTo(tile);if(renderMaximizedState){innerContainer.html(this._renderMaximizedState(ui.index))}else{innerContainer.html(this._renderMinimizedState(ui.index))}}innerContainer.addClass(this.css.innerContainer);tile.addClass(this.css.content).addClass(renderMaximizedState?this.css.maximized:this.css.minimized);this._triggerTileRendered(event,ui)},_initLayoutManager:function(tiles){var self=this,opt=this.options,_opt=this._options,items=[],lengthDiff,noCancel,i;if(opt.items){$.extend(items,opt.items)}if(tiles.length>items.length){lengthDiff=tiles.length-items.length;for(i=0;i<lengthDiff;i++){items.push({})}}else{items.splice(tiles.length)}noCancel=this._triggerRendering(tiles,items);if(noCancel){if(!(typeof opt.maximizedTileIndex==="number"&&tiles.length>=opt.maximizedTileIndex)){this._addPanels();_opt.leftPanel.addClass(this.css.overflowHidden);this._renderSplitter();_opt.layoutManagerElement=_opt.leftPanel;_opt.leftPanel.igLayoutManager($.extend(true,{},{layoutMode:"grid",items:items,destroyItems:false,gridLayout:{columnWidth:opt.columnWidth,columnHeight:opt.columnHeight,cols:opt.cols,rows:opt.rows,marginLeft:opt.marginLeft,marginTop:opt.marginTop,rearrangeItems:opt.rearrangeItems,animationDuration:opt.animationDuration,overrideConfigOnSetOption:false,useOffset:false},itemRendered:function(event,ui){noCancel=self._triggerTileRendering(event,ui);if(noCancel){self._tileRendered(event,ui)}},rendered:function(event,ui){_opt.leftPanel.removeClass(self.css.overflowHidden);_opt.tiles=$(this).data("igLayoutManager")._opt.gridLayout.elements;self._triggerRendered()},internalResizing:function(event,ui){if(_opt.maximizedTile){return false}},internalResized:function(event,ui){if(_opt.maximizedTile){_opt.animating=false;if(event){self._triggerTileMinimized(event,_opt.maximizedTile)}_opt.maximizedTile=null}}}))}else{_opt.useMaximizedTileIndex=true;this.element.addClass(this.css.overflowHidden);_opt.layoutManagerElement=this.element;this.element.igLayoutManager($.extend(true,{},{layoutMode:"grid",items:items,destroyItems:false,gridLayout:{columnWidth:opt.columnWidth,columnHeight:opt.columnHeight,cols:opt.cols,rows:opt.rows,marginLeft:opt.marginLeft,marginTop:opt.marginTop,rearrangeItems:opt.rearrangeItems,animationDuration:opt.animationDuration,overrideConfigOnSetOption:false,useOffset:false},itemRendered:function(event,ui){noCancel=self._triggerTileRendering(event,ui);if(noCancel){self._tileRendered(event,ui)}},rendered:function(event,ui){self.element.removeClass(self.css.overflowHidden);_opt.tiles=$(this).data("igLayoutManager")._opt.gridLayout.elements;self._triggerRendered()}}));_opt.maximizedTile=_opt.tiles.filter("[data-index="+opt.maximizedTileIndex+"]")}_opt.gridLayout=this.layoutManager()._opt.gridLayout}},_toMaximizedState:function(tile){var innerContainer=tile.find(this._selectors.innerContainerSelector);tile.removeClass(this.css.minimized).addClass(this.css.maximized);if(!this._options.fromMarkup){innerContainer.html((this._options.useMaximizedTileIndex?"":this._renderMinimizeButton())+this._renderMaximizedState(tile.attr("data-index")))}else{if(this.options.maximizedState){innerContainer.children().not(this.options.maximizedState).addClass(this.css.hidden);innerContainer.find(this.options.maximizedState+", "+this._selectors.minimizeBtnSelector).removeClass(this.css.hidden)}else{innerContainer.children().removeClass(this.css.hidden)}}},_toMinimizedState:function(tile){var innerContainer=tile.find(this._selectors.innerContainerSelector);tile.removeClass(this.css.maximized).addClass(this.css.minimized);if(!this._options.fromMarkup){innerContainer.html(this._renderMinimizedState(tile.attr("data-index")))}else{if(this.options.minimizedState){innerContainer.children().not(this.options.minimizedState).addClass(this.css.hidden);innerContainer.find(this.options.minimizedState).removeClass(this.css.hidden)}else{innerContainer.children().removeClass(this.css.hidden)}}},_renderMaximizedState:function(index){return this.options.maximizedState?$.ig.tmpl(this.options.maximizedState,this.options.dataSource.data()[index]):this._renderMinimizedState(index)},_renderMinimizedState:function(index){return this.options.minimizedState?$.ig.tmpl(this.options.minimizedState,this.options.dataSource.data()[index]):""},_renderMinimizeButton:function(){return'<span class="'+this.css.minimizeButton+'">'+'<span class="'+this.css.minimizeIcon+'"></span></span>'},_addPanels:function(){var _opt=this._options,markup=this.element.children(),leftPanel=$("<div/>").addClass(this.css.leftPanel),rightPanel=$("<div/>").addClass(this.css.rightPanel+" "+this.css.hidden);leftPanel.appendTo(this.element);rightPanel.appendTo(this.element);_opt.leftPanel=leftPanel;_opt.rightPanel=rightPanel;if(!this.options.showRightPanelScroll){_opt.rightPanel.addClass(this.css.overflowHidden)}markup.appendTo(_opt.leftPanel)},_removePanels:function(){this.element.find(this._selectors.leftPanelSelector).children().appendTo(this.element);this.element.find(this._selectors.leftPanelSelector+", "+this._selectors.rightPanelSelector).remove();this._options.leftPanel=null;this._options.rightPanel=null},_renderSplitter:function(){var self=this,_opt=this._options;this.element.igSplitter({panels:[{size:"100%"}],layoutRefreshing:function(){return false},resizeStarted:function(){_opt.rightPanelWidth=_opt.rightPanel.width()},resizeEnded:function(){var gl=_opt.gridLayout,rightPanelWidth=_opt.rightPanel.width(),rightPanelTilesWidth=self._getRightPanelTilesWidth(),rightPanelTilesHeight=self._getRightPanelTilesHeight(),tiles=_opt.tiles.not(_opt.maximizedTile),rightPanelCols,oldRightPanelCols,rightPanelHasScroll;if(_opt.rightPanelWidth>rightPanelWidth){rightPanelCols=Math.floor(rightPanelWidth/(rightPanelTilesWidth+gl.marginLeft))}else{rightPanelCols=Math.ceil(rightPanelWidth/(rightPanelTilesWidth+gl.marginLeft))}rightPanelHasScroll=self.options.showRightPanelScroll&&Math.ceil(tiles.length/rightPanelCols)*(rightPanelTilesHeight+gl.marginTop)>_opt.rightPanel.height();if(rightPanelHasScroll){if(_opt.rightPanelWidth>rightPanelWidth){rightPanelCols=Math.floor((rightPanelWidth-$.ig.util.getScrollWidth())/(rightPanelTilesWidth+gl.marginLeft))}else{rightPanelCols=Math.ceil((rightPanelWidth-$.ig.util.getScrollWidth())/(rightPanelTilesWidth+gl.marginLeft))}}oldRightPanelCols=self.options.rightPanelCols;self.options.rightPanelCols=rightPanelCols;self._setRightPanelSize();if(oldRightPanelCols!==self.options.rightPanelCols){self._positionRightPanelTiles(tiles,parseInt(_opt.maximizedTile.attr("data-index"),10),false,false,null)}_opt.rightPanelWidth=rightPanelWidth}});this._hideSplitterElements()},_attachEvents:function(){var self=this,_opt=this._options,minimizeBtnSelector=".ig-tile-minimize-button",minimizedTileSelector=".ui-igtile-minimized",splitter=this.splitter(),elHandlers=_opt.elementHandlers,noCancel;elHandlers.minimizedTileClick=function(event){var target=$(event.target),tileToMaximize=$(this);self._stopEventPropagation(event);if(target.is(self.options.preventMaximizingSelector)){return}if(!_opt.animating){_opt.animating=true;tileToMaximize.removeClass(self.css.hoverClass);noCancel=self._triggerTileMaximizing(event,tileToMaximize);if(_opt.maximizedTile){self._triggerTileMinimizing(event,_opt.maximizedTile,tileToMaximize)}if(noCancel){self.maximize(tileToMaximize,event)}else{_opt.animating=false}}};elHandlers.miminimizedTileMouseOver=function(event){self._stopEventPropagation(event);if(!(_opt.animating||splitter&&splitter._isDrag)){$(this).addClass(self.css.hoverClass)}};elHandlers.minimizedTileMouseOut=function(event){self._stopEventPropagation(event);$(this).removeClass(self.css.hoverClass)};elHandlers.minimizeBtnClick=function(event){self._stopEventPropagation(event);if(!_opt.animating){_opt.animating=true;noCancel=self._triggerTileMinimizing(event,_opt.maximizedTile);if(noCancel){self.minimize(event)}else{_opt.animating=false}}};elHandlers.minimizeBtnMouseOver=function(event){self._stopEventPropagation(event);if(!(_opt.animating||splitter&&splitter._isDrag)){$(this).find(self._selectors.minimizeIconSelector).addClass(self.css.hoverClass)}};elHandlers.minimizeBtnMouseOut=function(event){self._stopEventPropagation(event);$(this).find(self._selectors.minimizeIconSelector).removeClass(self.css.hoverClass)};this.element.on("click",minimizedTileSelector,elHandlers.minimizedTileClick).on("mouseover",minimizedTileSelector,elHandlers.miminimizedTileMouseOver).on("mouseout",minimizedTileSelector,elHandlers.minimizedTileMouseOut).on("click",minimizeBtnSelector,elHandlers.minimizeBtnClick).on("mouseover",minimizeBtnSelector,elHandlers.minimizeBtnMouseOver).on("mouseout",minimizeBtnSelector,elHandlers.minimizeBtnMouseOut);_opt.windowHandlers.resize=function(){if(_opt.maximizedTile&&!_opt.useMaximizedTileIndex){self._setRightPanelSize()}};$(window).on("resize",_opt.windowHandlers.resize)},_stopEventPropagation:function(event){if(event.stopPropagation){event.stopPropagation()}if(event.cancelBubble!==null||event.cancelBubble!==undefined){event.cancelBubble=true}},_getRightPanelTilesWidth:function(){return this.options.rightPanelTilesWidth||this._options.gridLayout.columnWidth},_getRightPanelTilesHeight:function(){return this.options.rightPanelTilesHeight||this._options.gridLayout.columnHeight},_setRightPanelSize:function(){var self=this,opt=this.options,_opt=this._options,gl=_opt.gridLayout,minMaximizedTileWidth=gl.columnWidth+2*gl.marginLeft,rightTilesTotalWidth=this._getRightPanelTilesWidth()+gl.marginLeft,rightTilesTotalHeight=this._getRightPanelTilesHeight()+gl.marginTop,rightPanelHeight=_opt.rightPanel.height(),splitterWidth=this.element.find(this._selectors.splitbarSelector).outerWidth(true),scrollWidth=$.ig.util.getScrollWidth(),maxCols,minWidth,rightPanelWidth,leftPanelWidth,rightPanelHasScroll=function(){return self.options.showRightPanelScroll&&Math.ceil((_opt.tiles.length-1)/self.options.rightPanelCols)*rightTilesTotalHeight>rightPanelHeight};if(opt.rightPanelCols<1){opt.rightPanelCols=1}maxCols=Math.max(Math.floor((this.element.width()-minMaximizedTileWidth-splitterWidth-(rightPanelHasScroll()?scrollWidth:0))/rightTilesTotalWidth),1);if(opt.rightPanelCols>maxCols){opt.rightPanelCols=maxCols}rightPanelWidth=opt.rightPanelCols*rightTilesTotalWidth+(rightPanelHasScroll()?scrollWidth:0);minWidth=rightPanelWidth+minMaximizedTileWidth+splitterWidth;this.element.css("min-width",minWidth);leftPanelWidth=this.element.width()-rightPanelWidth-2*gl.marginLeft-splitterWidth;this.element.igSplitter("setFirstPanelSize",leftPanelWidth)},_positionRightPanelTiles:function(tiles,maximizingTileIndex,containerSwap,animateSize,callback){var self=this,opt=this.options,_opt=this._options,gl=_opt.gridLayout,rightPanelTilesWidth=this._getRightPanelTilesWidth(),rightPanelTilesHeight=this._getRightPanelTilesHeight(),leftAdjustment=containerSwap?_opt.rightPanel.position().left-gl.marginLeft:0,topAdjustment=containerSwap?_opt.rightPanel.scrollTop():0,rightPanelCols=opt.rightPanelCols;tiles.each(function(index,element){var tile=$(this),tileIndex=parseInt(tile.attr("data-index"),10),tileLeft,tileTop,newDim;if(tileIndex>maximizingTileIndex){tileTop=Math.floor((tileIndex-1)/rightPanelCols)*(rightPanelTilesHeight+gl.marginTop)+gl.marginTop;tileLeft=(tileIndex-1)%rightPanelCols*(rightPanelTilesWidth+gl.marginLeft)+gl.marginLeft/2}else{tileTop=Math.floor(tileIndex/rightPanelCols)*(rightPanelTilesHeight+gl.marginTop)+gl.marginTop;tileLeft=tileIndex%rightPanelCols*(rightPanelTilesWidth+gl.marginLeft)+gl.marginLeft/2}newDim={top:tileTop-topAdjustment,left:tileLeft+leftAdjustment};if(animateSize){newDim.width=rightPanelTilesWidth;newDim.height=rightPanelTilesHeight}tile.animate(newDim,opt.animationDuration,function(){if(containerSwap){tile.css({left:tileLeft,top:tileTop}).appendTo(_opt.rightPanel)}if(callback){callback.apply(this)}})})},_hideSplitterElements:function(){var _opt=this._options;_opt.rightPanel.addClass(this.css.hidden+" "+this.css.splitterNoScroll);this.element.find(this._selectors.splitbarSelector).addClass(this.css.hidden);_opt.leftPanel.width("100%");if(!this.options.showSplitter){this.element.find(this._selectors.splitbarSelector).addClass(this.css.visibilityHidden)}},_showSplitterElements:function(){this._options.rightPanel.removeClass(this.css.hidden+" "+this.css.splitterNoScroll);this.element.find(this._selectors.splitbarSelector).removeClass(this.css.hidden)},_toMaximizedView:function(tileToMaximize,event){var _opt=this._options,marginLeft=_opt.gridLayout.marginLeft;_opt.tiles.css({left:"-="+marginLeft});_opt.leftPanel.css({marginLeft:marginLeft,marginRight:marginLeft});this._setRightPanelSize();this._showSplitterElements();this._positionRightPanelTiles(_opt.tiles.not(tileToMaximize),parseInt(tileToMaximize.attr("data-index"),10),true,true,null);this._maximizeTile(tileToMaximize,event)},_maximizedTileSwap:function(tileToMaximize,event){var self=this,_opt=this._options,gl=_opt.gridLayout,minimizedTiles=_opt.tiles.not(_opt.maximizedTile),tileToMinimize=_opt.maximizedTile,tileToMinimizeIndex=parseInt(tileToMinimize.attr("data-index"),10),tileToMaximizeIndex=parseInt(tileToMaximize.attr("data-index"),10),rightPanelOffset=_opt.rightPanel.position().left-gl.marginLeft;this._toMinimizedState(tileToMinimize);this._positionRightPanelTiles(tileToMinimize,tileToMaximizeIndex,true,true,function(){var prevIndex=tileToMinimizeIndex-1,prevTile;if(prevIndex===tileToMaximizeIndex){prevIndex-=1}prevTile=_opt.tiles.filter("[data-index="+prevIndex+"]");if(prevTile.length>0){tileToMinimize.insertAfter(prevTile)}else{tileToMinimize.prependTo(_opt.rightPanel)}if(event){self._triggerTileMinimized(event,tileToMinimize)}});this._positionRightPanelTiles(minimizedTiles.not(tileToMaximize),tileToMaximizeIndex,false,false,null);tileToMaximize.css({left:"+="+rightPanelOffset,top:"-="+_opt.rightPanel.scrollTop()}).appendTo(_opt.leftPanel);this._maximizeTile(tileToMaximize,event)},_maximizeTile:function(tileToMaximize,event){var self=this,_opt=this._options,mt=_opt.gridLayout.marginTop,innerContainer=tileToMaximize.find(this._selectors.innerContainerSelector);this._toMaximizedState(tileToMaximize);innerContainer.addClass(this.css.overflowHidden);tileToMaximize.animate({width:"100%",height:this.element.height()-2*mt,top:mt,left:0},this.options.animationDuration,function(){_opt.leftPanel.removeClass(self.css.overflowVisible);innerContainer.removeClass(self.css.overflowHidden);_opt.maximizedTile=tileToMaximize;_opt.animating=false;if(event){self._triggerTileMaximized(event,tileToMaximize)}})},_maximizeTileWithCustomIndex:function(tileToMaximize,event){var itemData,i,self=this,_opt=this._options,animDuration=this.options.animationDuration,tileToMinimize=_opt.maximizedTile,tileToMinimizeNewDim={width:tileToMaximize.outerWidth(),height:tileToMaximize.outerHeight(),top:tileToMaximize.css("top"),left:tileToMaximize.css("left")},tileToMaximizeNewDim={width:tileToMinimize.outerWidth(),height:tileToMinimize.outerHeight(),top:tileToMinimize.css("top"),left:tileToMinimize.css("left")},swapTilesInConfig=function(itemsConfig){for(i=0;i<itemsConfig.length;i++){itemData=itemsConfig[i];if(itemData.item.is(tileToMinimize)){itemData.item=tileToMaximize}else if(itemData.item.is(tileToMaximize)){itemData.item=tileToMinimize}}};this._toMaximizedState(tileToMaximize);this._toMinimizedState(tileToMinimize);tileToMinimize.animate(tileToMinimizeNewDim,animDuration,function(){if(event){self._triggerTileMinimized(event,tileToMinimize)}});tileToMaximize.animate(tileToMaximizeNewDim,animDuration,function(){var lmGridLayout=self.layoutManager()._opt.gridLayout;swapTilesInConfig(lmGridLayout.items);swapTilesInConfig(lmGridLayout.sortedItems);_opt.maximizedTile=tileToMaximize;_opt.animating=false;if(event){self._triggerTileMaximized(event,tileToMaximize)}})},maximize:function(tileToMaximize,event){var _opt=this._options;if(!tileToMaximize){return}if(_opt.maximizedTile&&_opt.maximizedTile.attr("data-index")===tileToMaximize.attr("data-index")){return}if(!_opt.useMaximizedTileIndex){_opt.leftPanel.addClass(this.css.overflowVisible).removeClass(this.css.overflowHidden);if(!_opt.maximizedTile){this._toMaximizedView(tileToMaximize,event)}else{this._maximizedTileSwap(tileToMaximize,event)}}else{this._maximizeTileWithCustomIndex(tileToMaximize,event)}},minimize:function(event){var self=this,_opt=this._options,tileToMinimize=_opt.maximizedTile,gl=_opt.gridLayout,rightTilesOffset=_opt.rightPanel.position().left,tileToMinimizeIndex;if(!tileToMinimize){return}this.element.css("min-width",0);tileToMinimizeIndex=parseInt(tileToMinimize.attr("data-index"),10);_opt.leftPanel.width(_opt.leftPanel.outerWidth(true)).height(_opt.leftPanel.outerHeight(true)).css({margin:0});this._toMinimizedState(tileToMinimize);tileToMinimize.css({width:tileToMinimize.outerWidth(),height:tileToMinimize.outerHeight(),top:gl.marginTop,left:gl.marginLeft});_opt.tiles.not(tileToMinimize).each(function(index,element){var tile=$(this);tile.css({left:"+="+rightTilesOffset,top:"-="+_opt.rightPanel.scrollTop()});if(parseInt(tile.attr("data-index"),10)>tileToMinimizeIndex){tile.appendTo(_opt.leftPanel)}else{tile.insertBefore(tileToMinimize)}});this._hideSplitterElements();this.reflow(true,event)},maximizedTile:function(){return this._options.maximizedTile||null},minimizedTiles:function(){var minimizedTiles=this._options.tiles.not(this._options.maximizedTile);return minimizedTiles.length>0?minimizedTiles:null},splitter:function(){return this._options.useMaximizedTileIndex?null:this.element.data("igSplitter")},layoutManager:function(){return this._options.layoutManagerElement.data("igLayoutManager")},reflow:function(forceReflow,event){this.layoutManager().reflow(forceReflow,event)},widget:function(){return this.element},_triggerDataBinding:function(){var args={owner:this,dataSource:this.options.dataSource};return this._trigger(this.events.dataBinding,null,args)},_triggerDataBound:function(success,msg,dataView){var args={owner:this,success:success,errorMessage:msg,dataView:dataView};this._trigger(this.events.dataBound,null,args)},_triggerRendering:function(tiles,items){var args={owner:this,tiles:tiles,items:items};return this._trigger(this.events.rendering,null,args)},_triggerRendered:function(){this._trigger(this.events.rendered,null,{owner:this})},_triggerTileRendering:function(event,ui){var args={owner:this,tile:ui.item};return this._trigger(this.events.tileRendering,event,args)},_triggerTileRendered:function(event,ui){var args={owner:this,tile:ui.item};return this._trigger(this.events.tileRendered,event,args)},_triggerTileMaximizing:function(event,tile){var args={owner:this,tile:tile,minimizingTile:this._options.maximizedTile||null};return this._trigger(this.events.tileMaximizing,event,args)},_triggerTileMaximized:function(event,tile){var args={owner:this,tile:tile};this._trigger(this.events.tileMaximized,event,args)},_triggerTileMinimizing:function(event,tile,maximizingTile){var args={owner:this,tile:tile,maximizingTile:maximizingTile||null};return this._trigger(this.events.tileMinimizing,event,args)},_triggerTileMinimized:function(event,tile){var args={owner:this,tile:tile};this._trigger(this.events.tileMinimized,event,args)},dataBind:function(){var noCancel;this._initDataSource();noCancel=this._triggerDataBinding();if(noCancel){this.options.dataSource.dataBind(this._renderData,this)}},_destroyTiles:function(){var self=this,_opt=this._options;_opt.layoutManagerElement.igLayoutManager("destroy");if(!_opt.useMaximizedTileIndex){this.element.igSplitter("destroy")}if(_opt.fromMarkup){if(_opt.useMaximizedTileIndex){_opt.tiles.each(function(index){var tile=$(this);tile.children().removeClass(self.css.innerContainer).appendTo(self.element).find("."+self.css.hidden).removeClass(self.css.hidden);tile.remove()})}else{this._removePanels();this.element.children().children().unwrap()}}else{this.element.empty()}},_removeEventHandlers:function(){var _opt=this._options,elHandlers=_opt.elementHandlers,minimizeBtnSelector=".ig-tile-minimize-button",minimizedTileSelector=".ui-igtile-minimized";this.element.off("click",minimizedTileSelector,elHandlers.minimizedTileClick).off("mouseover",minimizedTileSelector,elHandlers.miminimizedTileMouseOver).off("mouseout",minimizedTileSelector,elHandlers.minimizedTileMouseOut).off("click",minimizeBtnSelector,elHandlers.minimizeBtnClick).off("mouseover",minimizeBtnSelector,elHandlers.minimizeBtnMouseOver).off("mouseout",minimizeBtnSelector,elHandlers.minimizeBtnMouseOut);$(window).off("resize",_opt.windowHandlers.resize)},destroy:function(){$.Widget.prototype.destroy.apply(this,arguments);this.element.removeClass(this.css.container);this._destroyTiles();this._removeEventHandlers();return this}});$.extend($.ui.igTileManager,{version:"14.1.20141.1020"})})(jQuery);(function($){$(document).ready(function(){var wm=$("#__ig_wm__").length>0?$("#__ig_wm__"):$('<div id="__ig_wm__"></div>').appendTo(document.body);wm.css({position:"fixed",bottom:0,right:0,zIndex:1e3}).addClass("ui-igtrialwatermark")})})(jQuery);