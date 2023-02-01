import bourdet1 from './bourdet/bourdet1'
import bourdet2 from './bourdet/bourdet2'
import bourdet3 from './bourdet/bourdet3'
import bourdet4 from './bourdet/bourdet4'
import bourdet5 from './bourdet/bourdet5'
import bourdet6 from './bourdet/bourdet6'
import bourdet7 from './bourdet/bourdet7'
import bourdet8 from './bourdet/bourdet8'
import bourdet9 from './bourdet/bourdet9'
import gringarten1 from './gringarten/gringarten1'
import gringarten2 from './gringarten/gringarten2'
import gringarten3 from './gringarten/gringarten3'
import gringarten4 from './gringarten/gringarten4'
import gringarten5 from './gringarten/gringarten5'
import gringarten6 from './gringarten/gringarten6'
import gringarten7 from './gringarten/gringarten7'
import gringarten8 from './gringarten/gringarten8'
import gringarten9 from './gringarten/gringarten9'

const gringarten_array = [
  gringarten1,
  gringarten2,
  gringarten3,
  gringarten4,
  gringarten5,
  gringarten6,
  gringarten7,
  gringarten8,
  gringarten9,
]

const gringarten_arr = gringarten_array.map((gringarten) => {
  return gringarten.map((item) => {
    return { x: Math.log10(item.x), y: Math.log10(item.y) }
  })
})

const bourdet_array = [
  bourdet1,
  bourdet2,
  bourdet3,
  bourdet4,
  bourdet5,
  bourdet6,
  bourdet7,
  bourdet8,
  bourdet9,
]

const bourdet_arr = bourdet_array.map((bourdet) => {
  return bourdet.map((item) => {
    return { x: Math.log10(item.x), y: Math.log10(item.y) }
  })
})

const dimensionlessGroupArray = [
  Math.pow(10, 125),
  Math.pow(10, 60),
  Math.pow(10, 30),
  Math.pow(10, 15),
  Math.pow(10, 8),
  Math.pow(10, 3),
  Math.pow(10, 0),
  Math.pow(10, -2),
  Math.pow(10, -3),
]

export { gringarten_arr, bourdet_arr, dimensionlessGroupArray }
