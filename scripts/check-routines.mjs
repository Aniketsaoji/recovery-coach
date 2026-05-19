import assert from 'node:assert/strict'
import { getFocusedExercises } from '../src/data/routines.js'

const names = (items) => items.map((exercise) => exercise.name)

const gluteStretch5 = names(getFocusedExercises(['gluteal'], 'stretch', '5'))
const gluteStretch20 = names(getFocusedExercises(['gluteal'], 'stretch', '20'))

assert.deepEqual(gluteStretch5, [
  'IT Band Stretch',
  'Knee to Chest Stretch',
])

assert.deepEqual(gluteStretch20, [
  'IT Band Stretch',
  'Knee to Chest Stretch',
  'Hip Flexor Stretch (Kneeling)',
  '90/90 Hip Switch',
  'Figure 4 Stretch',
])

assert.deepEqual(getFocusedExercises([], 'stretch', '20'), [])

assert.deepEqual(
  names(getFocusedExercises(['trapezius', 'gluteal'], 'stretch', '20', 'gluteal')),
  [
    'IT Band Stretch',
    'Knee to Chest Stretch',
    'Hip Flexor Stretch (Kneeling)',
    '90/90 Hip Switch',
    'Figure 4 Stretch',
    'Chin Tuck',
  ]
)

console.log('Routine checks passed')
