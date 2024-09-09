class ProjectInput{
    
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    //representa la instacia d eun elemento con el cual vams a interactuar con el foormulario de html
    titleInputElement: HTMLInputElement;
    descriptionInputElement:HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor(){
        this.templateElement = <HTMLTemplateElement>document.getElementById('project-input')!;
        this.hostElement = <HTMLDivElement>document.getElementById('app')!;
        //Este metodo se encarga de  modificar o renderizar desde typescript  el node del doom
        const importedNode = document.importNode(this.templateElement.content,true);
        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.element.id='user-input';

        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

        this.attach();
    }

    private attach(){
        this.hostElement.insertAdjacentElement('afterbegin',this.element);
    }
   //generamos el evento  manejador de forma privada
    private submitHandler(event:Event){
        event.preventDefault();
        console.log(this.titleInputElement.value);
    }
    private configure(){
        this.element.addEventListener('submit', this.submitHandler)
    }
}

const prjInput = new ProjectInput();