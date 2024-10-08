/// <reference path="models/drag-drop.ts" />
/// <reference path="models/project.ts" />
/// <reference path="state/project-state.ts" />
/// <reference path="util/validation.ts" />
/// <reference path="decorators/autobind.ts" />


namespace App{ 


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
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable{
   
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
   ///necesitamos  agregar dos elementos  mas para el drag and drop
   //nos ayuda a construir elementos mas arrastrables  de manera uniforme
   @autobind  ///agregamos el elemento del tipo binding
   dragStartHandler(event: DragEvent): void {
      //transferimos los datos desde el drag and drop  en formato de texto plano
      //transferimos el identofocador del proyecto para saber con que elemento se esta trabajando
       event.dataTransfer!.setData('text/plain', this.project.id);
       ///generamos el efecto de movimiento del archivo para permitir que se sobreponga el nuevo dato a agregar
       event.dataTransfer!.effectAllowed ='move';
   }
   dragEndHandler(_: DragEvent): void {
       console.log('DragEnd');
   }


configure(): void {
    ///agregamos el elemento necesario para escuchar  cuando hay un elemento de arrastrar y soltar.
    this.element.addEventListener('dragstart', this.dragStartHandler);
    //agregamos el elemento que termina  el proceso  de soltar 
    this.element.addEventListener('dragend', this.dragEndHandler);
}
renderContent(): void {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.persons;
    this.element.querySelector('p')!.textContent = this.project.description;
}

}

//creamos una clase para renderizar los elementos de la lista
//ahora heredamos todos los elementos necesarios dentro de nuestro aplicativo de clase abstracta
class ProjectList  extends Component<HTMLDivElement, HTMLElement> implements DragTarget
{
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
     //establcemos los metodos necesarios para trabajar con Drag and Drop
     @autobind
     dragOverHandler(event: DragEvent){
        //especificamos que los elementos necesarios se transfieran en formato de texto plano
        if(event.dataTransfer && event.dataTransfer.types[0] === 'text/plain'){
            event.preventDefault();
            const listEl = this.element.querySelector('ul')!;
            listEl.classList.add('droppable');
        }
        
     }
     @autobind
     dropHandler(event: DragEvent)
     {
        console.log(event.dataTransfer!.getData('text/plain'));
        const prjId= event.dataTransfer!.getData('text/plain');
        projectState.moveProject(prjId,this.type=== 'active' ? ProjectStatus.Active :ProjectStatus.Finished);
     }


     dragLeaveHandler(_: DragEvent){
        const listEl = this.element.querySelector('ul')!;
        listEl.classList.remove('droppable');
     }

    configure(): void {

        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        this.element.addEventListener('drop', this.dropHandler);

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
}