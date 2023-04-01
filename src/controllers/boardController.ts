import { Response } from "express";
import { errorHttp } from "../helpers";
import { UserResquestProvider } from "../interfaces";
import { projectModel, taskModel, boardModel } from "../models";

const getBoard = async ( { params, user }: UserResquestProvider, res: Response ) => {
  const { id } = params;

  try {
    const board = await boardModel.findById( id ).populate('project', '-createdAt -updatedAt').populate('tasks');
    if ( !board ) return res.status(404).json({ ok: false, msg: 'No existe el tablero' });

    const project = await projectModel.findById( board.project._id ).populate('owner', '_id name lastname username email').populate('boards', '-createdAt -updatedAt').populate('collaborators', '_id name lastname username email');
    if ( !project ) return res.status(404).json({ ok: false, msg: 'No existe un proyecto asociado a este tablero' });

    const isAuthorized = project.owner._id.toString() !== user?._id.toString() && !project.collaborators.some( collaborator => collaborator._id.toString() === user?._id.toString() );
    if ( isAuthorized ) return res.status(403).json({ ok: false, msg: 'No autorizado para esta acción' });

    return res.status(202).json({
      ok: true,
      board,
      project,
    })
  } catch (error) {
    return errorHttp( res, 'Error al obtener la tarea');
  }
}

const createBoard = async ( { body, user }: UserResquestProvider, res: Response ) => {
  const { project: proyectId } = body;
  
  try {
    const project = await projectModel.findById( proyectId );
    if ( !project ) return res.status(404).json({ ok: false, msg: 'Proyecto no encontrado' });

    if ( project.owner.toString() !== user?._id.toString() ) return res.status(403).json({ ok: false, msg: 'No autorizado para esta acción' });
    
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