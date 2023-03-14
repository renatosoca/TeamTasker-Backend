import { Request, Response } from "express"
import { errorHttp } from "../helpers"
import { UserResquestProvider } from "../interfaces"
import { projectModel } from "../models"

const getProjects = async ( { user }: UserResquestProvider, res: Response) => {
  try {
    const projects = await projectModel.find({ owner: user?.id }).populate('owner', 'name lastname email');

    return res.status(200).json({
      ok: true,
      projects,
    })
  } catch (error) {
    return errorHttp( res, 'Error del sistema, comuniquese con el administrador');
  }
}

const getProject = async ( { params }: Request, res: Response ) => {
  const { id } = params;

  try {
    const project = await projectModel.findById( id );
    if ( !project ) res.status(404).json({ ok: false, msg: 'No existe el proyecto' });

    return res.status(200).json({
      ok: true,
      project
    })
  } catch (error) {
    return errorHttp( res, 'Error del sistema, comuniquese con el administrador');
  }
}

const createProject = async ( { body, user }: UserResquestProvider, res: Response ) => {
  try {
    const project = new projectModel( body );
    project.owner = user?.id

    const newProject = await project.save();

    return res.status( 201 ).json({
      ok: false,
      project: newProject,
    })
  } catch (error) {
    return errorHttp( res, 'Error al crear el proyecto');
  }
}

const updateProject = (_req: Request) => {

}

const deleteProject = () => {

}

const addCollaborator = () => {

}

const deleteCollaborator = () => {

}

const getTasksProject = () => {

}

export {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addCollaborator,
  deleteCollaborator,
  getTasksProject,
}