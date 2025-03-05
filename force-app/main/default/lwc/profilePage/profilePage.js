import { LightningElement, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import NAME_FIELD from "@salesforce/schema/Account.Name";
import EMAIL_FIELD from "@salesforce/schema/Account.PersonEmail";
import PHONE_FIELD from "@salesforce/schema/Account.Phone";
import MILITARY_BRANCH_FIELD from "@salesforce/schema/Account.Military_Branch__c";
import SERVICE_DATE_START_FIELD from "@salesforce/schema/Account.Service_Date_Start__c";
import SERVICE_DATE_END_FIELD from "@salesforce/schema/Account.Service_Date_End__c";
import DISCHARGE_STATUS_FIELD from "@salesforce/schema/Account.Discharge_Status__c";
import DISABILITY_RATING_FIELD from "@salesforce/schema/Account.Disability_Rating__c";
import getPersonAccountId from "@salesforce/apex/UserUtility.getPersonAccountId";

export default class ProfilePage extends LightningElement {
  name = NAME_FIELD;
  email = EMAIL_FIELD;
  phone = PHONE_FIELD;
  ssn = "@salesforce/schema/Account.SSN__pc";
  militaryBranch = MILITARY_BRANCH_FIELD;
  serviceDateStart = SERVICE_DATE_START_FIELD;
  serviceDateEnd = SERVICE_DATE_END_FIELD;
  dischargeStatus = DISCHARGE_STATUS_FIELD;
  disabilityRating = DISABILITY_RATING_FIELD;

  personAccountId;
  ssnValue = ""; // This will hold the SSN input value
  ssnPlaceholder = "***-**-***"; // Indicates that a value is stored

  @wire(getPersonAccountId)
  wiredAccountId({ data, error }) {
    if (data) {
      this.personAccountId = data;
      // Optionally, you could set ssnPlaceholder based on whether the record has an SSN,
      // but for security it's common to just show a generic placeholder.
    } else if (error) {
      console.error("Error retrieving person account id: ", error);
    }
  }

  handleSSNChange(event) {
    this.ssnValue = event.target.value;
  }

  handleSubmit(event) {
    event.preventDefault();
    // Get the fields from the form submission
    const fields = event.detail.fields;
    // If the user entered a new SSN value, add it to the fields object.
    // Otherwise, do not modify the SSN field (so it remains unchanged).
    if (this.ssnValue) {
      // Note: Use the API name for updating the field.
      fields["SSN__pc"] = this.ssnValue;
    }
    // Submit the form with the updated fields.
    this.template.querySelector("lightning-record-edit-form").submit(fields);
  }

  handleSuccess(event) {
    const toastEvent = new ShowToastEvent({
      title: "Success",
      message: "Profile updated successfully",
      variant: "success"
    });
    this.dispatchEvent(toastEvent);
  }

  handleError(event) {
    const toastEvent = new ShowToastEvent({
      title: "Error",
      message: "Error updating profile",
      variant: "error"
    });
    this.dispatchEvent(toastEvent);
  }
}
