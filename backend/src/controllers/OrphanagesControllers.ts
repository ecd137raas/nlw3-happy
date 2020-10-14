import { Request, Response  } from 'express';
import { getRepository } from 'typeorm';
import Orphanage from '../models/Orphanages';


export default {

    async index(req: Request, res: Response ){
        try{
            const orphanagesRepository = getRepository(Orphanage);
            const orphanages = await orphanagesRepository.find();
            return res.status(200).json(orphanages);

        } catch (err) {
            res.status(500).send({ error: 'Falha para processar a requisição'});
        }
    },
    async show(req: Request, res: Response ){
        const { id } = req.params;
        try{
            const orphanagesRepository = getRepository(Orphanage);
            const orphanages = await orphanagesRepository.findOneOrFail(id);
            return res.status(200).json(orphanages);

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
    const  orphanages = orphanagesRepository.create({
        name,
        latitude,
        longitude,
        about,
        instructions,
        opening_hours,
        open_on_weekends,
    });
    
    await orphanagesRepository.save(orphanages);
    
    return res.status(201).json(orphanages); 
    }
}