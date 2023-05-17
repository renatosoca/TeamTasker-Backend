import { Router } from 'express';
import { addCollaborator, createProject, deleteCollaborator, deleteProject, getProject, getProjects, searchCollaborator, updateProject } from '../controllers';
import { checkSesion } from '../middlewares';

const router = Router();

router.use(checkSesion);

router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

router.post('/search-collaborator', searchCollaborator);
router.post('/add-collaborator/:id', addCollaborator);
router.post('/delete-collaborator/:id', deleteCollaborator);

export default router;