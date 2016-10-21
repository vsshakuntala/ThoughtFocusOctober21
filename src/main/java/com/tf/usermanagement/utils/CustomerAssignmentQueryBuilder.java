package com.tf.usermanagement.utils;

import org.springframework.stereotype.Component;

import com.tf.usermanagement.exceptions.InsufficientDataException;


/**
 * This class is used to build the query for customer assignment
 * @author Santosh
 *
 */

@Component
public class CustomerAssignmentQueryBuilder {  
  
    
    private String NEWUPDATEDUNASSIGNEDQUERY1="select customerNumber from "
    	+ "(select customerNumber,customerReference,customerName,addressOne,city,state,postal,country,billto,Status,Type,active "
    	+ "from (select com.CUSTOMER_ID AS customerNumber,c.CUSTOMER_REFERENCE AS customerReference,"
    	+ "(Select CUSTOMER_NAME FROM CUSTOMER WHERE CUSTOMER_ID = com.CUSTOMER_ID) AS customerName,"
    	+ "(SELECT TOP 1 ADDRESS1 FROM ADDRESS WHERE CUSTOMER_ID = com.CUSTOMER_ID AND ADDRESS_TYPE_ID in(1,2,3) AND ACTIVE=1) AS addressOne,"
    	+ "(SELECT TOP 1 CITY FROM ADDRESS WHERE CUSTOMER_ID = com.CUSTOMER_ID AND ADDRESS_TYPE_ID in(1,2,3) AND ACTIVE=1) AS city,"
    	+ "(SELECT TOP 1 STATE FROM ADDRESS WHERE CUSTOMER_ID = com.CUSTOMER_ID AND ADDRESS_TYPE_ID in(1,2,3) AND ACTIVE=1) AS state,"
    	+ "(SELECT TOP 1 ZIP_CODE FROM ADDRESS WHERE CUSTOMER_ID = com.CUSTOMER_ID AND ADDRESS_TYPE_ID in(1,2,3) AND ACTIVE=1) AS postal,"
    	+ "(SELECT TOP 1 COUNTRY FROM ADDRESS WHERE CUSTOMER_ID = com.CUSTOMER_ID AND ADDRESS_TYPE_ID in(1,2,3) AND ACTIVE=1) AS country,"
    	+ "(SELECT TOP 1 ADDRESS_REFERENCE FROM ADDRESS WHERE CUSTOMER_ID = com.CUSTOMER_ID AND ADDRESS_TYPE_ID in(1,2,3) AND ACTIVE=1) AS billto,"
    	+ "(CASE com.ACTIVE WHEN 1 THEN 'UnASSIGNED' END) AS Status,'' AS Type,com.active AS active "
    	+ "from CUSTOMER_ORGANIZATION_MAP com inner join CUSTOMER c on c.CUSTOMER_ID=com.CUSTOMER_ID AND c.ACTIVE=1 "
    	+ "where com.ORGANIZATION_ID=";
    private String NEWUPDATEDUNASSIGNEDQUERY2=" and com.ACTIVE=1 and com.CUSTOMER_ID not in "
    	+ "(SELECT distinct UsrCust.CUSTOMER_ID AS ASSIGNEDID_CUSTID FROM USERS Usr "
    	+ "INNER JOIN USER_CUSTOMER UsrCust ON Usr.USER_ID = UsrCust.USER_ID AND UsrCust.ACTIVE = 1 "
    	+ "INNER JOIN CUSTOMER Cust ON Cust.CUSTOMER_ID = UsrCust.CUSTOMER_ID AND Cust.ACTIVE = 1 "
    	+ "INNER JOIN CUSTOMER_ORGANIZATION_MAP CustOrg ON UsrCust.CUSTOMER_ID = CustOrg.CUSTOMER_ID AND CustOrg.ACTIVE = 1 "    	
    	+ "WHERE Usr.USER_ID = ";
    
  private final String UPDATEDASSIGNEDQUERY1="SELECT distinct UsrCust.CUSTOMER_ID AS ASSIGNEDID_CUSTID "
  	+ "FROM USERS Usr INNER JOIN USER_CUSTOMER UsrCust ON Usr.USER_ID = UsrCust.USER_ID AND UsrCust.ACTIVE = 1 "
  	+ "INNER JOIN CUSTOMER Cust ON Cust.CUSTOMER_ID = UsrCust.CUSTOMER_ID AND Cust.ACTIVE = 1 "
  	+ "INNER JOIN CUSTOMER_ORGANIZATION_MAP CustOrg ON UsrCust.CUSTOMER_ID = CustOrg.CUSTOMER_ID AND CustOrg.ACTIVE = 1 "  	  	
  	+ "WHERE Usr.USER_ID = ";

  private final String updatedAssignQuery1 = "select CustomerNum from (SELECT CustomerNum,customerReference,Name,Type,Active,Address1,City,State,Postal,Country,billto "
		+ "from (SELECT UsrCust.CUSTOMER_ID AS CustomerNum,cust.CUSTOMER_REFERENCE AS customerReference,Cust.CUSTOMER_NAME AS Name, '' as Type,Usr.active as Active ,"
	+ " (SELECT TOP 1 ADDRESS1 FROM ADDRESS WHERE CUSTOMER_ID = UsrCust.CUSTOMER_ID AND ADDRESS_TYPE_ID in(1,2,3) AND ACTIVE=1) AS Address1,"
  + "(SELECT TOP 1 CITY FROM ADDRESS WHERE CUSTOMER_ID = UsrCust.CUSTOMER_ID AND ADDRESS_TYPE_ID in(1,2,3) AND ACTIVE=1) AS City,"
  + "(SELECT TOP 1 STATE FROM ADDRESS WHERE CUSTOMER_ID = UsrCust.CUSTOMER_ID AND ADDRESS_TYPE_ID in(1,2,3) AND ACTIVE=1) AS State,"
  + "(SELECT TOP 1 ZIP_CODE FROM ADDRESS WHERE CUSTOMER_ID = UsrCust.CUSTOMER_ID AND ADDRESS_TYPE_ID in(1,2,3) AND ACTIVE=1) AS Postal,"
  + "(SELECT TOP 1 COUNTRY FROM ADDRESS WHERE CUSTOMER_ID = UsrCust.CUSTOMER_ID AND ADDRESS_TYPE_ID in(1,2,3) AND ACTIVE=1) AS Country,"
  + "(SELECT TOP 1 ADDRESS_REFERENCE FROM ADDRESS WHERE CUSTOMER_ID = UsrCust.CUSTOMER_ID AND ADDRESS_TYPE_ID in(1,2,3) AND ACTIVE=1) AS billto "
	+ "FROM   USERS Usr INNER JOIN USER_CUSTOMER UsrCust ON Usr.USER_ID = UsrCust.USER_ID AND UsrCust.ACTIVE = 1 "
	+ "INNER JOIN CUSTOMER Cust ON Cust.CUSTOMER_ID = UsrCust.CUSTOMER_ID AND Cust.ACTIVE = 1 "
	+ "INNER JOIN CUSTOMER_ORGANIZATION_MAP CustOrg ON UsrCust.CUSTOMER_ID = CustOrg.CUSTOMER_ID AND CustOrg.ACTIVE = 1 "    	
	+ "WHERE  Usr.USER_ID =";
   
    /**
     * This is used to get the query for customer which has assigned based on filter criteria
     * @param userId
     * @param orgId
     * @param custName
     * @param custNumber
     * @param billToNumber
     * @param addressOne
     * @param city
     * @param state
     * @param postalCode
     * @param status
     * @return 
     */
    public String allCustomerRemoveFromUser(Long userId,Long orgId,String custName,String custNumber,String billToNumber,String addressOne,
	    String city,String state,String postalCode, String status){
	
	StringBuilder builder = new StringBuilder();
	
	if(userId == null || userId < 1){
	    
	    throw new InsufficientDataException("User id is mandatory ");
	}
	
	if(orgId == null || orgId < 1){
	    throw new InsufficientDataException("orgId is mandatory ");
	}
	
	builder.append(updatedAssignQuery1);
	builder.append(userId).append(" AND CustOrg.ORGANIZATION_ID = ").append(orgId).append(") t where Active=1 ");
	
	if(custName != null && custName.trim().length() > 0){
	   
	       builder.append("AND Name LIKE '").append(getBuilderString(custName)).append("' ");
	   
	}
	
	if(custNumber != null && custNumber.trim().length() > 0){
	    builder.append("AND customerReference LIKE '").append(getBuilderString(custNumber)).append("' ");
	    }
	
	
	builder.append(getBuilderString(billToNumber,addressOne,city,state,postalCode));
	
	return builder.toString();
    
    }
    
    /**
     * This is used to get the query for customer which has unassigned based on filter criteria
     * @param userId
     * @param orgId
     * @param custName
     * @param custNumber
     * @param billToNumber
     * @param addressOne
     * @param city
     * @param state
     * @param postalCode
     * @param status
     * @return
     */
    public String allCustomerAssignToUser(Long userId,Long orgId,String custName,String custNumber,String billToNumber,String addressOne,
	    String city,String state,String postalCode, String status){
	
	StringBuilder builder = new StringBuilder();
	
	if(userId == null || userId < 1){
	    
	    throw new InsufficientDataException("User id is mandatory ");
	}
	
	if(orgId == null || orgId < 1){
	    throw new InsufficientDataException("orgId is mandatory ");
	}
	builder.append(NEWUPDATEDUNASSIGNEDQUERY1);
	builder.append(orgId);
	builder.append(NEWUPDATEDUNASSIGNEDQUERY2).append(userId);
	builder.append(" AND CustOrg.ORGANIZATION_ID =").append(orgId).append(")) t where t.active=1 ");
	
	if(custName != null && custName.trim().length() > 0){
	   
	       builder.append("AND t.customerName LIKE '").append(getBuilderString(custName)).append("' ");
	   
	}
	
	if(custNumber != null && custNumber.trim().length() > 0){
	    builder.append("AND t.customerReference LIKE '").append(getBuilderString(custNumber)).append("' ");
	    }
	
	builder.append(getBuilderStringUnAssign(billToNumber,addressOne,city,state,postalCode));
	builder.append(") t1");
	return builder.toString();
    }
    
    public String getBuilderStringUnAssign(String billToNumber,String addressOne,
	    String city,String state,String postalCode){
	
	StringBuilder builder = new StringBuilder();
	
	if(billToNumber != null && billToNumber.trim().length() > 0){
	    builder.append(" AND t.billto LIKE '").append(getBuilderString(billToNumber)).append("' ");
	    }
	
	if(addressOne != null && addressOne.trim().length() > 0){
	    builder.append(" AND t.addressOne LIKE '").append(getBuilderString(addressOne)).append("' ");
	}
	
	if(city != null && city.trim().length() > 0){
	    builder.append(" AND t.city LIKE '").append(getBuilderString(city)).append("' ");
		}
	
	if(state != null && state.trim().length() > 0){
	    builder.append(" AND t.state LIKE '").append(getBuilderString(state)).append("' ");
		}
	
	if(postalCode != null && postalCode.trim().length() > 0){
	    builder.append(" AND t.postal LIKE '").append(getBuilderString(postalCode)).append("' ");
		}
	return builder.toString();
    }
    
    
    public String getBuilderString(String billToNumber,String addressOne,
	    String city,String state,String postalCode){
	
	StringBuilder builder = new StringBuilder();
	if(billToNumber != null && billToNumber.trim().length() > 0){
	    builder.append("AND billto LIKE '").append(getBuilderString(billToNumber)).append("' ");
	    }
	
	if(addressOne != null && addressOne.trim().length() > 0){
	    builder.append("AND Address1 LIKE '").append(getBuilderString(addressOne)).append("' ");
	}
	
	if(city != null && city.trim().length() > 0){
	    builder.append("AND City LIKE '").append(getBuilderString(city)).append("' ");
		}
	
	if(state != null && state.trim().length() > 0){
	    builder.append("AND State LIKE '").append(getBuilderString(state)).append("' ");
		}
	
	if(postalCode != null && postalCode.trim().length() > 0){
	    builder.append("AND Postal LIKE '").append(getBuilderString(postalCode)).append("' ");
		}
	builder.append(") t1");
	
	return builder.toString();
    }
    
    public String getBuilderString(String str){

	   if(str.contains("*") && str.contains("?")){
	       str= str.replaceAll("\\*", "\\%");
	       str= str.replaceAll("\\?", "\\_");
	       return str;
	   }else if(str.contains("*")){
	       str= str.replaceAll("\\*", "\\%");
	       return str;
	    }else if(str.contains("?")){
		str= str.replaceAll("\\?", "\\_");
		return str;
	    }else{
		return "%"+str+"%";
	    }	
    }
}
