import { Request, response, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import * as yup from 'yup'
class UserController {
  async create (req: Request, res: Response) {
    const { name, email } = req.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required()
    })

    try {
      await schema.validate(req.body, {abortEarly: false})
    } catch(err) {
      return res.status(400).json({ error: err })
    }

    const userRepository = getCustomRepository(UsersRepository);

    const userAlreadyExists = await userRepository.findOne({
      email
    });

    if (userAlreadyExists) {
      return res.status(400).json({
        error: "User already Exists!"
      })
    }

    const user = userRepository.create({
      name, email
    })

    await userRepository.save(user);

    return res.status(201).json(user);
  }
}

export { UserController };