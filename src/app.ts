///Manejo del estado del proyeco: Management State
///se crea un patronn de diseño del tipo singleton
class ProjectState{
    private projects: any[] = [];
    private static instance: ProjectState;

    private constructor(){}
    
    static getInstance(){
        if(this.instance){
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }


    addProject(title: string, description: string, numOfPeople:number){
        const newProject ={
            id:Math.random().toString(),
            title: title,
            description: description,
            numOfPeople:numOfPeople
        };
        //agrgeamos al arreglo de proyectos  el nuevo objeto.
        this.projects.push(newProject);
    }
}

//creamos una constante global para poder ser utilizada  en cualquier parte dell proyecto.
const projectState = ProjectState.getInstance();

//Validacion
interface Validatable{

    value: string| number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?:number;
}
function validate( validatableInput: Validatable){
    let isValid = true;
    if( validatableInput.required){
        isValid = isValid && validatableInput.value.toString().trim().length !==0;
    }
    if(validatableInput.minLength != null && typeof validatableInput.value === 'string'){
        isValid = validatableInput.value.length >= validatableInput.minLength;
    }
    if(validatableInput.maxLength !=null && typeof validatableInput.value === 'string'){
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
    }
    if(validatableInput.min !=null && typeof validatableInput.value === 'number'){
        isValid = isValid && validatableInput.value >= validatableInput.min;
    }  
    if(validatableInput.max !=null && typeof validatableInput.value === 'number'){
        isValid = isValid && validatableInput.value <= validatableInput.max;
    }    

    return isValid;
}
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
//creamos una clase para renderizar los elementos de la lista
class ProjectList{
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element:HTMLElement;

    //en el constructor pasamos dos tipos de parametros  activos y terminados para la lista de proyectos
    constructor(private  type: 'active'| 'finished'){
        this.templateElement = <HTMLTemplateElement> document.getElementById('project-list')! as HTMLTemplateElement;
        this.hostElement =<HTMLElement>document.getElementById('app')! as HTMLDivElement;
         //Este metodo se encarga de  modificar o renderizar desde typescript  el node del doom
         const importedNode = document.importNode(this.templateElement.content,true);
         this.element = importedNode.firstElementChild as HTMLFormElement;
         this.element.id=`${this.type}-projects`;
         this.attach();
         this.renderContent();

    }
    private renderContent(){
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id=listId;
        this.element.querySelector('h2')!.textContent =this.type.toUpperCase() + 'PROJECTS';
    }
    private attach()
    {
        //se encarga de insertar un nodo de acuerdo a la posicion especifica en la cual se agrega dicho nodo.
        this.hostElement.insertAdjacentElement('beforeend',this.element);
    }
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
        //este metodo es el evento de escucha
        this.configure();
        //adjuntamos todos los elementos dentro del hijo del nodo de html
        this.attach();
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

    private attach(){
        //se encarga de insertar un nodo de acuerdo a la posicion especifica en la cual se agrega dicho nodo.
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
const activePrjList = new ProjectList('active');
const finishPrjList = new ProjectList('finished');