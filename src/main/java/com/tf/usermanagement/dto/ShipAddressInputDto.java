package com.tf.usermanagement.dto;

/**
 * @author Biswajit Sahoo
 */

public class ShipAddressInputDto {

	private Long addressId;
	private String addressName;
	private String addressReference;
	private String country;
	private String state;
	private String city;
	private String addressOne;
	private String addressTwo;
	private String zipCode;

	public Long getAddressId() {
		return addressId;
	}

	public void setAddressId(Long addressId) {
		this.addressId = addressId;
	}

	public String getAddressName() {
		return addressName;
	}

	public void setAddressName(String addressName) {
		this.addressName = addressName;
	}

	public String getAddressReference() {
		return addressReference;
	}

	public void setAddressReference(String addressReference) {
		this.addressReference = addressReference;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getAddressOne() {
		return addressOne;
	}

	public void setAddressOne(String addressOne) {
		this.addressOne = addressOne;
	}

	public String getAddressTwo() {
		return addressTwo;
	}

	public void setAddressTwo(String addressTwo) {
		this.addressTwo = addressTwo;
	}

	public String getZipCode() {
		return zipCode;
	}

	public void setZipCode(String zipCode) {
		this.zipCode = zipCode;
	}

	@Override
	public String toString() {
		return "BillAddressInputDto [addressId=" + addressId + ", addressName=" + addressName + ", addressReference="
				+ addressReference + ", country=" + country + ", state=" + state + ", city=" + city + ", addressOne="
				+ addressOne + ", addressTwo=" + addressTwo + ", zipCode=" + zipCode + "]";
	}

	
}
