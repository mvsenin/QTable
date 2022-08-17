/**
 * Global definitions
 */
define( ["qlik", "jquery", "text!./style.css", "qvangular"], function ( qlik, $, cssContent, angular, leonardoui ) {
	'use strict';
	$( "<style>" ).html( cssContent ).appendTo( "head" );

	/**
	 * Getting app base URL
	 * @returns app URL
	 */
	function getAppBaseURL () {
	  var config = {
		host: window.location.hostname,
		prefix: window.location.pathname.substr(0, window.location.pathname.toLowerCase().lastIndexOf("/extensions") + 1),
		port: window.location.port,
		isSecure: window.location.protocol === "https:"
	  };
	  // Open a connection to QRS
	  var global = qlik.getGlobal(config);

	  var isDesktop = (config.port == "4848");	
	  var appPathEncoded = "";

	  // Get the app path for Qlik Sense Desktop
	  if (isDesktop) { 
		var app = qlik.currApp(this);
		var applicationId = app.id;
		if(applicationId!=null){            
		  applicationId = applicationId.slice(0, applicationId.lastIndexOf("\\")+1);
		  appPathEncoded = encodeURIComponent(applicationId);
		};
	  }

	  return (config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port : "" ) + "/sense/app/" + appPathEncoded;
	};


	/**
	 * Rendering totals
	 * @param rows - not used
	 * @param dimensionInfo
	 * @param measureInfo
	 * @param labelTotal
	 * @param totalTopBottom - not used
	 * @returns row with totals
	 */
	function  createTotal ( rows, dimensionInfo, measureInfo, labelTotal, totalTopBottom ) {

		var html = "";
		var ImgURL="/extensions/QTable/images/"; 
		
		var AppBaseURL = getAppBaseURL();

	
		var tdTotal = "<tr>";
		
		if (labelTotal === undefined )
			var tdTotalLabel="Total";
		else 
			var tdTotalLabel=labelTotal;

		
		for(var i = 0;  i < dimensionInfo.length; i++) {
			if (i == 0)
				tdTotal=tdTotal+"<td class='otherTotalDim"+"' colspan='2'>" + tdTotalLabel + '</td>';
			else
				tdTotal=tdTotal+"<td class='otherTotalDim"+"' colspan='2'>" + '</td>';
		}

		var hasTotal=false;

		for(var i = 0; i < measureInfo.length; i++){
			tdTotal += "<td class='";
			if ( !isNaN(measureInfo[i].qMax) ) {
				tdTotal += "numericTotal ";
			} else {
				tdTotal += "otherTotalMea ";
			}
			if(measureInfo[i].totalMeasure===undefined){
				tdTotal += "'> </td>";
			} else {
			  if(measureInfo[i].totalMeasure !== "")
				hasTotal=true;
			  if(~measureInfo[i].totalMeasure.toLowerCase().indexOf('<img>')){
				tdTotal += "image'"+'> <img src="'+ ImgURL + measureInfo[i].totalMeasure.slice(5, measureInfo[i].totalMeasure.length) + '" height=' + '15' + '></td>';
			  }
			  else if(~measureInfo[i].totalMeasure.toLowerCase().indexOf('<url>')){
				var urlmark = measureInfo[i].totalMeasure.toLowerCase().indexOf('<url>');
				tdTotal += "'"+'> <a href="' + measureInfo[i].totalMeasure.slice(urlmark+5, measureInfo[i].totalMeasure.length) + '" target="_blank">' + measureInfo[i].totalMeasure.slice(0,urlmark) + '</a></td>';
			  }
			  else if(~measureInfo[i].totalMeasure.toLowerCase().indexOf('<app>')){
				var urlmark = measureInfo[i].totalMeasure.toLowerCase().indexOf('<app>');
				tdTotal += "'"+'> <a href="' + AppBaseURL + measureInfo[i].totalMeasure.slice(urlmark+5, measureInfo[i].totalMeasure.length) + '" target="_blank">' + measureInfo[i].totalMeasure.slice(0,urlmark) + '</a></td>';
			  }
			  else {
				tdTotal += "'>" + measureInfo[i].totalMeasure + '</td>';
			  }
			}
		}
		tdTotal += "</tr>";
		if(hasTotal)
			return tdTotal;
		else
			return "";
	}

	/**
	 * Renderiong table rows
	 * @param rows
	 * @param dimensionInfo
	 * @param measureInfo - not used
	 * @param labelTotal - not used
	 * @param totalTopBottom - not used
	 * @returns row with data
	 */
	function createRows ( rows, dimensionInfo, measureInfo, labelTotal, totalTopBottom ) {;
		var ImgURL="/extensions/QTable/images/"; 

		var AppBaseURL = getAppBaseURL();

		var htmlRows="";

		rows.forEach( function ( row ) {
			htmlRows+="<tr>";
			row.forEach( function ( cell, key ) {
				if ( cell.qIsOtherCell ) {
					cell.qText = dimensionInfo[key].othersLabel;
				}
			//	console.log (cell);
			//	console.log (key);
			//  console.log (dimensionInfo[key]);
				
				
				//measure columns
				htmlRows += "<td ";
				//add style defined for a dimension or a measure
				if (cell.qAttrExps) {
					if (cell.qAttrExps.qValues[0].qText) {
						htmlRows += "style = '" + cell.qAttrExps.qValues[0].qText + "'";
					}
				};

				htmlRows += " class = '";

				if ( !isNaN(cell.qNum) || (~cell.qText.toLowerCase().indexOf('<url>')) ) {
					htmlRows += "numeric ";
				}

				if (cell.qText === undefined) {
					htmlRows += "'> </td>";
				} else  {
					if(~cell.qText.toLowerCase().indexOf('<img>')) {
						htmlRows += "image'"+'> <img src="'+ ImgURL + cell.qText.slice(5, cell.qText.length) + '" height=' + '15' + '></td>';
					} else if(~cell.qText.toLowerCase().indexOf('<url>')) {
						var urlmark = cell.qText.toLowerCase().indexOf('<url>');
						htmlRows += "'"+'> <a href="' + cell.qText.slice(urlmark+5, cell.qText.length) + '" target="_blank">' + cell.qText.slice(0,urlmark) + '</a></td>';
					} else if(~cell.qText.toLowerCase().indexOf('<app>')) {
						var urlmark = cell.qText.toLowerCase().indexOf('<app>');
						htmlRows += "'"+'> <a href="' + AppBaseURL + cell.qText.slice(urlmark+5, cell.qText.length) + '" target="_blank">' + cell.qText.slice(0,urlmark) + '</a></td>';
					} else {
						if (dimensionInfo[key]) {
							htmlRows += "selectable' ";
							htmlRows += " dim-col = '" + key + "'";
							htmlRows += " dim-index = '" + cell.qElemNumber  + "'";
							htmlRows += " colspan = '2'";
						}
						htmlRows += "'>" + cell.qText + '</td>';
					};
				};
			} );
			htmlRows += '</tr>';
		} );
		
		return htmlRows;
	}
	
	/**
	 * Set column to be first in sort order
	 * @param self The extension
	 * @param col Column number, starting with 0
	 */
	function setSortOrder ( self, col ) {
		//set this column first
		var sortorder = [col];

		//append the other columns in the same order, if it is not currently sorted...
		if (col != self.backendApi.model.layout.qHyperCube.qEffectiveInterColumnSortOrder[0]) {
			self.backendApi.model.layout.qHyperCube.qEffectiveInterColumnSortOrder.forEach( function ( val ) {
				if ( val !== sortorder[0] ) {
					sortorder.push( val );
				}
			} );
			self.backendApi.applyPatches( [{
				'qPath': '/qHyperCubeDef/qInterColumnSortOrder',
				'qOp': 'replace',
				'qValue': '[' + sortorder.join( ',' ) + ']'
			}], true );
		// otherwise, reverse sorting order of the column
		} else {
			reverseOrder(self, col);
		}
	}

	/**
	 * Reverse sort order for column
	 * @param self The extension
	 * @param col The column number, starting with 0
	 */
	function reverseOrder ( self, col ) {
		var hypercube = self.backendApi.model.layout.qHyperCube;
		var dimcnt = hypercube.qDimensionInfo.length;
		var reversesort = col < dimcnt ? hypercube.qDimensionInfo[col].qReverseSort :
			hypercube.qMeasureInfo[col - dimcnt].qReverseSort;
		self.backendApi.applyPatches( [{
			'qPath': '/qHyperCubeDef/' +
			( col < dimcnt ? 'qDimensions/' + col : 'qMeasures/' + ( col - dimcnt ) ) +
			'/qDef/qReverseSort',
			'qOp': 'replace',
			'qValue': ( !reversesort ).toString()
		}], true );
	}

	/**
	 * Rendering table header
	 * @param col - column number
	 * @param value - column value
	 * @param sortorder - collestion of sorting order
	 * @param showSearch - whether to show search button, integer >= 1 stands for "yes", and "no" otherwise
	 * @returns HTML for table header
	 */	
	function formatHeader ( col, value, sortorder, showSearch ) {
		// Add HTML for search button, if needed
		var tdSearch = '';
		var thStyle = '';

		if (showSearch && showSearch >= 1) {
			tdSearch = '<th class="qv-object-QTable-search"><span class="lui-icon lui-icon--search"></span></th>';
			thStyle =' style = "border-right: 1px solid #ffffff;"';
		}
		// console.log("value: ");
		// console.log(value.qGroupFieldDefs);
		var html = '<th data-col="' + col + '"' + thStyle + ' fieldName = "' + value.qGroupFieldDefs + '">' + value.qFallbackTitle;

		//sort Ascending or Descending ?? add arrow
		if(value.qSortIndicator === 'A' || value.qSortIndicator === 'D') {
			html += "<span class='";
			if ( sortorder && sortorder[0] == col ) {
				html += (value.qSortIndicator === 'A' ? "lui-icon lui-icon--triangle-top" : "lui-icon lui-icon--triangle-bottom");
			}
			if ( sortorder && sortorder[0] !== col ) {
				html += " secondary";
			}
			html += "' fieldName = '" + value.qFallbackTitle + "'></span>";
		}
		html += "</th>" + tdSearch;
		return html;
	}

	var luiPopover = angular.getService('luiPopover'); // так работает с qvangular!
	//var $injector = angular.injector(); // так не работает с qvangular!
	//$injector.invoke(function(serviceA){});
	//console.log($injector);
	//console.log($injector.get('luiPopover'));
	// console.log("luiPopover: ");
	// console.log(luiPopover);

	/**
	* Definition of search pop-up dialog
	* @param elem - HTML element
	# @param field - field name
	*/
	function luiListbox(elem, field) {
		var popoverElement = undefined;
		var eTemplate = `<lui-popover
			class="qv-listbox-popover"
			style="min-width: 200px;width: 234px;height: 332px"
			on-close-view="closeView(event)"
			qva-outside-ignore-for="{{input.qvaOutsideIgnoreFor}}"
			qva-mouse-wheel-outside="close()">
			<lui-popover-body style="height: 332px" class="lui-nopad">
			<div class="toolbar-wrapper"
			qva-include-selection-toolbar></div>
			<div class="listbox-wrapper"></div>
			</lui-popover-body>
			</lui-popover>`;
			//<qv-spinner show="!input.model" spinner-height="100px" spinner-width="100px" show-Delay="300" center-in-parent="true"></qv-spinner>
			//<div class
		luiPopover.show({
			template: eTemplate,
			closeOnEscape: true,
			dock: "bottom",
			alignTo: elem,
			controller: ['$scope', '$element', '$timeout', function($scope, $element, $timeout) {
				$timeout(function() {
					popoverElement = $element[0].querySelector('.listbox-wrapper');
					var popOverController = $scope;
					var isRendered = false;
					var renderCount = 0;
					qlik.currApp().visualization.create('listbox', [field], {
						"showTitles": false
					}).then(function(vis) {
						vis.show(popoverElement).then(function(props) {
							// console.log("renderCount: ");
							// console.log(renderCount);

							// console.log("vis: ");
							// console.log(vis);

							props.options.showSearch = true;
							props.options.isReadonly = false;
							props.options.onRendered = function() {
								if (!isRendered) {
									props.options.search?.toggle();
									props.options.search?.focus();
									props.object.activateSelections();
								};
								// console.log("props.options: ");
								// console.log(props.options);

								// console.log("props.options.search?.show: ");
								// console.log(props.options.search?.show);
								if (renderCount > 1 && !props.options.search.show) {
									popOverController.close();
								}
								isRendered = true;
								renderCount++;
							}
						})
					});
				});
			}]
		})
	}

	// Rendering table options 
	var labelTotal = {
			type: "string",
			label: "Total Label",
			ref: "labelTotal",
			//expression: "always",
			defaultValue: "Total"
			
	};

	var totalTopBottom = {
		type: "string",
		component: "switch",
		label: "Totals on Top/Bottom",
		ref: "totalTopBottom",
		options: [{
			value: "top",
			label: "Top"
		}, {
			value: "bottom",
			label: "Bottom"
		}],
		defaultValue: "top"
	};	
	
	var tableSelectonDimensions = {
		type: "string",
		component: "switch",
		label: "Select on Dimensions",
		ref: "tableSelectonDimensions",
		options: [{
			value: "no",
			label: "No"
		}, {
			value: "yes",
			label: "Yes"
		}],
		defaultValue: "no"
	};	

	// Creating collection of the options
	var options = {
					type:"items",
					//component: "expandable-items",
					label:"Options",
					items: {			
						labelTotal:labelTotal,
						totalTopBottom:totalTopBottom,
						tableSelectonDimensions:tableSelectonDimensions
					}
			
				}

	return {
		initialProperties: {
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 100,
					qHeight: 100
				}]
			},
			selectionMode : "CONFIRM"
		},

		definition: {
			type: "items",
			component: "accordion",
			items: {
				dimensions: {
					uses: "dimensions",
					min: 1,
					items: {
						styleDimension: {
							type: "string",
							component: 'expression',
							ref: "qAttributeExpressions.0.qExpression",
							label: "Style",
							expression: ""
						},
						calcCond: {
							type: "string",
							label: "Show Column If",
							ref :"qCalcCond.qv",     // this is the important line.  
							expression: "always"
						}
					}
				},
				measures: {
					uses: "measures",
					min: 0,
					items: {
						totalMeasure: {
							type: "string",
							ref: "qDef.totalMeasure",
							label: "Total Expression",
							expression: "always",
							defaultValue: ""
						},
						styleMeasure: {
							type: "string",
							component: 'expression',
							ref: "qAttributeExpressions.0.qExpression",
							label: "Style",
							expression: ""
						},
						calcCond: {
							type: "string",
							label: "Show Column If",
							ref :"qCalcCond.qv",     // this is the important line.  
							expression: "always"
						}
					}
				},
				sorting: {
					uses: "sorting"
				},
				settings: {
					uses: "settings"
				},
				options:options
			}
		},

		snapshot: {
			canTakeSnapshot: true
		},

		support: {
			snapshot: true,
			export: true,
			exportData : true
		},

		paint: function ( $element, layout ) {
			var html = "<table><thead><tr>",
				self = this,
				morebutton = false,
				hypercube = layout.qHyperCube,
				rowcount = hypercube.qDataPages[0].qMatrix.length,
				dimcount = hypercube.qDimensionInfo.length,
				colcount = hypercube.qDimensionInfo.length + hypercube.qMeasureInfo.length,
				sortorder = hypercube.qEffectiveInterColumnSortOrder;

			//	console.log(hypercube);
				
			// Render titles for dimensions
            hypercube.qDimensionInfo.forEach(function(value, col) {
				if (value.qFallbackTitle != undefined) {
                	html += formatHeader(col, value, sortorder, 2);
				}
            });

			// Render titles for measures
            hypercube.qMeasureInfo.forEach(function(value, col) {
				if (value.qFallbackTitle != undefined) {
                	html += formatHeader(col + dimcount, value, sortorder);
				}
			} );

			html += "</tr>";

			// Render data:

			// - calculate totals
			var htmlTotal = createTotal(hypercube.qDataPages[0].qMatrix, hypercube.qDimensionInfo, hypercube.qMeasureInfo, layout.labelTotal, layout.totalTopBottom);

			//insert Total on the top
			if (layout.totalTopBottom == "top")
				html = html + htmlTotal;

			html += "</thead><tbody>";

			// create array to put  in  table(can be more with button "more")
			var htmlArray = [];

			// push first results on array
			htmlArray.push(createRows( hypercube.qDataPages[0].qMatrix, hypercube.qDimensionInfo,hypercube.qMeasureInfo,layout.labelTotal,layout.totalTopBottom));

			//html += createRows( hypercube.qDataPages[0].qMatrix, hypercube.qDimensionInfo,hypercube.qMeasureInfo,layout.labelTotal,layout.totalTopBottom);
			html += "</tbody></table>";
			//add 'more...' button
			if ( hypercube.qSize.qcy > rowcount ) {
				html += "<button class='more'>More...</button>";
				morebutton = true;
			}

			//create empty table
			$element.html( html );
			
			//create rows
			html="";
			for(var i = 0; i < htmlArray.length; i++)
				html += htmlArray[i];
			
			//insert Total on the buttom
			if(layout.totalTopBottom != "top")
				html = html + htmlTotal;
			
			//insert resulting table 
			$element.find( "tbody" ).html( html );

			// Event processing:
			// - More button processing
			if ( morebutton ) {
				$element.find( ".more" ).on( "qv-activate", function () {
					var requestPage = [{
						qTop: rowcount,
						qLeft: 0,
						qWidth: colcount,
						qHeight: Math.min( 50, hypercube.qSize.qcy - rowcount )
					}];
					self.backendApi.getData( requestPage ).then( function ( dataPages ) {
						rowcount += dataPages[0].qMatrix.length;
						if ( rowcount >= hypercube.qSize.qcy ) {
							$element.find( ".more" ).hide();
						}

						//push result from more on array;
						htmlArray.push(createRows( dataPages[0].qMatrix, hypercube.qDimensionInfo,hypercube.qMeasureInfo,layout.labelTotal,layout.totalTopBottom));
						//var html = createRows( dataPages[0].qMatrix, hypercube.qDimensionInfo,hypercube.qMeasureInfo,layout.labelTotal,layout.totalTopBottom);

						// create new html
						var  html = "";
						for(var i = 0; i < htmlArray.length; i++)
							html += htmlArray[i];

						// totals
						if(layout.totalTopBottom == "top")
							html = htmlTotal + html;
						else
							html = html + htmlTotal;

						//replace html
						$element.find( "tbody" ).html( html );
					} );
				} );
			}
			
			// - dimension selection in the table			
			$element.find(".selectable").on("click", function() {
				// Get the dimension column number
				if (layout.tableSelectonDimensions === 'yes') {
					var dimCol = parseInt(this.getAttribute("dim-col"));
					
					// Get the dimension value index
					var dimInd = parseInt(this.getAttribute("dim-index"));
		
					// Call selectValues with these values
					if(layout.selectionMode === "CONFIRM") {
						self.selectValues(dimCol, [dimInd], true);
						$element.find("[dim-col='" + dimCol + "'][dim-index='" + dimInd + "']").toggleClass("selected");
					} else {
						self.backendApi.selectValues(dimCol, [dimInd], true);
					}
				}
			});

			// - sorting in the table
			$element.find('th').on('qv-activate', function() {
				if (this.hasAttribute("data-col")) {
					var col = parseInt(this.getAttribute("data-col"), 10);
					setSortOrder(self, col);
				}
			});

			// - searching in the table dimensions
			$element.find('th.qv-object-QTable-search').on('qv-activate', function() {
				// console.log("$element.find: ");
				// console.log(this.previousSibling.getAttribute("fieldname"));
				luiListbox(this, this.previousSibling.getAttribute("fieldname"));
				/*
				var parent = this.parentNode;
				if (parent.hasAttribute("data-col")) {
					var col = parseInt(parent.getAttribute("data-col"), 10);
					reverseOrder(self, col);
				}
				*/
			});

			return qlik.Promise.resolve();
		}
	};
} );
