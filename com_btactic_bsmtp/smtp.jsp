<%-- 
Document   : SentEmail
Created on : Nov 12, 2014, 11:33:21 AM
Author     : q
--%>

<%@page import="javax.mail.Transport"%>
<%@page import="javax.mail.Message"%>
<%@page import="java.util.Date"%>
<%@page import="javax.mail.internet.InternetAddress"%>
<%@page import="javax.mail.Session"%>
<%@page import="javax.mail.internet.MimeMessage"%>
<%@page import="javax.mail.Authenticator"%>
<%@page import="javax.mail.PasswordAuthentication"%>
<%@page import="java.util.Properties"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
    </head>
<body>

<%
    // Get Post data
    String input_type       = request.getParameter("input_type");
    String response_type    = request.getParameter("response_type");
    String from           = request.getParameter("from");
    String to        = request.getParameter("to");
    String cc 	= request.getParameter("cc");
    String bcc       = request.getParameter("bcc");
    String issue        = request.getParameter("issue");
    String body        = request.getParameter("body");
    String host	= request.getParameter("host");
    String port	= request.getParameter("port");
    String count	= request.getParameter("count");
    String pass	= request.getParameter("pass");
    String mode	= request.getParameter("mode");
    String encoding     = request.getCharacterEncoding();
    if (encoding == null) encoding = "UTF-8";

    final String fromEmail = count;
    final String password = pass;
    final String toEmail = to;
    final String ccEmail = cc;
    final String bccEmail = bcc;
    Properties props = new Properties();

    if(mode.equals("STARTTLS")){
        props.put("mail.smtp.host", host); //SMTP Host
        props.put("mail.smtp.port", port);//TLS Port
        props.put("mail.smtp.auth", "true");//Enabling Authentication
        props.put("mail.smtp.starttls.enable","true");//enable STARTTLS
    }
    if(mode.equals("TLS")){
        props.put("mail.smtp.host", host); //SMTP Host
        props.put("mail.smtp.port", port);//TLS Port
        props.put("mail.smtp.auth", "true");//Enabling Authentication
    }
    if(mode.equals("SSL")){
        props.put("mail.smtp.host", host); //SMTP Host
        props.put("mail.smtp.socketFactory.port", port); //SSL Port
        props.put("mail.smtp.socketFactory.class","javax.net.ssl.SSLSocketFactory"); //SSL Factory Class
        props.put("mail.smtp.auth", "true"); //Enabling SMTP Authentication
        props.put("mail.smtp.port", "port"); //SMTP Port
    }
    if(port.equals("25")){
        props.put("mail.smtp.host",host); //SMTP Host
        props.put("mail.smtp.port", port);
        props.put("mail.smtp.auth", "true");
    }
    Authenticator auth = new Authenticator(){
        // override the getPasswordAuthentication method
        protected PasswordAuthentication getPasswordAuthentication(){
            return new PasswordAuthentication(fromEmail, password);
        }
    };
    Session s = Session.getInstance(props,auth);
    try{ 
        MimeMessage msg = new MimeMessage(s);

        //set message headers
        msg.addHeader("Content-type", "text/HTML; charset=UTF-8");
        msg.addHeader("format", "flowed");
        msg.addHeader("Content-Transfer-Encoding", "8bit");

        msg.setFrom(new InternetAddress(count, count));
        msg.setSubject(issue, "UTF-8");
        msg.setText(body, "UTF-8");
        msg.setSentDate(new Date());
        msg.addRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
        msg.addRecipients(Message.RecipientType.TO, InternetAddress.parse(ccEmail));
        msg.addRecipients(Message.RecipientType.TO, InternetAddress.parse(bccEmail));
        Transport.send(msg);  
    }catch (Exception e) {
        response.sendError(500);
    }

%>
</body>
</html>
