import { test, expect, describe } from 'vitest'
import Formatter from "./Formatting";

const testCoords = [207306.35682565783, 6149486.5315516805, 0]
const targetOutput = [testCoords[0] + ' m, ', testCoords[1] + ' m']

describe('Formatter', () => {
    test('formats correctly', () => {
        expect(Formatter.toMeters(testCoords)).toBe(targetOutput)
    })
})