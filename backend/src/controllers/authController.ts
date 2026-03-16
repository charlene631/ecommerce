import { Request, Response } from "express";
import * as UserModel from "../models/userModel";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { sendEmail } from "../utils/emailSender";
import env from "../config/env";
import { RegisterBody, LoginBody, User, EmailTokenPayload } from "../types/user";

// Utilitaire pour sécuriser le secret
function getJwtSecret(): string {
  if (!env.JWT_SECRET) throw new Error("JWT_SECRET non défini");
  return env.JWT_SECRET;
}

// REGISTER
export async function register(req: Request<{}, {}, RegisterBody>, res: Response) {
  try {
    const { firstname, lastname, email, password, passwordConfirm } = req.body;

    if (password !== passwordConfirm) {
      return res.status(400).json({ error: "Les mots de passe ne correspondent pas." });
    }

    const user = await UserModel.findByEmail(email);

    if (user?.is_verified) {
      return res.status(409).json({ error: "Cet email existe déjà." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const token = jwt.sign({ email }, getJwtSecret(), {
      expiresIn: env.JWT_EMAIL_VERIFICATION_EXPIRES_IN as SignOptions["expiresIn"],
    });

    const decoded = jwt.decode(token) as EmailTokenPayload & { exp: number };
    const emailTokenExpiresAt = new Date(decoded.exp * 1000);

    if (user && !user.is_verified) {
      await UserModel.update({
        id: user.id,
        firstname,
        lastname,
        email,
        hashedPassword,
        emailTokenExpiresAt,
      });
    } else {
      await UserModel.create({
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
      subject: "Veuillez confirmer votre adresse email",
      html: `
        <h1>Vous y êtes presque !</h1>
        <p>Pour assurer la sécurité de votre compte, nous devons vérifier votre adresse e-mail.</p>
        <p><a href="${url}">Vérifier l'adresse email</a></p>
        <p><em>Ce lien est valable pendant 1h</em></p>
      `,
    });

    res.status(201).json({ message: "Utilisateur créé. Un email de vérification a été envoyé." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Le serveur a rencontré une erreur." });
  }
}

// VERIFY EMAIL
export async function verifyEmail(req: Request<{ token: string }>, res: Response) {
  try {
    const { token } = req.params;

    const decoded = jwt.verify(token, env.JWT_SECRET) as EmailTokenPayload;

    const result = await UserModel.confirmVerification(decoded.email);
    if (!result.affectedRows) {
      return res.status(404).json({ error: "L'email ne peut pas être vérifié. Veuillez vous réinscrire." });
    }

    res.status(201).json({ message: `L'email ${decoded.email} a été vérifié.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Le serveur a rencontré une erreur." });
  }
}

// LOGIN
export async function login(req: Request<{}, {}, LoginBody>, res: Response) {
  try {
    const { email, password } = req.body;

    const user: User | undefined = await UserModel.findByEmail(email);

    if (!user) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    const passwordMatch = await bcrypt.compare(password, user.hashed_password);
    if (!user.is_verified || !passwordMatch) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, getJwtSecret(), {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
    });

    await UserModel.recordLastLogin(email);

    res.status(200).json({ message: "Connexion réussie.", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Le serveur a rencontré une erreur." });
  }
}
