// accountForm.js
import { LightningElement, track, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import createPersonAccount from "@salesforce/apex/UserCreationController.createPersonAccount";

export default class AccountForm extends LightningElement {
  @api userId;

  @track accountRecord = {
    Military_Branch__c: "",
    Discharge_Status__c: "",
    Service_Date_Start__c: new Date(),
    parsedStartDate: "",
    Service_Date_End__c: new Date(),
    parsedEndDate: "",
    Phone: "",
    SSN__c: ""
  };

  @track isLoading = false;

  get branchOptions() {
    return [
      { label: "Army", value: "Army" },
      { label: "Navy", value: "Navy" },
      { label: "Air Force", value: "Air Force" },
      { label: "Marine Corps", value: "Marine Corps" },
      { label: "Coast Guard", value: "Coast Guard" },
      { label: "Space Force", value: "Space Force" }
    ];
  }

  get dischargeOptions() {
    return [
      { label: "Honorable Discharge", value: "Honorable Discharge" },
      { label: "General Discharge", value: "General Discharge" },
      { label: "Dishonorable Discharge", value: "Dishonorable Discharge" }
    ];
  }

  handleInputChange(event) {
    const field = event.target.name;
    const value = event.target.value;
    this.accountRecord = { ...this.accountRecord, [field]: value };
  }

  goBack() {
    // Dispatch event to go back to user form
    this.dispatchEvent(new CustomEvent("back"));
  }

  formatDate(d = new Date()) {
    let month = String(d.getMonth() + 1);
    let day = String(d.getDate());
    const year = String(d.getFullYear());

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return `${month}/${day}/${year}`;
  }

  createAccount() {
    if (!this.userId) {
      this.showToast(
        "Error",
        "No user ID provided. Please create a user first.",
        "error"
      );
      return;
    }

    this.accountRecord.parsedStartDate = this.formatDate(
      this.accountRecord.Service_Date_Start__c
    );
    this.accountRecord.parsedEndDate = this.formatDate(
      this.accountRecord.Service_Date_End__c
    );

    this.isLoading = true;

    // Call the Apex method to create the account
    createPersonAccount({
      accountJson: JSON.stringify(this.accountRecord),
      userId: this.userId
    })
      .then((result) => {
        this.showToast("Success", "Account created successfully!", "success");

        // Dispatch event for completion
        this.dispatchEvent(
          new CustomEvent("complete", {
            detail: { accountId: result }
          })
        );
      })
      .catch((error) => {
        this.handleError(error);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  showToast(title, message, variant) {
    console.log(title, message, variant);
    this.dispatchEvent(
      new ShowToastEvent({
        title: title,
        message: message,
        variant: variant
      })
    );
  }

  handleError(error) {
    let errorMessage = "Unknown error";
    if (error.body && error.body.message) {
      errorMessage = error.body.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }
    this.showToast("Error", errorMessage, "error");
  }
}
