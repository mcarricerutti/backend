//dependencia para trabajar con argumentos de consola
import {program} from 'commander';

program.option('-m, --mode <type>', 'Modo de ejecucion', 'dev');
program.parse(process.argv);

export const options = program.opts();