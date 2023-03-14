import { Response } from "express";
import { errorHttp } from "../helpers";
import { UserResquestProvider } from "../interfaces";
import { projectModel, taskModel } from "../models";

const createTask = async ( { body, user }: UserResquestProvider, res: Response ) => {
  const { project: poryectId } = body;
  
  try {
    const project = await projectModel.findById( poryectId );
    console.log(project, 'Project')
    if ( !project ) return res.status(404).json({ ok: false, msg: 'Proyecto no encontrado' });

    if ( project.owner.toString() !== user?._id.toString() ) return res.status(403).json({ ok: false, msg: 'No autorizado para esta acción' });
    
    const task = await taskModel.create( body );
    
    return res.status(201).json({
      ok: true,
      task,
      msg: 'Tarea creada correctamente'
    })
  } catch (error) {
    return errorHttp( res, 'Error al crear la tarea');
  }
}

const getTask = async ( { params, user }: UserResquestProvider, res: Response ) => {
  const { id } = params;

  try {
    const task = await taskModel.findById( id ).populate('project');
    if ( !task ) return res.status(404).json({ ok: false, msg: 'No existe la tarea' });

    if ( task.project.owner.toString() !== user?._id.toString() ) return res.status(403).json({ ok: false, msg: 'No autorizado para esta acción' });

    return res.status(202).json({
      ok: true,
      task,
    })
  } catch (error) {
    return errorHttp( res, 'Error al obtener la tarea');
  }
}

const updateTask = async ( { params, body, user }: UserResquestProvider, res: Response ) => {
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

const deleteTask = async ( { params, user }: UserResquestProvider, res: Response ) => {
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

const changeStatusTask = async (  ) => {

}

export {
  createTask,
  getTask,
  updateTask,
  deleteTask,
  changeStatusTask,
}