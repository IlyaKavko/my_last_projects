import {testAliasFabric} from "./aliasFabric/AliasFabric.test";
import {testValuesFabric} from "./valuesFabric/ValuesFabric.test";
import {testGenerate} from "./generator/generate.test";
import { testFormulas } from "./formulas/Formulas.test";

export async function testDocxTempleter(): Promise<void> {
    await testAliasFabric()
    await testValuesFabric()
    await testGenerate()
    await testFormulas()
}