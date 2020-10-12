import express, { Request, Response} from "express";
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from "@boitickets/common";

import { Password } from '../services/password';
import { User } from '../models/user';

const router = express.Router();

router.post("/api/users/signin",
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must suppy a password')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passordsMatch = await Password.compare(existingUser.password, password);
    if (!passordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    // Generate JWT
    const userJwt = jwt.sign({
      id: existingUser.id,
      email: existingUser.email
    }, process.env.JWT_KEY!);//asdf

    // Store it on session object
    req.session = {
      jwt: userJwt
    };

    return res.status(200).send(existingUser);
});

export { router as signinRouter };
