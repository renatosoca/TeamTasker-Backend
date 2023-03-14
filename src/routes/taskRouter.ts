import { Router } from 'express';
import { changeStatusTask, createTask, deleteTask, getTask, updateTask } from '../controllers';
import { checkSesion } from '../middlewares';

const router = Router();

router.use( checkSesion );

router.post('/', createTask );
router.route( '/:id' )
  .get( getTask )
  .put( updateTask )
  .delete( deleteTask );
router.post( '/status/:id', changeStatusTask );

export default router;