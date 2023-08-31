//dependencia para trabajar con argumentos de consola
import {program} from 'commander';

program
.option('-m, --mode <type>', 'Modo de ejecucion', 'development')
.option('-f, --file <file>', 'the file to read')
.option('-t --timeout <timeout>', 'the timeout to read')

program.parse(process.argv);

export const options = program.opts();