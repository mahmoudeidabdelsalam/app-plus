
(function () {
	"use strict";

	var messageBanner;
	var isUserLoggedIn = false;
	var retrievedGraphicItems = '';
	var retrievedGrpahicsFacades = [];
	var selectedCategory = graphicCategories.Templates;

	//$('#previous-page').prop('disabled', true);
	//pagination logic
	var currentPage = 1;
	var rowDivIcons = '';
	var rowDivGraphics = '';
	var rowDivTemplates = '';
	var rowDivBackground = '';
	var counterIcons = 0;
	var counterGraphics = 0;
	var counterTemplates = 0;
	var counterBackground = 0;
	var searchTerm = '';
	var xhrRequest;
	// The initialize function must be run each time a new page is loaded.

		$(document).ready(function () {

			//  ###  D - EVENTS AREA  ###

			//1. Validate sign up and log in, on click and handle actions
			$('#logInWithCredBtn').click(function () {
				var valResult = validateLogInAction();
				if (valResult) {
					hideLogInArea();
					showTempSpinner();
					logInUser();
				}
			});
			// 2. Search for graphics
			var typingTimer;                //timer identifier
			var doneTypingInterval = 1200;  //time in ms
			var searchBoxControl = $('#searchBox');
			$(searchBoxControl).on("keyup", function () {
				//if (xhrRequest) {
				//	xhrRequest.abort();
				//	retrievedGrpahicsFacades = [];
				//	ClearGraphicItemsImagesArea();
				//	ClearGraphicItemsTemplatesArea();
				//	ClearGraphicItemsTextArea();
				//	ClearGraphicItemsIconsArea();
				//}
				clearTimeout(typingTimer);
				searchTerm = $(this).val();
				typingTimer = setTimeout(updateGraphicItemsAreaOnSearch, doneTypingInterval);

				//updateGraphicItemsAreaOnSearch(searchTerm);
			});
			//3. Hide pop up show more
			$('.showMoreLbl').click(function () {
				var isVisible = $('#myPopup').is(":visible");
				if (isVisible) {
					$('#myPopup').hide();
					$('#searchBox').show();
				} else {
					$('#searchBox').hide();
					$('#myPopup').show();
				}
			});
			$('.ms-SearchBox').click(function () {
				$('#myPopup').hide();
				$('#searchBox').show();
			});
			$('#nav-images').click(function () {
				$('#myPopup').hide();
				$('#searchBox').show();
			});
			$('#nav-icons').click(function () {
				$('#myPopup').hide();
				$('#searchBox').show();
			});
			$('#nav-templates').click(function () {
				$('#myPopup').hide();
				$('#searchBox').show();
			});
			$('#nav-text').click(function () {
				$('#myPopup').hide();
				$('#searchBox').show();
			});
			//4. Show Catagory Items
			$('.showTemplatesLbl').on('click', function () {
				selectedCategory = graphicCategories.Templates;
				populateGraphicItemsArea(graphicCategories.Templates, nextPreviousPage.None);
				$('#myPopup').hide();
				$('#searchBox').show();
			});
			$('.showImagesLbl').on('click', function () {
				selectedCategory = graphicCategories.Graphics;
				populateGraphicItemsArea(graphicCategories.Graphics, nextPreviousPage.None);
				$('#myPopup').hide();
				$('#searchBox').show();
			});
			$('.showIconsLbl').on('click', function () {
				selectedCategory = graphicCategories.Icons;
				populateGraphicItemsArea(graphicCategories.Icons, nextPreviousPage.None);
				$('#myPopup').hide();
				$('#searchBox').show();
			});
			$('.showTextLbl').on('click', function () {
				selectedCategory = graphicCategories.Background;
				populateGraphicItemsArea(graphicCategories.Background, nextPreviousPage.None);
				$('#myPopup').hide();
				$('#searchBox').show();
			});
			//5. Welcome are links
			$('#goto-website').click(function () {
				window.open("https://www.premast.com/", "_blank");
			});
			$('#goto-community').click(function () {
				window.open("https://www.premast.com/blog/", "_blank");
			});
			$('#goto-support').click(function () {
				window.open("https://www.premast.com/contact-us/", "_blank");
			});
			$('#goto-about').click(function () {
				window.open("https://www.premast.com/about/", "_blank");
			});
			$('#goto-signout').click(function () {
				hideMainAreaGraphicsContainer();
				showLogInArea();
				hideHeaderAreaMainAlt();
				showHeaderAreaMainLogo();
				ClearCredentials();
			});
			//6. Pager actions
			$('#next-page').click(function () {
				if (this.hasAttribute("disabled")) return;
				populateGraphicItemsArea(selectedCategory, nextPreviousPage.Next);
			});
			$('#next-page').on('mouseover', function () {
				if (!this.hasAttribute("disabled")) {
					$(this).addClass('hover-pager-active');
				}
			});
			$('#next-page').on('mouseout', function () {
				$(this).removeClass('hover-pager-active');
			});

			$('#previous-page').click(function () {
				if (this.hasAttribute("disabled")) return;
				populateGraphicItemsArea(selectedCategory, nextPreviousPage.Previous);
			});
			$('#previous-page').on('mouseover', function () {
				if (!this.hasAttribute("disabled")) {
					$(this).addClass('hover-pager-active');
				}
			});
			$('#previous-page').on('mouseout', function () {
				$(this).removeClass('hover-pager-active');
			});

			$('#first-page').click(function () {
				if (this.hasAttribute("disabled")) return;
				populateGraphicItemsArea(selectedCategory, nextPreviousPage.First);
			});
			$('#first-page').on('mouseover', function () {
				if (!this.hasAttribute("disabled")) {
					$(this).addClass('hover-pager-active');
				}
			});
			$('#first-page').on('mouseout', function () {
				$(this).removeClass('hover-pager-active');
			});
			$('#last-page').click(function () {
				if (this.hasAttribute("disabled")) return;
				populateGraphicItemsArea(selectedCategory, nextPreviousPage.Last);
			});
			$('#last-page').on('mouseover', function () {
				if (!this.hasAttribute("disabled")) {
					$(this).addClass('hover-pager-active');
				}
			});
			$('#last-page').on('mouseout', function () {
				$(this).removeClass('hover-pager-active');
			});
			$('#searchBox').focus(function () {
				$('#search-icon-cont').hide();
			});
			$('#searchBox').focusout(function () {
				$('#search-icon-cont').show();
			});
			// ***TEMP
			//selectedCategory = graphicCategories.Templates;
			//populateGraphicItemsArea(graphicCategories.Templates, nextPreviousPage.None);
			$('#myPopup').hide();
			$('#searchBox').show();
			//showMainAreaGraphicsContainer();
			//ShowGraphicItemsTemplatesArea();


		});


	//  ###  C - GRAPHICS MGMT AREA  ###
	function updateGraphicItemsAreaOnSearch() {
		var query = searchTerm;

		ClearGraphicItemsImagesArea();
		ClearGraphicItemsIconsArea();
		ClearGraphicItemsTemplatesArea();
		ClearGraphicItemsTextArea();

		showGroupSpinner();
		//var url = localStorage.getItem('baseUrl') + 'api/graphics/GetGraphics?currentPage=' + currentPage
		//	+ '&pageSize=' + localStorage.getItem('pageSize') + '&pageNp=' + nextPreviousPage.None + '&category=' + selectedCategory + '&searchText=' + query;

		var url = ppGraphicsInjectorConfigurationData.baseUrl + ppGraphicsInjectorConfigurationData.getGraphicsUrl + '&searchText=' + query;

		var type = requestMethod.GET;
		var contentType = requestContentType.JSON;
		var dataType = '';
		var params = { selectedCategory: selectedCategory };
		CallWS(type, url, contentType, dataType, '', getGraphicsSuccessCallback, errorHandler, errorHandler, params);
	}

	function populateGraphicItemsArea(selectedCategory, nextPrevious) {
		ClearGraphicItemsImagesArea();
		ClearGraphicItemsIconsArea();
		ClearGraphicItemsTemplatesArea();
		ClearGraphicItemsTextArea();
		HideGraphicItemsIconsArea();
		HideGraphicItemsImagesArea();
		HideGraphicItemsTemplatesArea();
		HideGraphicItemsTextArea();

		showGroupSpinner();
		var params = { selectedCategory: selectedCategory };
		if (ppGraphicsInjectorConfigurationData.useStaticData) {
			var response = getStaticTemplates();
			getGraphicsSuccessCallback(response, params);
		}
		else {
			var contentType = requestContentType.JSON;
			var dataType = '';
			var type = requestMethod.GET;
			var url = ppGraphicsInjectorConfigurationData.baseUrl + ppGraphicsInjectorConfigurationData.getGraphicsUrl;
			if (ppGraphicsInjectorConfigurationData.usePaging) {
				url = url + '?currentPage=' + currentPage + '&pageSize=' + localStorage.getItem('pageSize') + '&pageNp=' + nextPrevious + '&category=' + params.selectedCategory;
			}
			CallWS(type, url, contentType, dataType, '', getGraphicsSuccessCallback, errorHandler, errorHandler, params);
		}
	}

	function getGraphicsSuccessCallback(response, params) {
		//if no response data is returned then stop loader and append a no entries found to the selected tab
		retrievedGrpahicsFacades = [];
		if (response.code === 404) {
			hideGroupSpinner();
			hideTempSpinner();
			var templatesTab = GetGraphicItemsTemplatesArea();
			var imagesTab = GetGraphicItemsImagesArea();
			var iconsTab = GetGraphicItemsIconsArea();
			var textTab = GetGraphicItemsTextArea();

			var noRecordsSpan = '<span class="no-items-found-lbl">no items found</span>';
			if (params && params.selectedCategory) {
				switch (params.selectedCategory) {
					case graphicCategories.Templates:
						{

							ClearGraphicItemsTemplatesArea();
							HideGraphicItemsIconsArea();
							HideGraphicItemsImagesArea();
							HideGraphicItemsTextArea();
							ShowGraphicItemsTemplatesArea();
							templatesTab.append(noRecordsSpan);
							break;
						}
					case graphicCategories.Graphics:
						{
							ClearGraphicItemsImagesArea();
							ShowGraphicItemsImagesArea();
							HideGraphicItemsIconsArea();
							HideGraphicItemsTemplatesArea();
							HideGraphicItemsTextArea();
							imagesTab.append(noRecordsSpan);
							break;
						}
					case graphicCategories.Icons:
						{
							ClearGraphicItemsIconsArea();
							HideGraphicItemsImagesArea();
							ShowGraphicItemsIconsArea();
							HideGraphicItemsTemplatesArea();
							HideGraphicItemsTextArea();
							iconsTab.append(noRecordsSpan);
							break;
						}
					case graphicCategories.Background:
						{
							ClearGraphicItemsTextArea();
							HideGraphicItemsImagesArea();
							HideGraphicItemsIconsArea();
							HideGraphicItemsTemplatesArea();
							ShowGraphicItemsTextArea();
							textTab.append(noRecordsSpan);
							break;
						}
				}
			} else {
				HideGraphicItemsIconsArea();
				HideGraphicItemsImagesArea();
				HideGraphicItemsTextArea();
				ShowGraphicItemsTemplatesArea();
				templatesTab.append(noRecordsSpan);
			}
			return;
		}

		retrievedGraphicItems = response.data;
		ResetItemsCounter();

		// ***TEMP
		//retrievedGraphicItems = getStaticLocalhostGraphicsResponse();

		for (var k = 0; k < retrievedGraphicItems.length; k++) {
			var facade = {
				Id: retrievedGraphicItems[k].Id,
				Name: retrievedGraphicItems[k].Name,
				Category: retrievedGraphicItems[k].Category,
				Content: retrievedGraphicItems[k].Content,
				PreviewImage: retrievedGraphicItems[k].PreviewImage,
				PreviewImageResult: '',
				ContentResult: ''
			};
			retrievedGrpahicsFacades.push(facade);
		}

		addItems(0, params);
	}

	function addItems(userIndex, params) {

		var imagesTab = GetGraphicItemsImagesArea();
		var iconsTab = GetGraphicItemsIconsArea();
		var templatesTab = GetGraphicItemsTemplatesArea();
		var textTab = GetGraphicItemsTextArea();

		var grItem = retrievedGraphicItems[userIndex];

		xhrRequest = $.ajax({
			type: requestMethod.GET,
			url: grItem.PreviewImage,
			xhrFields: {
				responseType: 'blob'
			},
			success: function (data) {
				var reader = new FileReader();
				reader.readAsDataURL(data);
				reader.onloadend = function () {
					var dataUrl = reader.result;

					updateretrievedGrpahicsFacades(grItem.Id, dataUrl);

					if (grItem.Category === graphicCategories.Templates && counterTemplates % 2 === 0) {
						rowDivTemplates = $('<div>');
						rowDivTemplates.addClass('row');
						templatesTab.append(rowDivTemplates);
					} else if (grItem.Category === graphicCategories.Graphics && counterGraphics % 2 === 0) {
						rowDivGraphics = $('<div>');
						rowDivGraphics.addClass('row');
						imagesTab.append(rowDivGraphics);
					} else if (grItem.Category === graphicCategories.Icons && counterIcons % 4 === 0) {
						rowDivIcons = $('<div>');
						rowDivIcons.addClass('row');
						iconsTab.append(rowDivIcons);
					} else if (grItem.Category === graphicCategories.Background && counterBackground % 2 === 0) {
						rowDivBackground = $('<div>');
						rowDivBackground.addClass('row');
						textTab.append(rowDivBackground);

					}

					var rowCol = $('<div class="over-img"  id= "' + grItem.Id + '">');
					var imageImg = new Image();
					imageImg.title = grItem.Name;
					imageImg.alt = grItem.Name;

					if (grItem.Category !== graphicCategories.Icons) {
						imageImg.classList.add('grItem');
					} else {
						imageImg.classList.add('grItemIcons');
					}

					imageImg.classList.add('clickToInsert');
					imageImg.src = dataUrl;
					rowCol.append(imageImg);

					if (grItem.Category === graphicCategories.Templates) {
						counterTemplates++;
						rowDivTemplates.append(rowCol);
					} else if (grItem.Category === graphicCategories.Graphics) {
						counterGraphics++;
						rowDivGraphics.append(rowCol);
					} else if (grItem.Category === graphicCategories.Icons) {
						counterIcons++;
						rowDivIcons.append(rowCol);
					} else if (grItem.Category === graphicCategories.Background) {
						counterBackground++;
						rowDivBackground.append(rowCol);
					}

					if (retrievedGraphicItems.length === userIndex + 1) {
						finalizeItems(params);
					} else {
						addItems(++userIndex, params);
					}
				};
			},
			error: function (data) {
				console.log("runRequests Error", "user", arguments);
				hideGroupSpinner();
				hideTempSpinner();
			}
		});
	}

	function finalizeItems(params) {
		$('.clickToInsert').hover(function () {
			var grId = +$(this).closest("div").attr("Id");
			var selectedGr = getGraphicItem(grId);

			var label = $('#itemLabel');
			label.text(selectedGr.Name);
		});

		$('.clickToInsert').on('mouseout', function () {
			var label = $('#itemLabel');
			label.text("");
		});

		$('.clickToInsert').click(function () {

			var grId = +$(this).closest("div").attr("Id");
			var selectedGr = getFacadeItem(grId);

			var coercionTypeOfItem = '';
			switch (selectedGr.Category) {
				case graphicCategories.Background:   // If it is an image then PreviewImage has already been fetched and encoded so we can add it immediatly
					{
						coercionTypeOfItem = Office.CoercionType.Image;
						var parts = selectedGr.PreviewImageResult.split(",");
						var grContent = parts.length > 1 ? parts[1] : parts[0];
						Office.context.document.setSelectedDataAsync(grContent, { coercionType: coercionTypeOfItem },
							function (asyncResult) {
								if (asyncResult.status === "failed") {
									showNotification("Error", "Failed to insert selected text. " + asyncResult.error.message);
								}
							});
						break;
					}
				case graphicCategories.Icons:
				case graphicCategories.Graphics:
					{
						coercionTypeOfItem = Office.CoercionType.XmlSvg;
						$.ajax({
							type: requestMethod.GET,
							url: selectedGr.Content,
							success: function (data) {
								var grContent = new XMLSerializer().serializeToString(data.documentElement);
								Office.context.document.setSelectedDataAsync(grContent, { coercionType: coercionTypeOfItem },
									function (asyncResult) {
										if (asyncResult.status === "failed") {
											showNotification("Error", "Failed to insert selected text. " + asyncResult.error.message);
										}
									});
							},
							error: function (data) {
								console.log("runRequests Error", "user", arguments);
								hideGroupSpinner();
								hideTempSpinner();
							}
						});
						break;
					}
				case graphicCategories.Templates:
					{
						coercionTypeOfItem = "pptmplt";
						$.ajax({
							type: requestMethod.GET,
							url: selectedGr.Content,
							xhrFields: {
								responseType: 'blob'
							},
							success: function (data) {
								var reader = new FileReader();
								reader.readAsDataURL(data);
								reader.onloadend = function () {
									var dataUrl = reader.result;
									if (dataUrl.indexOf("base64,") > 0) {
										var startIndex = dataUrl.indexOf("base64,");
										var copyBase64 = dataUrl.substr(startIndex + 7);
										PowerPoint.createPresentation(copyBase64);
									} else {
										PowerPoint.createPresentation(dataUrl);
									}
								};
							},
							error: function (data) {
								console.log("runRequests Error", "user", arguments);
								hideGroupSpinner();
								hideTempSpinner();
							}
						});
					}

					break;
				default:
					coercionTypeOfItem = Office.CoercionType.Image;
			}
		});

		hideGroupSpinner();
		if (params && params.selectedCategory) {
			switch (params.selectedCategory) {
				case graphicCategories.Templates:
					{
						HideGraphicItemsIconsArea();
						HideGraphicItemsImagesArea();
						HideGraphicItemsTextArea();
						ShowGraphicItemsTemplatesArea();
						break;
					}
				case graphicCategories.Graphics:
					{
						ShowGraphicItemsImagesArea();
						HideGraphicItemsIconsArea();
						HideGraphicItemsTemplatesArea();
						HideGraphicItemsTextArea();
						break;
					}
				case graphicCategories.Icons:
					{
						HideGraphicItemsImagesArea();
						ShowGraphicItemsIconsArea();
						HideGraphicItemsTemplatesArea();
						HideGraphicItemsTextArea();
						break;
					}
				case graphicCategories.Background:
					{
						HideGraphicItemsImagesArea();
						HideGraphicItemsIconsArea();
						HideGraphicItemsTemplatesArea();
						ShowGraphicItemsTextArea();
						break;
					}
				default:
					{
						HideGraphicItemsIconsArea();
						HideGraphicItemsTemplatesArea();
						HideGraphicItemsTextArea();
						ShowGraphicItemsTemplatesArea();
						break;
					}
			}
		} else {
			HideGraphicItemsIconsArea();
			HideGraphicItemsTemplatesArea();
			HideGraphicItemsTextArea();
			ShowGraphicItemsTemplatesArea();
		}

		// ***TEMP
		//paginate(response);
		//currentPage = response.CurrentPage;
	}

	//  ###  A - LOG IN AREA  ###
	function validateLogInAction() {
		var email = GetLoginEmail();
		var password = GetLoginPassword();

		if (!email.trim().length > 0 || !password.trim().length > 0) {
			showNotification("Warning", 'Email address and password are required');
			return false;
		}

		if (!validateEmail(email)) {
			showNotification("Warning", 'Please enter a valid email address');
			return false;
		}

		return true;
	}

	function logInUser() {
		var type = requestMethod.POST;
		var url = ppGraphicsInjectorConfigurationData.baseUrl + ppGraphicsInjectorConfigurationData.logInUrl;
		var data = {
			email: GetLoginEmail(),
			password: GetLoginPassword()
		};
		var contentType = requestContentType.JSON;
		var dataType = '';
		CallWS(type, url, contentType, dataType, JSON.stringify(data), logInUserSuccessCallback, logInUserErrorCallback, logInUserErrorCallback, null);
	}

	function logInUserSuccessCallback(response) {
		if (response.data.IsSuccess) {
			hideTempSpinner();
			hideLogInArea();
			hideHeaderAreaMainLogo();
			showHeaderAreaMainAlt();
			isUserLoggedIn = true;
			showMainAreaGraphicsContainer();
			populateGraphicItemsArea(graphicCategories.Templates, nextPreviousPage.None);

		} else {
			isUserLoggedIn = false;
			showLogInArea();
			hideMainAreaGraphicsContainer();
			hideHeaderAreaMainAlt();
			showHeaderAreaMainLogo();
			hideTempSpinner();
			showNotification("Information", response.message);
		}
	}

	function logInUserErrorCallback(response) {
		showLogInArea();
		console.log(response);
		showNotification("Error", 'Log in process failed');
		hideGroupSpinner();
	}

	//  ###  B - HELPERS  ###
	function getGraphicItem(id) {
		var item = null;
		for (var k = 0; k < retrievedGraphicItems.length; k++) {
			if (retrievedGraphicItems[k].Id === id) {
				item = retrievedGraphicItems[k];
				break;
			}
		}
		return item;
	}

	function getFacadeItem(id) {
		var item = null;
		for (var k = 0; k < retrievedGrpahicsFacades.length; k++) {
			if (retrievedGrpahicsFacades[k].Id === id) {
				item = retrievedGrpahicsFacades[k];
				break;
			}
		}
		return item;
	}
	function updateretrievedGrpahicsFacades(id, result) {
		for (var k = 0; k < retrievedGrpahicsFacades.length; k++) {
			if (retrievedGrpahicsFacades[k].Id === id) {
				retrievedGrpahicsFacades[k].PreviewImageResult = result;
				break;
			}
		}
	}
	function validateConfiguration() {
		if (ppGraphicsInjectorConfigurationData.pageSize)
			localStorage.setItem('pageSize', ppGraphicsInjectorConfigurationData.pageSize);
		else
			localStorage.setItem('pageSize', 8);

		if (!ppGraphicsInjectorConfigurationData.logInUrl || !ppGraphicsInjectorConfigurationData.logInUrl.length > 0)
			showNotification("Warning", "Configuration Missing: Please submit a valid Log in Url to configuration file");

		if (!ppGraphicsInjectorConfigurationData.getGraphicsUrl || !ppGraphicsInjectorConfigurationData.getGraphicsUrl.length > 0)
			showNotification("Warning","Configuration Missing: Please submit a valid Get Graphics Url to configuration file");
	}
	function paginate(response) {
		$('#previous-page').prop('disabled', false);
		$('#next-page').prop('disabled', false);
		$('#first-page').prop('disabled', false);
		$('#last-page').prop('disabled', false);
		if (response.DisableLast) $('#last-page').prop('disabled', true);
		if (response.DisableNext) $('#next-page').prop('disabled', true);
		if (response.DisablePrevious) $('#previous-page').prop('disabled', true);
		if (response.DisableFirst) $('#first-page').prop('disabled', true);
		$('#page-count').text(response.CurrentPage + '/' + response.TotalPages);
		//TODO add  1/2  label
	}

	function CallWS(type, url, contentType, dataType, data, successCallBack, errorCallback, failureCallback, params) {
		$.ajax({
			type: type,
			url: url,
			contentType: contentType,
			dataType: dataType,
			data: data,
			success: function (response) {
				if (successCallBack) successCallBack(response, params);

			},
			failure: function (response) {
				if (failureCallback) failureCallback(response.Message);
				hideGroupSpinner();
				hideTempSpinner();
				//errorHandler(response.ErrorMessage);
			},
			error: function (response) {
				if (errorCallback) errorCallback(response.Message);
				hideGroupSpinner();
				hideTempSpinner();
				//errorHandler(response.ErrorMessage);
			}
		});
	}
	function errorHandler(error) {
		// $$(Always be sure to catch any accumulated errors that bubble up from the Word.run execution., $loc_script_taskpane_home_js_comment35$)$$
		showNotification("Error:", error);
		console.log("Error: " + error);
		if (error instanceof OfficeExtension.Error) {
			console.log("Debug info: " + JSON.stringify(error.debugInfo));
		}
	}
	function showNotification(header, content) {
		//$("#notification-header").text(header);
		//$("#notification-body").text(content);
		//messageBanner.showBanner();
		//messageBanner.toggleExpansion();
		$('.modal-title').text(header);
		$('.modal-content-text').text(content);
		$("#myModal").modal("toggle");
		if (header === "Warning") {
			$('.modal-header').addClass('modal-body-warning');
		} else if (header === "Error") {
			$('.modal-header').addClass('modal-body-error');
		} else {
			$('.modal-header').addClass('modal-body-info');
		}
	}

	function ResetItemsCounter() {
		counterTemplates = 0;
		counterIcons = 0;
		counterGraphics = 0;
		counterBackground = 0;
	}
})();
