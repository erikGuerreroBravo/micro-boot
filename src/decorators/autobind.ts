//namespace App{
    //agregamos el decorador
export function autobind(_: any, _2: string, descriptor: PropertyDescriptor){
    
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

//}