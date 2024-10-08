/// <reference path="base-component.ts" />
namespace App{


//creamos una clase para renderizar los elementos de la lista
//ahora heredamos todos los elementos necesarios dentro de nuestro aplicativo de clase abstracta
export class ProjectList  extends Component<HTMLDivElement, HTMLElement> implements DragTarget
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


}