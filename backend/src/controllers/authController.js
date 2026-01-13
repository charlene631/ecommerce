import env from "../config/env.js";
import * as User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/emailSender.js";


export async function register(req, res) {
    try {
        const { lastname, firstname, email, password, passwordConfirm } = req.body;

        if (password !== passwordConfirm) {
            return res.status(400).json({ error: "Les mots de passe ne correspondent pas." });
        }

        const user = await User.findByEmail(email);

        
        if (user?.is_verified) {
            return res.status(409).json({ error: `Cet email existe déjà.` });
        }

     
        const hashedPassword = await bcrypt.hash(password, 10);

       
        const token = jwt.sign({ email }, env.JWT_SECRET, {
            expiresIn: env.JWT_EMAIL_VERIFICATION_EXPIRES_IN,
        });
        const emailTokenExpiresAt = new Date(jwt.decode(token).exp * 1000);

      
        if (user && !user.is_verified) {
            await User.update({
                id: user.id,
                firstname,
                lastname,
                email,
                hashedPassword,
                emailTokenExpiresAt,
            });
        } else {
         
            await User.create({
                firstname,
                lastname,
                email,
                hashedPassword,
                emailTokenExpiresAt,
            });
        }

        const url = `http://${env.HOST}:${env.PORT}/api/auth/verify-email/${token}`;

        await sendEmail({
            to: email,
            subject: `Veuillez confirmer votre adresse email`,
            html: `
                <h1>Vous y êtes presque !</h1>
                <p>Pour assurer la sécurité de votre compte, nous devons vérifier votre adresse e-mail.</p>
                <p><a href="${url}">Vérifier l'adresse email</a></p>
                <p><em>Ce lien est valable pendant 1h</em></p>
            `,
        });

        res.status(201).json({
            message: "Utilisateur créé. Un email de vérification a été envoyé.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Le serveur a rencontré une erreur.` });
    }
}


export async function verifyEmail(req, res) {
    try {
        const { token } = req.params;

        const { email } = jwt.verify(token, env.JWT_SECRET);

        const result = await User.confirmVerification(email);
        if (!result.affectedRows) {
            return res.status(404).json({
                error: `L'email ne peut pas être vérifié. Veuillez vous réinscrire.`,
            });
        }

        res.status(201).json({ message: `L'email ${email} a été vérifié.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Le serveur a rencontré une erreur.` });
    }
}


export async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(401).json({
                error: "Email ou mot de passe incorrect",
            });
        }

      
        const passwordMatch = await bcrypt.compare(password, user.hashed_password);
        if (!user.is_verified || !passwordMatch) {
            return res.status(401).json({
                error: "Email ou mot de passe incorrect",
            });
        }

       
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            env.JWT_SECRET,
            { expiresIn: env.JWT_ACCESS_EXPIRES_IN }
        );

        await User.recordLastLogin(email);

        res.status(200).json({
            message: `Connexion réussie.`,
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Le serveur a rencontré une erreur.` });
    }
}

