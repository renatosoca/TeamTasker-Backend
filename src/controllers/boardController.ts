import { Response } from "express";
import { CheckIsOwner, CheckIsOwnerAndCollaborator, errorHttp } from "../helpers";
import { UserResquestProvider } from "../interfaces";
import { projectModel, taskModel, boardModel } from "../models";

const getBoard = async ( { params, user }: UserResquestProvider, res: Response ) => {
  if (!user) return res.status(401).json({ ok: false, msg: 'Sin autorización' });
  const { boardId } = params;

  try {
    const board = await boardModel.findById( boardId ).populate('project', '-createdAt -updatedAt').populate('tasks');
    if ( !board ) return res.status(404).json({ ok: false, msg: 'No existe el tablero' });

    const project = await projectModel.findById( board.project._id ).populate('owner', '_id name lastname username email').populate('boards', '-createdAt -updatedAt').populate('collaborators', '_id name lastname username email');
    if ( !project ) return res.status(404).json({ ok: false, msg: 'No existe un proyecto asociado a este tablero' });

    if ( !CheckIsOwnerAndCollaborator( project, user ) ) return res.status(403).json({ ok: false, msg: 'No autorizado para esta acción' });

    return res.status(202).json({
      ok: true,
      project,
    })
  } catch (error) {
    return errorHttp( res, 'Error del sistema, comuniquese con el administrador');
  }
}

const createBoard = async ( { body, user }: UserResquestProvider, res: Response ) => {
  const { project: proyectId } = body;
  
  try {
    const project = await projectModel.findById( proyectId ).populate('owner');
    if ( !project ) return res.status(404).json({ ok: false, msg: 'Proyecto no encontrado' });

    if ( !CheckIsOwner( project, user )) return res.status(403).json({ ok: false, msg: 'No autorizado para esta acción' });
    
    const board = await boardModel.create( body );
    project.boards.push( board._id );
    await project.save();
    
    return res.status(201).json({
      ok: true,
      board,
      msg: 'Tarea creada correctamente'
    })
  } catch (error) {
    return errorHttp( res, 'Error al crear la tarea');
  }
}

const updateBoard = async ( { params, body, user }: UserResquestProvider, res: Response ) => {
  const { id } = params;

  try {
    const task = await taskModel.findById( id ).populate('project');
    if ( !task ) return res.status(404).json({ ok: false, msg: 'No existe la tarea' });

    if ( task.project.owner.toString() !== user?._id.toString() ) return res.status(403).json({ ok: false, msg: 'No autorizado para esta acción' });

    const newTask = await taskModel.findByIdAndUpdate( id, { ...body }, { new: true });

    return res.status(202).json({
      ok: true,
      task: newTask,
      msg: 'Tarea actualizada correctamente'
    })
  } catch (error) {
    return errorHttp( res, 'Error al editar la tarea');
  }
}

const deleteBoard = async ( { params, user }: UserResquestProvider, res: Response ) => {
  const { id } = params;

  try {
    const task = await taskModel.findById( id ).populate('project');
    if ( !task ) return res.status(404).json({ ok: false, msg: 'No existe la tarea' });

    if ( task.project.owner.toString() !== user?._id.toString() ) return res.status(403).json({ ok: false, msg: 'No autorizado para esta acción' });

    await task.deleteOne();

    return res.status(202).json({
      ok: true,
      msg: 'Tarea eliminada correctamente'
    })
  } catch (error) {
    return errorHttp( res, 'Error al eliminar la tarea');
  }
}

const changeStatusBoard = async (  ) => {

}

export {
  createBoard,
  getBoard,
  updateBoard,
  deleteBoard,
  changeStatusBoard,
}