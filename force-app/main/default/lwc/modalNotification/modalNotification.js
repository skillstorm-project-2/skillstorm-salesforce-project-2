import { LightningElement, api, track } from "lwc";

export default class ModalNotification extends LightningElement {
  @api title = "Notification";
  @api message = "Operation completed successfully.";
  @api variant = "info";
  @track isOpen = false;
  @track fadeOutClass = "";

  get toastClass() {
    return `slds-notify slds-notify_toast slds-theme_${this.variant} ${this.fadeOutClass}`;
  }

  get iconName() {
    return (
      {
        success: "utility:success",
        error: "utility:error",
        warning: "utility:warning",
        info: "utility:info"
      }[this.variant] || "utility:info"
    );
  }

  @api showToast() {
    this.isOpen = true;
    this.fadeOutClass = "show";

    if (this.variant !== "error") {
      setTimeout(() => {
        this.fadeOut();
      }, 2000);
    }
  }

  fadeOut() {
    this.fadeOutClass = "hide";
    setTimeout(() => {
      this.isOpen = false;
    }, 300);
  }

  closeToast() {
    this.fadeOut();
  }
}
