import { getConnection } from "../models/connection"
import bcryptjs from 'bcryptjs'
import config from '../config';
import jwt from 'jsonwebtoken'
import { promisify } from 'util'

const indexcontroller = {}
indexcontroller.index = (req, res) => {

    res.render('index', {
        title: 'Pagina Principal'
    })
}

indexcontroller.dashboardNew = (req, res) => {

    res.render('dashboardNew', {
        title: 'Dashboard'})
}

indexcontroller.login = (req, res) => {

    res.render('login', {
        title: 'Inicio de sesion'
    })
}

indexcontroller.servicios = (req, res) => {

    res.render('servicios', {
        title: 'Servicios'
    })
}

indexcontroller.testimonios = (req, res) => {

    res.render('testimonios', {
        title: 'Testimonios'
    })
}

indexcontroller.dashboard  = async (req, res) => {
    
    try {

        const con = await getConnection()
        const resultado = await con.request().query('select UsuarioID, Nombre, Apellido, Username From Usuarios')
        res.render('dashboard', {
            title: 'Dashboard',
            data: resultado.recordset,
            user: req.user
        })

    } catch (error) {
        console.log(error)
    }
}

indexcontroller.guardarback = async (req, res) => {

    try {

        const con = await getConnection()
        const { nombre, apellido, mail, user, pass } = req.body
        await con.request().query("insert into Usuarios(nombre, apellido, email, username, pass) values ('" + nombre + "', '" + apellido + "', '" + mail + "', '" + user + "', '" + pass + "')")

        res.redirect('dashboard')


    } catch (error) {
        console.log(error)
    }
}

indexcontroller.guardar = async (req, res) => {

    try {

        const con = await getConnection()
        const { Nombre, Apellido, Email, Username, Pass } = req.body
        let passHash = await bcryptjs.hash(Pass, 10)
        await con.request().query("insert into Usuarios(nombre, apellido, email, username, pass) values ('" + Nombre + "', '" + Apellido + "', '" + Email + "', '" + Username + "', '" + passHash + "')")

        const alertData = {
            alert: true,
            alertTitle: 'Registrado',
            alertMessage: 'Registrado con exito',
            alertIcon: 'success',
            showConfirmButton: false,
            timer: null,
            ruta: 'login'
        }

        res.render('login', { alert: alertData })

    } catch (error) {
        console.log(error)

    }
}

indexcontroller.buscarPersonas = async (req, res) => {

    try {

        const con = await getConnection()
        const { txtBuscar } = req.body
        const resultado = await con.request().query("select * from Usuarios WHERE nombre = '" + txtBuscar + "' or apellido = '" + txtBuscar + "' or username = '" + txtBuscar + "'")

        res.render('dashboard', {
            title: 'Dashboard',
            data: resultado.recordset,
        })

    } catch (error) {
        console.log(error)
    }
}

indexcontroller.eliminarPersonas = async (req, res) => {

    try {

        const con = await getConnection()
        const { UsuarioID } = req.params
        await con.request().query("Delete from Usuarios Where UsuarioID = '" + UsuarioID + "'")

        res.redirect('/dashboard')

    } catch (error) {
        console.log(error)
    }
}

indexcontroller.editarPersona = async (req, res) => {

    try {

        const con = await getConnection()
        const { UsuarioID } = req.params
        const resultado = await con.request().query("select * from Usuarios WHERE UsuarioID = '" + UsuarioID + "'")

        res.render('actualizar', {
            title: 'Editar registro',
            data: resultado.recordset[0],
        })

    } catch (error) {
        console.log(error)
    }
}

indexcontroller.actualizarPersona = async (req, res) => {

    try {

        const con = await getConnection()
        const { UsuarioID } = req.params
        const { Nombre, Apellido, Email, Username, Pass } = req.body
        await con.request().query("update Usuarios set nombre = '" + Nombre + "', apellido = '" + Apellido + "', email = '" + Email + "', username = '" + Username + "', pass = '" + Pass + "' WHERE UsuarioID = '" + UsuarioID + "'")

        res.redirect('/dashboard')

    } catch (error) {
        console.log(error)
    }
}

indexcontroller.auth = async (req, res) => {

    try {
        const con = await getConnection();
        const { Username, Pass } = req.body;
        let passHash = await bcryptjs.hash(Pass, 10);
    
        if (Username && Pass) {
            const result = await con.request().query("select * from Usuarios WHERE Username = '" + Username + "'");
            if (result.recordset.length === 0 || !(await bcryptjs.compare(Pass, result.recordset[0].Pass))) {
                
                const alertData ={
                    alert: true,
                    alertTitle: 'Error',
                    alertMessage: 'Usuario y/o contraseña incorrectos',
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: 2000,
                    ruta: 'login'
                }
                
                res.render('login', { alert: alertData })

            } else {
                const id = result.recordset[0].UsuarioID
                const token = jwt.sign({ id }, config.secret, {
                    expiresIn: config.tokenExpira                
                })

                console.log('TOKEN: ' + token + ' ID: ' + id)

                const cookieOptions = {
                    expires: new Date(Date.now() + config.cookieExpira * 24 * 60 * 60 * 1000),
                    httpOnly: true
                }
                res.cookie('jwt', token, cookieOptions)                
                res.redirect('dashboard')
            }
        } else {
            const alertData ={
                alert: true,
                alertTitle: 'Advertencia',
                alertMessage: 'Por favor, proporcione un nombre de usuario y una contraseña',
                alertIcon: 'info',
                showConfirmButton: false,
                timer: 3000,
                ruta: 'login'
            }            
            res.render('login', { alert: alertData })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
    
}

indexcontroller.autenticado = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        try {
            const con = await getConnection();
            const decodificada = await promisify(jwt.verify)(token, config.secret);
            const resultado = await con.request().query("select * from Usuarios WHERE UsuarioID = '" + decodificada.id + "'");
            
            if (resultado.recordset.length) {
                req.user = resultado.recordset[0];
                return next();
            } 
        } catch (error) {
            console.log(error);
        }
    }
    res.redirect('/login');
};

indexcontroller.logout = (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/login');
}
export default indexcontroller