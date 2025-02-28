import { LightningElement, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import createUser from "@salesforce/apex/UserCreationController.createUser";

export default class RegistrationForm extends LightningElement {
  currentStep = "1";

  @track userRecord = {
    FirstName: "",
    LastName: "",
    Email: "",
    Username: "",
    Alias: "",
    CommunityNickname: "",
    // Default values that won't show in UI
    ProfileId: "", // Replace with your actual Profile ID
    TimeZoneSidKey: "America/Los_Angeles",
    LocaleSidKey: "en_US",
    EmailEncodingKey: "UTF-8",
    LanguageLocaleKey: "en_US",
    IsActive: true
  };

  @track accountRecord = {
    MilitaryBranch__c: "",
    DischargeStatus__c: ""
    // Additional fields will be added as needed
  };

  @track isLoading = false;
  userId = null;

  // Computed properties for CSS classes
  get stepOneClass() {
    return this.currentStep === "1" ? "stepOne" : "stepOne slds-hide";
  }

  get stepTwoClass() {
    return this.currentStep === "2" ? "stepTwo" : "stepTwo slds-hide";
  }

  get isButtonDisabled() {
    // Disable the button if required fields are empty
    return (
      !this.userRecord.FirstName ||
      !this.userRecord.LastName ||
      !this.userRecord.Email ||
      !this.userRecord.Username ||
      !this.userRecord.Alias ||
      !this.userRecord.CommunityNickname
    );
  }

  // Options for the comboboxes
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
      { label: "Honorable", value: "Honorable" },
      { label: "General", value: "General" },
      { label: "Other than Honorable", value: "Other than Honorable" },
      { label: "Bad Conduct", value: "Bad Conduct" },
      { label: "Dishonorable", value: "Dishonorable" }
    ];
  }

  // Event handlers
  handleUserInputChange(event) {
    const field = event.target.name;
    const value = event.target.value;
    this.userRecord = { ...this.userRecord, [field]: value };

    // Auto-populate Username if Email is entered and Username is empty
    if (field === "Email" && !this.userRecord.Username) {
      this.userRecord.Username = value;
    }

    // Auto-populate Alias if First and Last name are entered and Alias is empty
    if (
      (field === "FirstName" || field === "LastName") &&
      !this.userRecord.Alias
    ) {
      const firstInitial = this.userRecord.FirstName
        ? this.userRecord.FirstName.charAt(0)
        : "";
      const lastPart = this.userRecord.LastName
        ? this.userRecord.LastName.substring(0, 7)
        : "";
      this.userRecord.Alias = (firstInitial + lastPart).toLowerCase();
    }

    // Auto-populate Nickname if Last name is entered and Nickname is empty
    if (field === "LastName" && !this.userRecord.CommunityNickname) {
      this.userRecord.CommunityNickname =
        this.userRecord.LastName +
        (this.userRecord.FirstName ? this.userRecord.FirstName.charAt(0) : "");
    }
  }

  handleAccountInputChange(event) {
    const field = event.target.name;
    const value = event.target.value;
    this.accountRecord = { ...this.accountRecord, [field]: value };
  }

  createUserAndContinue() {
    this.isLoading = true;

    // Call the Apex method to create the user
    createUser({ userJson: JSON.stringify(this.userRecord) })
      .then((result) => {
        this.userId = result;
        this.showToast("Success", "User created successfully!", "success");
        this.goToStepTwo();
      })
      .catch((error) => {
        this.handleError(error);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  goToStepTwo() {
    this.currentStep = "2";
  }

  goToStepOne() {
    this.currentStep = "1";
  }

  createAccount() {
    // This would be implemented to create the Person Account
    // associated with the user created in step 1
    console.log("Create account for user ID: ", this.userId);
  }

  // Helper methods
  showToast(title, message, variant) {
    console.log(message);
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