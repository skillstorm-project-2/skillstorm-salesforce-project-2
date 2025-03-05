import { LightningElement } from 'lwc';
import vaFooterLogo from '@salesforce/resourceUrl/VAClaimsPortalFooterImage';

export default class SiteFooter extends LightningElement {
    footerImageUrl = vaFooterLogo;
    originalContentHeight;

    connectedCallback() {
        window.addEventListener('resize', () => {
            this.adjustFooter();
        });

        window.addEventListener('popstate', () => {
            this.handlePageChange();
        });
    }

    renderedCallback() {
        this.handlePageChange();
    }

    disconnectedCallback() {
        window.removeEventListener('resize', this.adjustFooter);
        window.removeEventListener('popstate', this.adjustFooter);
    }

    handlePageChange = () => {
        setTimeout(() => this.adjustFooter(), 100); // Delays execution to allow content to load
    };

    adjustFooter() {
        const bodyHeight = document.getElementsByClassName('body')[0].offsetHeight;// the height of the content
        
        if (bodyHeight == 0) {
            this.handlePageChange();
            return;
        }
        
        const viewportHeight = window.innerHeight; // the height of the user's screen

        const footer = document.getElementsByClassName('footer')[0];
        const navbar = document.getElementsByClassName('a11y-banner')[0];

        console.log("Adjusting footer");

        //console.log("Body height", bodyHeight);
        //console.log("Viewport height", viewportHeight);

        if (bodyHeight <= viewportHeight) {
            //console.log("Footer height", footer.offsetHeight);
            //console.log("Navbar height", navbar.offsetHeight);

            footer.style.marginTop = `${((viewportHeight + navbar.offsetHeight) - (footer.offsetHeight + bodyHeight))}px`;
            footer.style.width = '100%';
        } else {
            footer.style.position = 'relative';
        }
    };
}