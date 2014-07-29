﻿/*!@license
 * Infragistics.Web.ClientUI Grid LoadOnDemand 14.1.20141.1020
 *
 * Copyright (c) 2011-2014 Infragistics Inc.
 *
 * http://www.infragistics.com/
 *
 * Depends on:
 * Depends on:
 *	jquery-1.4.4.js
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	infragistics.ui.grid.framework.js
 *	infragistics.ui.editors.js
 *	infragistics.ui.shared.js
 *	infragistics.dataSource.js
 *	infragistics.util.js
 */
if(typeof jQuery!=="function"){throw new Error("jQuery is undefined")}(function($){$.widget("ui.igGridLoadOnDemand",{options:{type:null,chunkSize:25,recordCountKey:null,chunkSizeUrlKey:null,chunkIndexUrlKey:null,defaultChunkIndex:0,currentChunkIndex:0,loadTrigger:"auto",loadMoreDataButtonText:$.ig.GridLoadOnDemand.locale.loadMoreDataButtonText},events:{rowsRequesting:"rowsRequesting",rowsRequested:"rowsRequested"},_loadingIndicator:null,_injectGrid:function(gridInstance,isRebind){this.grid=gridInstance;this._checkNotSupportedScenarios();this.options.currentChunkIndex=this.options.defaultChunkIndex;if(this.options.type===null){this.options.type=this.grid._inferOpType()}this.grid.dataSource.settings.paging.type=this.options.type||"remote";this._defaultChunkSize=parseInt(this.options.chunkSize,10)*(this.options.defaultChunkIndex+1);this.grid.dataSource.settings.paging.pageSize=this._defaultChunkSize;if(this.options.chunkSizeUrlKey!==null&&this.options.chunkIndexUrlKey){this.grid.dataSource.settings.paging.pageSizeUrlKey=this.options.chunkSizeUrlKey;this.grid.dataSource.settings.paging.chunkIndexUrlKey=this.options.chunkIndexUrlKey}if(this.options.recordCountKey!==null){this.grid.dataSource.settings.responseTotalRecCountKey=this.options.recordCountKey}this.grid.dataSource.settings.paging.enabled=true;if(this.options.loadTrigger==="auto"){this._verticalScrollHandler=$.proxy(this._probeForNextPage,this)}this._appendRecordsHandler=$.proxy(this._appendRecords,this);this.grid.element.bind("iggridrowsrendered",this._rowsRenderingHandler)},_dataRendered:function(){var scrollId="#"+this.grid.scrollContainer()[0].id,buttonId,container;this.grid.scrollContainer().css("background-color","white");this._originalDataSourceCallback=this.grid.dataSource.settings.callback;this._initLoadingIndicator();if(this.options.loadTrigger==="auto"){$(scrollId).unbind("scroll",this._verticalScrollHandler);$(scrollId).bind("scroll",this._verticalScrollHandler);this._probeForNextPage()}this._requestPending=false;if(this.options.loadTrigger==="button"){if(!this._buttonRow){buttonId=this.grid.id()+"_loadMoreButton";container=this.grid.options.height?this.grid.scrollContainer():this.grid.container();this._buttonRow=container.append("<div class='ui-iggrid-loadmorebutton'><input type='button' id='"+buttonId+"'></input></div>");$("#"+buttonId).igButton({labelText:this.options.loadMoreDataButtonText,click:$.proxy(this._nextChunk,this),width:"100%"})}}if(this._loadingIndicator){this._hideLoading()}},_checkNotSupportedScenarios:function(){if(this.options.loadTrigger==="auto"&&!this.grid.options.height){throw new Error($.ig.GridLoadOnDemand.locale.loadOnDemandRequiresHeight)}if(this.grid.options.virtualization){throw new Error($.ig.GridLoadOnDemand.locale.virtualizationNotSupported)}var i,featureName,features=this.grid.options.features,featuresLength=features.length;if(featuresLength===1){return}for(i=0;i<featuresLength;i++){featureName=features[i].name;if(!featureName){continue}featureName=featureName.toLowerCase();switch(featureName){case"groupby":throw new Error($.ig.GridLoadOnDemand.locale.groupByNotSupported);case"paging":throw new Error($.ig.GridLoadOnDemand.locale.pagingNotSupported);case"cellmerging":throw new Error($.ig.GridLoadOnDemand.locale.cellMergingNotSupported)}}},_setOption:function(key,value){$.Widget.prototype._setOption.apply(this,arguments);if(key==="defaultChunkIndex"){throw new Error($.ig.Grid.locale.optionChangeNotSupported+" "+key)}if(key==="currentChunkIndex"||key==="chunkSize"){this.grid.dataSource.settings.paging.pageSize=(this.options.currentChunkIndex+1)*this.options.chunkSize;this.grid.dataSource.dataBind()}},_initLoadingIndicator:function(){this._loadingIndicator=this.grid.container().igLoading().data("igLoading").indicator()},_nextChunk:function(){var noCancel=true;if(this.grid.dataSource.pageIndex()>=this.grid.dataSource.pageCount()-1){return}noCancel=this._trigger(this.events.rowsRequesting,null,{owner:this,chunkIndex:this.options.currentChunkIndex+1,chunkSize:this.options.chunkSize});if(noCancel){this._showLoading();this.grid.dataSource.settings.paging.pageSize=this.options.chunkSize;this.grid.dataSource.settings.paging.pageIndex=this.options.currentChunkIndex;this.grid.dataSource.settings.paging.appendPage=true;this._originalDataSourceCallback=this.grid.dataSource.settings.callback;this.grid.dataSource.settings.callback=this._appendRecordsHandler;this._requestPending=true;this.grid.dataSource.nextPage()}},_showLoading:function(){this._loadingIndicator.show()},_hideLoading:function(){this._loadingIndicator.hide()},destroy:function(){var buttonId=this.grid.id()+"_loadMoreButton",scrollId="#"+this.grid.scrollContainer()[0].id,container=this.grid.options.height?this.grid.scrollContainer():this.grid.container(),button=this.grid.container().find("div.ui-iggrid-loadmorebutton");$("#"+buttonId).igButton("destroy");if(button){button.remove()}this.grid.element.unbind("iggridrowsrendered",this._rowsRenderingHandler);$(scrollId).unbind("scroll",this._verticalScrollHandler);$.Widget.prototype.destroy.call(this);return this},_appendRecords:function(success,errmsg){var i,currentPage,noCancelError;if(success===true){currentPage=this.grid.dataSource.recordsForPage(this.grid.dataSource.settings.paging.pageIndex);for(i=0;i<currentPage.length;i++){this.grid.renderNewRow(currentPage[i])}}this._requestPending=false;this.grid.dataSource.settings.paging.pageSize=this.options.chunkSize*(this.options.currentChunkIndex+1);this.grid.dataSource.settings.paging.pageIndex=0;this.grid.dataSource.settings.paging.appendPage=false;this.grid.dataSource.settings.callback=this._originalDataSourceCallback;this._hideLoading();if(success===false){noCancelError=this._trigger(this.grid.events.requestError,null,{owner:this,message:errmsg});if(noCancelError){throw new Error(errmsg)}}this.options.currentChunkIndex++;this.grid.dataSource.settings.paging.pageSize=this.options.chunkSize*(this.options.currentChunkIndex+1);this._trigger(this.events.rowsRequested,null,{owner:this,chunkIndex:this.options.currentChunkIndex,chunkSize:this.options.chunkSize,rows:currentPage})},_refreshData:function(){this._showLoading();this.grid.dataSource.settings.paging.appendPage=false;this.grid.dataSource.settings.callback=this._originalDataSourceCallback;this._requestPending=true;this.grid.dataSource.dataBind()},_probeForNextPage:function(evt,ui){var delta=(this.grid.scrollContainer().scrollTop()+this.grid.scrollContainer().height())/$(this.grid.element).height();if(delta>=1&&!this._requestPending){this._nextChunk()}},nextChunk:function(){this._nextChunk()}});$.extend($.ui.igGridLoadOnDemand,{version:"14.1.20141.1020"})})(jQuery);(function($){$(document).ready(function(){var wm=$("#__ig_wm__").length>0?$("#__ig_wm__"):$('<div id="__ig_wm__"></div>').appendTo(document.body);wm.css({position:"fixed",bottom:0,right:0,zIndex:1e3}).addClass("ui-igtrialwatermark")})})(jQuery);