/**
 * Views
 *
 * This grabs every single view and exports as a single array used in @/router.js.
 * The format follows the vue-router format and is shown below.
 */

import Home from '@/views/Home'
import Room from '@/views/Room'

import Users from '@/views/Users'

// Views all listed in @/views
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

// Gather the views
export default []
  .concat(root)
