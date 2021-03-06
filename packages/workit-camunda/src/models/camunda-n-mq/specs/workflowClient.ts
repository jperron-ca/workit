import { ICreateWorkflowInstance } from './createWorkflowInstance';
import { ICreateWorkflowInstanceResponse } from './createWorkflowInstanceResponse';
import { IDeployWorkflowResponse } from './deployWorkflowResponse';
import { IPagination } from './pagination';
import { IPaginationOptions } from './paginationOptions';
import { IPublishMessage } from './publishMessage';
import { IUpdateWorkflowRetry } from './updateWorkflowRetry';
import { IUpdateWorkflowVariables } from './updateWorkflowVariables';
import { IWorkflow } from './workflow';
import { IWorkflowDefinition, IWorkflowDefinitionRequest } from './workflowDefinition';
import { IWorkflowOptions } from './workflowOptions';

export interface IWorkflowClient {
  deployWorkflow(absPath: string): Promise<Readonly<IDeployWorkflowResponse>>;
  getWorkflows(options?: Partial<IWorkflowOptions & IPaginationOptions>): Promise<IPagination<IWorkflow>>;
  updateVariables(payload: IUpdateWorkflowVariables): Promise<void>;
  updateJobRetries(payload: IUpdateWorkflowRetry): Promise<void>;
  publishMessage<T = any>(payload: IPublishMessage<T, any>): Promise<void>;
  cancelWorkflowInstance(instance: number | string): Promise<void>;
  createWorkflowInstance<T>(payload: ICreateWorkflowInstance<T>): Promise<ICreateWorkflowInstanceResponse>;
  resolveIncident(incidentKey: string): Promise<void>;
  getWorkflow(payload: IWorkflowDefinitionRequest): Promise<IWorkflowDefinition>;
}
