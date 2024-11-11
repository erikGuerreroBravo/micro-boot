/**utilizamos la variable const para poder tener salida al archivo de salida correcto */
const path= require('path');

module.exports = {
    /*archivo de entrada principal*/
    entry: './src/app.ts',
    output:{
        /*archivo de salida final*/
        filename: 'bundle.js',
        /** esta ruta debe coincidir con la ruta de salida dell archivo de configuracion de typescript*/
        /**est modulo se utiliza para establecer la ruta de salida */
        path: path.resolve(__dirname,'dist')
    }
}