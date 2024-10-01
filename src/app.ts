///Construimos las interfaces necesarias para utilizar el Drag and Drop
//Drag  Interface
interface Draggable{
    //expezamos  el listener que se encarga de manejar los elementos de escucha para el arrastrar y soltar
    dragStartHandler(event: DragEvent):void;
    //el listener que escucha cuando termina el proceso de soltar el elemento
    dragEndHandler(event: DragEvent):void;
}
interface DragTarget{

}



enum ProjectStatus{
    Active,Finished

}
/// creamos la clase project
class Project{
    constructor(public id: string, public title:string,public description:string, public people: number,public status: ProjectStatus){

    }
}
///agregamos los oyentes
//type Listener = (items: Project[] ) => void;

type Listener<T> = (items: T[]) => void;

//manejamos el estado de la aplicacion de forma generica
class State<T>{
    protected listeners: Listener<T>[] = [];
    addListener(listenerFn: Listener<T>){
        this.listeners.push(listenerFn);
    }

}

///Manejo del estado del proyeco: Management State
///se crea un patronn de diseño del tipo singleton
class ProjectState extends State<Project>{
   
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor(){
        super();
    }
    
    static getInstance(){
        if(this.instance){
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }

   //metodo que se encarga de agregar objetos del tipo newProject al arreglo original projects
    addProject(title: string, description: string, numOfPeople:number){
        const newProject =new Project(Math.random.toString(),title,description,numOfPeople,ProjectStatus.Active);
         /*{
            id:Math.random().toString(),
            title: title,
            description: description,
            numOfPeople:numOfPeople
        };*/
        //agrgeamos al arreglo de proyectos  el nuevo objeto.
        this.projects.push(newProject);
        for(const listeneerFn of this.listeners)
        {
            ///retornamos una copìa del arreglo original por cada vez que se invoque la funcion
             listeneerFn(this.projects.slice());
        }
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


//Agregamos un componente base para reutilizar el codigo generado
abstract class Component<T extends HTMLElement, U extends HTMLElement>
{
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;

   constructor(templateId: string, hostElementId: string , insertAtStart: boolean ,newElement?: string)
   {
        this.templateElement = <HTMLTemplateElement> document.getElementById('project-list')! as HTMLTemplateElement;
        //vamos a utilizar el elemento T explicando que T es un elemento del tipo HTMLElement
        this.hostElement =<HTMLElement>document.getElementById(hostElementId)! as T;
        
        const importedNode = document.importNode(this.templateElement.content,true);
         this.element = importedNode.firstElementChild as U;
         if(newElement)
         {
            this.element.id= newElement;
         }
         this.attach(insertAtStart);
   
        //mandamos raer  los metodos asignados
        this.renderContent();
        this.configure();

   }
   private attach(insertAtStartBegining: boolean)
    {
        //se encarga de insertar un nodo de acuerdo a la posicion especifica en la cual se agrega dicho nodo.
        this.hostElement.insertAdjacentElement(insertAtStartBegining ? 'afterbegin' : 'beforeend',this.element);
    }

   //configuramos los elementos exctras necesarios para la clase
   abstract configure(): void;
   abstract renderContent(): void;

}

//creamos el componente de la lista
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement>{
   
   private project: Project;
   
   //los metodos setter y getter se activan de forma automatica cuando  se  manda llamar la propiedad adecuada.
   //recordando que la clase project contiene una propiedad que se llama people y esta es de tipo numerico
   get persons(){
        if(this.project.people ===1)
        {
            return '1 persona';
        }
        else{
            return `${this.project.people} personas`;
        }
   }

   constructor(hostId: string, project: Project){
       super('single-project',hostId,false,project.id);
       this.project = project;
       this.configure();
       this.renderContent();
}
configure(): void {
    
}
renderContent(): void {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.persons;
    this.element.querySelector('p')!.textContent = this.project.description;
}

}

//creamos una clase para renderizar los elementos de la lista
//ahora heredamos todos los elementos necesarios dentro de nuestro aplicativo de clase abstracta
class ProjectList  extends Component<HTMLDivElement, HTMLElement>{
    //templateElement: HTMLTemplateElement;
    //hostElement: HTMLDivElement;
    //element:HTMLElement;
    assignedProjects: Project[];

    //en el constructor pasamos dos tipos de parametros  activos y terminados para la lista de proyectos
    constructor(private  type: 'active'| 'finished'){
        //mandamos llamar nuestra clase base a traves del elemento super
        super('project-list','app',false,`${type}-projects`);

        //this.templateElement = <HTMLTemplateElement> document.getElementById('project-list')! as HTMLTemplateElement;
        //this.hostElement =<HTMLElement>document.getElementById('app')! as HTMLDivElement;

        this.assignedProjects =[];
         //Este metodo se encarga de  modificar o renderizar desde typescript  el node del doom
         //const importedNode = document.importNode(this.templateElement.content,true);
         //this.element = importedNode.firstElementChild as HTMLFormElement;
         //this.element.id=`${this.type}-projects`;
         this.configure();
         //this.attach();
         this.renderContent();

    }
    configure(): void {
        ///recibo una funcion 
        projectState.addListener( (projects: Project[] ) => {
            //creamos un filtro para trabajar con los proyectos.
            //este metodo se encarga a traves de una llamada de callback generar mediante una lambda un filtro de un array
            const relevantProojects = projects.filter(p =>  {
                if(this.type === 'active')
                {
                    return p.status === ProjectStatus.Active;
                }
                return p.status === ProjectStatus.Finished;
            });
            //asiganmos el filtro nuevo con los proyectos.
            this.assignedProjects = relevantProojects;
            this.renderProjects();
         });
    }

    renderContent(){
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id=listId;
        this.element.querySelector('h2')!.textContent =this.type.toUpperCase() + 'PROJECTS';
    }
    
   
    /*private attach()
    {
        //se encarga de insertar un nodo de acuerdo a la posicion especifica en la cual se agrega dicho nodo.
        this.hostElement.insertAdjacentElement('beforeend',this.element);
    }*/

    renderProjects(){
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        listEl.innerHTML ='';
        for(const prjItem of this.assignedProjects){

            new ProjectItem(this.element.id, prjItem);
            //const listItem = document.createElement('li');
            //listItem.textContent =prjItem.title; 
            //listEl.appendChild(listItem);
        }

    }



}


class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>{
    
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

const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishPrjList = new ProjectList('finished');