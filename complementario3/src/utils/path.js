import { fileURLToPath } from "url";
import { dirname } from "path";
import Url from 'url';


export const __filename = fileURLToPath(import.meta.url);
export const __dirname = Url.resolve(dirname(__filename), '.');
