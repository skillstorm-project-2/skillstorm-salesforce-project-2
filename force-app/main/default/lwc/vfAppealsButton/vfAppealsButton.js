import { LightningElement } from 'lwc';

export default class VfAppealsButton extends LightningElement {
    openVfPage() {
        window.open('/apex/VfAppeals', '_blank');
    }
}