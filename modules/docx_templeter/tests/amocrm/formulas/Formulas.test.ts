import { Formulas } from "../../../amocrm/vendor/formulas";

const chai = require('chai')

export async function testFormulas(): Promise<void> {
	describe('Formulas', () => {
		it('DB', async () => {
			const account_id = 8
			const DB = new Formulas(account_id)
			console.log(test)
			chai.assert(test !== [])
		})
	})
}