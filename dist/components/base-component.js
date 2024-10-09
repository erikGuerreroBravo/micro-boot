export class Component {
    constructor(templateId, hostElementId, insertAtStart, newElement) {
        this.templateElement = document.getElementById(templateId);
        this.hostElement = document.getElementById(hostElementId);
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        if (newElement) {
            this.element.id = newElement;
        }
        this.attach(insertAtStart);
        this.renderContent();
        this.configure();
    }
    attach(insertAtStartBegining) {
        this.hostElement.insertAdjacentElement(insertAtStartBegining ? 'afterbegin' : 'beforeend', this.element);
    }
}
//# sourceMappingURL=base-component.js.map