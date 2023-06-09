import { Project, User } from "../interfaces";

export const CheckIsOwnerAndCollaborator = ( project: Project, user?: User ) => {
  const isAutorized = project.owner._id.toString() === user?._id.toString() && project.collaborators.some( collaborator => collaborator._id.toString() === user?._id.toString() );

  return isAutorized ? true : false;
}

export const CheckIsOwner = ( project: Project, user?: User ) => {
  const isAutorized = project.owner._id.toString() === user?._id.toString();

  return isAutorized ? true : false;
}