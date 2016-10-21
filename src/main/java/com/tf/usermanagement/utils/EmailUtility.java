package com.tf.usermanagement.utils;

import java.io.UnsupportedEncodingException;
import java.security.SecureRandom;
import java.util.Date;
import java.util.Properties;

import javax.annotation.Resource;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

/**
 * 
 * @author abhilash
 *
 *
 */
@Service
public class EmailUtility {

	private static final Logger LOGGER = Logger.getLogger(EmailUtility.class);

	@Resource
	private Environment environment;

	private static final String HOST = "host";
	private static final String HOST_NAME = "hostname";
	private static final String PORT = "port";
	private static final String PORT_NUMBER = "portnumber";
	private static final String STARTTLS = "starttls";
	private static final String SMTPAUTH = "smtpauth";
	private static final String ENABLE = "enable";

	private static final String FROMEMAIL = "email.from.emailid";
	private static final String FROMUSERPASSWORD = "email.from.emailid.password";
	private static final String SUBJECT = "Registarion Details from Thought Focus";

	private static final String RESETPASSWORDSUBJECT = "Reset Password From Thought Focus!";

	public void sendMail(Email email) {
		LOGGER.info("Inside send email ");
		Properties props = new Properties();
		/*props.put(environment.getProperty(STARTTLS), environment.getProperty(ENABLE));
		props.put(environment.getProperty(HOST), environment.getProperty(HOST_NAME));
		props.put(environment.getProperty(SMTPAUTH), environment.getProperty(ENABLE));
		props.put(environment.getProperty(PORT), environment.getProperty(PORT_NUMBER));
		props.put("mail.debug", "true");
		props.put("mail.smtp.ssl.enable", "true");
		LOGGER.info("Properties " + props.toString());
		Authenticator auth = new Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(environment.getProperty(FROMEMAIL),
						environment.getProperty(FROMUSERPASSWORD));
			}
		};
		Session session = Session.getInstance(props, auth);*/
		
		//Mail properties for No-Reply
		//Properties props = new Properties();
		props.put(
				"mail.smtp.auth",
				StringUtils.isBlank(environment
						.getProperty("email.smtp.auth")) ? false : Boolean
						.parseBoolean(environment
								.getProperty("email.smtp.auth")));
		props.put(
				"mail.smtp.starttls.enable",
				StringUtils.isBlank(environment
						.getProperty("email.mailStarttlsEnabled")) ? false
						: Boolean.parseBoolean(environment
								.getProperty("email.mailStarttlsEnabled")));
		props.put("mail.smtp.host",environment.getProperty("email.host"));
		props.put("mail.smtp.port",environment.getProperty("email.port"));
		
		props.put("mail.smtp.connectiontimeout", 10*1000);
		//props.put("mail.smtp.timeout", 10*1000);
		
		/*props.put("mail.smtp.socketFactory.port","465");
		props.put("mail.smtp.socketFactory.class","javax.net.ssl.SSLSocketFactory");
		props.put("mail.smtp.socketFactory.fallback","false");*/
		  
		
		Boolean mailStarttlsEnabled = StringUtils.isBlank(environment
				.getProperty("email.mailStarttlsEnabled")) ? false
				: Boolean.parseBoolean(environment
						.getProperty("email.mailStarttlsEnabled"));
		Boolean authIsEnabled = StringUtils.isBlank(environment
				.getProperty("email.smtp.auth")) ? false
				: Boolean.parseBoolean(environment
						.getProperty("email.smtp.auth"));
				
				
		Session session = null;
		if (mailStarttlsEnabled && authIsEnabled) {
			session = Session.getInstance(props,
					new javax.mail.Authenticator() {
						protected PasswordAuthentication getPasswordAuthentication() {
							return new PasswordAuthentication(environment.getProperty(FROMEMAIL),environment.getProperty(FROMUSERPASSWORD));
						}
					});
		} else {
			LOGGER.debug("Setting local session..");
			session=Session.getDefaultInstance(props);
		}
		sendEmail(session, email);
	}

	private void sendEmail(Session session, Email email) {
		try {
			MimeMessage msg = new MimeMessage(session);
			msg.addHeader("Content-type", "text/HTML; charset=UTF-8");
			msg.addHeader("format", "flowed");
			msg.addHeader("Content-Transfer-Encoding", "8bit");
			msg.setSubject(email.getEmailSubject());
			msg.setFrom(new InternetAddress(environment.getProperty(FROMEMAIL), environment.getProperty(FROMEMAIL)));
			msg.setContent(email.getMessage(), "text/html");
			msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email.getToAddress(), false));
			msg.setSentDate(new Date());
			Transport.send(msg);
		} catch (AddressException e) {
			LOGGER.error("AddressException in sendEmail " , e);
		} catch (UnsupportedEncodingException e) {
			LOGGER.error("UnsupportedEncodingException in sendEmail " , e);
		} catch (MessagingException e) {
			LOGGER.error("MessagingException in sendEmail " , e);
		}
	}
	

	/**
	 * 
	 * @param session
	 * @param email
	 * 
	 *            This method is used to send mail of user password on
	 *            successful of registration.
	 */

	public void sendMailToUser(String userEmail, String userPassword) {
		try {
			Email email = new Email();
			email.setToAddress(userEmail);
			email.setEmailSubject(environment.getProperty("registration.successsubject"));

			email.setMessage(environment.getProperty("registration.successmsg")+ " <br> " + " UserEmail : " + userEmail + "<br>" + "UserPassword : " + userPassword);

			sendMail(email);
		} catch (Exception e) {
			LOGGER.error("Exotpception in sendMailToUser " , e);
		}
	}

	/**
	 * 
	 * @param session
	 * @param email
	 * 
	 *            This method is used to send mail of user password on
	 *            successful of registration.
	 */

	public void sendMailToUserForApprovedDivision(String userEmail, String approvedDivision) {
		try {
			Email email = new Email();
			email.setToAddress(userEmail);
			email.setEmailSubject(environment.getProperty("approvedivision.successsubject"));

			email.setMessage(environment.getProperty("approvedivision.successmsg")+ " <br> "+ " Division Name : " +approvedDivision);

			sendMail(email);
		} catch (Exception e) {
			LOGGER.error("Exotpception in sendMailToUser while approving division" , e);
		}
	}

	
	/**
	 * 
	 * @param userEmail
	 *            This method is used to send OTP to the user's registered mail
	 *            id.
	 */
	public void sendRestPasswordToUser(String userEmail,String password) {

		try {
			//String otp = genrateOtp();
			Email email = new Email();
			email.setToAddress(userEmail);
			email.setEmailSubject(environment.getProperty("resetpassword.successsubject"));

			email.setMessage(environment.getProperty("resetpassword.successmsg") + " <br> " + "  : " + password);

			sendMail(email);
		} catch (Exception e) {
			LOGGER.error("Exception in sendMailToUser " , e);
		}

	}

	static final String val = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	static SecureRandom rnd = new SecureRandom();

	public String genrateOtp() {
		int passwordLength = 8;
		StringBuilder sb = new StringBuilder(passwordLength);
		for (int i = 0; i < passwordLength; i++)
			sb.append(val.charAt(rnd.nextInt(val.length())));
		return sb.toString();
	}

}
