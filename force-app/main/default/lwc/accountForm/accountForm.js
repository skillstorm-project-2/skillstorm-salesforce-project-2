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
    const branches = [
      "Army",
      "Navy",
      "Air Force",
      "Marine Corps",
      "Coast Guard",
      "Space Force"
    ];
    return branches.map((branch) => ({
      label: branch,
      value: branch
    }));
  }

  get dischargeOptions() {
    const dischargeOptions = [
      "Honorable Discharge",
      "Dishonorable Discharge",
      "General Discharge"
    ];
    return dischargeOptions.map((opt) => ({ label: opt, value: opt }));
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
    console.log("Firing show toast with:", title, message, variant);

    // Create event with explicit detail structure
    const customEvent = new CustomEvent("showtoast", {
      bubbles: true,
      composed: true,
      detail: {
        title: title,
        message: message,
        variant: variant
      }
    });

    console.log("Event created:", customEvent);
    this.dispatchEvent(customEvent);
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