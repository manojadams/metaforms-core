/**
 * Represents a page in the form
 */
export class Page {
    pageNumber: number;
    isGrouped: boolean;
    totalPages: number;

    constructor(isGrouped: boolean, private pages: number) {
        this.isGrouped = isGrouped;
        this.pageNumber = 1;
        this.totalPages = pages;
    }

    /**
     * Update page number
     * @param pageNumber
     */
    update(pageNumber: number) {
        if (pageNumber <= this.totalPages) {
            this.pageNumber = pageNumber;
        } else {
            this.pageNumber = this.totalPages;
        }
    }

    /**
     * Set end of page to disable user to go to last page
     * and submit the page earlier
     * @param pageNumber
     */
    setEndOfPage(pageNumber: number | undefined) {
        if (pageNumber !== undefined && pageNumber < this.totalPages) {
            this.totalPages = pageNumber;
        }
    }

    /**
     * Reset end of page
     */
    resetEndOfPage() {
        this.totalPages = this.pages;
    }

    /**
     * Whether to show previous button
     * eg. -> Previous button is not valid in form's 1st page (for a form having more than 1 page)
     * @returns boolean
     */
    showPrev() {
        return this.isGrouped && this.pageNumber !== 1;
    }

    /**
     * Whether to show next button
     * Next button not shown on last page
     * @returns boolean
     */
    showNext() {
        return this.isGrouped && this.pageNumber < this.totalPages;
    }

    /**
     * Whether to show/hide submit button
     * Submit button is present only on the last page
     * @returns boolean
     */
    showSave() {
        if (this.isGrouped) {
            return this.pageNumber >= this.totalPages;
        } else {
            return true;
        }
    }
}
