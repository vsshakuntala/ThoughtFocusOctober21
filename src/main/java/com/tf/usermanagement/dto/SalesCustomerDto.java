package com.tf.usermanagement.dto;

/**
 * @author Biswajit
 */

public class SalesCustomerDto {

	private Long customerId;
	private String customerName;
	private String customerReference;

	public Long getCustomerId() {
		return customerId;
	}

	public String getCustomerReference() {
		return customerReference;
	}

	public void setCustomerReference(String customerReference) {
		this.customerReference = customerReference;
	}

	public void setCustomerId(Long customerId) {
		this.customerId = customerId;
	}

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	@Override
	public String toString() {
		return "SalesCustomerDto [customerId=" + customerId + ", customerName=" + customerName + ", customerReference="
				+ customerReference + "]";
	}

	

}
