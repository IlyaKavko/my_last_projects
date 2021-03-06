import {Alias, AliasFabric} from "./aliases";
import {Interfaces} from "./Interfaces";
import {parseNumber} from "./number_parser";
import IOtherParams = Interfaces.IOtherParams;
import IAliasValue = Interfaces.IAliasValue;
import { Formula } from "./formulas";

class Value extends Alias implements Alias{
    private readonly _value: string | Date
    private readonly otherParams: IOtherParams

    constructor(aliasModel: IAliasValue, otherParams: IOtherParams) {
        super(aliasModel)
        this._value = Value.formattingValue(aliasModel.value, aliasModel.mode)
        this.otherParams = otherParams
    }

    private static formattingValue (value, mode): string | Date{
        if(value instanceof Date) return value
        if(mode === 'text') {
            const val = Number.parseInt(value) || 0
            return parseNumber(val)
        } else if(mode === 'in') {
            return Value.createInitials(value)
        }
        return (value || value === 0) ? ('' + value) : ''
    }

    private static createInitials(value: string): string {
        value = typeof value !== "string" ? '' : value
        const arr = value.trim().split(' ').splice(0, 3).map(i => i.trim())
        const f = arr[0]
        const i = Value.fetchFirstSymbol(arr[1]).toUpperCase()
        const o = Value.fetchFirstSymbol(arr[2]).toUpperCase()
        return f ? `${f} ${i} ${o}` : ''
    }

    private static fetchFirstSymbol(str: string): string {
        if(!str || !str.trim()) return ''
        return '' + str[0] + '.'
    }

    get stringValue(): string{
        if(this.entity_type === 'def') {
            return this.defStringValue
        } else if ( this.entity_type === 'f' )
        {
            return
        }
        switch (this.field_type) {
            case 'user_id':
                return this.getUserName(this.value)
            case 'date':
                return this.value ? Value.asDate(this.value) : ''
            case 'date_time':
                return this.value ? Value.asDateTime(this.value) : ''
            default:
                return typeof this.value === 'object' ? '' : ('' + this.value)
        }
    }

    get defStringValue(): string{
        switch (this.field_name) {
            case 'current_d':
                return Value.asDate(new Date())
            case 'current_dt':
                return Value.asDateTime(new Date())
            default:
                return this.value instanceof Date ? Value.asDate(this.value) : ''
        }
    }

    getUserName(user_id): string{
        const user = this.otherParams.managers.find(i => i.id == user_id)
        return user ? user.name : user_id
    }

    static asDateTime(dateSec): string{
        const date = dateSec instanceof Date ? dateSec : new Date(Number.parseInt(dateSec) * 1000)
        if(isNaN(date.getTime()))
            return '' + dateSec
        return Value.formattingToTime(date)
    }

    static formattingToTime (date): string{
        if(!(date instanceof Date))
            return '' + date
        const toDay = Value.formattingToDay(date)
        const hours = Value.asLeadingZero(date.getHours())
        const min = Value.asLeadingZero(date.getMinutes())
        const sec = Value.asLeadingZero(date.getSeconds())
        return `${toDay} ${hours}:${min}:${sec}`
    }

    static asDate(dateSec): string{
        if(typeof dateSec === 'string') return dateSec
        const date = dateSec instanceof Date ? dateSec : new Date(Number.parseInt(dateSec) * 1000)
        return Value.formattingToDay(date)
    }

    static formattingToDay (date): string{
        const month = Value.asLeadingZero(date.getMonth() + 1)
        const day = Value.asLeadingZero(date.getDate())
        return `${day}.${month}.${date.getFullYear()}`
    }

    static asLeadingZero(numb): string{
        numb = '' + numb
        return numb.length === 1 ? '0' + numb : numb
    }

    get value(): string|Date{
        return this._value;
    }
}

class EntityFormatter {
    _entity
    readonly bursCrutchDateFieldName: string = '684282'
    readonly bursCrutchDateFieldName2: string = '684368'

    constructor(entity) {
        this._entity = entity
    }

    get createValueModels(): IAliasValue[]{
        const cfModels = this.customFieldsModels
        const crutchBursModels = this.getBursCrutchValueModels(cfModels)
        return [].concat(...this.defaultFieldsModels, ...cfModels, ...crutchBursModels).filter(i => i)
    }

    get defaultFieldsModels(): IAliasValue[]{
        return [...this.nameValues, ...this.priceValues, ...this.responsibleValues, ...this.phoneValues].map(i => i).filter(i => i)
    }

    get customFieldsModels(): IAliasValue[]{
        const cfs = this.available_custom_fields
        return [].concat(...cfs.map(i => this.formattingCustomField(i)))
    }

    getBursCrutchValueModels(cfModels: IAliasValue[]): IAliasValue[] {
        return [
            ...this.getBursWellValues(cfModels),
            ...this.getBursArrangementValues(cfModels),
        ]
    }

    getBursWellValues(cfModels: IAliasValue[]): IAliasValue[] {
        const targetCfModel = cfModels.filter(i => i).find(i => i.field_name == this.bursCrutchDateFieldName2)
        if(!targetCfModel || !(targetCfModel.value instanceof Date)) return []
        const v10 = EntityFormatter.createBursCrutchDate(targetCfModel.value, 10)
        const v17 = EntityFormatter.createBursCrutchDate(targetCfModel.value, 17)
        return [v10, v17]
    }

    getBursArrangementValues(cfModels: IAliasValue[]): IAliasValue[]{
        const targetCfModel = cfModels.filter(i => i).find(i => i.field_name == this.bursCrutchDateFieldName)
        if(!targetCfModel || !(targetCfModel.value instanceof Date)) return []
        const v30 = EntityFormatter.createBursCrutchDate(targetCfModel.value, 30)
        const v45 = EntityFormatter.createBursCrutchDate(targetCfModel.value, 45)
        return [v30, v45]
    }

    static createBursCrutchDate (value: Date|string, dif: number): IAliasValue {
        return {
            entity_type: "def",
            field_name: `burs${dif}day`,
            field_type: "date",
            mode: "",
            title: `burs${dif}day`,
            isDate: true,
            value: value instanceof Date ? EntityFormatter.sumDate(value, dif) : ''
        }
    }

    private static sumDate(date: Date, diff: number): Date {
        const time = date.getTime() + diff * 86400 * 1000
        return new Date(time)
    }

    get available_custom_fields(): any[]{
        const fields = this.entity.custom_fields_values
        const values = Array.isArray(fields) ? fields : []
        return values.filter(i => AliasFabric.isAvailableType(i) || i.field_code === 'PHONE')
    }

    get nameValues(): IAliasValue[]{
        const value = this.entity.name || ''
        return [this.createValueModel('text', 'name', value)]
    }

    get priceValues(): IAliasValue[]{
        if(this.entityType !== 'leads' && this.entityType !== 'customers')
            return []
        const value = '' + (this.entity.price || 0)
        return [
            this.createValueModel('numeric', 'price', value),
            this.createValueModel('numeric', 'price', value, 'text'),
        ]
    }

    get responsibleValues(): IAliasValue[]{
        const value = this.entity.responsible_user_id || 0
        return [this.createValueModel('user_id', 'user_id', value)]
    }

    get phoneValues(): IAliasValue[]{
        if(this.entityType !== 'contacts')
            return []
        const phoneValuesStruct = this.available_custom_fields.find(i => i.field_code === 'PHONE')
        if(!phoneValuesStruct) return []
        const {value} = EntityFormatter.fetchNameAndValue(phoneValuesStruct)
        return [this.createValueModel('text', 'phone', value)]
    }

    get entityType() {
        return this.entity.entity_type
    }

    get entity() {
        return this._entity;
    }

    formattingCustomField(fieldStruct): IAliasValue[]{
        let res = []
        switch (fieldStruct.field_type) {
            case 'numeric':
                return this.createNumericValueModels(fieldStruct)
            case 'text':
                res = res.concat(this.createTextInitialsValueModels(fieldStruct))
            case 'streetaddress':
                return res.concat(this.createTextValueModels(fieldStruct))
            case 'checkbox':
                return this.createFlagModels(fieldStruct)
            case 'select':
            case 'radiobutton':
                return this.createListValueModels(fieldStruct)
            case 'multiselect':
                return this.createMultiListValueModels(fieldStruct)
            case 'legal_entity':
                return this.createLegalValueModels(fieldStruct)
            case 'date':
                return this.createDateValueModels(fieldStruct)
            case 'date_time':
                return this.createDateTimeValueModels(fieldStruct)
        }
    }

    createFlagModels(fieldValueStruct): IAliasValue[]{
        typeof fieldValueStruct === 'object' ? fieldValueStruct : {}
        const {field_name, value} = EntityFormatter.fetchNameAndValue(fieldValueStruct)
        const flagText = value ? fieldValueStruct.field_name : ''
        return [this.createValueModel('text', field_name, flagText)]
    }

    createListValueModels(fieldValueStruct): IAliasValue[]{
        typeof fieldValueStruct === 'object' ? fieldValueStruct : {}
        const {field_name, values} = EntityFormatter.fetchNameAndValue(fieldValueStruct)
        const value = values.map(i => i.value).join(', ')
        return [this.createValueModel('text', field_name, value)]
    }

    createMultiListValueModels(fieldValueStruct): IAliasValue[]{
        typeof fieldValueStruct === 'object' ? fieldValueStruct : {}
        const {field_name, values} = EntityFormatter.fetchNameAndValue(fieldValueStruct)
        const value = values.map(i => i.value)
        return [this.createValueModel('text', field_name, value)]
    }

    createLegalValueModels(fieldValueStruct): IAliasValue[]{
        typeof fieldValueStruct === 'object' ? fieldValueStruct : {}
        const {field_name, value} = EntityFormatter.fetchNameAndValue(fieldValueStruct)
        return [
            this.createValueModel('text', field_name, value['address'], 'address'),
            this.createValueModel('text', field_name, value['kpp'], 'kpp'),
            this.createValueModel('text', field_name, value['name'], 'name'),
            this.createValueModel('text', field_name, value['vat_id'], 'id'),
            this.createValueModel('text', field_name, value['tax_registration_reason_code'], 'tax'),
        ]
    }

    createDateValueModels(fieldValueStruct): IAliasValue[]{
        typeof fieldValueStruct === 'object' ? fieldValueStruct : {}
        const {field_name, value} = EntityFormatter.fetchNameAndValue(fieldValueStruct)
        if(!value) return []
        const time = Number.parseInt(value) * 1000
        return [this.createValueModel('date', field_name, new Date(time))]
    }

    createDateTimeValueModels(fieldValueStruct): IAliasValue[]{
        typeof fieldValueStruct === 'object' ? fieldValueStruct : {}
        const {field_name, value} = EntityFormatter.fetchNameAndValue(fieldValueStruct)
        if(!value) return []
        const time = Number.parseInt(value) * 1000
        return [this.createValueModel('date_time', field_name, new Date(time))]
    }

    createNumericValueModels (fieldStruct): IAliasValue[]{
        const {field_name, value} = EntityFormatter.fetchNameAndValue(fieldStruct)
        return [
            this.createValueModel('numeric', field_name, value),
            this.createValueModel('numeric', field_name, value, 'text'),
        ]
    }

    createTextValueModels (fieldStruct): IAliasValue[]{
        const {field_name, value} = EntityFormatter.fetchNameAndValue(fieldStruct)
        return [this.createValueModel('text', field_name, value)]
    }

    createTextInitialsValueModels (fieldStruct): IAliasValue[]{
        const {field_name, value} = EntityFormatter.fetchNameAndValue(fieldStruct)
        return [this.createValueModel('text', field_name, value, 'in')]
    }

    static fetchNameAndValue(fieldStruct) {
        const field_name = '' + fieldStruct.field_id
        const values = fieldStruct.values || []
        const value = values[0].value || ''
        return {field_name, value, values}
    }

    createValueModel (field_type, field_name, value, mode = null): IAliasValue{
        return {
            entity_type: this.entityType,
            field_type,
            field_name: '' + field_name,
            title: '',
            isDate: field_type === 'date' || field_type === 'date_time',
            value: (!value && value !== 0) ? '' : value,
            mode
        }
    }
}

export class AliasValuesFabric extends AliasFabric {
    getAllCurrentValues() {
        const {values, aliases} = this.getValuesAndAliases()
        return aliases.map(alias => {
            const val = values.find(val => val.shortAlias === alias.shortAlias)
            if(val) return val
            return alias
        })
    }

    private getValuesAndAliases(): any{
        return {values: this.getCurrentValues(), aliases: this.getAliasValues()}
    }

    private getAliasValues() {
        const aliases = this.getAliases()
        return aliases.map(i => new Value(i, this.otherParams)).concat(this.getBursCrutchAliases())
    }

    private getCurrentValues () {
        const currentModels = this.getCurrentValueModels()
        return currentModels.map(i => new Value(i, this.otherParams))
    }

    private getCurrentValueModels(): IAliasValue[]{
        const currentEntities = this.getCurrentEntities()
        return [].concat(...currentEntities.map(i => AliasValuesFabric.fetchValues(i)))
    }

    private getCurrentEntities(): any{
        return this.otherParams.entities || []
    }

    private static fetchValues (entity): IAliasValue[]{
        const formatter = new EntityFormatter(entity)
        return formatter.createValueModels
    }

    private getBursCrutchAliases() {
        return [
            new Value(EntityFormatter.createBursCrutchDate('', 10), this.otherParams),
            new Value(EntityFormatter.createBursCrutchDate('', 17), this.otherParams),
            new Value(EntityFormatter.createBursCrutchDate('', 30), this.otherParams),
            new Value(EntityFormatter.createBursCrutchDate('', 45), this.otherParams),
        ]
    }
}