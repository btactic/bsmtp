# bsmtp

bSmtp is a zimlet for Zimbra Collaboration Suite.

This project aims for integration of sent mails using diferents SMTP server.


## Installing bSmtp
 - Create a folder named com_btactic_bsmtp
 - Download bSmtp source and uncompress into previously created folder
 - Zip the folder com_btactic_bsmtp and deploy using Zimbra Administration interface
 
You can also deploy the zimlet from the server shell 

    $ su - zimbra
    $ zmzimletctl deploy com_btactic_bsmtp.zip
    $ zmmailboxdctl restart
  
## Configuring bSmtp
 There is no global configuration for bSmtp, each user must 
 configure it separately.

 If bSmtp has been correctly deployed, after loggin in zimbra, 
 a new icon should apperar in the left panel. Just click it and 
 a configuration window should appear with the following fields:

 Folder path: the path where the sent email will stored
 Smtp Host: the host of server smtp 
 Smtp Port: the port wich is used to send the email
 User Account: the email address of the user
 Password: password of this account
 Encryption mode: the type of encryption to apply into the email

## Using bSmtp
 There are three ways to access zSugar screen:

 - Configuration menu:
 	Click on the zimlet and a configuration menu will appear, then fill all the fields
 - Using Toolbar Button:
 	Select or create a email and click 'Enviar SMTP' to send the email.


## License

Copyright (C) <2015>  <Aleix Ribes Grimaldos & Quan En Pan>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

