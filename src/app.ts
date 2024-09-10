//agregamos el decorador
function autobind(_: any, _2: string, descriptor: PropertyDescriptor){
    
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor ={
        configurable: true,
        get(){
            //se obtiene el nombre de la funcion generica y se enlaza a traves del metodo bind
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjDescriptor;
}

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
        this.configure();
        this.attach();
    }


    private clearFields(){
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.peopleInputElement.value ="";
    }

    private gatherUserInput(): [ string, string, number] | undefined{
        const enteredTitle =this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople =  this.peopleInputElement.value;
        if( enteredTitle.trim().length ===0 ||   enteredDescription.trim().length === 0 ||  enteredPeople.trim().length ===0){
            alert("Ingresa los valores correctos, no se permiten nulos");
            return;
        }
        else{
            return [enteredTitle,enteredDescription,+enteredPeople];
        }
    }

    private attach(){
        this.hostElement.insertAdjacentElement('afterbegin',this.element);
    }
   //generamos el evento  manejador de forma privada
   @autobind 
   private submitHandler(event:Event){
        event.preventDefault();
        console.log(this.titleInputElement.value);
        const userInput = this.gatherUserInput();
        if(Array.isArray(userInput)){
            const[ c,t,p] = userInput;
            console.log(c,t,p);
            this.clearFields();
        }
    }
    private configure(){
        //se agrega el elemento bind en el cual, se agrega  el contexto, para que no se pierda, el contexto de la accion
        this.element.addEventListener('submit', this.submitHandler.bind);
    }
}

const prjInput = new ProjectInput();