/// <reference path="base-component.ts" />
namespace App{


export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>{
    
    //templateElement: HTMLTemplateElement;
    //hostElement: HTMLDivElement;
    //element: HTMLFormElement;
    //representa la instacia d eun elemento con el cual vams a interactuar con el foormulario de html
    titleInputElement: HTMLInputElement;
    descriptionInputElement:HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor(){
        super('project-input','app', true, 'user-input');
        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;
        /*this.templateElement = <HTMLTemplateElement>document.getElementById('project-input')!;
        this.hostElement = <HTMLDivElement>document.getElementById('app')!;
        //Este metodo se encarga de  modificar o renderizar desde typescript  el node del doom
        const importedNode = document.importNode(this.templateElement.content,true);
        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.element.id='user-input';*/
        
        //este metodo es el evento de escucha
        this.configure();
        //adjuntamos todos los elementos dentro del hijo del nodo de html
        //this.attach();
    }

    configure(){
        
        //se agrega el elemento bind en el cual, se agrega  el contexto, para que no se pierda, el contexto de la accion
        this.element.addEventListener('submit', this.submitHandler);
    }
    renderContent(): void {
        
    }
    ///metodo que se encarga  de limpiar los campos del form
    private clearFields(){
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.peopleInputElement.value ="";
    }

    private gatherUserInput(): [ string, string, number] | undefined{
        const enteredTitle =this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople =  this.peopleInputElement.value;

        const titleValidatable : Validatable ={
            value:enteredTitle,
            required: true
        };
        const descriptionValidatable: Validatable ={
            value: enteredDescription,
            required: true,
            minLength: 5
        };
       const peopleValidatable: Validatable = {
           value: +enteredPeople,
           required: true,
           min: 1,
           max:5
       };
       if( !validate(titleValidatable) || !validate(descriptionValidatable) || !validate(peopleValidatable) ){
            alert("Ingresa los valores correctos, no se permiten nulos");
            return;
        }
        else{
            return [enteredTitle,enteredDescription,+enteredPeople];
        }
    }

    /*private attach(){
        //se encarga de insertar un nodo de acuerdo a la posicion especifica en la cual se agrega dicho nodo.
        this.hostElement.insertAdjacentElement('afterbegin',this.element);
    }*/

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
    
}


}