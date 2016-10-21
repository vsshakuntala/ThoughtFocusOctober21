package com.tf.usermanagement.dto;

import java.util.Date;
import java.util.List;

public class AssignOrgDto {
	private long userId;
	private long modifiedById;
	private Date modifiedDate;
	private boolean addUserToOrg;
	private List<AssignOrgMapDto> organizationIds;
	private String note;
	private String userEmail;
	private String userName;
	private String organizationName;
	
	
	/**
	 * @return the userEmail
	 */
	public String getUserEmail() {
	    return userEmail;
	}
	/**
	 * @param userEmail the userEmail to set
	 */
	public void setUserEmail(String userEmail) {
	    this.userEmail = userEmail;
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
	public long getUserId() {
		return userId;
	}
	public void setUserId(long userId) {
		this.userId = userId;
	}
	public long getModifiedById() {
		return modifiedById;
	}
	public void setModifiedById(long modifiedById) {
		this.modifiedById = modifiedById;
	}
	public Date getModifiedDate() {
		return modifiedDate;
	}
	public void setModifiedDate(Date modifiedDate) {
		this.modifiedDate = modifiedDate;
	}
	public boolean isAddUserToOrg() {
		return addUserToOrg;
	}
	public void setAddUserToOrg(boolean addUserToOrg) {
		this.addUserToOrg = addUserToOrg;
	}
	public List<AssignOrgMapDto> getOrganizationIds() {
		return organizationIds;
	}
	public void setOrganizationIds(List<AssignOrgMapDto> organizationIds) {
		this.organizationIds = organizationIds;
	}
	
	public String getNote() {
		return note;
	}
	public void setNote(String note) {
		this.note = note;
	}
	
	public String getOrganizationName() {
	    return organizationName;
	}
	public void setOrganizationName(String organizationName) {
	    this.organizationName = organizationName;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
	    StringBuilder builder = new StringBuilder();
	    builder.append("AssignOrgDto [userId=");
	    builder.append(userId);
	    builder.append(", modifiedById=");
	    builder.append(modifiedById);
	    builder.append(", modifiedDate=");
	    builder.append(modifiedDate);
	    builder.append(", addUserToOrg=");
	    builder.append(addUserToOrg);
	    builder.append(", organizationIds=");
	    builder.append(organizationIds);
	    builder.append(", note=");
	    builder.append(note);
	    builder.append(", userEmail=");
	    builder.append(userEmail);
	    builder.append(", userName=");
	    builder.append(userName);
	    builder.append(", organizationName=");
	    builder.append(organizationName);
	    builder.append("]");
	    return builder.toString();
	}
	

}
