import { Response } from 'express'
import { errorHttp } from '../helpers'
import { UserResquestProvider } from '../interfaces'
import { projectModel, userModel } from '../models'

const getProjects = async ( { user }: UserResquestProvider, res: Response) => {
  try {
    const projects = await projectModel.find({ $or: [{ 'collaborators': {$in: user}}, { 'owner': {$in: user}}] }).populate('owner', '_id name lastname username email').populate('boards').populate('collaborators', '_id name lastname username email').sort({ createdAt: -1 });

    return res.status(200).json({
      ok: true,
      projects,
    })
  } catch (error) {
    return errorHttp( res, 'Error del sistema, comuniquese con el administrador');
  }
}

const getProject = async ( { params, user }: UserResquestProvider, res: Response ) => {
  const { id } = params;
  
  try {
    const project = await projectModel.findById( id ).populate('boards').populate('collaborators', '_id name lastname username email').populate('owner', '_id name lastname username email');
    if ( !project ) return res.status(404).json({ ok: false, msg: 'No existe el proyecto' });
    
    if ( (project?.owner._id.toString() !== user?._id.toString()) && !project.collaborators.some( collaborator => collaborator._id.toString() === user?._id.toString() ) ) return res.status(403).json({ ok: false, msg: 'No autorizado para esta acción' });

    return res.status(200).json({
      ok: true,
      project,
    })
  } catch (error) {
    return errorHttp( res, 'Error del sistema, comuniquese con el administrador');
  }
}

const createProject = async ( { body, user }: UserResquestProvider, res: Response ) => {
  try {
    const project = new projectModel( body );
    project.owner = user?.id;
    project.collaborators.push( user?.id );

    const newProject = await project.save();

    return res.status( 201 ).json({
      ok: true,
      project: newProject,
      msg: 'Proyecto creado correctamente.'
    })
  } catch (error) {
    return errorHttp( res, 'Error al crear el proyecto');
  }
}

const updateProject = async ( { params, body, user }: UserResquestProvider, res: Response ) => {
  const { id } = params;

  try {
    const project = await projectModel.findById( id );
    if ( !project ) return res.status(404).json({ ok: false, msg: 'No existe el proyecto' });

    if ( project?.owner.toString() !== user?._id.toString() ) return res.status(403).json({ ok: false, msg: 'No autorizado' });
    
    const newProject = await projectModel.findByIdAndUpdate( id, { ...body }, { new: true } );
    
    return res.status(200).json({
      ok: true,
      project: newProject,
      msg: 'Proyecto actualizado correctamente.'
    })
  } catch (error) {
    return errorHttp( res, 'Error del sistema, comuniquese con el administrador');
  }
}

const deleteProject = async ( { params, user }: UserResquestProvider, res: Response ) => {
  const { id } = params;

  try {
    const project = await projectModel.findById( id );
    if ( !project ) return res.status(404).json({ ok: false, msg: 'No existe el proyecto' });

    if ( project?.owner.toString() !== user?._id.toString() ) return res.status(403).json({ ok: false, msg: 'No autorizado' });
    
    await project.deleteOne();
    
    return res.status(200).json({
      ok: true,
      msg: 'Proyecto eliminado correctamente.'
    })
  } catch (error) {
    return errorHttp( res, 'Error del sistema, comuniquese con el administrador');
  }
}

const searchCollaborator = async ( { body }: UserResquestProvider, res: Response ) => {
  const { username } = body;
  
  try {
    const users = await userModel.find({ $or: [{ username: { $regex: username, $options: "i" }}] }).select('-password -token -confirmed -createdAt -updatedAt -__v');
    if ( !users ) return res.status(404).json({ ok: false, msg: 'No existen usuarios con ese nombre o email' });

    return res.status(200).json({
      ok: true,
      users,
    })
  } catch (error) {
    return errorHttp( res, 'Error del sistema, comuniquese con el administrador');
  }
}

const addCollaborator = async ( { params, body }: UserResquestProvider, res: Response ) => {
  const { id } = params;
  const { collaboratorId } = body;
  
  try {
    const project = await projectModel.findById( id ).populate('boards').populate('collaborators', '_id name lastname username email').populate('owner', '_id name lastname username email');
    if ( !project ) return res.status(404).json({ ok: false, msg: 'No existe el proyecto' });

    const userExist = await userModel.findById( collaboratorId ).select('-password -token -confirmed -createdAt -updatedAt -__v');
    if ( !userExist ) return res.status(404).json({ ok: false, msg: 'No existe el usuario' });
    
    if ( project.owner._id.toString() === userExist._id.toString() ) return res.status(403).json({ ok: false, msg: 'El administrador no puede ser colaborador' });

    const isCollaborator = project.collaborators.some(collaborator => collaborator._id.toString() === userExist._id.toString());
    if ( isCollaborator ) return res.status(403).json({ ok: false, msg: 'Este usuario ya es colaborador' });
    
    project.collaborators.push( userExist );
    const savedProject = await project.save();
    
    return res.status(200).json({
      ok: true,
      project: savedProject,
      msg: 'Colaborador agregado correctamente.'
    })
  } catch (error) {
    return errorHttp( res, 'Error del sistema, comuniquese con el administrador');
  }
}

const deleteCollaborator = async ( { params, body, user }: UserResquestProvider, res: Response ) => {
  const { id } = params;
  const { collaboratorId } = body;
  
  try {
    const project = await projectModel.findById( id ).populate('collaborators', '_id name lastname username email');
    if ( !project ) return res.status(404).json({ ok: false, msg: 'No existe el proyecto' });
    
    if ( project.owner._id.toString() !== user?._id.toString() ) return res.status(403).json({ ok: false, msg: 'No autorizado' });
    if ( project.owner._id.toString() === collaboratorId.toString() ) return res.status(403).json({ ok: false, msg: 'El administrador no puede ser eliminado' });

    project.collaborators = project.collaborators.filter(collaborator => collaborator._id.toString() !== collaboratorId.toString());

    const savedProject = await project.save();
    
    return res.status(200).json({
      ok: true,
      project: savedProject,
      msg: 'Colaborador eliminado correctamente.'
    })
  } catch (error) {
    return errorHttp( res, 'Error del sistema, comuniquese con el administrador');
  }
}

export {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  searchCollaborator,
  addCollaborator,
  deleteCollaborator,
}