import { LightningElement, api } from "lwc";

export default class ModalNotification extends LightningElement {
  @api title = "Notification";
  @api message = "";
  @api variant = "info";
  @api isOpen = false;

  get headerClass() {
    return `slds-modal__header slds-theme_${this.variant}`;
  }

  @api
  closeModal() {
    this.isOpen = false;
    // Dispatch an event to let the parent component know the modal was closed
    this.dispatchEvent(new CustomEvent("close"));
  }

  @api
  openModal() {
    this.isOpen = true;
  }
}