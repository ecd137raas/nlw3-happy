import { Request, Response  } from 'express';
import { getRepository } from 'typeorm';
import * as Yup from 'yup';

import Orphanage from '../models/Orphanages';
import orphanageView from '../views/orphanage_view'


export default {

    async index(req: Request, res: Response ){
        try{
            const orphanagesRepository = getRepository(Orphanage);
            const orphanages = await orphanagesRepository.find({
                relations: ['images']
            });
            return res.status(200).json(orphanageView.renderMany(orphanages));

        } catch (err) {
            res.status(500).send({ error: 'Falha para processar a requisição'});
        }
    },
    async show(req: Request, res: Response ){
        const { id } = req.params;
        try{
            const orphanagesRepository = getRepository(Orphanage);
            const orphanages = await orphanagesRepository.findOneOrFail(id, {
                relations: ['images']
            });
            return res.status(200).json(orphanageView.render(orphanages));

        }  catch (err) {
            res.status(204).send();
        }
        res.status(500).send({ error: 'Falha para processar a requisição'});
    },
    async create(req: Request, res: Response) {
    const {
        name,
        latitude,
        longitude,
        about,
        instructions,
        opening_hours,
        open_on_weekends,
    } = req.body;
    const orphanagesRepository = getRepository(Orphanage);
    
    const reqImages = req.files as Express.Multer.File[];
    const images = reqImages.map(image => {
        return { path: image.filename }
    })
    const data = {
        name,
        latitude,
        longitude,
        about,
        instructions,
        opening_hours,
        open_on_weekends,
        images
    }

    const schema = Yup.object().shape({
        name: Yup.string().required(),
        latitude: Yup.number().required(),
        longitude: Yup.number().required(),
        about: Yup.string().required().max(300),
        instructions: Yup.string().required(),
        opening_hours: Yup.string().required(),
        open_on_weekends: Yup.boolean().required(),
        images: Yup.array(
            Yup.object().shape({
                path: Yup.string().required()
            })
        )
    });
    await schema.validate(data, {
        abortEarly: false,
    })

    const  orphanages = orphanagesRepository.create(data);
    
    await orphanagesRepository.save(orphanages);
    
    return res.status(201).json(orphanages); 
    }
}