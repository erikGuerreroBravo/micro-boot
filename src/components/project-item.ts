/// <reference path="base-component.ts" />


namespace App{


//creamos el componente de la lista
export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable{
   
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
}