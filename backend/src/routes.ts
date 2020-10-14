import {Router} from 'express';
import OrphanagesController from './controllers/OrphanagesControllers';

const routes = Router();

routes.post('/orphanages', OrphanagesController.create);
routes.get('/orphanages/:id', OrphanagesController.show);
routes.get('/orphanages', OrphanagesController.index);

export default routes;