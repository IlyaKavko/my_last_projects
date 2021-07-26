export namespace Interfaces {

    export interface IAliasValue extends IAlias {
        readonly value: string|Date
    }

    export interface IAlias{
        readonly entity_type: string
        readonly field_type: string
        readonly field_name: string
        readonly title: string
        readonly mode: string
        readonly isDate: boolean
        readonly value: string|Date
    }

    export interface IOtherParams {
        readonly managers: IAmocrmManager[]
        readonly entities: any[]
        readonly customFields: any[]
        readonly account_id: number
    }

    export interface IAmocrmManager {
        readonly id: number
        readonly name: string
    }
    export interface IFormulas {
        readonly account_id: number
    }
}