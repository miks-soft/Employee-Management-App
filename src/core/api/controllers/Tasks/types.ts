export type RequestsTasks = {
  getTasks: PickApiData<'/api/v1/tasks', 'get'>;
  createTask: PickApiData<'/api/v1/tasks', 'post'>;
  updateTask: PickApiData<'/api/v1/tasks/{id}', 'put'>;
  deleteTask: PickApiData<'/api/v1/tasks/{id}', 'delete'>;
  markTaskAsDone: PickApiData<'/api/v1/tasks/{id}/done', 'post'>;
  markTaskAsUndone: PickApiData<'/api/v1/tasks/{id}/cancel', 'post'>;
};

export enum APITagsTasks {
  TASKS = 'TASKS',
}
