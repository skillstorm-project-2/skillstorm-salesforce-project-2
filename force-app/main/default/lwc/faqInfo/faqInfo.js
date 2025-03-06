import { LightningElement, track } from "lwc";
import faqDataUrl from "@salesforce/resourceUrl/claimsFAQ";

export default class FaqInfo extends LightningElement {
  @track sections;

  connectedCallback() {
    // Fetch the JSON file from the static resource
    fetch(faqDataUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        this.sections = data;
      })
      .catch((error) => {
        console.error("Error loading FAQ data: ", error);
      });
  }
}
