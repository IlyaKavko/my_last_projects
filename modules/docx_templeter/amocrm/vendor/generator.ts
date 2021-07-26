import {Interfaces} from "./Interfaces";
import IOtherParams = Interfaces.IOtherParams;
import {AliasValuesFabric} from "./values";
import { Formulas } from "./formulas";
import { LogJson } from "../../../../generals/LogWriter";
import { ValuesFabric } from "../../../../workers/amocrm/loaders/entities/EntitiesFabric";

const request = require('request')
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

export async function createDoc(templateLink: any, params: IOtherParams): Promise<any> {
    const valuesFabric = new AliasValuesFabric(params)
    // const formulas = new Formulas(params.account_id)
    const formulas_FromTest = new Formulas(98)
    const values = await valuesFabric.getAllCurrentValues()
    await formulas_FromTest.handlerValues(values)
    const template = await loadFile(templateLink)
    return await createWithValues(template, values)
}

export async function createWithValues(template: any, values: any): Promise<any> {
    const valuesStruct = {}
    values.forEach(i => i._entity_type !== 'f' ? valuesStruct[i.shortAlias] = i.stringValue : valuesStruct[i.shortAlias] = i._value)
    let logs = new LogJson('TestFormula', 'TemplateEngine', 'TEST')
    logs.add('TEST', valuesStruct);
    return await generator(template, valuesStruct)
}

async function generator(template: any, values: any): Promise<any> {
    const doc = new Docxtemplater(createZip(template));
    doc.setData(values);
    doc.render()
    return doc.getZip().generate({type: 'nodebuffer'});
}

function createZip(template: any): any {
    return new PizZip(template)
    // if(!(template instanceof Buffer))
    //     return new PizZip(template)
    //
    // const zip =  new PizZip()
    // zip.file('temp.docx', template, { type : 'binary' })
    // return zip
}

async function loadFile(url: string): Promise<Buffer> {
    return new Promise((res, rej) => {
        const requestSettings = {
            method: 'GET',
            url,
            encoding: null
        };
        request(requestSettings, (error, response, body) => {
            if(error) return rej({error, response})
            return res(body)
        })
    })
}