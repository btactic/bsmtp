/****************************************************************************
 **
 ** Copyright (C) 2011 Irontec SL. All rights reserved.
 **
 ** This file may be used under the terms of the GNU General Public
 ** License version 3.0 as published by the Free Software Foundation
 ** and appearing in the file LICENSE.GPL included in the packaging of
 ** this file.  Please review the following information to ensure GNU
 ** General Public Licensing requirements will be met:
 **
 ** This file is provided AS IS with NO WARRANTY OF ANY KIND, INCLUDING THE
 ** WARRANTY OF DESIGN, MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
 **
 **@Author Quan En Pan & Aleix Ribes Grimaldos
 ****************************************************************************/
 
com_btactic_bsmtp_HandlerObject = function() {};

com_btactic_bsmtp_HandlerObject.prototype = new ZmZimletBase;
com_btactic_bsmtp_HandlerObject.prototype.constructor = com_btactic_bsmtp_HandlerObject;

com_btactic_bsmtp_HandlerObject.prototype.singleClicked = function() {
    this.doubleClicked();
};

com_btactic_bsmtp_HandlerObject.prototype.init = function() {
    if (this._checkUserData() === true) 
        appCtxt.getAppController().setStatusMsg(this.getUserPropertyInfo("encrypt_options").value);
};

com_btactic_bsmtp_HandlerObject.prototype.doubleClicked = function() {

    if (!this.setUserInfoView) {

        //var sDialogTitle = this.getMessage("bSmtp_about"); // Get i18n resource string
        this.setUserInfoView = new DwtComposite(this.getShell()); // Creates an empty div as a child of main shell div
        this.setUserInfoView.setSize("450", "250"); // Set width and height

        var html = [],
            i = 0;
        html[i++] = "<table>";
	html[i++] = "<img src='" + this.getResource("logo_btactic.png") + "' border='0' align='up' /></a>";
        html[i++] = "<tr><td>" + this.getMessage("bSmtp_folder_path") + ":</td><td id='bSmtp_folder_path'></td></tr>";
        html[i++] = "<tr><td>" + this.getMessage("bSmtp_host") + ":</td><td id='bSmtp_host'></td></tr>";
        html[i++] = "<tr><td>" + this.getMessage("bSmtp_port") + ":</td><td id='bSmtp_port'></td></tr>";
        html[i++] = "<tr><td>" + this.getMessage("bSmtp_user") + ":</td><td id='bSmtp_user'></td></tr>";
        html[i++] = "<tr><td>" + this.getMessage("bSmtp_password") + ":</td><td id='bSmtp_password'></td></tr>";
        html[i++] = "<tr><td>" + this.getMessage("bSmtp_encrypt_options") + ":</td><td id='bSmtp_encrypt_options'></td></tr>";
	html[i++] = "<tr><td>" + this.getMessage("bSmtp_about") + "Copyright 2015 BTACTIC, SCCL";
        html[i++] = "<table>";

        this.setUserInfoView.getHtmlElement().innerHTML = html.join("");

        this.selectFolderButtonId = Dwt.getNextId();

        var selectFolderButton = new DwtDialog_ButtonDescriptor(this.selectFolderButtonId, this.getMessage("bSmtp_select_folder"),
            DwtDialog.ALIGN_LEFT, new AjxCallback(this, this._setFolderBtnListener));

        // pass the title, view & buttons information to create dialog box
        this.setUserInfoDialog = new ZmDialog({
            //title: sDialogTitle,
            view: this.setUserInfoView,
            parent: this.getShell(),
            standardButtons: [DwtDialog.CANCEL_BUTTON, DwtDialog.OK_BUTTON],
            extraButtons: [selectFolderButton]
        });
        this.setUserInfoDialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._saveUserInfo));

        var addrs = [];
        addrs.push(new DwtSelectOption(this.getMessage("bSmtp_ssl"), true, this.getMessage("bSmtp_ssl")));
        addrs.push(new DwtSelectOption(this.getMessage("bSmtp_tls"), true, this.getMessage("bSmtp_tls")));
        addrs.push(new DwtSelectOption(this.getMessage("bSmtp_starttls"), true, this.getMessage("bSmtp_starttls")));

        if (this.getMessage("bSmtp_no_encrypt") == "Sin Encriptaci&#243n") {
            addrs.push(new DwtSelectOption("Sin Encriptación", true, "Sin Encriptación"));
        } else {
            addrs.push(new DwtSelectOption(this.getMessage("bSmtp_no_encrypt"), true, this.getMessage("bSmtp_no_encrypt")));
        }


        this.cbAddresses = new DwtSelect({parent: this.setUserInfoDialog,options: addrs});
        this.cbAddresses.getHtmlElement().style.width = '100%';
        var cap = document.getElementById("bSmtp_encrypt_options");
        cap.appendChild(this.cbAddresses.getHtmlElement());

        this.inputFieldFolder = new DwtInputField({parent: this.setUserInfoView,size: 30});
        document.getElementById("bSmtp_folder_path").appendChild(this.inputFieldFolder.getHtmlElement());
        
        this.inputFieldSmtpHost = new DwtInputField({parent: this.setUserInfoView,size: 30});
        document.getElementById("bSmtp_host").appendChild(this.inputFieldSmtpHost.getHtmlElement());
        
        this.inputFieldSmtpPort = new DwtInputField({parent: this.setUserInfoView,size: 30});
        document.getElementById("bSmtp_port").appendChild(this.inputFieldSmtpPort.getHtmlElement());

        this.inputFieldSmtpAccount = new DwtInputField({parent: this.setUserInfoView,size: 30});
        document.getElementById("bSmtp_user").appendChild(this.inputFieldSmtpAccount.getHtmlElement());

        this.inputFieldPassword = new DwtPasswordField({parent: this.setUserInfoView,size: 30});
        document.getElementById("bSmtp_password").appendChild(this.inputFieldPassword.getHtmlElement());

    }


    if (this.getUserPropertyInfo("encrypt_options").value == "Sin Encriptación") {
        this.cbAddresses.removeOptionWithValue("Sin Encriptación");
        this.cbAddresses.addOption(new DwtSelectOption(this.getUserPropertyInfo("encrypt_options").value, true, this.getUserPropertyInfo("encrypt_options").value));
    } else {
        this.cbAddresses.removeOptionWithValue(this.getUserPropertyInfo("encrypt_options").value);
        this.cbAddresses.addOption(new DwtSelectOption(this.getUserPropertyInfo("encrypt_options").value, true, this.getUserPropertyInfo("encrypt_options").value));
    }

    //this.cbAddresses.removeOptionWithValue(this.getUserPropertyInfo("encrypt_options").value);
    //this.cbAddresses.addOption(new DwtSelectOption(this.getUserPropertyInfo("encrypt_options").value, true, this.getUserPropertyInfo("encrypt_options").value)); 
    
    if(this.getUserPropertyInfo("folder_id").value -1 == -1 || this.getUserPropertyInfo("folder_id").value === undefined)
        {this.inputFieldFolder.setValue("");}
   	else
   		{this.inputFieldFolder.setValue(this.getUserPropertyInfo("folder_path").value);}
    
    this.inputFieldSmtpHost.setValue(this.getUserPropertyInfo("host").value);
    this._setPort();
    this.inputFieldSmtpAccount.setValue(this.getUserPropertyInfo("user").value);
    this.inputFieldPassword.setValue(this.getUserPropertyInfo("password").value);
    this.setUserInfoDialog.popup();
    
};

com_btactic_bsmtp_HandlerObject.prototype._setPort = function() {

    if (this.getUserPropertyInfo("encrypt_options").value == this.getMessage("bSmtp_tls") || this.getUserPropertyInfo("encrypt_options").value == this.getMessage("bSmtp_starttls")) {
        this.inputFieldSmtpPort.setValue("587");
    }
    if (this.getUserPropertyInfo("encrypt_options").value == this.getMessage("bSmtp_ssl")) {
        this.inputFieldSmtpPort.setValue("465");
    }
    if (this.getUserPropertyInfo("encrypt_options").value == this.getMessage("bSmtp_no_encrypt") ||
        this.getUserPropertyInfo("encrypt_options").value == "Sin Encriptación") {
        this.inputFieldSmtpPort.setValue("25");
    }
    this.setUserProperty("port", this.inputFieldSmtpPort.getValue());

};

com_btactic_bsmtp_HandlerObject.prototype._saveUserInfo = function() {

	if(this.fid !== undefined)
    	{this.setUserProperty("folder_id", this.fid);alert("here");}
    this.setUserProperty("folder_path", this.inputFieldFolder.getValue());
    this.setUserProperty("host", this.inputFieldSmtpHost.getValue());
    this.setUserProperty("user", this.inputFieldSmtpAccount.getValue());
    this.setUserProperty("password", this.inputFieldPassword.getValue());
    this.setUserProperty("encrypt_options", this.cbAddresses.getSelectedOption().getValue());

    var callback = new AjxCallback(this, null, null);
    this.saveUserProperties(callback);

    this.setUserInfoDialog.popdown();
};

com_btactic_bsmtp_HandlerObject.prototype.initializeToolbar = function(app, toolbar, controller, viewId) {
    this._currentViewId = viewId;
    if (!this._viewIdAndMenuMap) {
        this._viewIdAndMenuMap = [];
    }
    this.viewId = viewId;
    if (viewId.indexOf("COMPOSE") >= 0 || viewId == "APPT") {
        if (toolbar.getOp("EMAIL_SMTP_ZIMLET_TOOLBAR_BUTTON")) {
            return;
        }
        //get the index of View menu so we can display it after that.
        var buttonIndex = 3;

        //create params obj with button details
        var buttonArgs = {
            text: this.getMessage("bSmtp_button_name"),
            tooltip: "Envia el correu a traves d'una conta exterior",
            index: buttonIndex, //position of the button
            image: "zimbraicon" //icon
        };

        //toolbar.createOp api creates the button with some id and  params containing button details.
        var button = toolbar.createOp("EMAIL_SMTP_ZIMLET_TOOLBAR_BUTTON", buttonArgs);
        button.removeAllListeners();
        button.removeDropDownSelectionListener();
        button.addSelectionListener(new AjxListener(this, this._showSelectedMail, controller));
    }
};

com_btactic_bsmtp_HandlerObject.prototype._showSelectedMail = function(controller) {

    controller._composeView.getController().saveDraft(ZmComposeController.DRAFT_TYPE_MANUAL);

    this.msg = controller._composeView.getMsg();
    var mailItem = new ZmMailItem("MSG", controller._composeView.getMsg().id);
    this.subject = " ";
    this.body = " ";
    this.to = " ";
    this.ccemails = " ";
    this.bccemails = " ";
    this.subject = this.msg.subject;
    this.body = this.msg.textBodyContent;
    this.to = this.msg.getAddresses(AjxEmailAddress.TO).toString();
    this.ccemails = this.msg.getAddresses(AjxEmailAddress.CC).toString();
    this.bccemails = this.msg.getAddresses(AjxEmailAddress.BCC).toString();
    this._sendingEmail(controller);
};

com_btactic_bsmtp_HandlerObject.prototype._setFolderBtnListener = function() {

    if (!this._chooseFolderDialog) {
        AjxDispatcher.require("Extras");
        this._chooseFolderDialog = new ZmChooseFolderDialog(appCtxt.getShell());
    }
    this._chooseFolderDialog.reset();
    this._chooseFolderDialog.registerCallback(DwtDialog.OK_BUTTON, this._chooseFolderOkBtnListener, this, this._chooseFolderDialog);

    var params = {
        treeIds: [ZmOrganizer.FOLDER],
        //title:                  this.getMessage("EmailTemplatesZimlet_selectTemplatesFolder"),
        overviewId: this.toString(),
        //description:    this.getMessage("EmailTemplatesZimlet_selectTemplatesFolder"),
        skipReadOnly: false,
        hideNewButton: false,
        appName: ZmApp.MAIL,
        omit: [],
        noRootSelect: true
    };
    this._chooseFolderDialog.popup(params);
};

com_btactic_bsmtp_HandlerObject.prototype._chooseFolderOkBtnListener = function(dlg, folder) {

    dlg.popdown();
    this.fid = folder.id;
    var fp = folder.getPath();
    this.inputFieldFolder.setValue(fp);

    var callback = new AjxCallback(this, null, null);
    this.saveUserProperties(callback);
};

com_btactic_bsmtp_HandlerObject.prototype._prefOKBtnListener = function() {
    if (this.needRefresh) {
        this.setUserProperty("etemplates_sourcefolderPath", this._folderPath);
        var callback = new AjxCallback(this, this._handleSaveProperties, this.needRefresh);
        this.saveUserProperties(callback);
    }
    this.prefDlg.popdown();
};

com_btactic_bsmtp_HandlerObject.prototype._checkUserData = function() {	
    if (this._checkData()) {
        appCtxt.getAppController().setStatusMsg(this.getMessage("bSmtp_miss_data"));
        return false;
    } else if (appCtxt.getFolderTree().getByPath(this.getUserPropertyInfo("folder_path").value, false) == null) {
        alert(this.getMessage("bSmtp_no_folder"));
        return false;
    } else {

        this.smtpHost = this.getUserPropertyInfo("host").value;
        this.smtpPort = this.getUserPropertyInfo("port").value;
        this.userAccount = this.getUserPropertyInfo("user").value;
        this.password = this.getUserPropertyInfo("password").value;
        this.mode = this.getUserPropertyInfo("encrypt_options").value;
    }
    return true;
};

com_btactic_bsmtp_HandlerObject.prototype._checkData = function() {
	
	return ((this.getUserPropertyInfo("host").value == "") || (this.getUserPropertyInfo("port").value == "") || (this.getUserPropertyInfo("user").value == "") || (this.getUserPropertyInfo("password").value == "") || (this.getUserPropertyInfo("folder_path").value == "") || (this.getUserPropertyInfo("folder_id").value -1==-1) || (this.getUserPropertyInfo("folder_id").value==undefined));
	
};

com_btactic_bsmtp_HandlerObject.prototype._sendingEmail = function(controller) {

    if (this._checkUserData() === true) {

        var paramsArray = [
            ["input_type", "JSON"],
            ["response_type", "JSON"],
            ["from", this.from],
            ["to", this.to],
            ["cc", this.ccemails],
            ["bcc", this.bccemails],
            ["issue", this.subject],
            ["body", this.body],
            ["host", this.smtpHost],
            ["port", this.smtpPort],
            ["count", this.userAccount],
            ["pass", this.password],
            ["mode", this.mode]
        ];

        var arr = [];
        for (var i = 0; i < paramsArray.length; i++) {
            arr.push(AjxStringUtil.urlComponentEncode(paramsArray[i][0]) + "=" + AjxStringUtil.urlComponentEncode(paramsArray[i][1]));
        }

        var jspUrl = this.getResource("smtp.jsp");
        var hdrs = [];

        hdrs["Content-type"] = "application/x-www-form-urlencoded";
        var result = AjxRpc.invoke(arr.join("&"), jspUrl, hdrs);
        if ( result.success ) {
            appCtxt.getAppController().setStatusMsg(this.getMessage("bSmtp_msg_sent"));
            this.msg = controller._composeView.getMsg();
            ZmItem.move(this.msg.id, this.getUserPropertyInfo("folder_id").value, null,null);
            appCtxt.getAppController().setStatusMsg(this.getMessage("bSmtp_msg_moved"));
            controller._app.popView();
        }else{
            alert(this.getMessage("bSmtp_msg_failure"));
        }
    }
};
