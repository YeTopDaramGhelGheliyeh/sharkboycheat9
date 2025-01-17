function Ask(ConfirmMessage,URL){
	if(confirm(ConfirmMessage))
		window.location = URL;
	return false;
}

function toggleRB(){
	try
	{
		if($("rightMenu").visible()) {
			$("contentContainer").removeClassName("contentContainer");
			$("contentContainer").addClassName("contentContainerFull");
			setCookie("rightBlock","hidden");
		}
		else {
			$("contentContainer").removeClassName("contentContainerFull");
			$("contentContainer").addClassName("contentContainer");
			setCookie("rightBlock","visible");
		}
		$("rightMenu").toggle();
	} catch (ex){}
}

function toggleNLRB(){
	try
	{
		if($("rightMenu").visible()) {
			$("centerContainer").removeClassName("nl2-center-normal");
			$("centerContainer").addClassName("nl2-center-rightfull");
			setCookie("rightBlock","hidden");
		}
		else {
			$("centerContainer").removeClassName("nl2-center-rightfull");
			$("centerContainer").addClassName("nl2-center-normal");
			setCookie("rightBlock","visible");
		}
		$("rightMenu").toggle();
	} catch (ex){}
}

function toggleMenu(MenuName){
	if(($(MenuName)||null) == null) return;
	if($(MenuName).visible()) {
		setCookie(MenuName,0);
		$(MenuName).hide();
	}  else {
		setCookie(MenuName,1);
		$(MenuName).show();
	}
}
function _GET( name )
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}
function openPDFDialog(URL,Params)
{
	iWidth = 950;
	iHeight = 500;
	if((Params.ResizeTo || null) != null)
	{
		if((Params.ResizeTo.Width || null) != null) iWidth = (Params.ResizeTo.Width - 10);
		if((Params.ResizeTo.Height || null) != null) iHeight = (Params.ResizeTo.Height - 40);
	}
	else
	{
		Params.ResizeTo = {'Width':(iWidth + 10), 'Height': (iHeight + 40)};
	}
	if((Params.Title || null) == null) Params.Title = "File Preview";
	if((Params.Extension || null) == null) Params.Extension = "pdf";

	Params.URL = '';
	if(Params.Extension == 'jpeg' || Params.Extension == 'jpg' || Params.Extension == 'gif' || Params.Extension == 'png')
	{
		Params.Scroll = "Always";
		Params.HTML = '<img style="min-width:100px;max-width:950px;" src="' + URL + '">';
	}
	else
		Params.HTML = '<iframe style="width:100%;height:100%;" frameborder="0" src="/cdn/ubis/Javascripts/PdfViewer/web/viewer.html?file=' + encodeURIComponent(URL) + '"></iframe>';
	openModalDialog('',Params);
}

var isWorkingModalDialog = false;
var disableDialogClose = false;
var isModalFullScreen = false;
var modalOrigins = {'Width':600,'Height':250};
function fullScreenModalDialog()
{
	if(isModalFullScreen)
	{
		isModalFullScreen = false;
		$('ModalDialogBoxContainer').style.width = modalOrigins.Width + 'px';
		$('ModalDialogBoxContainer').style.height = modalOrigins.Height + 'px';
		$('ModalDialogBox').style.height = (modalOrigins.Height - 40) + 'px';
		replaceDialogBox();
	}
	else
	{
		isModalFullScreen = true;
		var dimensions = $("BlackBack").getDimensions();
		$('ModalDialogBoxContainer').style.width = dimensions.width + 'px';
		$('ModalDialogBoxContainer').style.height = dimensions.height + 'px';
		$('ModalDialogBox').style.height = (dimensions.height - 40) + 'px';
		$("ModalDialogBoxContainer").style.left = "0px";
		$("ModalDialogBoxContainer").style.top = "0px";
	}
}
function closeModalDialog(){
	if (disableDialogClose) return;
	$('BlackBack').hide();
	$("ModalDialogBoxContainer").hide();
	$('ModalDialogBox').removeClassName('scroll_always');
}
function replaceDialogBox(){
	var dimensions = $("BlackBack").getDimensions();
	var boxdims = $("ModalDialogBoxContainer").getDimensions();
	$("ModalDialogBoxContainer").style.left = ((dimensions.width - boxdims.width)/2) + "px";
	$("ModalDialogBoxContainer").style.top = ((dimensions.height - boxdims.height)/2 -30 ) + "px";
}
function openModalDialog(URL, Params){
	isModalFullScreen = false;
	$('ModalDialogBox').removeClassName('scroll_always');
	$('BlackBack').show();
	$("ModalDialogBoxTitle").innerHTML = "";
	$("ModalDialogBox").innerHTML = $('modalLoadingDiv').innerHTML;
	$("ModalDialogBoxContainer").show();

	modalOrigins.Width = 600;
	modalOrigins.Height = 250;
	$('ModalDialogBoxContainer').style.width = '600px';
	$('ModalDialogBoxContainer').style.height = '250px';
	$('ModalDialogBox').style.height = '210px';

	if((Params.disableDialogClose || null) == true)
		disableDialogClose = true;
	else
		disableDialogClose = false;


	replaceDialogBox();
	isWorkingModalDialog = true;
	if (URL == '') {
		isWorkingModalDialog = false;
		$('ModalDialogBoxTitle').innerHTML = (Params.Title);
		$('ModalDialogBox').innerHTML = Params.HTML;
		if((Params.Scroll || null) == 'Always')
			$('ModalDialogBox').addClassName('scroll_always');
		if((Params.ResizeTo || null) != null)
		{
			try {
				if((Params.ResizeTo.Width || null) != null)
				{
					$('ModalDialogBoxContainer').style.width = Params.ResizeTo.Width+'px';
					modalOrigins.Width = Params.ResizeTo.Width;
				}
				if((Params.ResizeTo.Height || null) != null) {
					$('ModalDialogBoxContainer').style.height = Params.ResizeTo.Height+'px';
					$('ModalDialogBox').style.height = (Params.ResizeTo.Height-40)+'px';
					modalOrigins.Height = Params.ResizeTo.Height;
				}
				replaceDialogBox();
			} catch(e) {}
		}
		return true;
	}
	new Ajax.Request( URL, {
			parameters: (Params||{}),
			onSuccess: function(transport) {
				response = transport.responseText.evalJSON();
				if(response.Status != 'OK'){
					closeModalDialog();
					isWorkingModalDialog = false;
					return;
				} else {
					if((response.Scroll || null) == 'Always')
						$('ModalDialogBox').addClassName('scroll_always');
					isWorkingModalDialog = false;
					$('ModalDialogBoxTitle').innerHTML = (response.Title||"");
					$('ModalDialogBox').innerHTML = response.Data;
					if((response.ResizeTo || null) != null)
					{
						try {
							if((response.ResizeTo.Width || null) != null)
							{
								$('ModalDialogBoxContainer').style.width = response.ResizeTo.Width+'px';
								modalOrigins.Width = response.ResizeTo.Width;
							}
							if((response.ResizeTo.Height || null) != null) {
								$('ModalDialogBoxContainer').style.height = response.ResizeTo.Height+'px';
								$('ModalDialogBox').style.height = (response.ResizeTo.Height-40)+'px';
								modalOrigins.Height = response.ResizeTo.Height;
							}
							replaceDialogBox();
						} catch(e) {}
					}
				}
			},
			onFailure: function(response) {
				closeModalDialog();
				isWorkingModalDialog = false;
				return;
			}
		});
	return false;
}


function setFeedBack(Params){
	new Ajax.Request( '/?Pointer=Core&Page=FeedBack&SubPage=AjaxSetFeedBack', {
			parameters: (Params||{}),
			onSuccess: function(transport) {
				response = transport.responseText.evalJSON();
				if(response.Status != 'OK'){
					alert(response.Message);
					return;
				} else {
					alert(replaceAll("[:NL:]","\n",response.Message));
					closeModalDialog();
				}
			},
			onFailure: function(response) {
				closeModalDialog();
				return;
			}
		});
	return false;
}
function SetCookie(name,value,hours)
{
	var expire = "";
	expire = new Date((new Date()).getTime() + hours * 3600000);
	expire = "; expires=" + expire.toGMTString();
	document.cookie = name + "=" + escape(value) + expire;
	return true;
}

function GetCookie(name)
{
	var cookieValue = "";
	var search = name + "=";
	if(document.cookie.length > 0){
		offset = document.cookie.indexOf(search);
			if (offset != -1){
				offset += search.length;
				end = document.cookie.indexOf(";", offset);
				if (end == -1) end = document.cookie.length;
				cookieValue = unescape(document.cookie.substring(offset, end))
			}
	}
	return cookieValue;
}


function buttonLink(URL){
	if(URL.substring(0,3) != 'JS|') {
			window.location = URL;
		return;
	}
	URL = URL.substring(3,URL.length);
	Params = URL.split("|");
	openModalDialog(Params[1],Params[0]);
}

function replaceAll( bul, deg,str ) {
	watchdog = 0;
    while ( str.indexOf( bul ) != -1 ) {
    	watchdog++;
    	if(watchdog > 100) return str;
        str = str.replace( bul, deg );
    }
    return str;
}
function continueSession()
{
	new Ajax.Request( '/?ContinueSession', {
			parameters: {},
			onSuccess: function(transport) {
				//do nothing for now
			},
			onFailure: function(response) {
				//do nothing for now
				return;
			}
		});
	return true;
}
function TRtoUpper(inputField){
	var inputValue = $F(inputField);
	inputValue = inputValue.replace('i','İ');
	inputValue = inputValue.replace('ı','I');
	inputValue = inputValue.replace('ö','Ö');
	inputValue = inputValue.replace('ü','Ü');
	inputValue = inputValue.replace('ğ','Ğ');
	inputValue = inputValue.replace('ş','Ş');
	inputValue = inputValue.replace('ç','Ç');
	$(inputField).setValue( inputValue.toUpperCase() );
}

function number_check(field){
	field.value = field.value.replace( /([^\-0-9\.])/g, '' );
}
function clearCombo(SelectName)
{
	var oldSelect = $(SelectName);
	var newSelect = oldSelect.cloneNode(false);
	oldSelect.parentNode.replaceChild(newSelect, oldSelect);
	return newSelect;
}
function addItem2Combo(selectField, value, text){
	var opt = document.createElement('option');
	opt.text = text;
   	opt.value = value;
   	$(selectField).options.add(opt);
}