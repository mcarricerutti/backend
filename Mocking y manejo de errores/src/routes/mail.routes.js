import { Router } from "express";
import { transporter } from '../utils/nodemailer.js'
import { __dirname } from "../utils/path.js";

const router = new Router()

router.get('/', async(req,res) => {
    try {
        await transporter.sendMail({
            to:'martinacarri345@gmail.com',
            subject:'Correo de prueba',
            text: 'Correo de prueba',
            html:`
            <div>
                <h1>Esto es un test</h1>
            </div>`,
            attachments: [{path: __dirname+'/public/img/avatar.png'}]
        })

        res.status(200).send('Mail sent')

    } catch (error) {
        res.status(500).json({message:error})
    }
})

router.post('/ticket', async(req,res) => {
    const {code, amount, purchaser, purchase_datetime} = req.body.ticket
    // console.log(req.body.ticket);
    try {
        await transporter.sendMail({
            to:purchaser,
            subject:'Ticket',
            html:`
            <div>
                <h1>Here is the info of your purchase:</h1>
                <p>Code: ${code}</p>
                <p>Time: ${purchase_datetime}</p>
                <p>Total amount: ${amount}</p>
            </div>`
        })

        res.status(200).json({message: 'Mail sent'})

    } catch (error) {
        res.status(500).json({error})
    }
})

export default router