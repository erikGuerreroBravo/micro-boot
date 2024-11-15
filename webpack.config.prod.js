/**utilizamos la variable const para poder tener salida al archivo de salida correcto */
const path= require('path');
const { devtools } = require('vue');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = {
    /**mejora en forma de mostrar los errores , en este modo de desarrollador */
    mode:'production',
    /*archivo de entrada principal*/
    entry: './src/app.ts',
    output:{
        /*archivo de salida final*/
        filename: 'bundle.js',
        /** esta ruta debe coincidir con la ruta de salida dell archivo de configuracion de typescript*/
        /**est modulo se utiliza para establecer la ruta de salida */
        path: path.resolve(__dirname,'dist'),
        /**establecems la carpeta de salida */
        publicPath: '/dist/'
    },
    devtool: 'none',
    devServer: {
        static: [
          {
            directory: path.join(__dirname),
          },
        ],
      },
    module:{
        rules:[
            {
                /**utilizamos una expresion regular para identificar y buscar todos los archivos  */
                //test:/\.ts$/,
                /**toma el archivo de configuracion de typescript y no realiza ninguna configuracion extra */
                //use:'ts-loader',
                /**excluimos todos los archivos de typescript que se encuentran en node_modules */
                //exclude: /node_modules/
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    resolve:{
        /**webpack lo utiliza para buscar todas las extensiones y solo agrupa por ts y js, es decir lo empieza a empaquetar*/
        extensions:['.ts','.js']
        /**recuerda que en el archivo de configuracion de typescrip es necesario establecer el sourceMap en true */
    },
    plugins: [
      new CleanPlugin.CleanWebpackPlugin()
    ]

    
};