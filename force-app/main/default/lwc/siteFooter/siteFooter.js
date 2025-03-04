import { LightningElement } from 'lwc';

export default class SiteFooter extends LightningElement {
    connectedCallback() {
        window.addEventListener('load', () => {
            this.adjustFooter();
        });

        window.addEventListener('resize', () => {
            this.adjustFooter();
        });

        window.addEventListener('popstate', () => {
            this.handlePageChange();
        });
    }

    renderedCallback() {
        this.adjustFooter();
    }

    disconnectedCallback() {
        window.removeEventListener('resize', this.adjustFooter);
        window.removeEventListener('popstate', this.adjustFooter);
    }

    handlePageChange = () => {
        setTimeout(() => this.adjustFooter(), 100); // Delays execution to allow content to load
    };

    adjustFooter() {
        const footer = this.template.querySelector('.lwc-footer');
        const bodyHeight = document.body.scrollHeight;
        const viewportHeight = window.innerHeight;

        if (bodyHeight < viewportHeight) {
            footer.style.position = 'fixed';
            footer.style.bottom = '0';
            footer.style.width = '100%';
        } else {
            footer.style.position = 'relative';
        }
    };
}