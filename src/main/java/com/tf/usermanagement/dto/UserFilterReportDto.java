package com.tf.usermanagement.dto;

public class UserFilterReportDto {
    
    private String userId;
	private String last_date;
	private String userName;
	private String firstName;
	private String lastName;
	private String email;
	private String active;
	private String createdDate;
	private String phoneNumber;
	private String companyName;
	private String approved;
	private String pending;
        private String countryFlag;
        private String RowNr;
	/**
	 * @return the userId
	 */
	public String getUserId() {
	    return userId;
	}
	/**
	 * @param userId the userId to set
	 */
	public void setUserId(String userId) {
	    this.userId = userId;
	}
	/**
	 * @return the last_date
	 */
	public String getLast_date() {
	    return last_date;
	}
	/**
	 * @param last_date the last_date to set
	 */
	public void setLast_date(String last_date) {
	    this.last_date = last_date;
	}
	/**
	 * @return the userName
	 */
	public String getUserName() {
	    return userName;
	}
	/**
	 * @param userName the userName to set
	 */
	public void setUserName(String userName) {
	    this.userName = userName;
	}
	/**
	 * @return the firstName
	 */
	public String getFirstName() {
	    return firstName;
	}
	/**
	 * @param firstName the firstName to set
	 */
	public void setFirstName(String firstName) {
	    this.firstName = firstName;
	}
	/**
	 * @return the lastName
	 */
	public String getLastName() {
	    return lastName;
	}
	/**
	 * @param lastName the lastName to set
	 */
	public void setLastName(String lastName) {
	    this.lastName = lastName;
	}
	/**
	 * @return the email
	 */
	public String getEmail() {
	    return email;
	}
	/**
	 * @param email the email to set
	 */
	public void setEmail(String email) {
	    this.email = email;
	}
	/**
	 * @return the createdDate
	 */
	public String getCreatedDate() {
	    return createdDate;
	}
	/**
	 * @param createdDate the createdDate to set
	 */
	public void setCreatedDate(String createdDate) {
	    this.createdDate = createdDate;
	}
	/**
	 * @return the phoneNumber
	 */
	public String getPhoneNumber() {
	    return phoneNumber;
	}
	/**
	 * @param phoneNumber the phoneNumber to set
	 */
	public void setPhoneNumber(String phoneNumber) {
	    this.phoneNumber = phoneNumber;
	}
	/**
	 * @return the companyName
	 */
	public String getCompanyName() {
	    return companyName;
	}
	/**
	 * @param companyName the companyName to set
	 */
	public void setCompanyName(String companyName) {
	    this.companyName = companyName;
	}
	/**
	 * @return the approved
	 */
	public String getApproved() {
	    return approved;
	}
	/**
	 * @param approved the approved to set
	 */
	public void setApproved(String approved) {
	    this.approved = approved;
	}
	/**
	 * @return the pending
	 */
	public String getPending() {
	    return pending;
	}
	/**
	 * @param pending the pending to set
	 */
	public void setPending(String pending) {
	    this.pending = pending;
	}
	/**
	 * @return the countryFlag
	 */
	public String getCountryFlag() {
	    return countryFlag;
	}
	/**
	 * @param countryFlag the countryFlag to set
	 */
	public void setCountryFlag(String countryFlag) {
	    this.countryFlag = countryFlag;
	}
	/**
	 * @return the active
	 */
	public String getActive() {
	    return active;
	}
	/**
	 * @param active the active to set
	 */
	public void setActive(String active) {
	    this.active = active;
	}
	/**
	 * @return the rowNr
	 */
	public String getRowNr() {
	    return RowNr;
	}
	/**
	 * @param rowNr the rowNr to set
	 */
	public void setRowNr(String rowNr) {
	    RowNr = rowNr;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
	    StringBuilder builder = new StringBuilder();
	    builder.append("UserFilterReportDto [userId=");
	    builder.append(userId);
	    builder.append(", last_date=");
	    builder.append(last_date);
	    builder.append(", userName=");
	    builder.append(userName);
	    builder.append(", firstName=");
	    builder.append(firstName);
	    builder.append(", lastName=");
	    builder.append(lastName);
	    builder.append(", email=");
	    builder.append(email);
	    builder.append(", createdDate=");
	    builder.append(createdDate);
	    builder.append(", phoneNumber=");
	    builder.append(phoneNumber);
	    builder.append(", companyName=");
	    builder.append(companyName);
	    builder.append(", approved=");
	    builder.append(approved);
	    builder.append(", pending=");
	    builder.append(pending);
	    builder.append(", countryFlag=");
	    builder.append(countryFlag);
	    builder.append(", active=");
	    builder.append(active);
	    builder.append(", RowNr=");
	    builder.append(RowNr);
	    builder.append("]");
	    return builder.toString();
	}
	

}
