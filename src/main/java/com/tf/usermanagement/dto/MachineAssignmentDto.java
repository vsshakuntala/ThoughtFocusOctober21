package com.tf.usermanagement.dto;

import java.io.Serializable;

public class MachineAssignmentDto implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String catalog_id;
	private String model;
	private String catalog_reference;
	private String customer_name;
	private String status;
	private String group_name;
	private String catalog_name;
	
	
	/**
	 * @return the catalog_id
	 */
	public String getCatalog_id() {
	    return catalog_id;
	}
	/**
	 * @param catalog_id the catalog_id to set
	 */
	public void setCatalog_id(String catalog_id) {
	    this.catalog_id = catalog_id;
	}
	public String getModel() {
		return model;
	}
	public void setModel(String model) {
		this.model = model;
	}
	public String getCatalog_reference() {
		return catalog_reference;
	}
	public void setCatalog_reference(String catalog_reference) {
		this.catalog_reference = catalog_reference;
	}
	public String getCustomer_name() {
		return customer_name;
	}
	public void setCustomer_name(String customer_name) {
		this.customer_name = customer_name;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getGroup_name() {
		return group_name;
	}
	public void setGroup_name(String group_name) {
		this.group_name = group_name;
	}
	
	public String getCatalog_name() {
		return catalog_name;
	}
	public void setCatalog_name(String catalog_name) {
		this.catalog_name = catalog_name;
	}
	@Override
	public String toString() {
		return "MachineAssignmentDto [catalog_id=" + catalog_id + ", model=" + model + ", catalog_reference="
				+ catalog_reference + ", customer_name=" + customer_name + ", status=" + status + ", group_name="
				+ group_name + ", catalog_name=" + catalog_name + "]";
	}
	
	
}
