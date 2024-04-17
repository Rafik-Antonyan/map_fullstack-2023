import fs from 'fs';
import path from 'path'
import dotenv from 'dotenv'
import handlebars from 'handlebars'
import { fileURLToPath } from 'url';

dotenv.config()

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const mailTemplatePath = path.resolve(__dirname, './success.html')
const verifyYourEmailTemplatePath = path.resolve(__dirname, './verifyYourEmail.handlebars')

const successTemplate = fs.readFileSync(mailTemplatePath, 'utf8');
const verifyYourEmailTemplate = fs.readFileSync(verifyYourEmailTemplatePath, 'utf8');

const compiledTemplate = handlebars.compile(verifyYourEmailTemplate);
const htmlContent = (id) => compiledTemplate({link:`${process.env.FRONT_URL}/verify?first=true&id=${id}`});

export {
    successTemplate,
    htmlContent
}