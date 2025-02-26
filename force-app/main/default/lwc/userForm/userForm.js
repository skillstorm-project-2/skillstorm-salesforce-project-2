// userForm.js
import { LightningElement, track, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import createUser from "@salesforce/apex/UserCreationController.createUser";

export default class UserForm extends LightningElement {
  @track userRecord = {
    FirstName: "",
    LastName: "",
    Email: "",
    Username: "",
    Alias: "",
    CommunityNickname: "",
    ProfileId: "", // handled by the Apex
    TimeZoneSidKey: "America/Los_Angeles",
    LocaleSidKey: "en_US",
    EmailEncodingKey: "UTF-8",
    LanguageLocaleKey: "en_US",
    IsActive: true
  };

  @track isLoading = false;

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

  handleInputChange(event) {
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

  createUser() {
    this.isLoading = true;

    // Call the Apex method to create the user
    createUser({ userJson: JSON.stringify(this.userRecord) })
      .then((result) => {
        this.showToast("Success", "User created successfully!", "success");

        // Dispatch event to parent Aura component
        const userCreatedEvent = new CustomEvent("usercreated", {
          detail: { userId: result }
        });
        this.dispatchEvent(userCreatedEvent);
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
