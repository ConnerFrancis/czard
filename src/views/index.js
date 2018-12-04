/**
 * Views
 *
 * This grabs every single view and exports as a single array used in @/router.js.
 * The format follows the vue-router format and is shown below.
 */

import Home from '@/views/Home'
import Room from '@/views/Room'

import Users from '@/views/Users'

/** This holds all base roots. */
const root = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/room/:id',
    name: 'room',
    component: Room
  },
  {
    path: '/users',
    name: 'users',
    component: Users
  }
]

/** Gather the different sub collections of views here with .concat. */
export default []
  .concat(root)
