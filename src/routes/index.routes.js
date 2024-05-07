import express from 'express'
import indexcontroller from '../controllers/index.controller'
const router = express.Router()

router.get('/', indexcontroller.index)
router.get('/login', indexcontroller.login)
router.get('/servicios', indexcontroller.servicios)
router.get('/testimonios', indexcontroller.testimonios)
router.get('/dashboard', indexcontroller.autenticado, indexcontroller.dashboard)
router.post('/guardar', indexcontroller.guardar)
router.post('/buscarPersonas', indexcontroller.buscarPersonas)
router.get('/eliminar/:UsuarioID', indexcontroller.eliminarPersonas)
router.get('/editar/:UsuarioID', indexcontroller.editarPersona)
router.post('/actualizar/:UsuarioID', indexcontroller.actualizarPersona)
router.post('/auth', indexcontroller.auth)
router.get('/logout', indexcontroller.logout)
router.get('/dashboardNew', indexcontroller.dashboardNew)
export default router