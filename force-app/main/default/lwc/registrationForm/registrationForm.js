import { LightningElement, track } from "lwc";

export default class RegistrationForm extends LightningElement {
  @track currentStep;

  goBackToStepOne() {
    this.currentStep = "1";

    this.template.querySelector("div.stepTwo").classList.add("slds-hide");
    this.template.querySelector("div.stepOne").classList.remove("slds-hide");
  }

  goToStepTwo() {
    this.currentStep = "2";

    this.template.querySelector("div.stepOne").classList.add("slds-hide");
    this.template.querySelector("div.stepTwo").classList.remove("slds-hide");
  }
}
