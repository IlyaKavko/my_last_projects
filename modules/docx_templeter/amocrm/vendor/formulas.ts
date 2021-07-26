import { CRMDB } from "../../../../crm_systems/main/data_base/CRMDB";
import { Interfaces } from "./Interfaces";
import IFormulas = Interfaces.IFormulas;
import {AliasValuesFabric} from "./values";
import { Alias } from "./aliases";
import IAlias = Interfaces.IAlias;
import { ValuesFabric } from "../../../../workers/amocrm/loaders/entities/EntitiesFabric";
import IAliasValue = Interfaces.IAliasValue;

class DefaultValue implements IAlias {
	readonly entity_type: string = 'f'
	readonly field_name: string;
	readonly field_type: string = 'text'
	readonly isDate: boolean = false;
	readonly mode: string = undefined;
	readonly title: string = '';
	readonly value: string | Date;

	constructor(name: string, value: string) {
		this.field_name = name
		this.value = this.setValue(value)
	}

	setValue(value: string): string
	{
		return value.replace(/[^\d]/g, '')
	}
}

export class Formula extends Alias {
	readonly formula: string
	readonly left: IAlias
	readonly math: string
	readonly right: IAlias
	readonly titleFormula: string
	readonly _value: string | Date

	constructor(model, values: any[]) {
		super(model)
		this.titleFormula = model.title
		this.formula = model.formula
		const formulaArr = this.parseFormula()
		this.left = this.fetchValue(values, formulaArr[0])
		this.math = formulaArr[1]
		this.right = this.fetchValue(values, formulaArr[2])
		this._value = this.value
	}

	private fetchValue(values: any[], unique_name: string): IAlias {
		return values.find(i => i.shortAlias === unique_name ? i._value = i.stringValue : '') ||  new DefaultValue(this.titleFormula, unique_name)
	}

	private parseFormula(): any[] {
		return this.formula.split('#')
	}

	get value(): string | Date {
		if(!this.isValid) return ''
		if(this.isDateValue)
			return this.calcDateAnswer()
		return this.calcStringAnswer()
	}

	private get isValid(): boolean {
		return !(this.validate_date(this.left.value) && this.validate_date(this.right.value))
	}

	private calcDateAnswer(): Date|string {
		let time: any
		let leftValue: any = this.left.value
		let rightValue: any = this.right.value
		if(this.validate_date(this.left.value))
			time = new Date(leftValue.split(".").reverse().join(".")).getTime() / 1000 +  Number.parseInt('' + this.right.value) * 86400
		else if (this.validate_date(this.right.value))
			time = new Date(rightValue.split(".").reverse().join(".")).getTime() / 1000 + Number.parseInt('' + this.left.value) * 86400
		else
			return ''

		return new Date(time * 1000).toLocaleDateString();
	}

	private calcStringAnswer():string {
		switch ( this.math ){
			case 'plus':
				return '' + (Number.parseFloat('' + this.left.value) + Number.parseFloat('' + this.right.value))
			case 'minus':
				return '' + (Number.parseFloat('' + this.left.value) - Number.parseFloat('' + this.right.value))
			case 'multiply':
				return '' + (Number.parseFloat('' + this.left.value) * Number.parseFloat('' + this.right.value))
			case 'share':
				return '' + (Number.parseFloat('' + this.left.value) / Number.parseFloat('' + this.right.value))
		}
	}

	private get isDateValue(): boolean {
		return this.validate_date(this.left.value) || this.validate_date(this.right.value)
	}

	get field_type(): string {
		return(this.left.isDate || this.right.isDate) ? 'date' : 'text'
	}

	validate_date(value: any): boolean
	{
		let arrD = value.split(".");
		arrD[1] -= 1;
		let d = new Date(arrD[2], arrD[1], arrD[0]);
		if ((d.getFullYear() == arrD[2]) && (d.getMonth() == arrD[1]) && (d.getDate() == arrD[0])) {
			console.log(true);
			return true;
		} else {
			console.log(false);
			return false;
		}
	}
}

export class Formulas implements IFormulas
{
	readonly account_id
	constructor(account_id: number) {
		this.account_id = account_id
	}

	getFormulasSchema(): Promise<any>
	{
		return FormulasSchema.find(this.account_id)
	}

	async handlerValues(values: any[]): Promise<void>
	{
		const formula = await this.createFormulas(values)

		formula.forEach(i => values.push(i))
	}


	private async createFormulas(values: any[]): Promise<Formula[]> {
		const formulasSchema = await this.getFormulasSchema()
		return formulasSchema.map(el => new Formula(el, values))
	}
}

class FormulasSchema extends CRMDB {
	static async find(account_id: number): Promise<object | null> {
		const sql = `SELECT id  as field_name,
                            'f' as entity_type,
       						'text' as field_type,
                            title,
                            formula
                     FROM ${ CRMDB.modelesSettingsSchema }
                     WHERE account_id = ${ account_id }`
		return await CRMDB.query(sql)
	}
}
